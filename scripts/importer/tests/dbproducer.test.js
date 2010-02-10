
require(
    ['lingwo_dictionary/scripts/common/TestCase',
     'lingwo_dictionary/scripts/importer/common/Database',
     'lingwo_dictionary/scripts/importer/common/DatabaseProducer',
    ],
    function (TestCase, Database, DatabaseProducer) {
        TestCase.subclass({
            setUp: function () {
                this.db = new Database();
                for(var i = 0; i < 20; i++) {
                    this.db.setEntry({
                        language: 'xxx',
                        pos: 'noun',
                        headword: 'entry'+i,
                    });
                }
                this.db.commit();
            },

            testLimit: function () {
                var producer = new DatabaseProducer(this.db);

                var count = function (limit) {
                    var i = 0;
                    var handler = {
                        process: function (data) {
                            i++;
                        },
                    };
                    producer.run({ handler: handler, limit: limit });
                    return i;
                };

                this.assertEquals(count(), 20);
                this.assertEquals(count(10), 10);
                this.assertEquals(count(15), 15);
            },
        }).run();
    }
);


