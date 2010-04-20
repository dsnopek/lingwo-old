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

class LingwoDataServiceException extends Exception {
  public $message;
  public $code;
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

  // Later on in the chain node_form seems to expect a copy of
  // the old node object.
  $form_state['node'] = (array) $node;

  // execute the form
  $ret = drupal_execute($entry_type .'_node_form', $form_state, $node);

  if ($node->nid) {
    // If the node is immediately reloaded after update, it will
    // load the OLD cached version.
    node_load(0, NULL, TRUE);

    // Set $nid, so it can be returned
    $nid = $node->nid;
  }
  else {
    // Fetch $nid out of $form_state
    $nid = $form_state['nid'];
  }
  if ($errors = form_get_errors()) {
    throw new LingwoDataServiceException(implode("\n", $errors), 401);
  }
  return $nid;
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
    throw new LingwoDataServiceException(
      t('The language of this entry <i>@lang</i> is not enabled on this site', 
      array('@lang' => $entry['language'])), 400);
  }

  return $languages;
}

function _lingwo_data_import_process_simple_field($entry, $field_name) {
  $value = $entry[$field_name];
  if (!is_array($value)) {
    $value = array($value);
  }
  return $value;
}

function _lingwo_data_import_process_sources($entry) {
  $res = NULL;

  if (!empty($entry['sources'])) {
    // put sources into the format we need
    foreach ($entry['sources'] as $source_name => $source) {
      $res[] = array(
        'source_name'      => $source_name,
        'source_url'       => $source['url'],
        'source_copyright' => $source['copyright'],
        'source_license'   => $source['license'],
        'source_raw'       => $source['raw'],
        'source_timestamp' => $source['timestamp'],
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

    $res['senses'] = _lingwo_data_import_process_simple_field($entry, 'senses');
  }

  // process fields
  if (!empty($entry['fields']) && lingwo_data_settings('field_fields') &&
      module_exists('lingwo_fields')) {

    // we have to add the fields in the same order as the form
    foreach (lingwo_language_fields($entry['language'], $entry['pos']) as $field_name => $field) {
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

    $res['senses'] = _lingwo_data_import_process_simple_field($entry, 'senses');
  }

  return $res;
}

function _lingwo_data_import_setup_node($nid, $entry, $newExtras=array()) {
  // create the original entry/update the original entry
  if (is_null($nid)) {
    $node = (object)array(
      'type' => lingwo_dictionary_settings('entry_content_type'),
      'title' => $entry['headword'],
      'language' => $entry['language'],
      'pos' => $entry['pos'],
    );
    foreach ($newExtras as $key => $value) {
      $node->$key = $value;
    }
  }
  else {
    $node = node_load($nid);

    if (!$node->imported) {
      // TODO: what we should really do is stash the data we got and save it for later.
      throw new LingwoDataServiceException(
        t('Existing entry was created by humans, cant overwrite'), 400);
    };
  }
  // gets this marked as imported
  $node->imported = -1;

  return $node;
}

function _lingwo_data_entry_has_changed($node, $entry_data) {
  // If this is a new node, then it has changed!
  if (empty($node->nid))
    return TRUE;

  // compare the data from the previous import with the data we have now
  $old_entry_data = unserialize($node->imported_data);
  return $entry_data != $old_entry_data;
}

function _lingwo_data_import_set_field_value(&$field, $value, $type) {
  switch ($type) {
    case 'lingwo_fields':
      $field['type'] = $value['type'];
      $field['name'] = $value['name'];
      $field['value'] = $value['value'];
      $field['automatic'] = $value['automatic'];
      break;

    case 'lingwo_senses':
      $field['data'] = $value;
      if (empty($field['id'])) {
        // senses are treated as invalid, unless they have a UUID!
        $field['id'] = _ld_make_uuid();
      }
      break;

    default:
      $field['value'] = $value;
      break;
  }
}

function _lingwo_data_import_process_field_values($node, &$items, $type, $values) {
  switch ($type) {
    case 'lingwo_senses':
      # convert the 'same_as' field to id rather than indexes
      foreach ($items as &$value) {
        if (isset($value['data']['same_as'])) {
          $value['data']['same_as'] = $items[$value['data']['same_as']]['id'];
        }
      }

      # Find the number of values we were given.
      if (lingwo_dictionary_entry_is_translation($node)) {
        $field_senses = lingwo_data_settings('field_senses');
        $translation_source = lingwo_dictionary_entry_load_translation_source($node);
        $max = count($translation_source->$field_senses);
      }
      else {
        $max = count($values);
      }

      # Check if the number of senses on this node exceeds the number of values we
      # where given.  If so, we have to remove some.
      if (count($items) > $max) {
        for($i = ($max - 1); $i < count($items); $i++) {
          if (lingwo_dictionary_entry_is_translation($node)) {
            $items[$i]['retire_sense'] = TRUE;
          }
          else {
            unset($items[$i]);
          }
        }
      }
      break;
  };
}

function _lingwo_data_import_set_field(&$node, $field_alias, $values) {
  $field_name = lingwo_data_settings('field_'. $field_alias);
  if (empty($field_name)) {
    return;
  }

  // TODO: get CCK infos about this field
  $field_type = content_fields($field_name, lingwo_dictionary_settings('entry_content_type'));

  if (!isset($node->$field_name)) {
    $node->$field_name = array();
  }
  // TODO: we really should merge these, not just overwrite them!
  $field = &$node->$field_name;
  for($i = 0; $i < count($values); $i++) {
    _lingwo_data_import_set_field_value($field[$i], $values[$i], $field_type['type']);
  }

  _lingwo_data_import_process_field_values($node, $field, $field_type['type'], $values);
}

function _lingwo_data_import_set_fields(&$node, $fields) {
  // stash the fields data on imported_data so we can compare it on later revisions
  $node->imported_data = serialize($fields);
  
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
    _lingwo_data_import_set_field($node, $name, $x);
  }
}

/*
 * Updates an entry based on JSON data from the importer.
 */
function lingwo_data_service_update_entry($data, $force_changed=FALSE) {
  $entry = json_decode($data, TRUE);

  try {
    // Get the list of available languages and check the language given in $entry is on it.
    $languages = _lingwo_data_import_process_language($entry);

    // Try to find if the already entry exists.
    $nid = lingwo_dictionary_entry_lookup($entry['headword'], $entry['language'], $entry['pos']);
    $is_new = $nid ? FALSE : TRUE;

    // Process the list of sources given by the $entry.
    $sources = _lingwo_data_import_process_sources($entry);

    // Setup a $node to hold the original (not translated) entry
    $node = _lingwo_data_import_setup_node($nid, $entry); 

    // Process the $entry creating an array holding the data which will be put on our node
    $entry_original = _lingwo_data_import_process_original($entry);

    // Only bother filling the node and saving it if it has changed.
    if ($force_changed || _lingwo_data_entry_has_changed($node, $entry_original)) {
      // Copy fields onto $node.
      _lingwo_data_import_set_fields($node, $entry_original);

      // Copy sources data onto $node.
      if ($sources) {
        _lingwo_data_import_set_fields_multigroup($node, $sources);
      }

      // Save the source node.
      $nid = _lingwo_data_node_save($node);
    }

    // create/update translation nodes
    // TODO: translation_node_get_translations() does some dangerous caching..  Dangerous because
    // I'm not aware of how to clear it!!
    $tnid_list = $is_new ? array() : translation_node_get_translations($nid);
    foreach ($entry['translations'] as $lang => $trans) {
      // Skip this translation if its not on our list of enabled languages.
      if (!$languages[$lang]) {
        continue;
      }

      // Setup a $tnode to hold the translated node
      $tnode = _lingwo_data_import_setup_node($tnid_list[$lang]->nid, $entry,
        array('language' => $lang));
      if (empty($tnode->nid)) {
        $tnode->translation_source = node_load($nid);

        # we need to put the original sense ids on the translation, otherwise
        # the importer will make up new IDs!!
        $field_senses = lingwo_data_settings('field_senses');
        $tnode->$field_senses = array();
        foreach ($tnode->translation_source->$field_senses as $sense) {
          array_push($tnode->$field_senses, array('id' => $sense['id']));
        }
      }

      // Process $trans creating an array holding the data which will be put on our node
      $entry_translation = _lingwo_data_import_process_translation($trans);

      // Only bother filling the node and saving it if it has changed.
      if ($force_changed || _lingwo_data_entry_has_changed($tnode, $entry_translation)) {
        // Copy fields onto $tnode.
        _lingwo_data_import_set_fields($tnode, $entry_translation);

        // Copy sources data onto $tnode.
        if ($sources) {
          _lingwo_data_import_set_fields_multigroup($tnode, $sources);
        }

        // Save the translation node.
        _lingwo_data_node_save($tnode);
      }
    }
  }
  catch (LingwoDataServiceException $e) {
    return services_error($e->message, $e->code);
  }

  return $nid;
}

