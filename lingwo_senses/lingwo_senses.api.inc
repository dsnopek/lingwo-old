<?php
// $Id: $

/**
 * @file
 * API for lingwo_senses
 */

require_once(dirname(__FILE__) .'/../includes/settings.inc');

class LingwoSensesSettings extends LingwoSettings {
  protected $base_name = 'lingwo_senses'; 

  // singleton boilerplate
  private static $settings = NULL;
  public static function get() {
    if (is_null(self::$settings)) {
      self::$settings = new self();
    }
    return self::$settings;
  }
}

class LingwoSenses {
  public static $settings;
}

LingwoSenses::$settings = LingwoSensesSettings::get();

/* Takes an entry and a trans and makes a list of trans senses in the appropriate
 * order, connected to the entry senses if one exists.
 */
// TODO: move to the public API!
function lingwo_senses_get_translations(&$node) {
  $orig = LingwoEntry::fromNode($node)->getTranslationSource();
  // TODO: does this make sense?  Why support not having a translation source??
  $orig_senses = isset($orig) ? $orig->lingwo_senses : array();

  $trans_map = array();
  $trans_senses = $node->lingwo_senses;

  // build our internal map of id => sense
  if (!empty($trans_senses)) {
    foreach ($trans_senses as $trans_sense) {
      $trans_map[$trans_sense['id']] = $trans_sense;
    }
  }

  $senses = array();

  foreach ($orig_senses as $sense) {
    $trans_sense = $trans_map[$sense['id']];
    if (!isset($trans_sense)) {
      $trans_sense = array('id' => $sense['id']);
    }
    $trans_sense['orig_sense'] = $sense;
    
    $senses[] = $trans_sense;
    unset($trans_map[$sense['id']]);
  }

  // TODO: do we still need this?  Source entries without senses is no longer our thing.
  if (count($senses) == 0) {
    if ($trans_map && isset($trans_map['*'])) {
      $only_sense = $trans_map['*'];
    }
    else {
      $only_sense = array('id' => '*', 'data' => array());
    }
    $senses[] = $only_sense;
    unset($trans_map['*']);
  }

  foreach ($trans_map as $id => $trans_sense) {
    $senses[] = $trans_sense;
  }

  return $senses;
}

/*
 * 
 * Internal functions
 *
 */

// TODO: should be a hook plus some default values stored in admin
// TODO: make this code generic, I copied it from LingwoEntry::getPosOptions()
// TODO: once this is finalized, it probably belongs in the public API
function _lingwo_senses_relationship_options($translate = FALSE, $option_name = NULL) {
  $list = array(
    # imiesłów przymiotnikowy teraźniejszy czynny
    'imieslow.przy.t.c' => 'present active participle',
    # imiesłów przymiotnikowy przeszły bierny
    'imieslow.przy.p.b' => 'past passive participle',
    # imiesłów przymiotnikowy przeszły czynny
    'imieslow.przy.p.c' => 'past active participle',
  );

  // Only translate if we have i18nstrings
  $translate = $translate && module_exists('i18nstrings');

  $options = array();
  foreach ($list as $key => $value) {
    // if we are only looking for one key, skip all the rest
    if (!is_null($option_name) && $option_name != $key) {
      continue;
    }

    if ($translate) {
      // TODO: we need to integrate this for real with the i18n hooks!!
      //$value = i18nstrings('lingwo:field:sense_relationships:option_'. $key, $value);
    }

    if ($option_name == $key) {
      return $value;
    }

    $options[$key] = $value;
  }

  if (!is_null($option_name)) {
    // we requested an option but it isn't here!  Return the original.
    return $option_name;
  }

  asort($options);

  return $options;
}

