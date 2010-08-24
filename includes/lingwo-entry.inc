<?php

class LingwoEntryException extends Exception { }

class LingwoEntry {
  private $node;
  private $ifaces = array();
  
  protected function __construct(&$node) {
    $this->node =& $node;
  }

  public static function isEntryNode($node) {
    return $node->type == lingwo_dictionary_settings('entry_content_type');
  }

  public static function fromNode(&$node) {
    if (!LingwoEntry::isEntryNode($node)) {
      throw new LingwoEntryException('node is not a dictionary entry');
    }
    if (is_a($node, 'LingwoEntry')) {
      return $node;
    }
    return new LingwoEntry($node);
  }

  public static function fromNid($nid) {
    if ($nid == 0) {
      throw new LingwoEntryException('nid invalid');
    }
    return LingwoEntry::fromNode(node_load($nid));
  }

  public static function fromLingwoId($id) {
    $nid = LingwoEntry::lingwo2nid($id);
    if (!$nid) {
      throw new LingwoEntryException("unable to find lingwo id '$id'");
    }
    return LingwoEntry::fromNid($nid);
  }

  public static function fromKey($language, $pos, $headword) {
    $nid = lingwo_dictionary_entry_lookup($language, $pos, $headword);
    if (!$nid) {
      throw new LingwoEntryException("unable to find key: $language, $pos, $headword");
    }
    return LingwoEntry::fromNid($nid);
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
      $trans = translation_node_get_translations($nid);
      if ($trans[$target_lang]) {
        $nid = $trans[$target_lang]->nid;
      }
      else {
        $nid = NULL;
      }
    }

    return $nid;
  }

  public function getNode() {
    return $node;
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

    throw LingwoEntryException("Unable to get interface for '$module'");
  }

  public function isTranslation() {
    $node = $this->node;
    return isset($node->translation_source) ||
      ($node->nid && $node->tnid != 0 && $node->nid != $node->tnid);
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

    if (lingwo_dictionary_settings('lookup_path')) {
      return implode('/', array(
        lingwo_dictionary_settings('lookup_path'),
        $this->getLingwoId(),
      ));
    }

    return isset($node->alias) ? $node->alias : ('node/'. $node->nid);
  }
};

