<?php

/*
 * Implementation of hook_form_alter()
 */
function lingwo_data_admin_settings()
{
  $form = array();

  $fields = array(
    '#title' => t('Map Fields'),
    '#type' => 'fieldset',
    '#tree' => FALSE,
    '#description' => t('Here we map fields that come from import feeds and map them to CCK fields on <i>@type</i>, our entry content type', array('@type' => lingwo_dictionary_settings('entry_content_type')))
  );

  // get information from CCK about our type
  $type = content_types(lingwo_dictionary_settings('entry_content_type'));

  // make some lists of the available CCK fields for the various settings
  $available_senses_fields = array('');
  $available_fields_fields = array('');
  $available_generic_fields = array('');
  foreach ($type['fields'] as $field_name => $field) {
    if (preg_match('/^lingwo_/', $field['type'])) {
      if ($field['type'] == 'lingwo_senses') {
        $available_senses_fields[$field_name] = $field['widget']['label'];
      }
      else if ($field['type'] == 'lingwo_fields') {
        $available_fields_fields[$field_name] = $field['widget']['label'];
      }
    }
    else {
      $available_generic_fields[$field_name] = $field['widget']['label'];
    }
  }

  if (module_exists('lingwo_senses')) {
    $fields['lingwo_data_field_senses'] = array(
      '#type' => 'select',
      '#title' => t('Lingwo Senses Field'),
      '#options' => $available_senses_fields,
      '#default_value' => lingwo_data_settings('field_senses'),
    );
  }

  if (module_exists('lingwo_fields')) {
    $fields['lingwo_data_field_fields'] = array(
      '#type' => 'select',
      '#title' => t('Lingwo Fields Field'),
      '#options' => $available_fields_fields,
      '#default_value' => lingwo_data_settings('field_fields'),
    );
  }

  $fields['lingwo_data_field_pron'] = array(
    '#type' => 'select',
    '#title' => t('Pronounciation Field'),
    '#options' => $available_generic_fields,
    '#default_values' => lingwo_data_settings('field_pron'),
  );

  $source = array(
    '#type' => 'fieldset',
    '#title' => 'Source',
    '#tree' => FALSE,
  );
  foreach(array('name', 'url', 'copyright', 'license', 'raw', 'timestamp') as $x) {
    $source["lingwo_data_field_source_$x"] = array(
      '#type' => 'select',
      '#title' => $x,
      '#options' => $available_generic_fields,
      '#default_value' => lingwo_data_settings("field_source_$x"),
    );
  }
  $fields['source'] = $source;
  $form['fields'] = $fields;

  return system_settings_form($form);
}


