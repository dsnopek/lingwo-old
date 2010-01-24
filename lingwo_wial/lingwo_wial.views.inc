<?php
// $Id$

/**
 * @file
 * For integrating WIAL with Views
 */

/**
 * Implementation of hook_views_data().
 */
function lingwo_wial_views_data() {
  return array(
    'lingwo_wial_node' => array(
      'table' => array(
        'group' => t('WIAL'),

        'join' => array(
          'node' => array(
            'left_field' => 'nid',
            'field'      => 'nid',
          ),
          'user' => array(
            'left_field' => 'uid',
            'field'      => 'uid',
          )
        ),
      ),

      'uid' => array(
        'title' => t('Uid'),
        'help' => t('The user who added the word to their WIAL list.'),

        'argument' => array(
          'handler' => 'views_handler_argument_numeric',
          'numeric' => TRUE,
        ),

      ),

      'nid' => array(
        'title' => t('Nid'),
      ),

      'added' => array(
        'title' => t('Date added'),
        'help' => t('The date this word was added to the WIAL list'),

        'field' => array(
          'handler' => 'views_handler_field_date',
          'click sortable' => TRUE,
        ),

        'sort' => array(
          'handler' => 'views_handler_sort_date',
        )
      )
    )
  );
}

