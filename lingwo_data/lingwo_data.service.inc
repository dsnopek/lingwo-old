<?php

/**
 * @file
 * The actual callbacks for this service
 */

// TODO: access is a hard problem..  Come back to this.
/*
function lingwo_data_service_update_entry_access($data) {
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
function _lingwo_data_get_field($node, $field_name) {
}

// NOTE: originally copied from services/service/node_services.inc
function _lingwo_data_node_save($node) {
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

function _lingwo_data_field_has_changed($node1, $node2, $field_alias, $key_names=NULL, $data_key=NULL) {
  $field_name = lingwo_data_settings('field_'. $field_alias);
  if (!$field_name)
    return FALSE;

  if (is_null($key_names)) {
    $key_names = array('value');
  }
  else if (is_string($key_names)) {
    $key_names = array($key_names);
  }

  $field1 = $node1->$field_name;
  $field2 = $node2->$field_name;

  if (count($field1) != count($field2)) {
    return TRUE;
  }

  for($i = 0; $i < count($field1); $i++) {
    $v1 = $field1[$i];
    $v2 = $field2[$i];

    // for things like lingwo_sense which embed all the data in a special data key
    if (!is_null($data_key)) {
      $v1 = $v1[$data_key];
      $v2 = $v2[$data_key];
    }

    foreach($key_names as $key) {
      if ($v1[$key] != $v2[$key]) {
        return TRUE;
      }
    }
  }

  return FALSE;
}

function _lingwo_data_entry_has_changed($node) {
  // TODO: For now we are punting on this.  I don't have a clever way to figure it out
  // right now, and a better testing environment (mock functions!!) would make this
  // waaay easier.
  return TRUE;

  /*
  // since we haven't saved yet, the current 'nid' and 'vid' are for
  // the previous revision.
  $old_node = node_load($node->nid, $node->vid);

  // TODO: it would be AWESOME if there was an automatic way to do this, but
  // no matter what, data from the database is going to be different than the
  // way the importer puts it together (id's on senses for example).  So, this
  // is what we are doing for now..

  return _lingwo_data_field_has_changed($node, $old_node, 'pron') ||
         _lingwo_data_field_has_changed($node, $old_node, 'senses',
           array('difference', 'example', 'trans', 'clue'), 'data') ||
         _lingwo_data_field_has_changed($node, $old_node, 'fields',
           array('name', 'type', 'value', 'automatic'));
  */
}

// TODO: use this for sorting the JSON before stashing it on the database.
function _lingwo_data_recursive_ksort(&$entry) {
  ksort($entry);
  foreach ($entry as $key => &$value) {
    if (is_array($value)) {
      _lingwo_data_recursive_ksort($value);
    }
  }
}

function _lingwo_data_import_process_language($entry) {
  // get a list of the enabled languages
  // TODO: there has to be a more functional way to do this?!
  $languages = array();
  foreach (language_list() as $lang) {
    if ($lang->enabled) {
      $languages[$lang->language] = TRUE;
    }
  }
  // make sure this entry is for an enabled language
  if (!$languages[$entry['language']]) {
    services_error(t('The language of this entry <i>@lang</i> is not enabled on this site', 
      array('@lang' => $entry['language'])), 400);
    return NULL;
  }

  return $languages;
}

function _lingwo_data_import_process_taxonomy($entry) {
  // check that pos is valid and build a taxonomy array to put
  // on to the node object
  $pos_vid = lingwo_dictionary_settings('pos_vocabulary');
  $taxonomy = NULL;
  foreach (taxonomy_get_tree($pos_vid) as $term) {
    if (drupal_strtolower($term->name) == $entry['pos']) {
      // we set it up like on a new entry form, because it will only really
      // be used to create an entry since POS can't be changed.
      $taxonomy = array($pos_vid => $term->tid);
      break;
    }
  }
  if (is_null($taxonomy)) {
    services_error(t('Couldn\'t find the given pos in our list: @pos', 
        array('@pos' => $entry['pos'])), 400);
  }
  return $taxonomy;
}

function _lingwo_data_import_process_simple_field($entry, $field_name, $key_name = 'value') {
  $value = $entry[$field_name];
  if (!is_array($value)) {
    $value = array($value);
  }
  $res = array();
  foreach ($value as $x) {
    $res[] = array(
      $key_name => $x
    );
  }
  return $res;
}

function _lingwo_data_import_process_sources($entry) {
  $res = NULL;

  if (!empty($entry['sources'])) {
    // put sources into the format we need
    foreach ($entry['sources'] as $source_name => $source) {
      // TODO: what to do about fields that don't use value?
      // TODO: this should probably use _lingwo_data_import_process_simple_field, which
      // given the current situation, needs to be made aware of CCK..  Hmmm, probably not
      // a good design!
      $res[] = array(
        'source_name'      => array('value' => $source_name),
        'source_url'       => array('value' => $source['url']),
        'source_copyright' => array('value' => $source['copyright']),
        'source_license'   => array('value' => $source['license']),
        'source_raw'       => array('value' => $source['raw']),
        'source_timestamp' => array('value' => $source['timestamp']),
      );
    }
  }

  return $res;
}

function _lingwo_data_import_process_original($entry) {
  $res = array();

  // process pron
  if (!empty($entry['pron']) && lingwo_data_settings('field_pron')) {
    $res['pron'] = _lingwo_data_import_process_simple_field($entry, 'pron');
  }

  // process senses
  if (!empty($entry['senses']) && lingwo_data_settings('field_senses') &&
      module_exists('lingwo_senses')) {

    $res['senses'] = _lingwo_data_import_process_simple_field($entry, 'senses', 'data');
  }

  // process fields
  if (!empty($entry['fields']) && lingwo_data_settings('field_fields') &&
      module_exists('lingwo_fields')) {

    // we have to add the fields in the same order as the form
    foreach (lingwo_language_fields($entry['language'], $entry['pos']) as $field) {
      $field_name = $field['name'];
      $auto = $entry['fields'][$field_name]['automatic'];
      if (!isset($auto)) {
        $auto = TRUE;
      }

      $res['fields'][] = array(
        'name'      => $field_name,
        'type'      => $field['type'],
        'value'     => $entry['fields'][$field_name]['value'],
        'automatic' => $auto,
      );
    }
  }

  return $res;
}

function _lingwo_data_import_process_translation($entry) {
  $res = array();

  // process senses
  if (!empty($entry['senses']) && lingwo_data_settings('field_senses') &&
      module_exists('lingwo_senses')) {

    $res['senses'] = _lingwo_data_import_process_simple_field($entry, 'senses', 'data');
  }

  return $res;
}

function _lingwo_data_import_setup_node($nid, $entry, $newExtras=array()) {
  // create the original entry/update the original entry
  if (is_null($nid)) {
    $node = array(
      'type' => lingwo_dictionary_settings('entry_content_type'),
      'title' => $entry['headword'],
      'language' => $entry['language'],
    );
    $node = (object)array_merge_recursive($node, $newExtras);
  }
  else {
    $node = node_load($nid);

    if (!$node->imported) {
      // TODO: what we should really do is stash the data we got and save it for later.
      services_error(t('Existing entry was created by humans, cant overwrite'), 400);
      return NULL;
    };
  }
  // gets this marked as imported
  $node->imported = -1;

  return $node;
}

function _lingwo_data_import_set_field(&$node, $field_alias, $values) {
  $field_name = lingwo_data_settings('field_'. $field_alias);
  if (empty($field_name)) {
    return;
  }

  if (!isset($node->$field_name)) {
    $node->$field_name = array();
  }
  // TODO: we really should merge these, not just overwrite them!
  $field = &$node->$field_name;
  for($i = 0; $i < count($values); $i++) {
    $field[$i] = $values[$i];
  }
}

function _lingwo_data_import_set_fields(&$node, $fields) {
  foreach ($fields as $field_alias => $values) {
    _lingwo_data_import_set_field($node, $field_alias, $values);
  }
}

function _lingwo_data_import_set_fields_multigroup(&$node, $values) {
  $flatten = array();
  foreach ($values as $value) {
    foreach ($value as $name => $x) {
      $flatten[$name][] = $x;
    }
  }
  foreach ($flatten as $name => $x) {
    // TODO: what about fields that take something other than value?
    // TODO: should the array(value => ) part be done here, or in *_process_source()?
    _lingwo_data_import_set_field($node, $name, $x);
  }
}

/*
 * Updates an entry based on JSON data from the importer.
 */
function lingwo_data_service_update_entry($data) {
  $entry = json_decode($data, TRUE);

  $languages = _lingwo_data_import_process_language($entry);
  // TODO: instead of all these is_null()'s we should throw exceptions, catch them here
  // and then pass the value to services_error()
  if (is_null($languages)) {
    return;
  }

  $taxonomy = _lingwo_data_import_process_taxonomy($entry);
  if (is_null($taxonomy)) {
    return;
  }

  // try to find if the entry exists
  $nid = lingwo_dictionary_entry_lookup($entry['headword'], $entry['language'], $entry['pos']);
  $is_new = $nid ? FALSE : TRUE;

  $sources = _lingwo_data_import_process_sources($entry);

  // get a node object to hold the original
  $node = _lingwo_data_import_setup_node($nid, $entry, 
    array('taxonomy' => $taxonomy));
  if (is_null($node)) {
    return;
  }

  $entry_original = _lingwo_data_import_process_original($entry);

  // only bother with the rest if this node is new or has changed since its last revision
  if (empty($node->nid) || _lingwo_data_entry_has_changed($node, $entry_original)) {
    _lingwo_data_import_set_fields($node, $entry_original);

    if ($sources) {
      _lingwo_data_import_set_fields_multigroup($node, $sources);
    }

    // save the source node
    $nid = _lingwo_data_node_save($node);
    if (!is_numeric($nid)) {
      // its a list of error messages!
      return $nid;
    }
  }

  // create/update translation nodes
  // TODO: translation_node_get_translations() does some dangerous caching..  Dangerous because
  // I'm not aware of how to clear it!!
  $tnid_list = $is_new ? array() : translation_node_get_translations($nid);
  foreach ($entry['translations'] as $lang => $trans) {
    if (!$languages[$lang]) {
      continue;
    }

    $tnode = _lingwo_data_import_setup_node($tnid_list[$lang], $entry,
      array('language' => $lang, 'taxonomy' => $taxonomy));
    $tnode->language = $lang;
    if (empty($tnode->nid)) {
      $tnode->translation_source = node_load($nid);
    }

    $entry_translation = _lingwo_data_import_process_translation($trans);
    if (empty($tnode->nid) || _lingwo_data_entry_has_changed($tnode, $entry_translation)) {
      _lingwo_data_import_set_fields($tnode, $entry_translation);

      // save the translation node
      $res = _lingwo_data_node_save($tnode);
      if (!is_numeric($res)) {
        // its a list of error messages!
        return $res;
      }
    }
  }

  return $nid;
}

