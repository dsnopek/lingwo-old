<?php
// $Id$

/**
 * @file
 * Defines the lingwo_dictionary_entry content type.
 */

/**
 * Implementation of hook_form().
 */
function lingwo_dictionary_entry_form(&$node, $form_state) {
  $type = node_get_types('type', $node);

  $form = array(
    '#cache' => TRUE,
  );

  $form['instructions'] = array(
    '#value' => '<p>'. t('Everything on this page should be entered in the source language!') .'</p>',
    '#weight' => -10,
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

  if ($type->has_body) {
    $form['body_field'] = node_body_field($node, $type->body_label, $type->min_word_count);
  }

  $form['pos'] = array(
    '#title' => t('Part of Speech'),
    '#type' => 'select',
    '#options' => array(
      'noun' => t('Noun'),
      'adjective' => t('Adjective'),
      'verb' => t('Verb'),
    ),
    '#default_value' => $node->pos,
    '#required' => TRUE
  );

  if ($node->nid) {
    // We pair the following fields with a disabled version
    // and make the real field hidden.
    //foreach (array('title', 'lang', 'pos') as $name) {
    foreach (array('title', 'pos') as $name) {
	  $form[$name]['#required'] = FALSE;
      $form[$name .'-disabled'] = $form[$name] + array(
        '#disabled' => TRUE,
      );
      $form[$name]['#type'] = 'hidden';
      $form[$name]['#value'] = $form[$name]['#default_value'];
    }
  }

  $form['sense_wrapper'] = array(
    '#prefix' => '<div id="lingwo-senses">',
    '#suffix' => '</div>',
    '#title' => 'Senses',
    '#type' => 'fieldset',
  );
  if ($node->senses) {
    $form['sense_wrapper']['senses'] = array(
      '#tree' => TRUE,
      '#theme' => 'lingwo_dictionary_entry_senses_form',
    );

    $index = 0;
    foreach ($node->senses as $sense) {
      /*
      if (!isset($sense->id)) {
        uuid_make($GLOBALS['uuid'], UUID_MAKE_V4);
        uuid_export($GLOBALS['uuid'], UUID_FMT_STR, &$uuidstring);
        $sense->id = trim($uuidstring);
      }
      */
      if (isset($sense['id'])) {
        $row['id'] = array(
          '#type' => 'hidden',
          '#value' => $sense['id'],
        );
      }

      $row['difference'] = array(
        '#title' => 'Difference',
        '#type' => 'textfield',
        '#default_value' => $sense['difference'],
      );
      $row['example'] = array(
        '#title' => 'Example',
        '#type' => 'textfield',
        '#default_value' => $sense['example'],
      );
      $row['weight'] = array(
        '#type' => 'weight',
        // TODO: Delta should probably be equal to the number of definitions?
        '#delta' => 50,
        '#default_value' => $index,
      );
      if (count($node->senses) > 2) {
        $row['remove_sense'] = array(
          '#type' => 'submit',
          '#value' => t('Remove Sense #!num', array('!num' => $index + 1)),
          '#submit' => array('lingwo_dictionary_entry_remove_sense_submit'),
        );
      }
      $form['sense_wrapper']['senses'][$index] = $row;
      $index ++;
    }
  }
  $form['sense_wrapper']['add_sense'] = array(
    '#type' => 'submit',
    '#value' => count($node->senses) == 0 ? t('Setup multiple senses') : t('Add Another Sense'),
    '#submit' => array('lingwo_dictionary_entry_add_sense_submit'),
  );
  if (count($node->senses) == 2) {
    $form['sense_wrapper']['remove_sense'] = array(
      '#type' => 'submit',
      '#value' => t('Delete Senses'),
      '#submit' => array('lingwo_dictionary_entry_remove_sense_submit'),
    );
  }

  return $form;
}

function _lingwo_dictionary_entry_from_form($form, &$form_state) {
  $node = node_form_submit_build_node($form, $form_state);

  $senses = $form_state['values']['senses'];
  if ($senses) {
    foreach ($senses as $sense) {
      $weight[] = $sense['weight'];
      unset($sense['weight']);
      $values[] = $sense;
    }
    array_multisort($weight, SORT_ASC, $values);
    $node->senses = $values;
  }
  else {
    $node->senses = array();
  }

  return $node;
}

function lingwo_dictionary_entry_add_sense_submit($form, &$form_state) {
  $node = _lingwo_dictionary_entry_from_form($form, $form_state);

  if ($node->senses) {
    $node->senses[] = array();
  }
  else {
    $node->senses = array( array(), array() );
  }

  $form_state['node'] = (array)$node;
}

function lingwo_dictionary_entry_remove_sense_submit($form, &$form_state) {
  // Remove the selected sense.  If we have fallen below 2 senses, then there
  // is no reason for any.. 
  // DRS: we remove before parsing the entry out of the form, because if
  // they moved a sense then removed it, the delta would no longer apply!
  if (count(element_children($form_state['values']['senses'])) == 2) {
    $form_state['values']['senses'] = array();
  }
  else {
    $delta = $form_state['clicked_button']['#parents'][1];
    unset($form_state['values']['senses'][$delta]);
  }

  $node = _lingwo_dictionary_entry_from_form($form, $form_state);
  $form_state['node'] = (array)$node;
}

function theme_lingwo_dictionary_entry_senses_form($form) {
  $elements = element_children($form);

  $header = array(
    '',
    t('Sense'),
    t('Weight'),
  );

  if (count($elements) > 2) {
    $header[] = t('Operations');
  }

  $rows = array();
  foreach (element_children($form) as $key) {
    $element = &$form[$key];
    $element['weight']['#attributes']['class'] = 'sense-weight';

    $weight = drupal_render($element['weight']);
    $delete = drupal_render($element['remove_sense']);

    $row = array();
    $row[] = '';
    $row[] = drupal_render($element);
    $row[] = $weight;

    if (count($elements) > 2) {
      $row[] = $delete;
    }

    $row = array('data' => $row);
    $row['class'] = !empty($row['class']) ? $row['class'] .' draggable' : 'draggable';
    $rows[] = $row;
  }

  drupal_add_tabledrag('lingwo-definition-table', 'order', 'sibling', 'sense-weight');
  return theme('table', $header, $rows, array('id' => 'lingwo-definition-table'));
}

/**
 * Implementation of hook_validate().
 */
function lingwo_dictionary_entry_validate(&$node) {
  // TODO: check that this headword/pos/lang combination isn't used elsewhere.
}

/**
 * Implementation of hook_load().
 */
function lingwo_dictionary_entry_load($node) {
  $additions = db_fetch_object(db_query('SELECT lang_nid, headword, pos, senses FROM {lingwo_dictionary_entry} WHERE vid = %d', $node->vid));
  if ($additions->senses) {
    $additions->senses = unserialize($additions->senses);
  }
  return $additions;
}

/**
 * Implementation of hook_insert().
 */
function lingwo_dictionary_entry_insert($node) {
  db_query("INSERT INTO {lingwo_dictionary_entry} (vid, nid, lang_nid, headword, pos, senses) VALUES (%d, %d, %d, '%s', '%s', '%s')",
    $node->vid, $node->nid, $node->lang_nid, $node->title, $node->pos, serialize($node->senses));
}

/**
 * Implementation of hook_update().
 */
function lingwo_dictionary_entry_update($node) {
  if ($node->revision) {
    lingwo_dictionary_entry_insert($node);
  }
  else {
    db_query("UPDATE {lingwo_dictionary_entry} SET senses = '%s' WHERE vid = %d",
      serialize($node->senses), $node->vid);
  }
}

/**
 * Implementation of hook_delete_revision().
 */
function lingwo_dictionary_entry_delete_revision(&$node, $op, $teaser, $page) {
  db_query("DELETE FROM {lingwo_dictionary_entry} WHERE vid = %d", $node->vid);
};

/**
 * Implementation of hook_delete().
 */
function lingwo_dictionary_entry_delete($node) {
  db_query('DELETE FROM {lingwo_dictionary_entry} WHERE nid = %d', $node->nid);
}

/**
 * Implementation of hook_view().
 */
function lingwo_dictionary_entry_view($node, $teaser = FALSE, $page = FALSE) {
  $node = node_prepare($node, $teaser);
  $node->content['pos'] = array(
    '#value' => '<div>'. $node->pos .'</div>',
    '#weight' => 1
  );
  $node->content['senses'] = array(
    '#value' => '<div>'. $node->senses .'</div>',
    '#weight' => 1
  );
  return $node;
}


