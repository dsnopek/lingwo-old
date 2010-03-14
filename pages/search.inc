<?php
// $Id$

/**
 * @file
 * Pages related to search and lookup.
 */

function lingwo_dictionary_search_form(&$form_state, $lang_pair=NULL, $word=NULL) {
  $language_options = array();
  $languages = language_list('enabled');
  foreach ($languages[1] as $lang1_code => $lang1) {
    foreach ($languages[1] as $lang2_code => $lang2) {
      $name = $lang1->name;
      if ($lang1_code != $lang2_code) {
        $name = $name .' => '. $lang2->name;
        // TODO: we should allow the pure dictionaries, but for now, we will
        // limit to just the translations.
        $language_options["$lang1_code-$lang2_code"] = $name .' '. t('Dictionary');
      }
    }
  }

  $form['search'] = array(
    '#title' => t('Find word/phrase'),
    '#type' => 'textfield',
    '#default_value' => $word,
    '#attributes' => array('title' => t('Enter the terms you wish to search for.')),
  );
  $form['lang_pair'] = array(
    '#title' => t('Languages'),
    '#type' => 'select',
    '#options' => $language_options,
    '#default_value' => $lang_pair,
  );

  // TODO: we should write some JavaScript that will do the redirect straight
  // off to save the extra round-trip to the server.
  $form['submit'] = array('#type' => 'submit', '#value' => t('Search'));

  return $form;
}

function lingwo_dictionary_search_form_submit($form, &$form_state) {
  $form_state['redirect'] = implode('/', array(
    lingwo_dictionary_settings('lookup_path'),
    $form_state['values']['lang_pair'],
    $form_state['values']['search']
  ));
}

function theme_lingwo_dictionary_search_form($form) {
  //return '<div id="lingwo-dictionary-search-block">'.drupal_render($form).'</div>';
  return drupal_render($form);
}

function lingwo_dictionary_lookup_page($lang_pair, $word) {
  list($source_lang, $target_lang) = explode("-", $lang_pair);

  // bust the pos out of $word if its there (ie. /lookup/en-pl/file[verb])
  $pos = NULL;
  if (preg_match('/([^\(]+)\((\S+)\)/', $word, $matches)) {
    $word = trim($matches[1]);
    $pos  = $matches[2];
  }

  # lookup the appropriate node or nodes
  $nids = array();
  if ($source_nids = lingwo_dictionary_entry_lookup($word, $source_lang, $pos)) {
    if (!is_array($source_nids)) {
      $source_nids = array($source_nids);
    }
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

  if (empty($nids)) {
    drupal_set_title(t('Entry Not Found: @title', array('@title' => $word)));

    $type_url_str = str_replace('_', '-', lingwo_dictionary_settings('entry_content_type'));
    $url_args = array('headword' => $word);
    if ($pos) {
      $url_args['pos'] = $pos;
    }

    //$output = drupal_get_form('lingwo_dictionary_search_form', $lang_pair, $word);

    if ($target_lang && !empty($source_nids)) {
      // we are translating an existing entry
      $output .= '<p>'. t('Entry exists but there are no translations for this language.') .'</p>';
      // TODO: we really should give options for which source node we are translating!!
      $url_args['translation'] = $source_nids[0];
      $url_args['language'] = $target_lang;
    }
    else {
      // we are creating a source node
      $output .= '<p>'. t('Unabled to find entry.') .'</p>';
      $url_args['headword'] = urlencode($word);
      $url_args['language'] = $source_lang;
    }

    $link = l('Click here', "node/add/$type_url_str", array('query' => $url_args));
    $output .= '<p>'. t('!link to add the entry to dictionary.', array('!link' => $link)) .'</p>';

    return $output;
  }

  // if this is a single node
  if ($pos) {
    return lingwo_dictionary_lookup_page_node($nids[0]);
  }

  /*
  $output = drupal_get_form('lingwo_dictionary_search_form', $lang_pair, $word);
  $output .= lingwo_dictionary_lookup_page_list($nids);
  return $output;
  */
  return lingwo_dictionary_lookup_page_list($nids);
}

function lingwo_dictionary_lookup_page_node($nid) {
  // Set query path so that the tabs from the node get displayed.
  menu_set_active_item('node/'. $nid);

  // Generate the node.
  return menu_execute_active_handler($url);
}

function lingwo_dictionary_lookup_page_list($nids) {
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

  return $output;
}


