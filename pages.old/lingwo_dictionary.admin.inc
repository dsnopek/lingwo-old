<?php
// $Id$

/**
 * @file
 * Admin pages.
 */


/**
 * Settings page
 **/

function lingwo_dictionary_admin_settings() {
  $form = array();

  $form['lingwo_dictionary_lookup_path'] = array(
    '#type' => 'textfield',
    '#title' => t('Lookup path'),
    '#default_value' => lingwo_dictionary_lookup_path(),
    '#description' => t('The drupal path for dictionary lookup. Do not include a trailing slash. Leave empty to disable the lookup path.'),
    '#field_prefix' => url(NULL, array('absolute' => FALSE)) . (variable_get('clean_url', 0) ? '' : '?q=')
  );
  $form['lingwo_dictionary_api_url'] = array(
    '#type' => 'textfield',
    '#title' => t('URL of API'),
    '#default_value' => lingwo_dictionary_api_url()
  );
  $form['lingwo_dictionary_api_account'] = array(
    '#type' => 'textfield',
    '#title' => t('API key account'),
    '#default_value' => lingwo_dictionary_api_account()
  );
  $form['lingwo_dictionary_api_secret'] = array(
    '#type' => 'textfield',
    '#title' => t('API key secret'),
    '#default_value' => lingwo_dictionary_api_secret()
  );
  $form['lingwo_dictionary_options'] = array(
    '#type' => 'checkboxes',
    '#title' => t('Options'),
    '#options' => array(
      'entry edit' => t('Entry Edit: Allow entry editting.'),
      'search similar' => t('Search Similar: Allow searching for similar entries.'),
      'view revisions' => t('View Revisions: Allow viewing of revisions.'),
    ),
    '#default_value' => lingwo_dictionary_options()
  );
  $form['lingwo_dictionary_404_type'] = array(
    '#type' => 'checkboxes',
    '#title' => t('Entry 404 type'),
    '#description' => t('Select the 404 (page not found) type for all pages under the lookup path.'),
    '#multiple' => TRUE,
    '#options' => array(
      'Link to similar' => t('Link to similar'),
      'Link to creation' => t('Link to creation'),
      'Creation form' => t('Creation form'),
    ),
    '#default_value' => lingwo_dictionary_404_type(),
  );

  $form = system_settings_form($form);
  // Rebuild the menu after updating the settings.
  $form['#submit'][] = 'menu_rebuild';
  return $form;
}


