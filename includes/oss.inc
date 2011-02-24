<?php

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

// A temporary replacement for _lingwo_project_path() which works for the code in this directory
function _ld_project_path_temp() {
  static $project_path = NULL;
  if (is_null($project_path)) {
    $project_path = dirname(drupal_get_path('module', 'lingwo_fields'));
  }
  return $project_path;
}

// TODO: may or may not belong in a special "requirejs" module
function _ld_add_require_js($plugins=array()) {
  static $added = FALSE;

  if (!$added) {
    $project_path = _ld_project_path_temp();
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

