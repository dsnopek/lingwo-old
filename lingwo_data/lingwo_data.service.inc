<?php

/**
 * @file
 * The actual callbacks for this service
 */

function lingwo_data_service_update_entry_access($data) {
  $data = json_decode($data);
  $nid = LingwoEntry::key2nid($data->language, $data->pos, $data->headword);

  if (is_null($nid)) {
    $entry_type = LingwoEntry::$settings->content_type;
    return node_access('create', $entry_type);
  }

  $node = node_load($nid);
  $node = (array) $node;
  return node_access('update', $node);
}

class LingwoDataServiceException extends Exception {
  public $message;
  public $code;
}

// NOTE: originally copied from services/service/node_services.inc
function _lingwo_data_node_save($node) {
  // Load the required includes for drupal_execute
  module_load_include('inc', 'node', 'node.pages');

  $nid = NULL;

  $entry_type = LingwoEntry::$settings->content_type;

  // Setup form_state.
  $form_state = array();
  $form_state['values'] = (array) $node;
  $form_state['values']['bbcom_dictionary_guidelines_confirm'] = '1';
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
        'name'      => $source_name,
        'url'       => $source['url'],
        'copyright' => $source['copyright'],
        'license'   => $source['license'],
        'raw'       => $source['raw'],
        'timestamp' => $source['timestamp'],
      );
    }
  }

  return $res;
}

function _lingwo_data_import_process_original($entry) {
  $res = array();

  // process pron
  if (!empty($entry['pron']) && module_exists('lingwo_pron')) {
    $res['pron'] = array();
    if (is_array($entry['pron'])) {
      foreach ($entry['pron'] as $pron) {
        $item = array();
        if (is_array($pron)) {
          if (LingwoPron::$settings->isFieldEnabled('ipa')) {
            $item['ipa'] = $pron['ipa'];
          }
          if (LingwoPron::$settings->isFieldEnabled('audio')) {
            $item['audio'] = $pron['audio'];
          }
          if (LingwoPron::$settings->isFieldEnabled('tag')) {
            $item['tag'] = $pron['tag'];
          }
        }
        else {
          if (LingwoPron::$settings->isFieldEnabled('ipa')) {
            $item['ipa'] = $pron;
          }
        }

        if (!empty($item)) {
          $res['pron'][] = $item;
        }
      }
    }
    elseif (LingwoPron::$settings->isFieldEnabled('ipa')) {
      $res['pron'][] = array('ipa' => $entry['pron']);
    }
  }

  // process senses
  if (!empty($entry['senses']) && module_exists('lingwo_senses')) {
    $res['senses'] = _lingwo_data_import_process_simple_field($entry, 'senses');
  }

  // process fields
  if (!empty($entry['fields']) && module_exists('lingwo_fields')) {
    // we don't need to do any processing here, because it will happen
    // at _lingwo_data_import_set_field_value
    $res['fields'] = $entry['fields'];
  }

  return $res;
}

function _lingwo_data_import_process_translation($entry) {
  $res = array();

  // process senses
  if (!empty($entry['senses']) && module_exists('lingwo_senses')) {
    $res['senses'] = _lingwo_data_import_process_simple_field($entry, 'senses');
  }

  return $res;
}

function _lingwo_data_import_setup_node($nid, $entry, $newExtras=array()) {
  // create the original entry/update the original entry
  if (is_null($nid)) {
    $node = (object)array(
      'type' => LingwoEntry::$settings->content_type,
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

// Downloads a file to Drupal
function _lingwo_data_download_file($url, $field_info) {
  global $user;

  $file = NULL;

  $url_info = parse_url($url);
  $filename = rawurldecode(basename($url_info['path']));
  $tmpfile = file_destination(file_create_path(file_directory_path() . '/' . $filename), FILE_EXISTS_RENAME);
  $fp = fopen($tmpfile, 'w');

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_FILE, $fp);
  curl_setopt($ch, CURLOPT_HEADER, 0);
  @curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
  $success = curl_exec($ch);
  curl_close($ch);
  fclose($fp);

  if ($success) {
    // code copied from file_save_upload() in includes/file.inc -- this code in Drupal really needs to
    // be refactored so that you can create files without the data coming from $_FILES
    $file->uid = $user->uid;
    $file->filename = $filename;
    $file->filepath = $tmpfile;
    $file->filemime = file_get_mimetype($file->filename);
    $file->filesize = filesize($file->filepath);
    $file->status = FILE_STATUS_TEMPORARY;
    $file->timestamp = time();
    $file->origname = $file->filename;

    drupal_write_record('files', $file);
  }

  return $file;
}

function _lingwo_data_import_set_field_value($field, $value, $info) {
  if (is_null($field)) {
    $field = array();
  }

  switch ($info['type']) {
    case 'lingwo_pron':
      $field['ipa'] = $value['ipa'];
      $field['tag'] = $value['tag'];
      // so that we aren't downloading the same file a bagillion times, we don't replace the
      // file if there already is one.
      if ((empty($field['audio']) || empty($field['audio']->fid)) && !empty($value['audio'])) {
        $field['audio'] = _lingwo_data_download_file($value['audio'], $info);
      }
      break;

    case 'lingwo_fields':
      $field['type'] = $value['type'];
      $field['name'] = $value['name'];
      $field['value'] = $value['value'];
      $field['automatic'] = $value['automatic'];
      if (!empty($value['alt'])) {
        $field['alt'] = $value['alt'];
      }
      break;

    case 'lingwo_senses':
      // flatten the example arrays
      if (!empty($value['example']) && is_array($value['example'])) {
        if (LingwoSenses::$settings->example == 'single') {
          $value['example'] = $value['example'][0];
        }
        else if (LingwoSenses::$settings->example == 'multiple') {
          $value['example'] = implode("\n", $value['example']);
        }
        else {
          unset($value['example']);
        }
      }
      if (!empty($value['example_translation']) && is_array($value['example_translation'])) {
        if (LingwoSenses::$settings->example == 'single') {
          $value['example_translation'] = $value['example_translation'][0];
        }
        else if (LingwoSenses::$settings->example == 'multiple') {
          $value['example_translation'] = implode("\n", $value['example_translation']);
        }
        else {
          unset($value['example_translation']);
        }
      }

      $field['data'] = $value;
      if (empty($field['id'])) {
        // senses are treated as invalid, unless they have a UUID!
        $field['id'] = _lingwo_make_uuid();
      }
      break;

    default:
      $field['value'] = $value;
      break;
  }

  return $field;
}

function _lingwo_data_import_process_field_values($node, &$items, $info, $values) {
  switch ($info['type']) {
    case 'lingwo_senses':
      # convert the 'same_as' field to id rather than indexes
      foreach ($items as &$value) {
        if (isset($value['data']['same_as'])) {
          $value['data']['same_as'] = $items[$value['data']['same_as']]['id'];
        }
      }

      # Find the number of values we were given.
      if (_lingwo_is_translation($node)) {
        $translation_source = LingwoEntry::fromNode($node)->sourceNode;
        $max = count($translation_source->lingwo_senses);
      }
      else {
        $max = count($values);
      }

      # Check if the number of senses on this node exceeds the number of values we
      # where given.  If so, we have to remove some.
      if (count($items) > $max) {
        for($i = ($max - 1); $i < count($items); $i++) {
          if (_lingwo_is_translation($node)) {
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
  if (in_array($field_alias, array('senses', 'fields', 'pron'))) {
    // Not CCK, these are special.
    $field_name = 'lingwo_'.$field_alias;
    $field_info = array('type' => $field_name);
  }
  else {
    $field_name = lingwo_data_settings('field_'. $field_alias);
    if (empty($field_name)) {
      return;
    }

    // get the CCK type name
    $field_info = content_fields($field_name, LingwoEntry::$settings->content_type);
  }

  if (!isset($node->$field_name)) {
    $node->$field_name = array();
  }
  // TODO: we really should merge these, not just overwrite them!
  $field = &$node->$field_name;
  foreach($values as $i => $value) {
    $field[$i] = _lingwo_data_import_set_field_value($field[$i], $value, $field_info);
  }

  _lingwo_data_import_process_field_values($node, $field, $field_info, $values);
}

function _lingwo_data_import_set_fields(&$node, $fields) {
  // stash the fields data on imported_data so we can compare it on later revisions
  $node->imported_data = serialize($fields);
  
  foreach ($fields as $field_alias => $values) {
    _lingwo_data_import_set_field($node, $field_alias, $values);
  }
}

function _lingwo_data_import_set_fields_multigroup(&$node, $values, $prefix) {
  $flatten = array();
  foreach ($values as $value) {
    foreach ($value as $name => $x) {
      $flatten[$name][] = $x;
    }
  }
  foreach ($flatten as $name => $x) {
    _lingwo_data_import_set_field($node, $prefix .'_'. $name, $x);
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
    $nid = LingwoEntry::key2nid($entry['language'], $entry['pos'], $entry['headword']);
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
        _lingwo_data_import_set_fields_multigroup($node, $sources, 'source');
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
      try {
        $newExtras = array('language' => $lang);
        $tnode = _lingwo_data_import_setup_node($tnid_list[$lang]->nid, $entry, $newExtras);
      }
      catch (LingwoDataServiceException $e) {
        // if a translation is created by humans, thats not a total failure, keep going to
        // other translations.
        continue;
      }
      if (empty($tnode->nid)) {
        $tnode->translation_source = node_load($nid);

        # we need to put the original sense ids on the translation, otherwise
        # the importer will make up new IDs!!
        $tnode->lingwo_senses = array();
        foreach ($tnode->translation_source->lingwo_senses as $sense) {
          array_push($tnode->lingwo_senses, array('id' => $sense['id']));
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
          _lingwo_data_import_set_fields_multigroup($tnode, $sources, 'source');
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

