<?php
// $Id: $

/**
 * @file
 * Views handler intergration: displays the pos field in a human readable way
 */

class lingwo_dictionary_views_handler_field_pos extends views_handler_field {
  function render($values) {
    $value = $values->{$this->field_alias};
    return lingwo_dictionary_pos_options(TRUE, $value);
  }
}

