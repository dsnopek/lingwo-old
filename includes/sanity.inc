<?php

namespace Sanity;

class Settings {
  protected $base_name = '';

  function __construct() {
    if ($this->base_name == '' || is_null($this->base_name)) {
      throw new \Exception('You must sub-class LingwoSettings and change $base_name!');
    }
  }

  public function __get($name) {
    $this->checkProperty($name);
    $res = \variable_get($this->getVariableName($name), NULL);
    if (is_null($res)) {
      $res = $this->getDefault($name);
    }
    return $res;
  }

  public function __set($name, $value) {
    $this->checkProperty($name);
    \variable_set($this->getVariableName($name), $value);
  }

  public function __isset($name) {
    $this->checkProperty($name);
    return !is_null(\variable_get($this->getVariableName($name), NULL));
  }

  public function __unset($name) {
    $this->checkProperty($name);
    \variable_del($this->getVariableName($name));
  }

  protected function getDefault($name) {
    return NULL;
  }

  protected function isValid($name) {
    return TRUE;
  }

  private function checkProperty($name) {
    if (!$this->isValid($name)) {
      throw new \Exception('Invalid property name: '. $name);
    }
  }

  public function getVariableName($name) {
    return $this->base_name .'_'. $name;
  }

  // TODO: I think we need functions to help build the admin pages, since that
  // sort of breaks the abstraction.
}


