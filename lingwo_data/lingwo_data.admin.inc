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
    '#description' => t('Here we map fields that may be used in import or export feed to CCK fields on <i>@type</i>, our entry content type.', array('@type' => lingwo_dictionary_settings('entry_content_type')))
  );

  // get information from CCK about our type
  $type = content_types(lingwo_dictionary_settings('entry_content_type'));

  // make some lists of the available CCK fields for the various settings
  $available_generic_fields = array('');
  foreach ($type['fields'] as $field_name => $field) {
    $available_generic_fields[$field_name] = $field['widget']['label'];
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


