<?php
// $Id$

/**
 * @file
 * Defines the lingwo_dictionary_lang content type.
 */

/**
 * Implementation of hook_form().
 */
function lingwo_dictionary_lang_form(&$node, $form_state) {
  $type = node_get_types('type', $node);

  $form = array(
    '#cache' => TRUE,
  );

  if ($type->has_title) {
    $form['title'] = array(
      '#type' => 'textfield',
      '#title' => check_plain($type->title_label),
      '#required' => TRUE,
      '#default_value' => $node->title,
      '#weight' => -5
    );
  }

  $form['lang_code'] = array(
  	'#type' => 'textfield',
	'#title' => 'ISO-639-3 Code',
	'#default_value' => $node->lang_code,
  );

  if ($type->has_body) {
    $form['body_field'] = node_body_field($node, $type->body_label, $type->min_word_count);
  }

  return $form;
}

function lingwo_dictionary_lang_validate(&$node) {
  // TODO: check that lang_code is valid somehow
}

/**
 * Implementation of hook_load().
 */
function lingwo_dictionary_lang_load($node) {
  $additions = db_fetch_object(db_query('SELECT lang_code FROM {lingwo_dictionary_lang} WHERE vid = %d', $node->vid));
  return $additions;
}

/**
 * Implementation of hook_insert().
 */
function lingwo_dictionary_lang_insert($node) {
  db_query("INSERT INTO {lingwo_dictionary_lang} (vid, nid, lang_code) VALUES (%d, %d, '%s')",
    $node->vid, $node->nid, $node->lang_code);
}

/**
 * Implementation of hook_update().
 */
function lingwo_dictionary_lang_update($node) {
  if ($node->revision) {
    lingwo_dictionary_lang_insert($node);
  }
  else {
    db_query("UPDATE {lingwo_dictionary_lang} SET lang_code = '%s' WHERE vid = %d",
      $node->lang_code, $node->vid);
  }
}

/**
 * Implementation of hook_delete_revision().
 */
function lingwo_dictionary_lang_delete_revision(&$node, $op, $teaser, $page) {
  db_query("DELETE FROM {lingwo_dictionary_lang} WHERE vid = %d", $node->vid);
};

/**
 * Implementation of hook_delete().
 */
function lingwo_dictionary_lang_delete($node) {
  db_query('DELETE FROM {lingwo_dictionary_lang} WHERE nid = %d', $node->nid);
}

/**
 * Implementation of hook_view().
 */
function lingwo_dictionary_lang_view($node, $teaser = FALSE, $page = FALSE) {
  $node = node_prepare($node, $teaser);
  $node->content['lang_code'] = array(
    '#value' => '<div>'. $node->lang_code .'</div>',
    '#weight' => 1
  );
  return $node;
}


