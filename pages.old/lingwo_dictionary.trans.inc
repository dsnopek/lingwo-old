<?php
// $Id$

/**
 * @file
 * User visible pages concerning translations
 */

/* Takes an entry and a trans and makes a list of trans senses in the appropriate
 * order, connected to the entry senses if one exists.
 */
function _lingwo_dictionary_trans_get_sense_list($entry, $trans) {
  $senses = array();
  $id_list = array();

  if (isset($entry->senses) && count($entry->senses) > 0) {
    foreach ($entry->senses as $sense) {
      $trans_sense = $trans->senses[$sense->id];
      $trans_sense->entry_sense = $sense;
      $trans_sense->id = $sense->id;
      
      $senses[] = $trans_sense;
      $id_list[$sense->id] = 1;
    }
  }

  if (count($senses) == 0) {
    if ($trans->senses && isset($trans->senses['*'])) {
      $only_sense = $trans->senses['*'];
    }
    else {
      $only_sense = (object)array('id' => '*');
    }
    $senses[] = $only_sense;
    $id_list['*'] = 1;
  }

  if ($trans->senses) {
    foreach ($trans->senses as $id => $trans_sense) {
      $trans_sense->id = $id;
      if (!array_key_exists($id, $id_list)) {
        $senses[] = $trans_sense;
      }
    }
  }

  return $senses;
}

function lingwo_dictionary_trans_view_page($entry, $target_lang) {
  if (!$entry) {
    return drupal_not_found();
  }

  $trans = lingwo_dictionary_trans_load($entry, $target_lang);
  if (!$trans) {
    return drupal_not_found();
  }

  return theme('lingwo_dictionary_translation', $entry, $trans);
}

function theme_lingwo_dictionary_entry_heading($entry) {
  $output = '';
  $output .= '<div class="lingwo-entry-heading">';
  $output .= '<span class="lingwo-headword">'. $entry->headword .'</span> ';
  // TODO: POS should be translated!
  $output .= '<span class="lingwo-pos">('. $entry->pos .')</span>';
  $output .= '</div>';

  return $output;
};

function theme_lingwo_dictionary_translation($entry, $trans) {
  $output = '';
  $output .= '<div class="lingwo-entry">';
  $output .= theme('lingwo_dictionary_entry_heading', $entry);
  $output .= '<ol class="lingwo-sense-list">';

  $senses = _lingwo_dictionary_trans_get_sense_list($entry, $trans);
  foreach ($senses as $sense) {
    if ($sense->values) {
      $entry_sense = $sense->entry_sense;
      
      $output .= '<li class="lingwo-sense">';
      if ($sense->clue) {
        $output .= '<span class="lingwo-sense-clue">('. $sense->clue .')</span> ';
      }

      $values = array();
      foreach ($sense->values as $value) {
        $values[] = l($value, 'entry/'. $trans->target_lang .'/'. $entry->pos .'/'. $value);
      };
      $output .= join(', ', $values);

      if ($entry_sense->example) {
        $output .= ': <blockquote class="lingwo-example">"'. $entry_sense->example .'"</blockquote>';
      }
      $output .= '</li>';
    }
  };
  $output .= '</ol>';
  $output .= '</div>';

  drupal_add_css(drupal_get_path('module', 'lingwo_dictionary') .'/lingwo_dictionary.css');
  return $output;
}

function lingwo_dictionary_trans_edit_page($entry, $target_lang) {
  if (!$entry) {
    return drupal_not_found();
  }

  $trans = lingwo_dictionary_trans_load($entry, $target_lang);
  if (!$trans) {
    $trans->target_lang = $target_lang;
    $trans->entry->_href = $entry->_self;
  }

  return drupal_get_form('lingwo_dictionary_trans_edit_form', $entry, $trans);
}

function lingwo_dictionary_trans_edit_form($form_state, $entry, $trans) {
  $target_lang = lingwo_dictionary_language_load($trans->target_lang);

  $form['heading'] = array(
    '#value' => theme('lingwo_dictionary_entry_heading', $entry),
  );
  $form['instructions'] = array(
    '#value' => '<p>'. t('Everything on this page should be entered in the target language!  In this case, that is %language.', array('%language' => $target_lang->ref_name)) .'</p>',
  );

  $form['trans'] = array(
    '#tree' => TRUE
  );
  if (isset($trans->_self)) {
    $form['trans']['_self'] = array(
      '#type' => 'hidden',
      '#value' => $trans->_self
    );
  }
  $form['trans']['entry']['_href'] = array(
    '#type' => 'hidden',
    '#value' => $entry->_self,
  );
  $form['trans']['target_lang'] = array(
    '#type' => 'hidden',
    '#value' => $trans->target_lang,
  );

  $form['senses'] = array(
    '#tree' => TRUE,
    '#theme' => 'lingwo_dictionary_trans_edit_senses',
  );
  $senses = _lingwo_dictionary_trans_get_sense_list($entry, $trans);
  $index = 0;
  foreach ($senses as $sense) {
    $entry_sense = $sense->entry_sense;
    
    $sense_form = array();
    $sense_form['id'] = array(
      '#type' => 'hidden',
      '#value' => $sense->id,
    );
    if ($entry_sense) {
      if ($entry_sense->difference) {
        $sense_form['difference'] = array(
          '#type' => 'item',
          '#title' => t('Difference'),
          '#value' => $entry_sense->difference,
        );
      }
      if ($entry_sense->example) {
        $sense_form['example'] = array(
          '#type' => 'item',
          '#title' => t('Example'),
          '#value' => $entry_sense->example,
        );
      }
    }
    if (count($senses) > 1) {
      $sense_form['clue'] = array(
        '#type' => 'textfield',
        '#title' => t('Clue'),
        '#description' => t('A couple words that will clue the reader to how this sense is different.'),
        '#default_value' => $sense->clue,
      );
    }
    if (!$entry_sense && !($sense->id == '*' && count($entry->senses) == 0)) {
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
    $sense_form['trans'] = array();
    for ($t = 0; $t < max(3, count($sense->values)); $t++) {
      $sense_form['trans'][$t] = array(
        '#type' => 'textfield',
        '#default_value' => $sense->values[$t]
      );
    }
    $sense_form['trans']['0']['#title'] = t('Translation');

    $form['senses'][$index++] = $sense_form;
  }

  $form['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Save'),
  );

  drupal_add_css(drupal_get_path('module', 'lingwo_dictionary') .'/lingwo_dictionary.css');
  return $form;
}

function lingwo_dictionary_trans_edit_form_submit($form, &$form_state) {
  $trans = (object)$form_state['values']['trans'];
  $trans->senses = array();
  foreach (array_values($form_state['values']['senses']) as $sense) {
    if (!$sense['retire_sense']) {
      $trans->senses[$sense['id']] = array(
        'values' => array(),
      );
      if ($sense['clue']) {
        $trans->sense[$sense['id']]['clue'] = $sense['clue'];
      }
      foreach (array_values($sense['trans']) as $trans_value) {
        if (trim($trans_value)) {
          $trans->senses[$sense['id']]['values'][] = $trans_value;
        }
      }
    }
  }

  if ($trans->_self) {
    lingwo_dictionary_update('translation', $trans);
  }
  else {
    lingwo_dictionary_create('translation', $trans);
  }

  $trans_url = $_GET['q'];
  $trans_url = preg_replace('/\/edit$/', '', $trans_url);
  $form_state['redirect'] = $trans_url;

  drupal_set_message(t('Translation saved'));
}

function theme_lingwo_dictionary_trans_edit_senses($form) {
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

