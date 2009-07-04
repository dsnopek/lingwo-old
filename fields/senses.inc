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
    case 'load':
      // Content_storage does serialize each field item's columns (if the 
      // 'serialize' key for that column is set) upon writing to the db,
      // but does not unserialize when reading from the db. Hopefully,
      // this will be fixed in the future, but for now, we have to 
      // explicitly unserialize.
      if (is_array($items)) {
        foreach ($items as &$item) {
          if (is_string($item['data'])) {
            $item['data'] = unserialize($item['data']);
          }
        }
        return (array($field['field_name'] => $items));
      }
      break;
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

function lingwo_dictionary_senses_widget(&$form, &$form_state, $field, $items, $delta = 0) {
  $node = $form['#node'];
  $tsrc = $form->translation_source;

  if (isset($tsrc)) {
    // translation
  }
  else {
    // original
  }

  $field_name = $field['field_name'];
  if (isset($form_state[$field_name]['senses'])) {
    $items = $form_state[$field_name]['senses'];
  }

  $element = array(
    '#prefix' => '<div id="lingwo-senses">',
    '#suffix' => '</div>',
    '#type' => 'fieldset',
    '#tree' => TRUE,
  );

  // we count it as empty if there is less than 2 senses!
  if (!empty($items) && isset($items[1])) {
    $element['senses'] = array(
      '#theme' => 'lingwo_dictionary_senses_form',
      '#parents' => array($field['field_name']),
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
      if (count($items) > 2) {
        $row['remove_sense'] = array(
          '#type' => 'submit',
          '#value' => t('Remove Sense #!num', array('!num' => $index + 1)),
          '#submit' => array('lingwo_dictionary_senses_remove_submit'),
          '#field_name' => $field_name,
        );
      }
      $element['senses'][$index]['data'] = $row;
      $index ++;
    }
  }
  $element['add_sense'] = array(
    '#type' => 'submit',
    '#value' => count($items) == 1 ? t('Setup multiple senses') : t('Add Another Sense'),
    '#submit' => array('lingwo_dictionary_senses_add_submit'),
    '#field_name' => $field_name,
  );
  if (count($items) == 2) {
    $element['remove_sense'] = array(
      '#type' => 'submit',
      '#value' => t('Delete Senses'),
      '#submit' => array('lingwo_dictionary_senses_remove_submit'),
      '#field_name' => $field_name,
    );
  }

  return $element;
}

function _lingwo_dictionary_senses_from_form($form, &$form_state) {
  $node = node_form_submit_build_node($form, $form_state);
  $field_name = $form_state['clicked_button']['#field_name'];

  $senses = $form_state['values'][$field_name]['wrapper']['senses'];
  if ($senses) {
    foreach ($senses as $sense) {
      $weight[] = $sense['weight'];
      unset($sense['weight']);
      $values[] = $sense;
    }
    array_multisort($weight, SORT_ASC, $values);
    $senses = $values;
  }
  else {
    $senses = array();
  }

  $form_state[$field_name]['senses'] = $senses;
  return $senses;
}

function lingwo_dictionary_senses_add_submit($form, &$form_state) {
  $senses = _lingwo_dictionary_senses_from_form($form, $form_state);
  $field_name = $form_state['clicked_button']['#field_name'];
  
  if (count($senses) > 1) {
    $form_state[$field_name]['senses'][] = array();
  }
  else {
    $form_state[$field_name]['senses'] = array( array(), array() );
  }
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
    $element = &$form[$key]['data'];
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


