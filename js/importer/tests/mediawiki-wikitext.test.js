
require(
    ['lingwo_old/util/TestCase',
     'lingwo_old/importer/mediawiki/WikiText',
    ],
    function (TestCase, WikiText) {
        TestCase.subclass({
            testSections: function () {
                var text = "== Blarney ==\n\nsomething\n\n=== Sub-section ===\n\n" +
                           "Here is data in a subsection\n\n=== Sub-section 2 ===\n\nSome other subsection\n";

                var wiki = new WikiText(text);

                this.assert(wiki.hasSection('Blarney'));
                this.assert(!wiki.hasSection('Zumma'));
                this.assert(!wiki.hasSection('Sub-section'));
                this.assert(wiki.hasSection('Sub-section', 2));
                this.assert(wiki.hasSection('Sub-section 2', 2));

                this.assertEquals(wiki.getSection('Blarney'), text);
                this.assertEquals(wiki.getSection('Sub-section', 2), '=== Sub-section ===\n\nHere is data in a subsection\n');
                this.assertEquals(wiki.getSection('Sub-section 2', 2), '=== Sub-section 2 ===\n\nSome other subsection\n');
            },
        }).run();
    }
);


