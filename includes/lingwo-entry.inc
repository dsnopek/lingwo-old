<?php

class LingwoEntry {
  private $node;
  private $ifaces = array();
  
  protected function __construct(&$node) {
    $this->node =& $node;
  }

  public static function isEntryNode($node) {
    return $node->type == _lingwo_dictionary_settings('entry_content_type');
  }

  public static function fromNode(&$node) {
    if (!$node || !LingwoEntry::isEntryNode($node)) {
      return NULL;
    }
    if (is_a($node, 'LingwoEntry')) {
      return $node;
    }
    return new LingwoEntry($node);
  }

  public static function fromNid($nid) {
    if ($nid) {
      return LingwoEntry::fromNode(node_load($nid));
    }
  }

  public static function fromLingwoId($id) {
    return LingwoEntry::fromNid(LingwoEntry::lingwo2nid($id));
  }

  public static function fromKey($language, $pos, $headword) {
    return LingwoEntry::fromNid(lingwo_dictionary_entry_lookup($language, $pos, $headword));
  }

  public static function fromHash($hash, $target_lang=NULL, $fallback=FALSE) {
    return LingwoEntry::fromNid(LingwoEntry::hash2nid($hash, $target_lang, $fallback));
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
      $nid = LingwoEntry::getTranslationForNid($nid, $target_lang);
    }

    return $nid;
  }

  public static function hash2nid($hash, $target_lang=NULL, $fallback=FALSE) {
    $res = db_query("SELECT nid FROM {lingwo_dictionary_entry} WHERE entry_hash = '%s'", $hash);
    if ($obj = db_fetch_object($res)) {
      $nid = $obj->nid;
      if (!is_null($target_lang)) {
        $tnid = LingwoEntry::getTranslationForNid($nid, $target_lang);
        $nid = empty($tnid) ? ($fallback ? $nid : NULL) : $tnid;
      }
      return $nid;
    }
  }

  public function &getNode() {
    return $this->node;
  }

  public static $MAP = array(
    'headword' => 'title',
  );

  private static function getName($name) {
    if (isset(LingwoEntry::$MAP[$name])) {
      $name = LingwoEntry::$MAP[$name];
    }
    return $name;
  }

  public function __set($name, $value) {
    $name = LingwoEntry::getName($name);
    $this->node->$name = $value;
  }

  public function __isset($name) {
    $name = LingwoEntry::getName($name);
    return isset($this->node->$name);
  }

  public function __unset($name) {
    $name = LingwoEntry::getName($name);
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
    $node = $this->node;
    if (isset($node->translation_source)) {
      return $node->translation_source;
    }

    if ($this->isTranslation()) {
      return node_load($node->tnid);
    }

    return NULL;
  }

  public function getTranslation($target_lang) {
    if (!$this->isTranslation()) {
      return LingwoEntry::fromNid(LingwoEntry::getTranslationForNid($this->node->nid, $target_lang));
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

    if (_lingwo_dictionary_settings('lookup_path')) {
      return implode('/', array(
        _lingwo_dictionary_settings('lookup_path'),
        $this->getLingwoId(),
      ));
    }

    return isset($node->alias) ? $node->alias : ('node/'. $node->nid);
  }
};

