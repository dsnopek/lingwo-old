<?php
// $Id$

/**
 * @file
 * For lingwo_dictionary with views
 */

/**
 * Implementation of hook_views_data().
 */
function lingwo_dictionary_views_data() {
  return array(
    'lingwo_dictionary_entry' => array(
      'table' => array(
        'group' => t('Lingwo Dictionary'),

        'join' => array(
          'node' => array(
            'left_field' => 'tnid',
            'field'      => 'nid',
          ),
        ),
      ),

      'nid' => array(
        'title' => t('Node'),
        'help' => t('The actual node that this entry refers to.'),

        'relationship' => array(
          'base' => 'node',
          'base field' => 'nid',
          'handler' => 'views_handler_relationship',
          'label' => t('entry node'),
        ),
      ),

      'pos' => array(
        'title' => t('Part Of Speech'),
        'help' => t('The Part of Speech if this is a dictionary entry'),
        # TODO: we need to do something to get the values for arguments

        'field' => array(
          'handler' => 'views_handler_field',
          'click sortable' => TRUE,
        ),
      ),
    )
  );
}

