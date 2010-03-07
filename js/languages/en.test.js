
require(
    ['lingwo_dictionary/util/TestCase',
     'lingwo_dictionary/languages/en.test-data',
    ],
    function (TestCase, test_data) {
        TestCase.subclass({
            testPlural: function () {
                this.assertEquals(test_data['house'].getField('plural'), 'houses');
            }
        }).run();
    }
);


