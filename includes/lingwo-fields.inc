<?php

class LingwoFields {
  private $entry;
  private $map;
  private $node;

  function __construct($entry) {
    $this->entry = $entry;
    $this->node =& $entry->getNode();

    if (empty($node->lingwo_fields)) {
      $node->lingwo_fields = array();
    }
    $this->map = array();
    foreach ($node->lingwo_fields as &$field) {
      $this->map[$field['name']] =& $field;
    }
  }

  public function getEntry() {
    return $this->entry;
  }

  public function exists($name) {
    return isset($this->map[$name]);
  }

  public function getType($name) {
    if (isset($this->map[$name])) {
      return $this->map[$name]['type'];
    }
  }

  public function getOne($name) {
    if (isset($this->map[$name])) {
      $value = $this->map[$name]['value'];
      if (is_array($value)) {
        $value = $value[0];
      }
      return $value;
    }
  }

  public function getMany($name) {
    if (isset($this->map[$name])) {
      $value = $this->map[$name]['value'];
      if (!is_array($value)) {
        $value = array($value);
      }
      return $value;
    }
  }

  public function set($name, $type, $value, $automatic=FALSE) {
    if (isset($this->map[$name])) {
      $field =& $this->map[$name];
      $field['type'] = $type;
      $field['value'] = $value;
      $field['automatic'] = $automatic;
    }
    else {
      $field = array(
        'name'      => $name,
        'type'      => $type,
        'value'     => $value,
        'automatic' => $automatic,
      );

      $this->node->lingwo_senses[] =& $field;
      $this->map[$name] =& $field;
    }
  }

  public function add($name, $type, $value, $automatic=FALSE) {
    if ($orig = $this->getMany($name)) {
      $orig[] = $value;
      $value = $orig;
    }
    else {
      $value = array($value);
    }
    $this->set($name, $type, $value, $automatic);
  }
}

