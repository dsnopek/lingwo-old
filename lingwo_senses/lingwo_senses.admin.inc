<?php
// $Id$

/**
 * @file
 * For the admin pages.
 */

function lingwo_senses_admin_settings_form() {
  $settings =& LingwoSensesSettings::get();
  $form = array();

  $form[$settings->name('difference')] = array(
    '#type' => 'radios',
    '#title' => t('Sense Differentiation'),
    '#description' => t('Controls how to tell senses apart'),
    '#options' => array(
      LINGWO_SENSES_DIFFERENCE_DEFINITION  => t('Every sense gets a definition'),
      LINGWO_SENSES_DIFFERENCE_ALWAYS      => t('Every sense gets a few words describing how it is different than the other senses'),
      LINGWO_SENSES_DIFFERENCE_MORETHANONE => t('Every sense gets a few words describing how it is different than the other senses, <strong>but only if there are two or more senses</strong>')
    ),
    '#default_value' => $settings->difference,
  );

  return system_settings_form($form);
}

