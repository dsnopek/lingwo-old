<?php
// $Id$

/**
 * @file
 * Admin pages for Anki integration.
 */

function anki_admin_settings() {
  $form['anki_server_url'] = array(
    '#type' => 'textfield',
    '#title' => t('Server url'),
    '#default_value' => anki_server_url(),
    '#field_prefix' => 'http://',
    '#description' => 'The URL (including <em>hostname</em> and <em>port</em>) that the AnkiServer is listening on.  For example: <em>localhost:5000</em>',
  );

  $form['anki_server_deck_path'] = array(
    '#type' => 'textfield',
    '#title' => t('Deck path'),
    '#default_value' => anki_server_deck_path(),
    '#description' => 'The path to where the AnkiServer keeps the decks on the filesystem.',
  );

  return system_settings_form($form);
}

