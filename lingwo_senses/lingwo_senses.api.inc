<?php
// $Id: $

/**
 * @file
 * API for lingwo_senses
 */

require_once(dirname(__FILE__) .'/../includes/settings.inc');

class LingwoSensesSettings extends LingwoSenses {
  protected static $base_name = 'lingwo_senses'; 
}

class LingwoSenses {
  public static $settings;
}
LingwoSenses::$settings = new LingwoSensesSettings;

