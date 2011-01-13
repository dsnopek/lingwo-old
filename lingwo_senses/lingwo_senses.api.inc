<?php

require_once(dirname(__FILE__) .'/../includes/settings.inc');

class lingwo_senses_settings extends lingwo_settings {
  protected static $base_name = 'lingwo_senses'; 
}

class lingwo_senses {
  public static $settings;
}
lingwo_senses::$settings = new lingwo_senses_settings;

