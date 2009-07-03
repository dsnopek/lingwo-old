<?php

/**
 * @file
 * Implements the 'senses' field.
 */

/**
 * Implementation of hook_field_settings().
 */
function lingwo_dictionary_senses_field_settings($op, $field) {
  switch ($op) {
    case 'database columns':
      $columns['data'] = array('type' => 'text', 'size' => 'big', 'not null' => FALSE, 'sortable' => FALSE, 'serialize' => TRUE);
      return $columns;
  }
}

/**
 * Implementation of hook_field().
 */
function lingwo_dictionary_senses_field($op, &$node, $field, &$items, $teaser, $page) {
  switch ($op) {
    case 'validate':
      return $items;
  }
}

/**
 * Implementation of hook_content_is_empty().
 */
function lingwo_dictionary_senses_content_is_empty($item, $field) {
  if (empty($item['data']['difference']) && empty($item['data']['example'])) {
    return TRUE;
  }
  return FALSE;
}


function lingwo_dictionary_senses_widget_process($element, $edit, &$form_state, $form) {
  $tsrc = $form_state['values']['translation_source'];
  if (isset($tsrc)) {
    //print "translation";
  }
  else {
    //print "original";
  }

  $defaults = $element['#value']['data'];
  if (!is_array($defaults)) {
    $defaults = unserialize($defaults);
  }

  $field = content_fields($element['#field_name'], $element['#type_name']);

  $element['data']['difference'] = array(
    '#title' => 'Difference',
    '#type' => 'textfield',
    '#default_value' => $defaults['difference'],
  );
  $element['data']['example'] = array(
    '#title' => 'Example',
    '#type' => 'textfield',
    '#default_value' => $defaults['example'],
  );

  return $element;
}

function theme_lingwo_dictionary_senses_widget(&$element) {
  return theme('form_element', $element, $element['#children']);
}

function lingwo_dictionary_senses_widget(&$form, &$form_state, $field, $items, $delta = 0) {
  $element = array(
    '#type' => $field['widget']['type'],
    '#default_value' => isset($items[$delta]) ? $items[$delta] : '',
  );
  return $element;
}


