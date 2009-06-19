<?php
// $Id$

/**
 * @file
 * The search page.
 */

function lingwo_dictionary_search_form($form_state, $lang_pair = NULL, $word = '') {
  $languages = array();

  $result = lingwo_dictionary_list('language',
    array('active' => TRUE, '_preload' => TRUE, '_order_by' => 'ref_name', '_limit' => 100));

  foreach ($result->documents as $lang1) {
    foreach ($result->documents as $lang2) {
      if ($lang1->code != $lang2->code) {
        $languages[$lang1->code .'-'. $lang2->code] = $lang1->ref_name .'-'. $lang2->ref_name;
      }
    }
  }

  $form['search'] = array(
    '#title' => t('Find word/phrase'),
    '#type' => 'textfield',
    '#default_value' => $word,
    '#attributes' => array('title' => t('Enter the terms you wish to search for.')),
  );
  $form['lang'] = array(
    '#title' => t('Languages'),
    '#type' => 'select',
    '#options' => $languages,
    '#default_value' => $lang_pair,
  );

  $form['submit'] = array('#type' => 'submit', '#value' => t('Search'));

  return $form;
}

function lingwo_dictionary_search_form_submit($form, &$form_state) {
  $form_state['redirect'] = lingwo_dictionary_lookup_path() .'/'.
    $form_state['values']['lang'] .'/'. $form_state['values']['search'];
}

function lingwo_dictionary_lookup_page($lang_pair, $word) {
  list($source_lang, $target_lang) = explode("-", $lang_pair);

  $result = lingwo_dictionary_list('entry', array(
    'lang' => $source_lang,
    'headword' => $word,
    '_preload' => TRUE,
  ));

  include_once(drupal_get_path('module', 'lingwo_dictionary') .'/pages/lingwo_dictionary.trans.inc');

  $output = drupal_get_form('lingwo_dictionary_search_form', $lang_pair, $word);
  foreach ($result->documents as $entry) {
    $trans = lingwo_dictionary_trans_load($entry, $target_lang);
    if ($trans) {
      $output .= theme('lingwo_dictionary_translation', $entry, $trans);
    }
    else {
      $output .= "Found entry but no translation for your languages";
    }
  }

  return $output;
}


