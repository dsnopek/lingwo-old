<?php

class lingwo_settings {
  protected static $base_name = NULL;

  public static function get($name) {
    static::_checkName($name);
    $res = variable_get(static::name($name), NULL);
    if (is_null($res)) {
      $res = static::getDefault($name);
    }
    return $res;
  }

  public static function set($name, $value) {
    static::_checkName($name);
    variable_set(static::name($name), $value);
  }

  public static function has($name) {
    static::_checkName($name);
    return !is_null(variable_get(static::name($name), NULL));
  }

  public static function del($name) {
    static::_checkName($name);
    variable_del(static::name($name));
  }

  public static function getDefault($name) {
    return NULL;
  }

  public static function isValid($name) {
    return TRUE;
  }

  private static function _checkName($name) {
    if (empty(static::$base_name)) {
      throw new Exception('You must sub-class lingwo_settings and change $base_name!');
    }
    if (!static::isValid($name)) {
      throw new Exception('Invalid property name: '. $name);
    }
  }

  public static function name($name) {
    static::_checkName($name);
    return static::$base_name .'_'. $name;
  }

  public static function getBaseName() {
    return static::$base_name;
  }

  /*
   * When used as an object.
   */

  public function __get($name) {
    return static::get($name);
  }

  public function __set($name, $value) {
    static::set($name, $value);
  }

  public function __isset($name) {
    return static::has($name);
  }

  public function __unset($name) {
    static::del($name);
  }
}

