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
  
  $form['lingwo_korpus_python_exec'] = array(
  	'#type' => 'textfield',
	'#title' => t('Python Executable Path'),
	'#description' => t('Path to the python executable.  Probably is a virtualenv specifically for running the automatic annotator.'),
	'#default_value' => lingwo_korpus_python_exec(),
  );

  return system_settings_form($form);
}


