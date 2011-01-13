<?php
// $Id$

/**
 * @file
 * For the admin pages.
 */

function lingwo_senses_admin_settings_form()
{
  $settings =& lingwo_senses::$settings;
  $form = array();

  return $settings->form($form);
}

