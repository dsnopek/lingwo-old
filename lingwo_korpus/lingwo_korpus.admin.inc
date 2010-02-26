<?php

/*
 * Implementation of hook_form_alter()
 */
function lingwo_korpus_admin_settings()
{
  $form = array();

  $form["lingwo_korpus_text_type"] = array(
    '#type' => 'select',
    '#title' => t('Text Content Type'),
    '#options' => array(''),
    '#description' => t('The content type to use as a korpus text.'),
    '#default_value' => '',
  );

  return system_settings_form($form);
}


