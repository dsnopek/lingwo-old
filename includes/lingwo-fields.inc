<?php

class LingwoFields implements IteratorAggregate {
  private $entry;
  private $node;

  function __construct($entry) {
    $this->entry = $entry;
    $this->node =& $entry->getNode();

    if (!isset($this->node->lingwo_fields)) {
      $this->node->lingwo_fields = array();
    }
  }

  public function getFields() {
    $this->clean();
    $items = $this->node->lingwo_fields;
    $fields = array();
    foreach (lingwo_language_fields($this->node->language, $pos) as $name => $field) {
      if (isset($items[$name])) {
        $item = $items[$name];
        unset($items[$name]);
      }
      else {
        // setup some defaults from the definition
        $item = array(
          'type'      => $field['type'],
          'name'      => $name,
          'value'     => NULL,
          'automatic' => TRUE
        );
      }

      $item['definition'] = $field;

      $fields[$name] = $item;
    }
    $fields += $items;

    return $fields;
  }

  public function clean() {
    _lingwo_fields_clean($this->node->lingwo_fields);
  }

  public function getIterator() {
    return new ArrayIterator($this->getFields());
  }

  public function getEntry() {
    return $this->entry;
  }

  public function exists($name) {
    return isset($this->node->lingwo_fields[$name]);
  }

  public function getType($name) {
    if (isset($this->node->lingwo_fields[$name])) {
      return $this->node->lingwo_fields[$name]['type'];
    }
  }

  public function getOne($name) {
    if (isset($this->node->lingwo_fields[$name])) {
      $value = $this->node->lingwo_fields[$name]['value'];
      if (is_array($value)) {
        $value = $value[0];
      }
      return $value;
    }
  }

  public function getMany($name) {
    if (isset($this->node->lingwo_fields[$name])) {
      $value = $this->node->lingwo_fields[$name]['value'];
      if (!is_array($value)) {
        $value = array($value);
      }
      return $value;
    }
  }

  public function set($name, $type, $value, $automatic=FALSE) {
    if (!isset($this->node->lingwo_fields[$name])) {
      $field = array(
        'name' => $name,
      );
      $this->node->lingwo_senses[$name] = $field;
    }

    $field =& $this->node->lingwo_fields[$name];
    $field['type']      = $type;
    $field['value']     = $value;
    $field['automatic'] = $automatic;
  }

  public function add($name, $type, $value, $automatic=FALSE) {
    if ($orig = $this->getMany($name)) {
      $orig[] = $value;
      $value = $orig;
    }
    $this->set($name, $type, $value, $automatic);
  }
}

