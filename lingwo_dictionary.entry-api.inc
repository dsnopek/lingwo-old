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

  $nid = lingwo_dictionary_entry_lookup($headword, $source_lang, $pos);

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


// Lookup an entry based on its headword, language and pos
function lingwo_dictionary_entry_lookup($headword, $language, $pos = NULL) {
  if (is_null($pos)) {
    $res = db_query("SELECT nid FROM {lingwo_dictionary_entry} WHERE title = '%s' AND language = '%s'", $headword, $language);

    $nids = NULL;
    while($obj = db_fetch_object($res)) {
      $nids[] = $obj->nid;
    }
    return $nids;
  }
  else {
    $res = db_query("SELECT nid FROM {lingwo_dictionary_entry} WHERE title = '%s' AND language = '%s' AND pos = '%s'", $headword, $language, $pos);
    $obj = db_fetch_object($res);
    if ($obj) {
      return $obj->nid;
    }
  }
  
  return NULL;
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

