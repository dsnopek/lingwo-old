<?php
// $Id$

/**
 * @file
 * API functions for dealing with entries
 */

require_once(dirname(__FILE__) .'/../includes/settings.inc');

// NOTE: we name everything LingwoEntry* because this will eventually be called SomethingEntry

class LingwoEntrySettings extends LingwoSettings {
  protected $base_name = 'lingwo_dictionary';

  private $defaults = array(
    'lookup_path' => 'lookup',
    'redirect_node' => FALSE,
    'entry_content_type' => NULL,
    'pos_allowed_values' => "noun|Noun\nadjective|Adjective\nverb|Verb",
  );

  public function getDefault($name) {
    return $this->defaults[$name];
  }

  public function isValid($name) {
    return array_key_exists($name, $this->defaults);
  }

  public function getDefaults() {
    return $this->defaults;
  }

  public function check($message=TRUE) {
    foreach ($this->defaults as $name => $default) {
      if (is_null($default) && is_null(variable_get('lingwo_dictionary_'. $name, NULL))) {
        if ($message) {
          drupal_set_message(t('Functionality provided by Lingwo Dictionary will not work correctly until it is configured'));
        }

        return FALSE;
      }
    }
    return TRUE;
  }

  // singleton boilerplate
  private static $settings = NULL;
  public static function get() {
    if (is_null(self::$settings)) {
      self::$settings = new self();
    }
    return self::$settings;
  }
}

class LingwoEntry {
  /*
   * 
   * Static properties/methods
   * =========================
   *
   */

  public static $settings;
  public static $MAP = array(
    'headword' => 'title',
  );

  private static function getName($name) {
    if (isset(self::$MAP[$name])) {
      $name = self::$MAP[$name];
    }
    return $name;
  }
 
  public static function isEntryNode($node) {
    return $node->type == self::$settings->entry_content_type;
  }

  private static function getTranslationForNid($nid, $target_lang) {
    $trans = translation_node_get_translations($nid);
    if ($trans[$target_lang]) {
      return $trans[$target_lang]->nid;
    }
  }

  public static function lingwo2nid($id) {
    list($source_lang, $headword) = explode('/', $id);
    list($source_lang, $target_lang) = explode('-', $source_lang);
    if (preg_match('/([^\(]+)\(([^\)]+)\)/', $headword, $matches)) {
      $headword = trim($matches[1]);
      $pos  = $matches[2];
    }

    $nid = lingwo_dictionary_entry_lookup($source_lang, $pos, $headword);

    if ($target_lang) {
      $nid = self::getTranslationForNid($nid, $target_lang);
    }

    return $nid;
  }

  public static function hash2nid($hash, $target_lang=NULL, $fallback=FALSE) {
    $res = db_query("SELECT nid FROM {lingwo_dictionary_entry} WHERE entry_hash = '%s'", $hash);
    if ($obj = db_fetch_object($res)) {
      $nid = $obj->nid;
      if (!is_null($target_lang)) {
        $tnid = self::getTranslationForNid($nid, $target_lang);
        $nid = empty($tnid) ? ($fallback ? $nid : NULL) : $tnid;
      }
      return $nid;
    }
  }

  public static function key2nid($language, $pos, $headword) {
    $res = db_query("SELECT nid FROM {lingwo_dictionary_entry} ".
      "WHERE language = '%s' AND pos = '%s' AND headword = '%s'",
      $language, $pos, $headword);
    if ($obj = db_fetch_object($res)) {
      return $obj->nid;
    }
    return NULL;
  }

  public static function searchHeadword($text, $options=array()) {
    $sql = "SELECT nid, headword, pos, language FROM {lingwo_dictionary_entry}";
    $where = " WHERE headword = '%s'";
    $args = array($text);

    if (!empty($options['language'])) {
      $where .= " AND language = '%s'";
      $args[] = $options['language'];
    }
    if (!empty($options['pos'])) {
      $where .= " AND pos = '%s'";
      $args[] = $options['pos'];
    }

    $results = array();
    $res = db_query($sql . $where, $args);
    while ($obj = db_fetch_object($res)) {
      $obj->exact = TRUE;
      $results[] = $obj;
    }

    return $results;
  }

  public static function search($text, $options=array()) {
    // first get all the headword matches
    $results = self::searchHeadword($text, $options);

    // then get all the fields matches
    if (module_exists('lingwo_fields')) {
      // TODO: this should be renamed to LingwoFields::searchForms(...)
      $ret = lingwo_fields_search_forms($text, $options);
      $results = array_merge($results, $ret);
    }

    return $results;
  }

  /*
   * 
   * Constructors
   * ============
   *
   */

  protected function __construct(&$node) {
    $this->node =& $node;
  }

  public static function fromNode(&$node) {
    if (!$node || !self::isEntryNode($node)) {
      return NULL;
    }
    if (is_a($node, 'LingwoEntry')) {
      return $node;
    }
    return new LingwoEntry($node);
  }

  public static function fromNid($nid) {
    if ($nid) {
      return self::fromNode(node_load($nid));
    }
  }

  public static function fromLingwoId($id) {
    return self::fromNid(self::lingwo2nid($id));
  }

  public static function fromKey($language, $pos, $headword) {
    return self::fromNid(self::key2nid($language, $pos, $headword));
  }

  public static function fromHash($hash, $target_lang=NULL, $fallback=FALSE) {
    return self::fromNid(self::hash2nid($hash, $target_lang, $fallback));
  }

  /*
   *
   * Instance properties/methods.
   * ===========================
   *
   */

  private $node;
  private $sourceNode;
  private $ifaces = array();
 
  public function &getNode() {
    return $this->node;
  }

  public function __set($name, $value) {
    $name = self::getName($name);
    $this->node->$name = $value;
  }

  public function __isset($name) {
    $name = self::getName($name);
    return isset($this->node->$name);
  }

  public function __unset($name) {
    $name = self::getName($name);
    unset($this->node->$name);
  }

  public function getInterface($module) {
    $args = func_get_args();
    $key = implode(':', $args);
    if (isset($this->ifaces[$key])) {
      return $this->ifaces[$key];
    }

    #$module = array_shift($args);
    #array_unshift($args, $this);
    #$module = $args[0];
    $args[0] = $this;

    $func = $module . "_lingwo_entry_interface";
    if (module_exists($module) && function_exists($func)) {
      $iface = call_user_func_array($func, $args);
      $this->ifaces[$key] = $iface;
      return $iface;
    }

    return NULL;
  }

  public function isTranslation() {
    return _ld_is_translation($this->node);
  }

  public function getTranslationSource() {
    if (isset($this->sourceNode)) {
      return $this->sourceNode;
    }

    $node = $this->node;
    if (isset($node->translation_source)) {
      return $node->translation_source;
    }

    if ($this->isTranslation()) {
      $this->sourceNode = node_load($node->tnid);
      return $this->sourceNode;
    }

    return NULL;
  }

  public function getTranslation($target_lang) {
    if (!$this->isTranslation()) {
      return self::fromNid(self::getTranslationForNid($this->node->nid, $target_lang));
    }
  }

  public function getLanguages($for_humans=FALSE) {
    $node = $this->node;
    if ($source_node = $this->getTranslationSource()) {
      $res = array($source_node->language, $node->language);
    }
    else {
      $res = array($node->language);
    }

    if ($for_humans) {
      $languages = language_list();
      for ($i = 0; $i < count($res); $i++) {
        // TODO: we need to translate the names to the current interface!
        $res[$i] = $languages[$res[$i]]->name;
      }
    }

    return $res;
  }

  public function getSourceLanguage($for_humans=FALSE) {
    $languages = $this->getLanguages($for_humans);
    return $languages[0];
  }

  public function getPos($for_humans=FALSE) {
    $node = $this->node;
    if ($for_humans) {
      return lingwo_dictionary_pos_options(TRUE, $node->pos);
    }

    return $node->pos;
  }

  public function getLingwoId() {
    return implode('/', array(
      implode('-', $this->getLanguages()),
      $this->node->title)) .'('. $this->getPos() .')';
  }

  public function getPath() {
    $node = $this->node;

    $lookup_path = self::$settings->lookup_path;
    if (!empty($lookup_path)) {
      return implode('/', array(
        $lookup_path,
        $this->getLingwoId(),
      ));
    }

    return isset($node->alias) ? $node->alias : ('node/'. $node->nid);
  }
};

LingwoEntry::$settings = LingwoEntrySettings::get();

/*
 *
 * Internal functions.
 *
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

// TODO: may or may not belong in a special "requirejs" module
function _ld_add_require_js($plugins=array()) {
  static $added = FALSE;

  if (!$added) {
    // add require.js to the page
    drupal_add_js('require({paths:{lingwo_dictionary:"/'. drupal_get_path('module', 'lingwo_dictionary') .'/js"}});', 'inline');
    drupal_add_js(drupal_get_path('module', 'lingwo_dictionary') .'/js/require.js');
    drupal_add_js(drupal_get_path('module', 'lingwo_dictionary') .'/js/require/jquery-stubs.js');
    foreach ($plugins as $plugin) {
      drupal_add_js(drupal_get_path('module', 'lingwo_dictionary') .'/js/require/'. $plugin .'.js');
    }
    $added = TRUE;
  }
}

// TODO: Deprecated!  Remove eventually.
function _lingwo_dictionary_settings($name, $value = NULL) {
  if (is_null($name)) {
    return LingwoEntry::$settings->getDefaults();
  }
  if (is_null($value)) {
    return LingwoEntry::$settings->__get($name);
  }
  LingwoEntry::$settings->__set($name, $value);
}

