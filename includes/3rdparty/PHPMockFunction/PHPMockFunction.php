<?php
    require_once("Expectation.php");
    require_once("WillAction.php");
    require_once("Matcher.php");
    
    class PHPMockFunction {
        private $functionName;
        private $backupFunc;
        private $active = FALSE;
        private $expectations = array();
        private $current_expectation;

        private static $mocks = array();
        private static $pivotFunc = '__phpmockfunction_pivot__';
        
        public static function mock($functionName) {
            $mocker = self::$mocks[$functionName];
            if (!$mocker) {
                $mocker = new self($functionName);
                self::$mocks[$functionName] = $mocker;
            }
            $mocker->activate();
            return $mocker;
        }

        // TODO: maybe in the future we should keep a list of active mock objects so that we don't
        // have to go through them all in order to deactivate only the active ones.
        public static function deactivateAll() {
            foreach(self::$mocks as $functionName => $mocker) {
                $mocker->deactivate();
            }
        }

        public function __construct($functionName) {
            if (!function_exists('rename_function')) {
                throw new Exception("PECL apd extension is required to mock functions. see http://www.php.net/manual/en/apd.installation.php for more info.");
            }

            $this->functionName = $functionName;
            if (!isset(self::$mocks[$functionName])) {
                $this->backupFunc = create_function('',
                    "return PHPMockFunction::getMock('$functionName')->invoke(func_get_args());");

                $this->swapFunctions();
            }
        }

        public function activate() {
            if (!$this->active) {
                $this->swapFunctions();
            }
        }

        public function deactivate() {
            if ($this->active) {
                $this->swapFunctions();
                $this->clear();
            }
        }

        public function clear() {
            $this->expectations = array();
            $this->current_expectation = NULL;
        }
        
        private function swapFunctions() {
            $this->active = !$this->active;
            rename_function($this->functionName, self::$pivotFunc);
            rename_function($this->backupFunc, $this->functionName);
            rename_function(self::$pivotFunc, $this->backupFunc);
        }

        public static function getMock($functionName) {
            return self::$mocks[$functionName];
        }

        public function invoke($arguments) {
            $matchedExpectation = null;
            foreach ($this->expectations as $expectation) {
                if ($expectation->match($arguments)) {
                    $matchedExpectation = $expectation;
                    break;
                }
            }
            if ($matchedExpectation != null) {
                $willAction = $matchedExpectation->getWillAction();
                if ($willAction != null) {
                    $willAction->setActualArguments($arguments);
                    switch($willAction->getType()) {
                        case PHPMOCKFUNCTION_WILL_ACTION_RETURNVALUE:
                            return $willAction->getValue();
                            break;
                        case PHPMOCKFUNCTION_WILL_ACTION_THROWEXCEPTION:
                            throw $willAction->getValue();
                            break;
                    }
                }
            } else {
                $msg = "No expectation was found for invocation of ";
                $msg .= $this->functionName;
                //$msg .= $this->toString();
                $msg .= "\n Allowed invocations:\n";
                foreach ($this->expectations as $expectation) {
                    $msg .= " '". $this->functionName ."' with arguments {";
                    $msg .= var_export($arguments, True);
                    $msg .= "}\n";
                }
                throw new Exception($msg);
            }
        }
        
        public function getFunctionName() {
            return $this->functionName;
        }
        
        public function expects($invocationRestriction) {
            $current_expectation = new Expectation($this);
            $current_expectation->setInvocationRestriction($invocationRestriction);
            $this->expectations[] = $current_expectation;
            
            return $current_expectation;
        }   
    }
    
?>
