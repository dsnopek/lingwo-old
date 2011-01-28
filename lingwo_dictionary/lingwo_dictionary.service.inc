<?php
// $Id$

/**
 * @file
 * Contains all of our service callbacks
 */

function lingwo_dictionary_search_entries_service($text, $options=array()) {
  return LingwoEntry::search($text, $options);
}

