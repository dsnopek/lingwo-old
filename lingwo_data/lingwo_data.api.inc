<?php
// $Id: $

/**
 * @file
 * API for lingwo_data
 */

require_once(dirname(__FILE__) .'/../../lingwo_oss/includes/settings.inc');

// TODO: We name this LingwoImport because that is what it will eventually be named
class LingwoImportSettings extends LingwoSettings {
  protected $base_name = 'lingwo_data'; 

  private $defaults = array(
	// TODO: This should really be provided by a lingwo_pron module
    'field_pron_ipa'         => NULL,
    'field_pron_audio'       => NULL,
    'field_pron_tag'         => NULL,

    'field_source_name'      => NULL,
    'field_source_url'       => NULL,
    'field_source_copyright' => NULL,
    'field_source_license'   => NULL,
    'field_source_raw'       => NULL,
    'field_source_timestamp' => NULL,
  );

  public function getDefault($name) {
    return $this->defaults[$name];
  }

  public function isValid($name) {
    return array_key_exists($name, $this->defaults);
  }

  // singleton boilerplate
  private static $settings = NULL;
  public static function get() {
    if (is_null(self::$settings)) {
      self::$settings = new self();
    }
    return self::$settings;
  }
}

// TODO: We name this LingwoImport because that is what it will eventually be named
class LingwoImport {
  public static $settings;

}

LingwoImport::$settings = LingwoImportSettings::get();

