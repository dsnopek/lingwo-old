<?php
// $Id$

/**
 * @file
 * Pages related to search and lookup.
 */

/*
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
*/

function lingwo_dictionary_lookup_page($lang_pair, $word) {
  list($source_lang, $target_lang) = explode("-", $lang_pair);
  // TODO: bust the pos out of $word if its there (ie. /lookup/en-pl/file[verb])

  //$output = drupal_get_form('lingwo_dictionary_search_form', $lang_pair, $word);

  $nids = array();
  if ($source_nids = lingwo_dictionary_entry_lookup($word, $source_lang)) {
    foreach ($source_nids as $nid) {
      // find translation nodes
      $trans = translation_node_get_translations($nid);
      if ($trans[$target_lang]) {
        $nids[] = $trans[$target_lang]->nid;
      }
    }
  }

  if (empty($nids)) {
    // TODO: give node creation form!
    $output = '<p>'. t('Unabled to find entry.') .'</p>';
  }
  else {
    // show the teaser for each entry
    foreach ($nids as $nid) {
      $output .= node_view(node_load($nid), 1);
    }
  }

  return $output;
}

