
require(
    ['lingwo_dictionary/util/TestCase',
     'lingwo_dictionary/languages/en.test-data',
    ],
    function (TestCase, test_data) {
        TestCase.subclass({
            // copied from pl.test.js
            checkFieldMulti: function (field_name, field_map) {
                for (var entry_name in field_map) {
                    this.assertEquals(test_data[entry_name].getField(field_name), field_map[entry_name]);
                }
            },

            // copied from pl.test.js
            checkFields: function (entry_name, fields) {
                var entry = test_data[entry_name];
                for(var name in fields) {
                    this.assertEquals(entry.getField(name), fields[name], entry.name);
                }
            },

            testNounPlural: function () {
                this.checkFieldMulti('plural', {
                    'house': 'houses',
                    'kiss': 'kisses',
                    'dish': 'dishes',
                    'watch': 'watches',
                    'boy': 'boys',
                    'hero': 'heroes',
                    'lady': 'ladies'
                });
            },

            testVerbSimplePresent3p: function () {
                this.checkFieldMulti('-s', {
                    'read': 'reads',
                    'try': 'tries',
                    'buzz': 'buzzes',
                    'veto': 'vetoes',
                });
            },

            testVerbIngForm: function () {
                this.checkFieldMulti('-ing', {
                    'read': 'reading',
                    'agree': 'agreeing',
                    'lie': 'lying',
                    'believe': 'believing',
                });
            },

            testVerb2ndForm: function () {
                this.checkFieldMulti('2nd', {
                    'buzz': 'buzzed',
                    'agree': 'agreed',
                });
            },

            testVerb3rdForm: function () {
                this.checkFieldMulti('3rd', {
                    'buzz': 'buzzed',
                    'agree': 'agreed',
                });
            },

            testMultiWordEntry: function () {
                this.checkFields('work out', {
                    '-s': 'works out',
                    '-ing': 'working out',
                    '2nd': 'worked out',
                    '3rd': 'worked out',
                    'infinitive': 'to work out',
                });
            },
        }).run();
    }
);


