<?php
// $Id$

/**
 * @file
 * For lingwo_dictionary with views
 */

/**
 * Implementation of hook_views_data().
 */
function lingwo_korpus_views_data() {
  return array(
    'lingwo_korpus_entry' => array(
      'table' => array(
        'group' => t('Lingwo Korpus'),
        'base' => array(
          'field' => 'row_hash',
          'title' => t('Korpus Entry'),
          'help' => t('An entry on a Lingwo Korpus text'),
        ),
      ),

      'nid' => array(
        'title' => t('Korpus Text Nid'),
        'help' => t('The Nid of the korpus text that this entry is on'),
        'field' => array(
          'handler' => 'views_handler_field',
        ),
        'argument' => array(
          'handler' => 'views_handler_argument_numeric',
          'numeric' => TRUE,
        ),
        'relationship' => array(
          'title' => t('Korpus Text Node'),
          'help' => t('The Korpus Text Node that the entry is on'),
          'base' => 'node',
          'base field' => 'nid',
          'relationship base' => 'lingwo_korpus_entry',
          'relationship field' => 'nid',
          'handler' => 'views_handler_relationship',
          'label' => t('korpus node'),
        ),
      ),

      'headword' => array(
        'title' => t('Headword'),
        'help' => t('The headword of this entry'),
        'field' => array(
          'handler' => 'views_handler_field',
        ),
        'sort' => array(
          'handler' => 'views_handler_sort',
        ),
      ),

      'language' => array(
        'title' => t('Language'),
        'help' => t('The language of this entry'),
        'field' => array(
          # TODO: we might want to make a custom one of these
          'handler' => 'views_handler_field_locale_language',
        ),
      ),

      'pos' => array(
        'title' => t('Part Of Speech'),
        'help' => t('The part of speech of this entry'),
        'field' => array(
          # TODO: we should show in the human readable form
          'handler' => 'views_handler_field',
        )
      ),

      'sense' => array(
        'title' => t('Sense ID'),
        'help' => t('The sense ID of this entry'),
        'field' => array(
          'handler' => 'views_handler_field',
        )
      ),

      'entry_hash' => array(
        'title' => t('Dictionary Entry'),
        'help' => t('The Dictionary Entry for the entry'),
        'relationship' => array(
          'base' => 'lingwo_dictionary_entry',
          'base field' => 'entry_hash',
          'label' => t('dictionary entry'),
        ),
      ),
    ),
  );
}

