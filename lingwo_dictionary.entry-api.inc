<?php
// $Id$

/**
 * @file
 * API functions for dealing with entries.  All of them start with "lingwo_dictionary_entry_".
 */

require_once('includes/lingwo-entry.inc');

// TODO: this doesn't belong here, it isn't really an entry function
// Returns TRUE if this entry is a translation.
function lingwo_dictionary_entry_is_translation($node) {
  return _ld_is_translation($node);
}

// Loads and returns a node's translation source
// TODO: this doesn't belong here, it isn't really an entry function
function lingwo_dictionary_entry_load_translation_source(&$node) {
  if ($entry = LingwoEntry::fromNode($node)) {
    $node->translation_source = $entry->getTranslationSource();
    return $node->translation_source;
  }
}

// Returns an array of languages where the first is always the source language
function lingwo_dictionary_entry_get_languages($node, $for_humans=FALSE) {
  if ($entry = LingwoEntry::fromNode($node)) {
    return $entry->getLanguages($for_humans);
  }
}

// Gets the Part of Speech from a node
function lingwo_dictionary_entry_get_pos($node, $for_humans=FALSE) {
  if ($entry = LingwoEntry::fromNode($node)) {
    return $entry->getPos($for_humans);
  }
}

// Makes a "Lingwo ID" for the entry
// TODO: we need a paired parse_id function!
function lingwo_dictionary_entry_get_id($node) {
  if ($entry = LingwoEntry::fromNode($node)) {
    return $entry->getLingwoId();
  }
}

// Gets an nid from the "Lingwo ID"
function lingwo_dictionary_entry_from_id($id) {
  return LingwoEntry::lingwo2nid($id);
}

function lingwo_dictionary_entry_path($node) {
  if ($entry = LingwoEntry::fromNode($node)) {
    return $entry->getPath();
  }
}

// TODO: This isn't really an entry function!!  This is is the wrong 'namespace'
function lingwo_dictionary_entry_generate_hash(&$entry) {
  $entry->entry_hash =
    sha1(join(':', array($entry->language, $entry->pos, $entry->headword)));
}

// Lookup an entry based on its headword, language and pos
function lingwo_dictionary_entry_lookup($language, $pos, $headword) {
  $res = db_query("SELECT nid FROM {lingwo_dictionary_entry} ".
    "WHERE language = '%s' AND pos = '%s' AND headword = '%s'",
    $language, $pos, $headword);
  if ($obj = db_fetch_object($res)) {
    return $obj->nid;
  }
  return NULL;
}

function _lingwo_dictionary_search_entries($text, $options=array()) {
  $sql = "SELECT nid, headword, pos, language FROM {lingwo_dictionary_entry}";
  $where = " WHERE headword = '%s'";
  $args = array($text);

  if (!empty($options['language'])) {
    $where .= " AND language = '%s'";
    $args[] = $options['language'];
  }
  if (!empty($options['pos'])) {
    $where .= " AND pos = '%s'";
    $args[] = $options['pos'];
  }

  $results = array();
  $res = db_query($sql . $where, $args);
  while ($obj = db_fetch_object($res)) {
    $obj->exact = TRUE;
    $results[] = $obj;
  }

  return $results;
}

function lingwo_dictionary_search_entries($text, $options=array()) {
  // first get all the headword matches
  $results = _lingwo_dictionary_search_entries($text, $options);

  // then get all the fields matches
  if (module_exists('lingwo_fields')) {
    $ret = lingwo_fields_search_forms($text, $options);
    $results = array_merge($results, $ret);
  }

  return $results;
}

