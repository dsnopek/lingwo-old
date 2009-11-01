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

  foreach (node_get_types() as $type) {
    $type_options[$type->type] = $type->name;
  }

  $form['lingwo_dictionary_entry_content_type'] = array(
    '#type' => 'select',
    '#title' => t('Entry Content Type'),
    '#default_value' => lingwo_dictionary_entry_content_type(),
    '#options' => $type_options,
    '#description' => t('The content type to use as a dictionary entry.'),
    '#required' => TRUE,
  );

  foreach (taxonomy_get_vocabularies() as $voc) {
    $pos_options[$voc->vid] = $voc->name;
  }

  $form['lingwo_dictionary_pos_vocabulary'] = array(
    '#type' => 'select',
    '#title' => t('Part of Speech Vocabulary'),
    '#default_value' => lingwo_dictionary_pos_vocabulary(),
    '#options' => $pos_options,
    '#description' => t('The taxonomy vocabulary used to denote part of speech (pos), ie: verb, noun, adjective, etc.'),
    '#required' => TRUE,
  );

  /*
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
  */

  $form = system_settings_form($form);
  // Rebuild the menu after updating the settings.
  $form['#submit'][] = 'menu_rebuild';
  return $form;
}

/**
 * Per-Language fields
 **/
function lingwo_dictionary_language_fields() {
  $form = array(
    // TODO: uncomment to convert the fieldsets below into jQuery UI tabs!
    //'#theme' => 'lingwo_dictionary_tabs'
  );

  $pos_terms = taxonomy_get_tree(lingwo_dictionary_pos_vocabulary());
  foreach ($pos_terms as $term) {
    $form['pos-'. $term->name] = array(
      // TODO: Should be the translated name!
      '#title' => $term->name,
      '#type' => 'fieldset',
    );


  }

  return $form;
}

function theme_lingwo_dictionary_tabs($form) {
  $elements = element_children($form);

  $output .= '<div id="lingwo-dictionary-tabs">';

  // produce the links
  $output .= '<ul>';
  foreach ($elements as $key) {
    $el = $form[$key];
    if (substr($key, 0, 4) == 'pos-') {
      $output .= '<li><a href="#lingwo-dictionary-tabs-'. $key .'">'. $el['#title'] .'</li>';
    }
  }
  $output .= '</ul>';

  // produce the tabs
  foreach ($elements as $key) {
    $el = $form[$key];
    if (substr($key, 0, 4) == 'pos-') {
      $output .= '<div id="lingwo-dictionary-tabs-'. $key .'">';
      $output .= drupal_render($el);
      $output .= '</div>';
    }
    else {
      $output .= drupal_render($el);
    }
  }

  $output .= '</div>';

  jquery_ui_add(array('ui.tabs'));
  drupal_add_js("$(document).ready(function() { $('#lingwo-dictionary-tabs > ul').tabs() });", "inline");
  // TODO: we probably should incorporate this into our theme, rather than use the default one
  drupal_add_css(drupal_get_path('module', 'jquery_ui').'/jquery.ui/themes/default/ui.all.css');

  return $output;
}

