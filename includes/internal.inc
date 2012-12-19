<?php

// A temporary replacement for _lingwo_project_path() which works for the code in this directory
/**
 * @todo Please document this function.
 * @see http://drupal.org/node/1354
 */
function _lingwo_old_project_path() {
  static $project_path = NULL;
  if (is_null($project_path)) {
    $project_path = dirname(drupal_get_path('module', 'lingwo_korpus'));
  }
  return $project_path;
}

// TODO: may or may not belong in a special "requirejs" module
/**
 * @todo Please document this function.
 * @see http://drupal.org/node/1354
 */
function _lingwo_old_add_require_js($plugins = array()) {
  static $added = FALSE;

  if (!$added) {
    $old_project_path = _lingwo_old_project_path();
    $project_path = _lingwo_project_path();
    // add require.js to the page
    drupal_add_js($old_project_path . '/js/require.js');
    drupal_add_js($old_project_path . '/js/require/jquery-stubs.js');
    foreach ($plugins as $plugin) {
      drupal_add_js($old_project_path . '/js/require/' . $plugin . '.js');
    }

    drupal_add_js('require({paths:{lingwo_old:"/' . $old_project_path . '/js",lingwo:"/' . $project_path . '/js"}});', array('type' => 'inline', 'scope' => JS_DEFAULT));

    $added = TRUE;
  }
}

