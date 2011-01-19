<?php
// $Id$

/**
 * @file
 * For the admin pages.
 */

function lingwo_senses_admin_settings_form() {
  $settings =& LingwoSensesSettings::get();
  $form = array();

  return system_settings_form($form);
}

