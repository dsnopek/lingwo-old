<?php
require_once('../includes/3rdparty/simpletest/autorun.php');
require_once('../includes/settings.inc');

// Mock the Drupal variable functions
$GLOBALS['_test_variables'] = array();
if (!function_exists('variable_get')) {
  function variable_get($name, $default) {
    return isset($GLOBALS['_test_variables'][$name]) ? $GLOBALS['_test_variables'][$name] : $default;
  }
}
if (!function_exists('variable_set')) {
  function variable_set($name, $value) {
    return $GLOBALS['_test_variables'][$name] = $value;
  }
}
if (!function_exists('variable_del')) {
  function variable_del($name) {
    unset($GLOBALS['_test_variables'][$name]);
  }
}

class BadSettings extends LingwoSettings {
}

class TestSettings extends LingwoSettings {
  protected $base_name = 'test';

  public function getDefault($name) {
    switch ($name) {
      case 'var2':
        return 'zen';
    }
  }

  public function isValid($name) {
    return preg_match('/^var\d$/', $name);
  }
}

class SanityTest extends UnitTestCase {
  function testBadSettings() {
    $this->expectException(new Exception('You must sub-class LingwoSettings and change $base_name!'));
    new BadSettings();
  }

  function testVariablesMock() {
    variable_set('blah', 'hey');
    $this->assertEqual(variable_get('blah', NULL), 'hey');
    variable_del('blah');
    $this->assertNull(variable_get('blah', NULL));
  }

  // test a variable that is allowed and has no default
  function testSettings1() {
    $settings = new TestSettings();
    
    $this->assertFalse(isset($settings->var1));
    $settings->var1 = 'blah';
    $this->assertTrue(isset($settings->var1));
    $this->assertEqual(variable_get('test_var1', NULL), 'blah');
    unset($settings->var1);
    $this->assertNull(variable_get('test_var1', NULL), NULL);
    $this->assertFalse(isset($settings->var1));
  }

  // test a variable with a default
  function testSettings2() {
    $settings = new TestSettings();

    $this->assertFalse(isset($settings->var2));
    $this->assertEqual($settings->var2, 'zen');
    $settings->var2 = 'anxious';
    $this->assertEqual(variable_get('test_var2', NULL), 'anxious');
    $this->assertEqual($settings->var2, 'anxious');
    $this->assertTrue(isset($settings->var2));
    unset($settings->var2);
    $this->assertNull(variable_get('test_var2', NULL), NULL);
    $this->assertFalse(isset($settings->var2));
    $this->assertEqual($settings->var2, 'zen');
  }

  // test an invalid variable
  function testSettingsBadVariable1() {
    $this->expectException(new Exception('Invalid setting name: invalid'));
    $settings = new TestSettings();
    $get = $settings->invalid;
  }
  function testSettingsBadVariable2() {
    $this->expectException(new Exception('Invalid setting name: invalid'));
    $settings = new TestSettings();
    $settings->invalid = 'set';
  }
  function testSettingsBadVariable3() {
    $this->expectException(new Exception('Invalid setting name: invalid'));
    $settings = new TestSettings();
    isset($settings->invalid);
  }
  function testSettingsBadVariable4() {
    $this->expectException(new Exception('Invalid setting name: invalid'));
    $settings = new TestSettings();
    unset($settings->invalid);
  }
}

