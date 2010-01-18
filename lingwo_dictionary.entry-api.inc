<?php
// $Id$

/**
 * @file
 * API functions for dealing with entries.  All of them start with "lingwo_dictionary_entry_".
 */

// Let's us know if a node is a translation
function lingwo_dictionary_entry_is_translation($node) {
  return isset($node->translation_source) ||
    ($node->nid && $node->tnid != 0 && $node->nid != $node->tnid);
}

// Loads and returns a node's translation source
function lingwo_dictionary_entry_load_translation_source(&$node) {
  if (lingwo_dictionary_entry_is_translation($node) && !isset($node->translation_source)) {
    $node->translation_source = node_load($node->tnid);
  }
  
  return $node->translation_source;
}

// Gets the Part of Speech from a node
function lingwo_dictionary_entry_get_pos($node, $is_new = FALSE) {
  $pos_vid = lingwo_dictionary_settings('pos_vocabulary');

  if (isset($node->taxonomy)) {
    //if (is_int($node->taxonomy[$pos_vid])) {
    //if (!$node->nid || $is_new) {
    /*
    $a = array_values($node->taxonomy);
    if (0+$a[0] != 0) {
    */
    if (is_numeric($node->taxonomy[$pos_vid])) {
      // This means the term object's haven't been loaded yet because we are
      // coming directly off the node form.  So load 'em!
      $taxonomy = taxonomy_preview_terms($node);
    }
    else {
      $taxonomy = $node->taxonomy;
    }

    foreach ($taxonomy as $term) {
      if ($term->vid == $pos_vid) {
        $pos = $term;
        break;
      }
    }
  }

  if (isset($pos)) {
    return drupal_strtolower($pos->name);
  }

  return NULL;
}

// Lookup an entry based on its headword, language and pos
function lingwo_dictionary_entry_find($headword, $language, $pos) {
  $res = db_query("SELECT nid FROM {lingwo_dictionary_entry} WHERE title = '%s' AND language = '%s' AND pos = '%s'", $headword, $language, $pos);

  $obj = db_fetch_object($res);
  if ($obj) {
    return $obj->nid;
  }
  
  return NULL;
}

