
load('src/importer.js');
load('src/mediawiki.js');
load('src/db.js');
load('src/pl-wiktionary-org.js');
load('src/en-wiktionary-org.js');

load('../morphology/test.js');

DatabaseProducerTest = TestCase.subclass({
    setUp: function () {
        this.db = new Lingwo.importer.db.Database();
        for(var i = 0; i < 20; i++) {
            this.db.setEntry('xxx', 'noun', 'entry'+i, 'entry'+i);
        }
        this.db.commit();
    },

    testLimit: function () {
        var producer = new Lingwo.importer.db.DatabaseProducer(this.db);

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

WikiTextTest = TestCase.subclass({
    testSections: function () {
        var text = "== Blarney ==\n\nsomething\n\n=== Sub-section ===\n\n" +
                   "Here is data in a subsection\n\n=== Sub-section 2 ===\n\nSome other subsection\n";

        var wiki = new Lingwo.importer.mediawiki.WikiText(text);

        this.assert(wiki.hasSection('Blarney'));
        this.assert(!wiki.hasSection('Zumma'));
        this.assert(!wiki.hasSection('Sub-section'));
        this.assert(wiki.hasSection('Sub-section', 2));
        this.assert(wiki.hasSection('Sub-section 2', 2));

        this.assertEquals(wiki.getSection('Blarney'), text);
        this.assertEquals(wiki.getSection('Sub-section', 2), '=== Sub-section ===\n\nHere is data in a subsection\n');
        this.assertEquals(wiki.getSection('Sub-section 2', 2), '=== Sub-section 2 ===\n\nSome other subsection\n');
    },
});

function main() {
    for (var name in this) {
        if (/Test$/.exec(name)) {
            print ('=='+name+'==');
            (new this[name]()).run();
            print ();
        }
    }
}
main();


