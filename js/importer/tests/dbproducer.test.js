
require(
    ['lingwo_old/util/TestCase',
     'lingwo_old/importer/Database',
     'lingwo_old/importer/DatabaseProducer',
     'lingwo/Entry',
     'lingwo/Language',
     'lingwo_old/entrySerialization'
    ],
    function (TestCase, Database, DatabaseProducer, Entry, Language) {
        TestCase.subclass({
            setUp: function () {
                this.db = new Database();
                var lang = Language.defineLanguage('xxx');
                for(var i = 0; i < 20; i++) {
                    this.db.setEntry(new Entry({
                        language: lang,
                        pos: 'noun',
                        headword: 'entry'+i,
                    }));
                }
                this.db.commit();
            },

            testLimit: function () {
                var producer = new DatabaseProducer(this.db);

                var count = function (limit) {
                    var i = 0;
                    function handler (data) {
                        i++;
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


