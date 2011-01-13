<?php
// $Id$

/**
 * @file
 * Pages related to search and lookup.
 */

function lingwo_dictionary_search_form(&$form_state) {
  global $language;

  if (module_exists('context')) {
    $search_word = context_get('lingwo_dictionary', 'search_word');
    $search_language = context_get('lingwo_dictionary', 'search_language');
  }

  $language_options = locale_language_list();
  unset($language_options[$language->language]);

  $form['search_word'] = array(
    '#title' => t('Find word/phrase'),
    '#type' => 'textfield',
    '#default_value' => $search_word,
    '#attributes' => array('title' => t('Enter the terms you wish to search for.')),
  );
  $form['search_language'] = array(
    '#title' => t('Language'),
    '#type' => 'select',
    '#options' => $language_options,
    '#default_value' => $search_language,
  );

  // TODO: we should write some JavaScript that will do the redirect straight
  // off to save the extra round-trip to the server.
  $form['submit'] = array('#type' => 'submit', '#value' => t('Search'));

  return $form;
}

function lingwo_dictionary_search_form_submit($form, &$form_state) {
  global $language;

  $form_state['redirect'] = implode('/', array(
    _lingwo_dictionary_settings('lookup_path'),
    $form_state['values']['search_language'] .'-'. $language->language,
    $form_state['values']['search_word']
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
  if (preg_match('/([^\(]+)\(([^\)]+)\)/', $word, $matches)) {
    $word = trim($matches[1]);
    $pos  = $matches[2];
  }

  if (module_exists('context')) {
    context_set('lingwo_dictionary', 'search_language', $source_lang);
  }

  // lookup the appropriate node or nodes
  if (!empty($pos)) {
    // ensure this is a single lookup with no magic extensions (forms, fuzzy, etc..)
    if ($nid = lingwo_dictionary_entry_lookup($source_lang, $pos, $word)) {
      $search = array((object)array('nid' => $nid));
    }
  }
  else {
    $search = lingwo_dictionary_search_entries($word, array('language' => $source_lang));
  }

  // translate if necessary
  $nids = array();
  foreach ($search as $result) {
    $nid = $result->nid;
    if ($target_lang) {
      // find translation nodes
      $trans = translation_node_get_translations($nid);
      if ($trans[$target_lang]) {
        $nid = $trans[$target_lang]->nid;
      }
    }

	// don't add duplicates
	if (!in_array($nid, $nids)) {
      $nids[] = $nid;
	}
  }

  // if this is a single node direct link, not a search
  if (!empty($nids) && !empty($pos)) {
    return lingwo_dictionary_lookup_page_node($nids[0]);
  }

  // we only set the search_word context when we didn't find an exact node.
  if (module_exists('context')) {
    context_set('lingwo_dictionary', 'search_word', $word);
  }

  if (empty($nids)) {
    drupal_set_title(t('Entry Not Found: @title', array('@title' => $word)));

    $type_url_str = str_replace('_', '-', _lingwo_dictionary_settings('entry_content_type'));
    $url_args = array('headword' => $word);
    if ($pos) {
      $url_args['pos'] = $pos;
    }

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


