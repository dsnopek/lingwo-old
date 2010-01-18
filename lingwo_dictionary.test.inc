<?php

class LingwoDictionaryWebTestCase extends DrupalWebTestCase {
  private $pos_terms;

  public function setUp() {
    $modules = array(
      'lingwo_dictionary',
      'locale',
      'translation',
      'i18n',
      'i18ntaxonomy',
      'content',
    );
    $args = func_get_args();
    $modules = array_merge($modules, $args);
    call_user_func_array(array('parent', 'setUp'), $modules);

    # create an appropriate user
    $this->drupalLogin(
      $this->drupalCreateUser(array('administer content types')));

    // create the entry content type
    $entry_type = $this->drupalCreateContentType(array(
      'has_body' => FALSE,
      'body_label' => '',
    ));
    variable_set('language_content_type_'. $entry_type->type, TRANSLATION_ENABLED);
    variable_set('i18n_node_'. $entry_type->type, LANGUAGE_SUPPORT_NORMAL);
    lingwo_dictionary_entry_content_type($entry_type->type);

    # create an appropriate user
    $this->drupalLogin(
      $this->drupalCreateUser(array(
        'create '. $entry_type->type .' content',
        'edit own '. $entry_type->type .' content',
        'translate content',
        'administer content types',
      ))
    );

    // Add POS vocabulary
    $voc = array(
      'name' => 'Part Of Speech',
      'relations' => TRUE,
      'hierarchy' => FALSE,
      'multiple' => FALSE,
      'required' => TRUE,
      'tags' => 0,
      'language' => '',
      'nodes' => array(
        $entry_type->type => TRUE
      )
    );
    taxonomy_save_vocabulary($voc);
    lingwo_dictionary_pos_vocabulary($voc['vid']);

    // Add POS terms
    foreach (array('Noun','Verb','Adjective') as $name) {
      $term = array(
        'vid' => $voc['vid'],
        'name' => $name,
        'language' => ''
      );
      taxonomy_save_term($term);

      // save for later use!
      $this->pos_terms[$name] = $term['tid'];
    }

    // Add a language
    include_once './includes/locale.inc';
    locale_add_language('pl', 'Polish', 'Polski');
  }

  protected function createEntry($values) {
    $entry_type = lingwo_dictionary_entry_content_type();
    $pos_vid = lingwo_dictionary_pos_vocabulary();

    if (!isset($values['headword'])) {
      $values['headword'] = $this->randomName(8);
    }

    $edit = array(
      'title'    => $values['headword'],
      'language' => $values['language'],
      "taxonomy[$pos_vid]" => $this->pos_terms[$values['pos']],
    );

    $this->drupalPost("node/add/$entry_type", $edit, 'Save');
  }
}

