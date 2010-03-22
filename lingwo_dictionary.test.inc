<?php

class LingwoDictionaryWebTestCase extends DrupalWebTestCase {
  private $pos_terms;

  public function setUp() {
    $modules = array(
      'lingwo_dictionary',
      'locale',
      'translation',
      'i18n',
      'content',
      'text',
      'optionwidgets',
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

    // Add POS field
    $this->createField(array(
      'label'       => 'Part of Speech',
      'field_name'  => 'pos',
      'type'        => 'text',
      'widget_type' => 'optionwidgets_select',
      'multiple'    => 0,
      'required'    => 1,
      'allowed_values' => "noun|Noun\nverb|Verb\nadjective|Adjective",
    ));
    lingwo_dictionary_settings('field_pos', 'field_pos');

    // Add some languages
    include_once './includes/locale.inc';
    locale_add_language('pl', 'Polish', 'Polski');
    locale_add_language('zzz', 'TestEmpty', 'TestEmpty');
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

  protected function getEntryEdit($values) {
    if (!isset($values['headword'])) {
      $values['headword'] = $this->randomName(8);
    }

    $field_pos = lingwo_dictionary_settings('field_pos');
    $edit = array(
      'title'    => $values['headword'],
      'language' => $values['language'],
      $field_pos .'[value]' => $values['pos'],
    );
    
    // remove the ones we have used
    unset($values['headword']);
    unset($values['language']);
    unset($values['pos']);

    return $edit + $values;
  }

  protected function createEntry($values) {
    $entry_type = lingwo_dictionary_settings('entry_content_type');
    $edit = $this->getEntryEdit($values);
    $this->drupalPost("node/add/$entry_type", $edit, 'Save');
  }

  protected function createField($values) {
    $entry_type = lingwo_dictionary_settings('entry_content_type');

    $edit1 = array();
    $edit2 = array();

    // split up the values for the two pages of the field creation form
    // NOTE: 'parent' is the fieldgroup
    $first = array('label', 'field_name', 'type', 'widget_type', 'parent');
    foreach ($values as $name => $value) {
      if (in_array($name, $first)) {
        $edit1["_add_new_field[$name]"] = $value;
      }
      else {
        $edit2[$name] = $value;
      }
    }

    $this->drupalPost('admin/content/node-type/'. $entry_type .'/fields', $edit1, 'Save');
    $this->drupalPost(NULL, $edit2, 'Save field settings');
    
    // clear cache!!
    content_clear_type_cache(TRUE);
  }

  protected function createFieldGroup($values) {
    $entry_type = lingwo_dictionary_settings('entry_content_type');

    // TODO: we could do this via the web-browser, but since I want to learn how to do these
    // programmatically anyway (for embedding in our feature) that's how I'll do it for now.
    if (empty($values['settings'])) {
      $values['settings'] = array();
    }
    if (empty($values['type_name'])) {
      $values['type_name'] = $entry_type;
    }
    $values['settings'] += field_group_default_settings($values['group_type']);
    fieldgroup_save_group($values['type_name'], $values);

    // reset the cache
    fieldgroup_groups('', FALSE, TRUE);
  }
}

