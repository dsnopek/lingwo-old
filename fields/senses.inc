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
  $func = 'lingwo_dictionary_senses_widget_'. (isset($node->translation_source) ? 'translation' : 'original');
  return $func($form, $form_state, $field, $items, $delta);
}

function lingwo_dictionary_senses_widget_original(&$form, &$form_state, $field, $items, $delta = 0) {
  $field_name = $field['field_name'];
  if (isset($form_state[$field_name]['senses'])) {
    $items = $form_state[$field_name]['senses'];
  }

  $element = array(
    '#type' => 'fieldset',
    '#tree' => TRUE,
  );

  $element['wrapper'] = array(
    '#prefix' => '<div id="'. $field_name .'-wrapper">',
    '#suffix' => '</div>',
  );

  $element['wrapper']['senses'] = array(
    '#theme' => 'lingwo_dictionary_senses_original_form',
    '#parents' => array($field['field_name']),
  );

  // we count it as empty if there is less than 2 senses!
  if (!empty($items) && count($items) > 1) {
    $index = 0;
    foreach ($items as $sense) {
      $sense = $sense['data'];

      if (!isset($sense['id'])) {
        $sense['id'] = _ld_make_uuid();
      }

      $row['id'] = array(
        '#type' => 'hidden',
        '#value' => $sense['id'],
      );

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
      $element['wrapper']['senses'][$index]['data'] = $row;
      $index ++;
    }
  }
  $element['wrapper']['add_sense'] = array(
    '#type' => 'submit',
    '#value' => count($items) == 1 ? t('Setup multiple senses') : t('Add Another Sense'),
    '#submit' => array('lingwo_dictionary_senses_add_submit'),
    '#field_name' => $field_name,
    /*
    '#ahah' => array(
      'event' => 'click',
      'path' => 'lingwo_dictionary_senses/ahah/'. $field_name,
      'wrapper' => $field_name .'-wrapper',
      'effect' => 'fade',
    ),
    */
  );
  if (count($items) == 2) {
    $element['wrapper']['remove_sense'] = array(
      '#type' => 'submit',
      '#value' => t('Delete Senses'),
      '#submit' => array('lingwo_dictionary_senses_remove_submit'),
      '#field_name' => $field_name,
    );
  }

  return $element;
}

function lingwo_dictionary_senses_widget_translation(&$form, &$form_state, $field, $items, $delta = 0) {
  $field_name = $field['field_name'];

  $senses = lingwo_dictionary_senses_get_translations($form['#node'], $field_name, $items);
  $orig_senses = $form['#node']->translation_source->$field_name;

  $element = array(
    '#type' => 'fieldset',
    '#tree' => TRUE,
    '#theme' => 'lingwo_dictionary_senses_translation_form',
  );

  $index = 0;
  foreach ($senses as $sense) {
    $orig_sense = $sense['data']['orig_sense'];

    $sense_form = array();
    $sense_form['data']['id'] = array(
      '#type' => 'hidden',
      '#value' => $sense['data']['id'],
    );
    if ($orig_sense) {
      if ($orig_sense['difference']) {
        $sense_form['data']['difference'] = array(
          '#type' => 'item',
          '#title' => t('Difference'),
          '#value' => $orig_sense['difference'],
        );
      }
      if ($orig_sense['example']) {
        $sense_form['data']['example'] = array(
          '#type' => 'item',
          '#title' => t('Example'),
          '#value' => $orig_sense['example'],
        );
      }
    }
    if (count($senses) > 1) {
      $sense_form['data']['clue'] = array(
        '#type' => 'textfield',
        '#title' => t('Clue'),
        '#description' => t('A couple words that will clue the reader to how this sense is different.'),
        '#default_value' => $sense['clue'],
      );
    }
    if (!$orig_sense && !($sense['id'] == '*' && count($orig_senses) == 0)) {
      $sense_form['old_sense_message'] = array(
        '#prefix' => '<div class="lingwo-sense-old-message">* ',
        '#value' => t('This translation is for a sense that has been removed from the entry.'),
        '#suffix' => '</div>',
      );
      $sense_form['retire_sense'] = array(
        '#type' => 'checkbox',
        '#title' => t('Retire this obsolete sense.'),
      );
    }
    $sense_form['data']['trans'] = array();
    for ($t = 0; $t < max(3, count($sense['values'])); $t++) {
      $sense_form['data']['trans'][$t] = array(
        '#type' => 'textfield',
        '#default_value' => $sense->values[$t]
      );
    }
    $sense_form['data']['trans']['0']['#title'] = t('Translation');

    $element[$index++] = $sense_form;
  }

  return $element;
}

/* Takes an entry and a trans and makes a list of trans senses in the appropriate
 * order, connected to the entry senses if one exists.
 */
function lingwo_dictionary_senses_get_translations($node, $field_name, $items) {
  $orig = $node->translation_source;
  $orig_senses = isset($orig) ? $orig->$field_name : array();
  $trans_senses = $node->nid ? $items : NULL;

  $senses = array();
  $id_list = array();

  if (isset($orig_senses) && count($orig_senses) > 0) {
    foreach ($orig_senses as $sense) {
      $trans_sense['data'] = $trans_senses[$sense['data']['id']];
      $trans_sense['data']['orig_sense'] = $sense['data'];
      $trans_sense['data']['id'] = $sense['data']['id'];
      
      $senses[] = $trans_sense;
      $id_list[$sense['data']['id']] = 1;
    }
  }

  if (count($senses) == 0) {
    if ($trans_senses && isset($trans_senses['*'])) {
      $only_sense = $trans_senses['*'];
    }
    else {
      $only_sense = array('id' => '*');
    }
    $senses[] = $only_sense;
    $id_list['*'] = 1;
  }

  if ($trans_senses) {
    foreach ($trans_senses as $id => $trans_sense) {
      $trans_sense['id'] = $id;
      if (!array_key_exists($id, $id_list)) {
        $senses[] = $trans_sense;
      }
    }
  }

  return $senses;
}

function _lingwo_dictionary_senses_from_form($form, &$form_state) {
  $node = node_form_submit_build_node($form, $form_state);
  $field_name = $form_state['clicked_button']['#field_name'];

  // hack to stop taxonomy from resetting when the form is rebuilt
  $form_state['node']['taxonomy'] = taxonomy_preview_terms($node);

  $senses = $form_state['values'][$field_name];
  if ($senses) {
    foreach ($senses as $index => $sense) {
      if (is_numeric($index)) {
        $weight[] = $sense['data']['weight'];
        unset($sense['data']['weight'], $sense['data']['remove_sense']);
        $values[] = $sense;
      }
    }
    if (!empty($values)) {
      array_multisort($weight, SORT_ASC, $values);
    }
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

function lingwo_dictionary_senses_remove_submit($form, &$form_state) {
  $senses = _lingwo_dictionary_senses_from_form($form, $form_state);
  $field_name = $form_state['clicked_button']['#field_name'];
  
  if (count($senses) == 2) {
    $form_state[$field_name]['senses'] = array();
  }
  else {
    $delta = $form_state['clicked_button']['#parents'][1];
    unset($form_state[$field_name]['senses'][$delta]);
  }
}

function lingwo_dictionary_senses_ahah($field_name) {
  module_load_include('inc', 'node', 'node.pages');
  $form_state = array('storage' => NULL, 'submitted' => FALSE);
  $form_build_id = $_POST['form_build_id'];

  $form = form_get_cache($form_build_id, $form_state);

  _ld_disable_validation($form);

  $args = $form['#parameters'];
  $form_id = array_shift($args);
  $form_state['post'] = $form['#post'] = $_POST;
  $form['#post']['form_id'] = $form_id;
  $form['#programmed'] = $form['#redirect'] = FALSE;

  drupal_process_form($form_id, $form, $form_state);

  $form = drupal_rebuild_form($form_id, $form_state, $args, $form_build_id);

  $element = $form[$field_name]['wrapper']; 
  unset($element['#prefix'], $element['#suffix']);
  $output = theme('status_messages') . drupal_render($element);

  drupal_json(array('status' => TRUE, 'data' => $output));
}

function theme_lingwo_dictionary_senses_original_form($form) {
  drupal_add_tabledrag('lingwo-definition-table', 'order', 'sibling', 'sense-weight');

  $elements = element_children($form);
  if (empty($elements)) {
    return '';
  }

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

  return theme('table', $header, $rows, array('id' => 'lingwo-definition-table'));
}

function theme_lingwo_dictionary_senses_translation_form($form) {
  $header = array(
    t('No.'),
    array('data' => t('Sense'), 'colspan' => 2),
  );

  $rows = array();
  $elements = element_children($form);
  foreach ($elements as $key) {
    $row = array();
    $row[] = ($key + 1);

    if (count($elements) > 1) {
      // split into trans in column 2 and everything else in column 1
      $trans = drupal_render($form[$key]['trans']);
      $row[] = drupal_render($form[$key]);
      $row[] = $trans;
    }
    else {
      $row[] = array('data' => drupal_render($form[$key]), 'colspan' => 2);
    }

    $rows[] = $row;
  }

  return theme('table', $header, $rows);
}
