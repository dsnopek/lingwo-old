
/*
 * A really simple test fixture class (ported from an older implementation of Lingwo)
 */

// TestCase
define(function () {
        var println = function (text) {
            print(text);
        };

        // A helper for extending a constructors prototype
        var extendPrototype = function (cons, props) {
            for (var name in props) {
                cons.prototype[name] = props[name];
            }
        };

        var TestCase = function () { };
        extendPrototype(TestCase, {
            setUp: function () { },
            tearDown: function () { },
            runTest: function (test_name) {
                // set our internal counters
                this.__success = 1;
                this.__current = test_name;
                
                // run the test
                this.setUp();
                this[test_name]();
                this.tearDown();

                if ( this.__success )
                {
                    println(test_name+': Ok');
                    return true
                }

                return false;
            },
            run: function (test_name) {
                var total  = 0;
                var passed = 0;
                var failed = 0;

                for( var member in this )
                {
                    if ( (test_name  && member == test_name) ||
                         (!test_name && member.substr(0,4) == 'test' ) )
                    {
                        if ( this.runTest(member) )
                        {
                            passed ++;
                        }
                        else
                        {
                            failed ++;
                        }

                        total ++;
                    }
                }

                println('passed '+passed+' out of '+total+' tests (failed '+failed+')');
            },

            assert: function (value, desc) {
                if ( !value )
                {
                    this.__success = 0;

                    var msg = this.__current+': assertion failed';
                    if ( desc )
                    {
                        msg = msg+' ('+desc+')';
                    }
                    println(msg);
                }
            },

            assertEquals: function (value1, value2, desc) {
                if ( value1 != value2 )
                {
                    this.__success = 0;

                    var msg = this.__current+': assertion failed: "'+value1+'" does not equal "'+value2+'"';
                    if ( desc )
                    {
                        msg = msg+' ('+desc+')';
                    }
                    println(msg);
                }
            },

        });

        TestCase.subclass = function (members) {
            var newClass = function () { };
            newClass.prototype = new TestCase();
            extendPrototype(newClass, members);
            // convenience function for running from an anonymous sub-class
            newClass.run = function () { (new newClass()).run(); };
            return newClass;
        };

        return TestCase;
    }
);

