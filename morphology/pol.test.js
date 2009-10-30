
load('morphology.js');
load('pol.js');
load('pol.test-data.js');
load('test.js');

function getEntry(entry_name) {
    if (typeof entries[entry_name] == 'undefined')
        throw("No such entry named: "+entry_name);
    return entries[entry_name];
}

PolishTest = TestCase.subclass({
    checkForms: function (entry_name, forms) {
        var entry = getEntry(entry_name);
        for(var name in forms) {
            this.assertEquals(entry.getForm(name), forms[name], entry.name);
        }
    },

    checkOptionMulti: function (entry_names, option_name, value) {
        for (var i = 0; i < entry_names.length; i++) {
            this.assertEquals(getEntry(entry_names[i]).getOption(option_name), value, entry_names[i]);
        }
    },

    checkClassMulti: function (entry_names, class_name, value) {
        if (typeof value == 'undefined')
            value = true;
        for (var i = 0; i < entry_names.length; i++) {
            this.assertEquals(getEntry(entry_names[i]).isClass(class_name), value, entry_names[i]);
        }
    },

    checkFormMulti: function (entry_form_map, form_name) {
        for (var entry_name in entry_form_map) {
            this.assertEquals(getEntry(entry_name).getForm(form_name), entry_form_map[entry_name]);
        }
    },

    testJaki: function () {
        this.checkForms('jaki', {
            'nominative.singular.masculine': 'jaki',
            'nominative.singular.feminine': 'jaka',
            'nominative.singular.neuter': 'jakie'
        });
    },

    testNounGenderMasculine: function () {
        this.checkOptionMulti([
            'stół', 'kot', 'pokój', 'chłopiec', 'kolega', 'dentysta', 'mężczyzna'
        ], 'gender', 'masculine');
    },

    testNounGenderFeminine: function () {
        this.checkOptionMulti([
            'kobieta', 'ulica', 'Polska', 'gospodyni', 'noc', 'część', 'jesień', 'wieś', 'mysz', 'miłość', 'ciekawość'
        ], 'gender', 'feminine');
    },

    testNounGenderNeuter: function () {
        this.checkOptionMulti([
            'okno', 'dziecko', 'życie', 'imię', 'szczenię', 'zwierzę', 'niemowlę', 'muzeum', 'gimnazjum'
        ], 'gender', 'neuter');
    },

    testAdjectiveSoft: function () {
        // not soft!
        this.checkClassMulti([
            'duży', 'mały', 'dobry', 'zły', 'wysoki', 'niski', 'polski', 'długi', 'drogi', 'drugi'
        ], 'soft', false);

        // soft
        this.checkClassMulti([
            'głupi', 'tani', 'trzeci', 'ostatni', 'średni'
        ], 'soft');
    },

    testAdjectiveFormStem: function () {
        this.checkFormMulti({
            'mały': 'mał',
            'duży': 'duż',
            'dobry': 'dobr',
            'zły': 'zł',
            'wysoki': 'wysok',
            'niski': 'nisk',
            'polski': 'polsk',
            'długi': 'dług',
            'drogi': 'drog',
            'drugi': 'drug',
            'głupi': 'głup',
            'tani': 'tan',
            'trzeci': 'trzec',
            'ostatni': 'ostatn',
            'średni': 'średn'
        }, '*stem');
    },

    testAdjectiveNominativeSingularMasculine: function () {
        this.checkFormMulti({
            'mały': 'mały',
            'wysoki': 'wysoki',
            'drogi': 'drogi',
            'głupi': 'głupi'
        }, 'nominative.singular.masculine');
    },

    testAdjectiveNominativeSingularFeminine: function () {
        this.checkFormMulti({
            'mały': 'mała',
            'wysoki': 'wysoka',
            'drogi': 'droga',
            'głupi': 'głupia'
        }, 'nominative.singular.feminine');
    },

    testAdjectiveNominativeSingularNeuter: function () {
        this.checkFormMulti({
            'mały': 'małe',
            'wysoki': 'wysokie',
            'drogi': 'drogie',
            'głupi': 'głupie'
        }, 'nominative.singular.neuter');
    },

    testToBeNonPast: function () {
        this.checkForms('być', {
            'nonpast.singular.1p': 'jestem',
            'nonpast.singular.2p': 'jesteś',
            'nonpast.singular.3p': 'jest',
            'nonpast.plural.1p': 'jesteśmy',
            'nonpast.plural.2p': 'jesteście',
            'nonpast.plural.3p': 'są'
        });
    },

    /* TODO: replace with one of the ported unit tests!! */
    test_kobieta: function () {
        var entry = entries['kobieta'];
        this.assertEquals(entry.getForm('*stem.singular'), 'kobiet')
    }
});

(new PolishTest()).run();

