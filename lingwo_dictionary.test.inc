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
    lingwo_dictionary_settings('entry_content_type', $entry_type->type);

    # create an appropriate user
    $this->drupalLogin(
      $this->drupalCreateUser(array(
        'create '. $entry_type->type .' content',
        'edit own '. $entry_type->type .' content',
        'edit any '. $entry_type->type .' content',
        'translate content',
        'administer content types',
        'administer site configuration',
      ))
    );

    // Add POS vocabulary
    $voc = $this->createVocabulary(array(
      'name' => 'Part Of Speech',
      'nodes' => array(
        $entry_type->type => TRUE
      ),
      'terms' => array('Noun', 'Verb', 'Adjective'),
    ));
    lingwo_dictionary_settings('pos_vocabulary', $voc->vid);

    // Add some languages
    include_once './includes/locale.inc';
    locale_add_language('pl', 'Polish', 'Polski');
    locale_add_language('zzz', 'TestEmpty', 'TestEmpty');
  }

  protected function getEntryEdit($values) {
    $pos_vid = lingwo_dictionary_settings('pos_vocabulary');

    if (!isset($values['headword'])) {
      $values['headword'] = $this->randomName(8);
    }

    // make a map from pos term names to tid
    $pos_terms = array();
    foreach (taxonomy_get_tree($pos_vid) as $term) {
      $pos_terms[$term->name] = $term->tid;
    }

    $edit = array(
      'title'    => $values['headword'],
      'language' => $values['language'],
      "taxonomy[$pos_vid]" => $pos_terms[$values['pos']],
    );

	  return $edit;
  }

  protected function createVocabulary($voc = array()) {
    if (!isset($voc['name'])) {
      $voc['name'] = $this->randomName(12);
    }
    $voc += array(
      'relations' => TRUE,
      'hierarchy' => FALSE,
      'multiple' => FALSE,
      'required' => TRUE,
      'tags' => 0,
      'language' => '',
      'terms' => array(),
    );
    taxonomy_save_vocabulary($voc);

    $newTerms = array();
    foreach ($voc['terms'] as $name) {
      $term = array(
        'vid' => $voc['vid'],
        'name' => $name,
        'language' => ''
      );
      taxonomy_save_term($term);
      $newTerms[] = $term;
    }
    $voc['terms'] = $newTerms;

    return (object)$voc;
  }

  protected function createEntry($values) {
    $entry_type = lingwo_dictionary_settings('entry_content_type');
    $edit = $this->getEntryEdit($values);
    $this->drupalPost("node/add/$entry_type", $edit, 'Save');
  }
}

