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

function _lingwo_dictionary_entry_from_form($form, &$form_state) {
  $node = node_form_submit_build_node($form, $form_state);
  // TODO: process senses onto form_state somehow, maybe..
  return $node;
}

function lingwo_dictionary_senses_widget(&$form, &$form_state, $field, $items, $delta = 0) {
  $node = $form['#node'];
  $tsrc = $form->translation_source;

  if (isset($tsrc)) {
    // translation
  }
  else {
    // original
  }

  $element['wrapper'] = array(
    '#prefix' => '<div id="lingwo-senses">',
    '#suffix' => '</div>',
    '#title' => 'Senses',
    '#type' => 'fieldset',
  );
  
  // we count it as empty if there is less than 2 senses!
  if (!empty($items) && !isset($items[1])) {
    $element['wrapper']['senses'] = array(
      '#tree' => TRUE,
      '#theme' => 'lingwo_dictionary_senses_form',
    );

    $index = 0;
    foreach ($items as $sense) {
      $sense = $sense['data'];

      /*
      if (!isset($sense->id)) {
        uuid_make($GLOBALS['uuid'], UUID_MAKE_V4);
        uuid_export($GLOBALS['uuid'], UUID_FMT_STR, &$uuidstring);
        $sense->id = trim($uuidstring);
      }
      */
      if (isset($sense['id'])) {
        $row['id'] = array(
          '#type' => 'hidden',
          '#value' => $sense['id'],
        );
      }

      $row['difference'] = array(
        '#title' => 'Difference',
        '#type' => 'textfield',
        '#default_value' => $sense['difference'],
      );
      $row['example'] = array(
        '#title' => 'Example',
        '#type' => 'textfield',
        '#default_value' => $sense['example'],
      );
      $row['weight'] = array(
        '#type' => 'weight',
        // TODO: Delta should probably be equal to the number of definitions?
        '#delta' => 50,
        '#default_value' => $index,
      );
      if (count($node->senses) > 2) {
        $row['remove_sense'] = array(
          '#type' => 'submit',
          '#value' => t('Remove Sense #!num', array('!num' => $index + 1)),
          '#submit' => array('lingwo_dictionary_senses_remove_submit'),
        );
      }
      $element['wrapper']['senses'][$index] = $row;
      $index ++;
    }
  }
  $element['wrapper']['add_sense'] = array(
    '#type' => 'submit',
    '#value' => count($node->senses) == 0 ? t('Setup multiple senses') : t('Add Another Sense'),
    '#submit' => array('lingwo_dictionary_senses_add_submit'),
  );
  if (count($node->senses) == 2) {
    $element['wrapper']['remove_sense'] = array(
      '#type' => 'submit',
      '#value' => t('Delete Senses'),
      '#submit' => array('lingwo_dictionary_senses_remove_submit'),
    );
  }

  return $element;
}

function lingwo_dictionary_senses_add_submit($form, &$form_state) {
  /*
  $node = _lingwo_dictionary_entry_from_form($form, $form_state);
  
  if (count($node->field_senses) > 2) {
    $node->field_senses[] = array();
  }
  else {
    $node->field_senses = array( array(), array() );
  }

  $form_state['node'] = (array)$node;
  */
}

function theme_lingwo_dictionary_senses_form($form) {
  $elements = element_children($form);

  $header = array(
    '',
    t('Sense'),
    t('Weight'),
  );

  if (count($elements) > 2) {
    $header[] = t('Operations');
  }

  $rows = array();
  foreach (element_children($form) as $key) {
    $element = &$form[$key];
    $element['weight']['#attributes']['class'] = 'sense-weight';

    $weight = drupal_render($element['weight']);
    $delete = drupal_render($element['remove_sense']);

    $row = array();
    $row[] = '';
    $row[] = drupal_render($element);
    $row[] = $weight;

    if (count($elements) > 2) {
      $row[] = $delete;
    }

    $row = array('data' => $row);
    $row['class'] = !empty($row['class']) ? $row['class'] .' draggable' : 'draggable';
    $rows[] = $row;
  }

  drupal_add_tabledrag('lingwo-definition-table', 'order', 'sibling', 'sense-weight');
  return theme('table', $header, $rows, array('id' => 'lingwo-definition-table'));
}


