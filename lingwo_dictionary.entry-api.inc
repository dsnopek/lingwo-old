<?php
// $Id$

/**
 * @file
 * API functions for dealing with entries.  All of them start with "lingwo_dictionary_entry_".
 */

// TODO: it would be pretty sweet to turn this into a class, rather these functions
// with such HUGE names.  Yeah, work on that.

// Let's us know if a node is a translation
function lingwo_dictionary_entry_is_translation($node) {
  return isset($node->translation_source) ||
    ($node->nid && $node->tnid != 0 && $node->nid != $node->tnid);
}

// Loads and returns a node's translation source
function lingwo_dictionary_entry_load_translation_source(&$node) {
  if (lingwo_dictionary_entry_is_translation($node) && !isset($node->translation_source)) {
    // TODO: we shouldn't modify the node!  At least not using this name, since 'translation'
    // owns it..
    $node->translation_source = node_load($node->tnid);
  }
  
  return $node->translation_source;
}

// Returns an array of languages where the first is always the source language
function lingwo_dictionary_entry_get_languages($node, $for_humans=FALSE) {
  if ($source_node = lingwo_dictionary_entry_load_translation_source($node)) {
    $res = array($source_node->language, $node->language);
  }
  else {
    $res = array($node->language);
  }

  if ($for_humans) {
    $languages = language_list();
    for ($i = 0; $i < count($res); $i++) {
      // TODO: we need to translate the names to the current interface!
      $res[$i] = $languages[$res[$i]]->name;
    }
  }

  return $res;
}

// Gets the Part of Speech from a node
function lingwo_dictionary_entry_get_pos($node, $human_readable=FALSE) {
  if ($human_readable) {
  	return lingwo_dictionary_pos_options(TRUE, $node->pos);
  }

  return $node->pos;
}

// Makes a "Lingwo ID" for the entry
// TODO: we need a paired parse_id function!
function lingwo_dictionary_entry_get_id($node) {
  return implode('/', array(
    implode('-', lingwo_dictionary_entry_get_languages($node)),
    $node->title)) .'('. lingwo_dictionary_entry_get_pos($node) .')';
}

// Gets an nid from the "Lingwo ID"
function lingwo_dictionary_entry_from_id($id) {
  list($source_lang, $headword) = explode('/', $id);
  list($source_lang, $target_lang) = explode('-', $source_lang);
  if (preg_match('/([^\(]+)\(([^\)]+)\)/', $headword, $matches)) {
    $headword = trim($matches[1]);
    $pos  = $matches[2];
  }

  $nid = lingwo_dictionary_entry_lookup($source_lang, $pos, $headword);

  if ($target_lang) {
    $trans = translation_node_get_translations($nid);
    if ($trans[$target_lang]) {
      $nid = $trans[$target_lang]->nid;
    }
    else {
      $nid = NULL;
    }
  }

  return $nid;
}

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

function lingwo_dictionary_entry_path($node) {
  if (lingwo_dictionary_settings('lookup_path')) {
    $lang = $node->language;
    if ($source_node = lingwo_dictionary_entry_load_translation_source($node)) {
      $lang = $source_node->language .'-'. $lang;
    }
    $pos = lingwo_dictionary_entry_get_pos($node);

    return implode('/', array(
      lingwo_dictionary_settings('lookup_path'),
      $lang,
      $node->title .'('. $pos .')'
    ));
  }

  return isset($node->alias) ? $node->alias : ('node/'. $node->nid);
}

