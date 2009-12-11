
load('importer.js');
load('../morphology/test.js');

DatabaseProducerTest = TestCase.subclass({
    setUp: function () {
        this.db = new Lingwo.importer.Database();
        for(var i = 0; i < 20; i++) {
            this.db.setEntry('xxx', 'noun', 'entry'+i, 'entry'+i);
        }
        this.db.commit();
    },

    testLimit: function () {
        var producer = new Lingwo.importer.DatabaseProducer(this.db);

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
});

(new DatabaseProducerTest()).run();


