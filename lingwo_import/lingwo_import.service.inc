<?php

/**
 * @file
 * The actual callbacks for this service
 */

// TODO: access is a hard problem..  Come back to this.
/*
function lingwo_import_service_update_entry_access($data) {
  $data = json_decode($data);
  $nid = lingwo_dictionary_entry_lookup($data->headword, $data->language, $data->pos);

  if (is_null($nid)) {
    $entry_type = lingwo_dictionary_settings('entry_content_type');
    return node_access('create', $entry_type);
  }

  $node = node_load($nid);
  $node = (array) $node;
  return node_access('update', $node);
}
*/

// TODO: a function to pull the field from node
function _lingwo_import_get_field($node, $field_name) {
}

function _lingwo_import_set_field(&$node, $field_alias, $value) {
  $field_name = lingwo_import_settings('field_'. $field_alias);
  if (empty($field_name)) {
    return;
  }

  // clear original value
  // TODO: is this the right thing to do always?
  $node->$field_name = array();

  if (!is_array($value)) {
    $value = array($value);
  }
  foreach ($value as $x) {
    // TODO: what about fields that don't use 'value'?
    array_push($node->$field_name, array('value' => $x));
  }
}

function _lingwo_import_set_multigroup(&$node, $values) {
  $flatten = array();
  foreach ($values as $value) {
    foreach ($value as $name => $x) {
      $flatten[$name][] = $x;
    }
  }
  foreach ($flatten as $name => $x) {
    _lingwo_import_set_field($node, $name, $x);
  }
}

// NOTE: originally copied from services/service/node_services.inc
function _lingwo_import_node_save($node) {
  // Load the required includes for drupal_execute
  module_load_include('inc', 'node', 'node.pages');

  $nid = NULL;

  $entry_type = lingwo_dictionary_settings('entry_content_type');

  // Setup form_state.
  $form_state = array();
  $form_state['values'] = (array) $node;
  $form_state['values']['op'] = t('Save');

  if ($node->nid) {
    // Later on in the chain node_form seems to expect a copy of
    // the old node object.
    $form_state['node'] = (array) $node;

    $ret = drupal_execute($entry_type .'_node_form', $form_state, (object)$node);

    // If the node is immediately reloaded after update, it will
    // load the OLD cached version.
    node_load(0, NULL, TRUE);

    // Set $nid, so it can be returned
    $nid = $node->nid;
  }
  else {
    $ret = drupal_execute($entry_type .'_node_form', $form_state, $node);

    // Fetch $nid out of $form_state
    $nid = $form_state['nid'];
  }
  if ($errors = form_get_errors()) {
    return services_error(implode("\n", $errors), 401);
  }
  return $nid;
}

/*
 * Updates an entry based on JSON data from the importer.
 */
function lingwo_import_service_update_entry($data) {
  $entry = json_decode($data);

  // TODO: check that language is valid/enabled

  // try to find if the entry exists
  $nid = lingwo_dictionary_entry_lookup($entry->headword, $entry->language, $entry->pos);

  // TODO: check that pos is valid, and actually look it up!!
  $pos_vid = lingwo_dictionary_settings('pos_vocabulary');
  $taxonomy = NULL;
  foreach (taxonomy_get_tree($pos_vid) as $term) {
    if (drupal_strtolower($term->name) == $entry->pos) {
      // we set it up like on a new entry form, because it will only really
      // be used to create an entry since POS can't be changed.
      $taxonomy = array($pos_vid => $term->tid);
      break;
    }
  }
  if (is_null($taxonomy)) {
    return services_error(t('Couldn\'t find the given pos in our list'), 400);
  }

  // create the original entry/update the original entry
  if (is_null($nid)) {
    $node = (object)array(
      'type' => lingwo_dictionary_settings('entry_content_type'),
      'title' => $entry->headword,
      'language' => $entry->language,
      'taxonomy' => $taxonomy,
    );

  }
  else {
    $node = node_load($nid);
  }

  // map pron
  _lingwo_import_set_field($node, 'pron', $entry->pron);

  // map sources
  if (!empty($entry->sources)) { //&& !empty(lingwo_import_settings('group_sources'))) {
    // put sources into the format we need
    $sources = array();
    foreach ($entry->sources as $source_name => $source) {
      $sources[] = array(
        'source_name'      => $source_name,
        'source_url'       => $source->url,
        'source_copyright' => $source->copyright,
        'source_license'   => $source->license,
        'source_raw'       => $source->raw,
        'source_timestamp' => $source->timestamp,
      );
    }

    _lingwo_import_set_multigroup($node, $sources);
  }

  // TODO: deal with senses
  // TODO: deal with field

  return _lingwo_import_node_save($node);
}

