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

  // bust the pos out of $word if its there (ie. /lookup/en-pl/file[verb])
  $pos = NULL;
  if (preg_match('/([^\(]+)\((\S+)\)/', $word, $matches)) {
    $word = trim($matches[1]);
    $pos  = $matches[2];
  }

  // if this is a single node
  if ($pos) {
    // TODO: give node creation form if it doesn't exist!
    $nid = lingwo_dictionary_entry_lookup($word, $source_lang, $pos);
    return lingwo_dictionary_lookup_page_node($nid);
  }

  //$output = drupal_get_form('lingwo_dictionary_search_form', $lang_pair, $word);

  $nids = array();
  if ($source_nids = lingwo_dictionary_entry_lookup($word, $source_lang)) {
    if ($target_lang) {
      foreach ($source_nids as $nid) {
        // find translation nodes
        $trans = translation_node_get_translations($nid);
        if ($trans[$target_lang]) {
          $nids[] = $trans[$target_lang]->nid;
        }
      }
    }
    else {
      $nids = $source_nids;
    }
  }

  return lingwo_dictionary_lookup_page_list($nids);
}

function lingwo_dictionary_lookup_page_node($nid) {
  // Set query path so that the tabs from the node get displayed.
  menu_set_active_item('node/'. $nid);

  // Generate the node.
  return menu_execute_active_handler($url);
}

function lingwo_dictionary_lookup_page_list($nids) {
  if (empty($nids)) {
    //drupal_set_title(t('Entry Not Found'));
    // TODO: give node creation form!
    $output = '<p>'. t('Unabled to find entry.') .'</p>';
  }
  else {
    // show the teaser for each entry
    $first = 1;
    foreach ($nids as $nid) {
      $node = node_load($nid);
      if ($first) {
        //drupal_set_title($node->title);
        $first = 0;
      }
      $output .= node_view($node, 1);
    }
  }

  return $output;
}


