<?php
// $Id$

/**
 * @file
 * Admin pages.
 */


/**
 * Per-Language fields
 */

function _ld_language_fields_form($type, $label, $labels, $settings) {
    $form = array(
      '#type' => 'fieldset',
      '#title' => $labels,
      '#theme' => 'lingwo_language_fields_subform'
    );
    $index = 0;
    if (!empty($settings[$type])) {
      foreach ($settings[$type] as $value) {
        $row = array();
        $row['value'] = array(
          '#type' => 'item',
          '#title' => 'Name',
          '#value' => $value['name']
        );
        $row['remove'] = array(
          '#type' => 'submit',
          '#value' => t('Remove !label #!num', array('!num' => $index + 1, '!label' => $label)),
          '#submit' => array('lingwo_language_fields_remove_submit'),
        );

        $form[$index++] = $row;
      }
    }

    $form['add']['value'] = array(
      '#type' => 'textfield',
      '#title' => 'Name',
    );
    $form['add']['add_'. $type] = array(
      '#type' => 'submit',
      '#value' => 'Add '. $label,
      '#submit' => array('lingwo_language_fields_add_submit'),
    );

    return $form;
}

function lingwo_language_fields_form($form, $lang) {
  $form = array(
    '#cache' => FALSE,
    '#tree' => TRUE,
  );
  $form['lang'] = array(
    '#type' => 'hidden',
    '#value' => $lang
  );
  $form['msg'] = array(
    '#type' => 'markup',
    '#value' => '<p>'. t('About the worst possible form ever!!  But its here, this can be done.  Please replace with something decent.') .'</p>',
  );

  $settings = lingwo_language_settings($lang);
  $settings = $settings['fields'];
  $form['settings'] = array(
    '#theme' => 'lingwo_language_tabs',
  );

  $pos_terms = taxonomy_get_tree(lingwo_dictionary_pos_vocabulary());
  foreach ($pos_terms as $term) {
    $pos_form = array(
      // TODO: Should be the translated name!
      '#title' => $term->name,
      '#type' => 'fieldset',
      '#collapsible' => TRUE,
      //'#collapsed' => TRUE
    );

    $pos_settings = $settings[drupal_strtolower($term->name)];
    $pos_form['options'] = _ld_language_fields_form('options', t('Option'), t('Options'), $pos_settings);
    $pos_form['classes'] = _ld_language_fields_form('classes', t('Class'), t('Classes'), $pos_settings);
    $pos_form['forms'] = _ld_language_fields_form('forms', t('Form'), t('Forms'), $pos_settings);

    $form['settings']['pos-'. $term->tid] = $pos_form;
  }

  return $form;
}

function lingwo_language_fields_add_submit($form, &$form_state) {
  $lang = $form_state['values']['lang'];
  $settings = lingwo_language_settings($lang);

  $pos_terms = taxonomy_get_tree(lingwo_dictionary_pos_vocabulary());

  if ($form_state['values']['op'] == 'Add Option') {
    foreach ($pos_terms as $term) {
      $value = $form_state['values']['settings']['pos-'. $term->tid]['options']['add']['value'];
      if (!empty($value)) {
        $settings[$term->tid]['options'][] = array('name' => $value);
      }
    }
  }

  if ($form_state['values']['op'] == 'Add Class') {
    foreach ($pos_terms as $term) {
      $value = $form_state['values']['settings']['pos-'. $term->tid]['classes']['add']['value'];
      if (!empty($value)) {
        $settings[$term->tid]['classes'][] = array('name' => $value);
      }
    }
  }

  if ($form_state['values']['op'] == 'Add Form') {
    foreach ($pos_terms as $term) {
      $value = $form_state['values']['settings']['pos-'. $term->tid]['forms']['add']['value'];
      if (!empty($value)) {
        $settings[$term->tid]['forms'][] = array('name' => $value);
      }
    }
  }

  lingwo_language_settings($lang, $settings);
}

function theme_lingwo_language_tabs($form) {
  $elements = element_children($form);

  $output .= '<div id="lingwo-dictionary-tabs">';

  // produce the links
  $output .= '<ul>';
  foreach ($elements as $key) {
    $el = $form[$key];
    if (drupal_substr($key, 0, 4) == 'pos-') {
      $output .= '<li><a href="#lingwo-dictionary-tabs-'. $key .'">'. $el['#title'] .'</li>';
    }
  }
  $output .= '</ul>';

  // produce the tabs
  foreach ($elements as $key) {
    $el = $form[$key];
    if (drupal_substr($key, 0, 4) == 'pos-') {
      $output .= '<div id="lingwo-dictionary-tabs-'. $key .'">';
      $output .= drupal_render($el);
      $output .= '</div>';
    }
    else {
      $output .= drupal_render($el);
    }
  }

  $output .= '</div>';

  jquery_ui_add(array('ui.tabs'));
  drupal_add_js("$(document).ready(function() { $('#lingwo-dictionary-tabs > ul').tabs() });", "inline");
  // TODO: we probably should incorporate this into our theme, rather than use the default one
  drupal_add_css(drupal_get_path('module', 'jquery_ui') .'/jquery.ui/themes/default/ui.all.css');

  return $output;
}

function theme_lingwo_language_fields_subform($form) {
  $rows = array();
  $elements = element_children($form);
  foreach ($elements as $key) {
    $row = array();

    unset($form[$key]['value']['#title']);
    $row[] = drupal_render($form[$key]['value']);
    $row[] = drupal_render($form[$key]);
    $rows[] = $row;
  }

  $header = array(
    t('Name'),
    t('Action')
  );

  return theme('table', $header, $rows);
}


