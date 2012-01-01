<?php

/*
 * Implementation of hook_form_alter()
 */
function lingwo_data_admin_settings()
{
  $settings =& LingwoImport::$settings;
  $form = array();

  $fields = array(
    '#title' => t('Map Fields'),
    '#type' => 'fieldset',
    '#tree' => FALSE,
    '#description' => t('Here we map fields that may be used in import or export feed to CCK fields on <i>@type</i>, our entry content type.', array('@type' => LingwoEntry::$settings->content_type))
  );

  // get information from CCK about our type
  $type = content_types(LingwoEntry::$settings->content_type);

  // make some lists of the available CCK fields for the various settings
  $available_generic_fields = array('');
  foreach ($type['fields'] as $field_name => $field) {
    $available_generic_fields[$field_name] = $field['widget']['label'];
  }

  $source = array(
    '#type' => 'fieldset',
    '#title' => 'Source',
    '#tree' => FALSE,
  );
  foreach(array('name', 'url', 'copyright', 'license', 'raw', 'timestamp') as $x) {
    $source[$settings->name("field_source_$x")] = array(
      '#type' => 'select',
      '#title' => $x,
      '#options' => $available_generic_fields,
      '#default_value' => $settings->__get("field_source_$x"),
    );
  }
  $fields['source'] = $source;
  $form['fields'] = $fields;

  $form[$settings->name('java_path')] = array(
    '#title' => t('Java path'),
    '#type' => 'textfield',
    '#description' => t('The full path to execute the java interpreter.  For example, <code>/usr/bin/java</code>'),
    '#default_value' => $settings->java_path,
  );

  $form[$settings->name('config_path')] = array(
    '#title' => t('Config path'),
    '#type' => 'textfield',
    '#description' => t('The full path to the JSON config for the importer.  For example, <code>/home/username/importer-config.js</code>'),
    '#default_value' => $settings->config_path,
  );

  return system_settings_form($form);
}


