
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

            testPlural: function () {
                this.checkFieldMulti('plural', {
                    'house': 'houses',
                    'kiss': 'kisses',
                    'dish': 'dishes',
                    'watch': 'watches',
                    'boy': 'boys',
                    'hero': 'heroes',
                    'lady': 'ladies'
                });
            }
        }).run();
    }
);


