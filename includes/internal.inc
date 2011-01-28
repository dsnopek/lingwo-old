<?php
// $Id$

/**
 * @file
 * Global internal functions (ie. for all the modules in this project)
 */

// TODO: when get our final name, changed from _ld to _project
// (ie. We could be "dictionary" so it would be "_dictionary"

// Helper for generating UUIDs
// TODO: we need fallbacks for when this add on module isn't present
function _ld_make_uuid() {
  // TODO: do this with a static variable instead of a global variable
  if (!isset($GLOBALS['uuid'])) {
    uuid_create(&$GLOBALS['uuid']);
  }

  uuid_make($GLOBALS['uuid'], UUID_MAKE_V4);
  uuid_export($GLOBALS['uuid'], UUID_FMT_STR, &$uuidstring);

  return trim($uuidstring);
}

// Helper for implementing AHAH
// TODO: now that we are using ahah_helper, this should be removed
// TODO: actually, AHAH helper appears to not be doing this for us atleast on lingwo_fields
// when trying to "Add More Forms" and there is no headword
function _ld_disable_validation(&$form) {
  foreach (element_children($form) as $child) {
    $form[$child]['#validated'] = TRUE;
    _ld_disable_validation(&$form[$child]);
  }
}

function _ld_element_process(&$element, $process_func) {
  $element += _element_info($element['#type']);
  $element['#process'][] = $process_func;
}

// Helper for implementing AHAH
// TODO: now that we are using ahah_helper, this should be removed
function &_ld_form_to_node(&$form, &$form_state) {
  $form['#submit'] = array('');
  $node = node_form_submit_build_node($form, $form_state);

  // hack to stop taxonomy from resetting when the form is rebuilt
  //$form_state['node']['taxonomy'] = taxonomy_preview_terms($node);

  return $form_state['node'];
}

// Helper: returns TRUE if the given node is a translation
function _ld_is_translation($node) {
  return isset($node->translation_source) ||
    ($node->nid && $node->tnid != 0 && $node->nid != $node->tnid);
}

function _ld_project_path() {
  static $project_path = NULL;
  if (is_null($project_path)) {
    $project_path = dirname(drupal_get_path('module', 'lingwo_dictionary'));
  }
  return $project_path;
}

// TODO: may or may not belong in a special "requirejs" module
function _ld_add_require_js($plugins=array()) {
  static $added = FALSE;

  if (!$added) {
    $project_path = _ld_project_path();
    // add require.js to the page
    drupal_add_js('require({paths:{lingwo_dictionary:"/'. $project_path .'/js"}});', 'inline');
    drupal_add_js($project_path .'/js/require.js');
    drupal_add_js($project_path .'/js/require/jquery-stubs.js');
    foreach ($plugins as $plugin) {
      drupal_add_js($project_path .'/js/require/'. $plugin .'.js');
    }
    $added = TRUE;
  }
}


