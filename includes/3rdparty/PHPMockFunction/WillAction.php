<?php
    define(PHPMOCKFUNCTION_WILL_ACTION_RETURNVALUE, 0x01);
    define(PHPMOCKFUNCTION_WILL_ACTION_THROWEXCEPTION, 0x02);
    
    abstract class WillAction {
        private $arguments;
        public abstract function getType();
        public abstract function getValue();
        
        static public function returnValue($value) {
            return new ReturnValueAction($value);
        }
        
        /**
         * pops return values in FIFO sequence 
         */
        static public function returnValueStack($value) {
            return new ReturnValueStackAction($value);
        }
        
        public function throwException($value) {
            return new ThrowExceptionAction($value);
        }
        
        public function setActualArguments($arguments) {
            $this->arguments = $arguments;
        }
        
        protected function getActualArguments() {
            return $this->arguments;
        }
    }
    
    class ReturnValueAction extends WillAction {
        private $value;
        
        public function __construct($value) {
            $this->value = $value;
        }
        
        public function getType() {
            return PHPMOCKFUNCTION_WILL_ACTION_RETURNVALUE;
        }
        
        public function getValue() {
            return $this->value;
        }
    }
    
    class ThrowExceptionAction extends WillAction {
        private $value;
        
        public function __construct($value) {
            $this->value = $value;
        }
        
        public function getType() {
            return PHPMOCKFUNCTION_WILL_ACTION_THROWEXCEPTION;
        }
        
        public function getValue() {
            return $this->value;
        }
    }
    
    class WillCallback extends WillAction {
        private $callback;
        
        function __construct($callback) {
          $this->callback = $callback;
        }
        
        static function call($callback) {
             return new WillCallback($callback);
        }
      
        public function getType() {
            return PHPMOCKFUNCTION_WILL_ACTION_RETURNVALUE;
        }
        
        function getValue() {
          return call_user_func_array($this->callback, $this->getActualArguments());
        }
    }

    class ReturnValueStackAction extends WillAction {
        private $values;
        
        public function __construct($values) {
            $this->values = $values;
        }
        
        public function getType() {
            return PHPMOCKFUNCTION_WILL_ACTION_RETURNVALUE;
        }
        
        public function getValue() {
            return array_shift($this->values);
        }        
    }
?>