<?php
// $Id$

/**
 * @file
 * All end user visible pages.
 */

function lingwo_dictionary_entry_add() {
  $entry = NULL;
  if (isset($_GET['lang']) || isset($_GET['pos']) || isset($_GET['headword'])) {
    $entry = (object)array(
      'lang' => $_GET['lang'],
      'pos' => $_GET['pos'],
      'headword' => $_GET['headword'],
    );
  }
  return drupal_get_form('lingwo_dictionary_entry_edit_form', $entry, TRUE);
}

function lingwo_dictionary_entry_view_page($lang, $pos, $headword) {
  $entry = lingwo_dictionary_entry_load($lang, $pos, $headword);
  drupal_set_title(lingwo_dictionary_entry_title($entry));

  if (!$entry) {
    drupal_set_message(t("Entry doesn't exist, use this form to create it!"), 'error');
    drupal_goto('entry/add', 'lang='. urlencode($lang) .'&pos='. $pos .'&headword='. $headword);
    return;
  }

  return theme('lingwo_dictionary_entry', $entry);
}

function theme_lingwo_dictionary_entry($entry) {
  $output = '';
  //$output .= theme('lingwo_dictionary_entry_heading', $entry);
  $output .= '<h3><strong>'. t('Senses') .':</strong></h3>';
  if ($entry->senses) {
    $output .= '<div class="lingwo-entry">';
    $output .= '<ol class="lingwo-sense-list">';
    foreach ($entry->senses as $sense) {
      $output .= '<li class="lingwo-sense">';
      if ($sense->difference) {
        $output .= '<span class="lingwo-sense-difference">'. $sense->difference .'</span>';
      }
      else {
        $output .= '<span class="lingwo-sense-nodifference">(';
        $output .= t('No difference given');
        $output .= ')</span>';
      }
      if ($sense->example) {
        $output .= ': <blockquote class="lingwo-example">"'. $sense->example .'"</blockquote>';
      }
      $output .= '</li>';
    };
    $output .= '</ol>';
    $output .= '</div>';
  }
  else {
    $output .= '<p>'. t('No sense distinctions.') .'</p>';
  }

  $header = array(
    t('Language'),
    t('Operations'),
  );

  $result = lingwo_dictionary_list('language', array(
    'active' => TRUE,
    '_preload' => TRUE,
    '_order_by' => 'ref_name',
    '_limit' => 100,
  ));

  $rows = array();
  foreach ($result->documents as $lang) {
    if (strcmp($lang->code, $entry->lang) == 0)
      continue;

    $trans_url = 'entry/'. $entry->lang .'/'. $entry->pos .'/'. $entry->headword .'/trans/'.
      $lang->code;
    $trans = lingwo_dictionary_trans_load($entry, $lang->code);

    $row = array();
    $row[] = $trans ? l($lang->ref_name, $trans_url) : $lang->ref_name;
    $row[] = l($trans ? t('edit') : t('create'), $trans_url .'/edit');

    $rows[] = $row;
  }

  $output .= '<h3><strong>'. t('Translations') .':</strong></h3>';
  $output .= theme('table', $header, $rows);

  drupal_add_css(drupal_get_path('module', 'lingwo_dictionary') .'/lingwo_dictionary.css');
  return $output;
}

function lingwo_dictionary_entry_edit_page($lang, $pos, $headword) {
  $entry = lingwo_dictionary_entry_load($lang, $pos, $headword);
  drupal_set_title(lingwo_dictionary_entry_title($entry));

  if (!$entry) {
    return drupal_not_found();
  }
  return drupal_get_form('lingwo_dictionary_entry_edit_form', $entry);
}

function lingwo_dictionary_entry_edit_form($form_state, $entry, $add = FALSE) {
  $form['#cache'] = TRUE;

  if (isset($form_state['entry'])) {
    $entry = (array)$form_state['entry'] + (array)$entry;
  }
  $entry = (object)$entry;

  if (isset($form_state['values']['add'])) {
    $add = strcmp($form_state['values']['add'], "TRUE") == 0;
  }
  $form['add'] = array(
    '#type' => 'hidden',
    '#value' => $add ? "TRUE" : "FALSE"
  );

  $languages = array();
  if ($add) {
  $lang_list = lingwo_dictionary_list('language', array(
    'active' => TRUE,
    '_preload' => TRUE,
    '_order_by' => 'ref_name',
    '_limit' => 100,
  ));

    foreach ($lang_list->documents as $lang) {
      $languages[$lang->code] = $lang->ref_name;
    }
  }
  else {
    $languages[$entry->lang] = lingwo_dictionary_language_load($entry->lang)->ref_name;
  }

  $form['instructions'] = array(
    '#value' => '<p>'. t('Everything on this page should be entered in the source language!') .'</p>',
  );

  $form['entry'] = array('#tree' => TRUE);
  if (!$add) {
    $form['entry']['_self'] = array(
      '#type' => 'hidden',
      '#value' => $entry->_self,
    );
  }
  $form['entry']['headword'] = array(
    '#title' => t('Headword'),
    '#type' => 'textfield',
    '#size' => 60,
    '#maxlength' => 128,
    '#default_value' => $entry->headword,
    '#required' => $add,
  );
  $form['entry']['lang'] = array(
    '#title' => t('Language'),
    '#type' => 'select',
    '#options' => $languages,
    '#default_value' => $entry->lang,
    '#required' => $add,
  );
  $form['entry']['pos'] = array(
    '#title' => t('Part of Speech'),
    '#type' => 'select',
    '#options' => array(
      'noun' => t('Noun'),
      'adjective' => t('Adjective'),
      'verb' => t('Verb'),
    ),
    '#default_value' => $entry->pos,
    '#required' => $add,
  );

  if (!$add) {
    // We pair the following fields with a disabled version
    // and make the real field hidden.
    foreach (array('headword', 'lang', 'pos') as $name) {
      $form[$name .'-disabled'] = $form['entry'][$name] + array(
        '#disabled' => TRUE,
      );
      $form['entry'][$name]['#type'] = 'hidden';
      $form['entry'][$name]['#value'] = $form['entry'][$name]['#default_value'];
    }
  }

  $form['sense_wrapper'] = array(
    '#prefix' => '<div id="lingwo-senses">',
    '#suffix' => '</div>',
    '#title' => 'Senses',
    '#type' => 'fieldset',
  );
  if ($entry->senses) {
    $form['sense_wrapper']['senses'] = array(
      '#tree' => TRUE,
      '#theme' => 'lingwo_dictionary_entry_edit_senses',
    );

    $index = 0;
    foreach ($entry->senses as $sense) {
      /*
      if (!isset($sense->id)) {
        uuid_make($GLOBALS['uuid'], UUID_MAKE_V4);
        uuid_export($GLOBALS['uuid'], UUID_FMT_STR, &$uuidstring);
        $sense->id = trim($uuidstring);
      }
      */
      if (isset($sense->id)) {
        $row['id'] = array(
          '#type' => 'hidden',
          '#value' => $sense->id,
        );
      }

      $row['difference'] = array(
        '#title' => 'Difference',
        '#type' => 'textfield',
        '#default_value' => $sense->difference,
      );
      $row['example'] = array(
        '#title' => 'Example',
        '#type' => 'textfield',
        '#default_value' => $sense->example,
      );
      $row['weight'] = array(
        '#type' => 'weight',
        // TODO: Delta should probably be equal to the number of definitions?
        '#delta' => 50,
        '#default_value' => $index,
      );
      if (count($entry->senses) > 2) {
        $row['remove_sense'] = array(
          '#type' => 'submit',
          '#value' => t('Remove Sense #!num', array('!num' => $index + 1)),
          '#submit' => array('lingwo_dictionary_remove_sense_submit'),
        );
      }
      $form['sense_wrapper']['senses'][$index] = $row;
      $index ++;
    }
  }
  $form['sense_wrapper']['add_sense'] = array(
    '#type' => 'submit',
    '#value' => count($entry->senses) == 0 ? t('Setup multiple senses') : t('Add Another Sense'),
    '#submit' => array('lingwo_dictionary_add_sense_submit'),
  );
  if (count($entry->senses) == 2) {
    $form['sense_wrapper']['remove_sense'] = array(
      '#type' => 'submit',
      '#value' => t('Delete Senses'),
      '#submit' => array('lingwo_dictionary_remove_sense_submit'),
    );
  }

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save'),
  );

  return $form;
}

/*
function _lingwo_dictionary_entry_from_form($form_state) {
  $entry = (object)$form_state['values']['entry'];
  $senses = $form_state['values']['senses'];
  if ($senses) {
    foreach ($senses as $sense) {
      $weight[] = $sense['weight'];
      unset($sense['weight']);
      $values[] = (object)$sense;
    }
    array_multisort($weight, SORT_ASC, $values);
    $entry->senses = $values;
  }
  else {
    $entry->senses = array();
  }
  return $entry;
}
*/

function lingwo_dictionary_entry_edit_form_submit($form, &$form_state) {
  // We don't want to save it if we're just adding or removing senses.
  if ($form_state['clicked_button']['#id'] == 'edit-submit') {
    $entry = _lingwo_dictionary_entry_from_form($form_state);

    if (isset($entry->_self)) {
      lingwo_dictionary_update('entry', $entry);
    }
    else {
      lingwo_dictionary_create('entry', $entry);
    }

    $form_state['redirect'] = 'entry/'. $entry->lang .'/'. $entry->pos .'/'. $entry->headword;
  }
}

/**
 * Submit handler to add more senses to an edit form. This handler is used when
 * javascript is not available. It makes changes to the form state and the
 * entire form is rebuilt during the page reload.
 */
function lingwo_dictionary_add_sense_submit($form, &$form_state) {
  $entry = _lingwo_dictionary_entry_from_form($form_state);
  if ($entry->senses) {
    $entry->senses[] = new stdClass();
  }
  else {
    $entry->senses = array( new stdClass(), new stdClass() );
  }

  unset($form_state['submit_handlers']);
  form_execute_handlers('submit', $form, $form_state);
  $form_state['entry'] = $entry;
  $form_state['rebuild'] = TRUE;
}

function lingwo_dictionary_remove_sense_submit($form, &$form_state) {
  // Remove the selected sense.  If we have fallen below 2 senses, then there
  // is no reason for any.. 
  // DRS: we remove before parsing the entry out of the form, because if
  // they moved a sense then removed it, the delta would no longer apply!
  if (count(element_children($form_state['values']['senses'])) == 2) {
    $form_state['values']['senses'] = array();
  }
  else {
    $delta = $form_state['clicked_button']['#parents'][1];
    unset($form_state['values']['senses'][$delta]);
  }

  $entry = _lingwo_dictionary_entry_from_form($form_state);

  unset($form_state['submit_handlers']);
  form_execute_handlers('submit', $form, $form_state);
  $form_state['entry'] = $entry;
  $form_state['rebuild'] = TRUE;
}

function theme_lingwo_dictionary_entry_edit_senses($form) {
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

/*
 * Search
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


