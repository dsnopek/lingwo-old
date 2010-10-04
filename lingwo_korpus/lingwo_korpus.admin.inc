<?php

/*
 * Implementation of hook_form_alter()
 */
function lingwo_korpus_admin_settings()
{
  $form = array();

  $type_options[''] = '';
  foreach (node_get_types() as $type) {
    $type_options[$type->type] = $type->name;
  }

  $form["lingwo_korpus_text_content_type"] = array(
    '#type' => 'select',
    '#title' => t('Text Content Type'),
    '#options' => $type_options,
    '#description' => t('The content type to use as a korpus text.'),
    '#default_value' => lingwo_korpus_text_content_type(),
  );

  $fields = content_fields();

  // make some lists of the available CCK fields for the various settings
  $available_generic_fields = array('');
  foreach ($fields as $field_name => $field) {
    $available_generic_fields[$field_name] = $field['widget']['label'];
  }

  $form['lingwo_korpus_field_remote_url'] = array(
    '#type' => 'select',
    '#title' => t('Remote URL Field'),
    '#options' => $available_generic_fields,
    '#default_value' => lingwo_korpus_field_remote_url(),
  );
  
  $form['lingwo_korpus_python_exec'] = array(
    '#type' => 'textfield',
    '#title' => t('Python Executable Path'),
    '#description' => t('Path to the python executable.  Probably is a virtualenv specifically for running the automatic annotator.'),
    '#default_value' => lingwo_korpus_python_exec(),
  );

  return system_settings_form($form);
}


