<?php

require_once('../includes/3rdparty/simpletest/autorun.php');

class AllTests extends TestSuite {
  function AllTests() {
    $this->TestSuite('All tests');
    $this->addFile('sanity.test.php');
  }
}

