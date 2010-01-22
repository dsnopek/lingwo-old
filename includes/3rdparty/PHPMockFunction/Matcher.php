<?php
    require_once('dumper.php');

    abstract class Matcher {
        public abstract function match($argument);
        
        public function eq($argument) {
            return new EqualsMatcher($argument);
        }
        
        public function notNull() {
            return new NotNullMatcher();
        }
    }
    
    class NotNullMatcher extends Matcher {
        public function match($argument) {
            return ($argument != NULL);
        }
    }
    
    class EqualsMatcher extends Matcher {      
        function __construct($argument) {
            $this->argument = $argument;          
        }
        
        public function match($argument) {
            if ($this->argument != $argument) {
                $dumper = new SimpleDumper;
                throw new Exception($dumper->describeDifference($this->argument, $argument));
            }
        }
    }
?>
