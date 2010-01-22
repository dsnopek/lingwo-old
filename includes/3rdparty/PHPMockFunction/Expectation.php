<?php
    require_once("PHPMockFunction.php");
    
    define(PHPMOCKFUNCTION_INVOCATION_COUNT_OKAY, 0x01);
    define(PHPMOCKFUNCTION_INVOCATION_COUNT_EXCEEDED, 0x02);
    
    class Expectation {
        private $mock;
        private $invocationRestriction;
        private $arguments;
        private $willAction;
        
        public function __construct($mock) {
            $this->mock = $mock;
        }
        
        public function setInvocationRestriction($invocationRestriction) {
            $this->invocationRestriction = $invocationRestriction;
        }
        
        public function with() {
            // TODO: fetch matchers for arguments instead of arguments
            $this->arguments = func_get_args();

            return $this;
        }
        
        public function will($willAction) {
            $this->willAction = $willAction;
        }
        
        public function getWillAction() {
            return $this->willAction;
        }
        
        private function checkBounds() {
            $bounds = $this->invocationRestriction->checkBounds();
            if ($bounds == PHPMOCKFUNCTION_INVOCATION_COUNT_EXCEEDED) {
                throw new Exception("function already invoked. " . $this->mock->getFunctionName());
            }
            if ($bounds == PHPMOCKFUNCTION_INVOCATION_COUNT_OKAY) {
                return TRUE;
            }
        }
        
        public function match($actualArguments) {
            if ($this->arguments == $actualArguments) {
                return $this->checkBounds();
            }
            foreach ($this->arguments as $key => $expectedArgument) {
                if ($expectedArgument instanceOf AnyArgsMatcher) {
                    return $this->checkBounds();
                }
                if ($expectedArgument instanceOf Matcher) {
                    if ($expectedArgument->match($actualArguments[$key])) {
                        continue;
                    }
                }

                // allow the next expectation to check
                return FALSE;
            }
            return $this->checkBounds();
        }
        
        public function toString() {
            $msg = $this->invocationRestriction->toString();
            $msg .= " with arguments {";
            $msg .= var_export($this->arguments, True);
            $msg .= "}";
            return $msg;
        }
    }
    
    class InvocationRestriction {
        private $minInvocation;
        private $maxInvocation;
        private $currentInvocationCount;
        
        public function __construct($minInvocation, $maxInvocation) {
            $this->minInvocation = $minInvocation;
            $this->maxInvocation = $maxInvocation;
        }
        
        public function checkBounds() {
            $this->currentInvocationCount++;
            if ($this->minInvocation == 0 && $this->maxInvocation == 0) {
                return PHPMOCKFUNCTION_INVOCATION_COUNT_EXCEEDED;
            }
            if ($this->minInvocation == -1) {
                if ($this->currentInvocationCount <= $this->maxInvocation) {
                    return PHPMOCKFUNCTION_INVOCATION_COUNT_OKAY;
                }
                return PHPMOCKFUNCTION_INVOCATION_COUNT_EXCEEDED;            
            }
            if ($this->minInvocation >= $this->currentInvocationCount && $this->currentInvocationCount <= $this->maxInvocation) {
                return PHPMOCKFUNCTION_INVOCATION_COUNT_OKAY;
            }
            
            return PHPMOCKFUNCTION_INVOCATION_COUNT_EXCEEDED;            
        }
        
        public function toString() {
            if ($this->minInvocation == 0 && $this->maxInvocation == 0) {
                return "never";
            }
            if ($this->minInvocation == -1 && $this->maxInvocation > 0) {
                return "up to " . $this->maxInvocation . " times";
            }
            if ($this->minInvocation > 0 && $this->maxInvocation == -1) {
                return "at least " . $this->minInvocation . " times";
            }
            if ($this->minInvocation == 1 && $this->maxInvocation == 1) {
                return "once";
            }
            if ($this->minInvocation == $this->maxInvocation) {
                return "exactly " . $this->minInvocation . " times";
            }
            return "between " . $this->minInvocation . " and " . $this->maxInvocation . " times";
        }
        
        public static function once() {
            return new self(1, 1);
        }
        
        public static function exactly($number) {
            return new self($number, $number);
        }

        // I question this feature is possible w/o an verify phase after
        // program execution          
        public static function atLeast($minInvocation) {
            return new self($minInvocation, -1);
        }
        
        public static function noMoreThan($maxInvocation) {
            return new self(-1, $maxInvocation);
        }
        
        public static function never() {
            return new self(0, 0);
        }
        
        public static function any() {
            return new self(-1, -1);
        }
    }
    
    
?>
