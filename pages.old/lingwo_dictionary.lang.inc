<?php
// $Id$

/**
 * @file
 * User visible pages concerning languages
 */

function lingwo_dictionary_language_list_page($which) {
  #$func = create_function('$x', 'return $x->ref_name;');
  #$languages = array_map($func, $GLOBALS['db']->find('__type__:language AND active:0',
  #  array('limit' => 100)));

  global $pager_page_array, $pager_total, $pager_total_items;

  $container = lingwo_dictionary_get_container('language');

  $page = isset($_GET['page']) ? $_GET['page'] : '';
  $limit = 10;
  $offset = ($page * $limit);

  $args = array(
    '_preload' => TRUE,
    '_order_by' => 'ref_name',
    '_limit' => $limit,
    '_offset' => $offset,
    '_total_count' => TRUE,
  );
  if ($which == 'enabled') {
    $args['active'] = TRUE;
  }
  else if ($which == 'disabled') {
    $args['active'] = FALSE;
  }

  $result = $container->list_($args);
  $total_pages = ceil($result->total_count / $limit);

  // Hack!  We have to set all these globals so that the Drupal pagers work correctly.  They are
  // usually set by pager_query() but since that calls directly to the database we can't use it.
  $element = 0;
  $pager_page_array = explode(',', $page);
  $pager_total_items[$element] = $result->total_count;
  $pager_total[$element] = ceil($pager_total_items[$element] / $limit);
  $pager_page_array[$element] = max(x, min((int)$pager_page_array[$element], ((int)$pager_total[$element]) - 1));

  //$output .= drupal_get_form('lingwo_dictionary_language_filter_form');
  $output .= theme('lingwo_dictionary_language_list', $result->documents);
  $output .= theme('pager', NULL, $limit, $element);
  return $output;
}

function lingwo_dictionary_language_filter_form($form_state) {
  $form['filter'] = array(
    '#type' => 'fieldset',
    '#title' => t('Filter'),
  );
  $form['filter']['search_for'] = array(
    '#type' => 'textfield',
    '#title' => t('Search'),
  );
  $form['filter']['search_by'] = array(
    '#type' => 'select',
    '#title' => t('Search by'),
    '#options' => array(
      'ref_name' => t('Reference Name'),
      'code' => t('ISO-639-3 Code'),
    ),
  );
  $form['filter']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Filter'),
  );

  return $form;
}

function theme_lingwo_dictionary_language_list($languages) {
  $header = array(
    t('Reference Language Name'),
    t('Scope'),
    t('Type'),
    t('Code'),
    t('Operations'),
  );

  $rows = array();
  foreach ($languages as $lang) {
    $row = array();
    $row[] = $lang->ref_name;
    $row[] = $lang->scope;
    $row[] = $lang->type;
    $row[] = $lang->code;
    $row[] = l(t('edit'), 'language/'. $lang->code .'/edit');

    $rows[] = $row;
  }

  return theme('table', $header, $rows);
}

function lingwo_dictionary_language_edit_form($form_state, $lang) {
  $form['code'] = array(
    '#type' => 'hidden',
    '#value' => $lang->code,
  );
  $form['active'] = array(
    '#type' => 'radios',
    '#options' => array(
      '0' => 'Disabled',
      '1' => 'Enabled',
    ),
    '#description' => 'Only enabled languages are able to words added to them or be used for translations',
    '#default_value' => $lang->active ? "1" : "0",
  );
  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save'),
  );

  return $form;
}

function lingwo_dictionary_language_edit_form_submit($form, &$form_state) {
  $container = lingwo_dictionary_get_container('language');
  $lang = $container->get($form_state['values']['code']);
  $lang->active = strcmp($form_state['values']['active'], '1') == 0 ? TRUE : FALSE;
  $container->update($lang);

  drupal_set_message(t('Language updated.'));
}

