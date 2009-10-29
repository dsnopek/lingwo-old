
load('morphology.js');
load('pol.js');
load('pol.test-data.js');
load('test.js');

PolishTest = TestCase.subclass({
    test_kobieta: function () {
        var entry = entries['kobieta'];

        this.assertEquals(entry.getForm('*stem.singular'), 'kobiet')
        this.assertEquals(entry.getOption('gender'), 'feminine');
    },

    test_glupi: function () {
        var entry = entries['głupi'];

        this.assertEquals(entry.getForm('*stem'), 'głup');
        this.assertEquals(entry.isClass('soft'), true);
        this.assertEquals(entry.getForm('nominative.singular.feminine'), 'głupia');
    }
});

(new PolishTest()).run();

