
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

    checkOptionMulti: function (option_name, value, entry_names) {
        for (var i = 0; i < entry_names.length; i++) {
            this.assertEquals(getEntry(entry_names[i]).getOption(option_name), value, entry_names[i]);
        }
    },

    checkClassMulti: function (class_name, value, entry_names) {
        for (var i = 0; i < entry_names.length; i++) {
            this.assertEquals(getEntry(entry_names[i]).isClass(class_name), value, entry_names[i]);
        }
    },

    checkFormMulti: function (form_name, entry_form_map) {
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
        this.checkOptionMulti('gender', 'masculine', [
            'stół', 'kot', 'pokój', 'chłopiec', 'kolega', 'dentysta', 'mężczyzna'
        ]);
    },

    testNounGenderFeminine: function () {
        this.checkOptionMulti('gender', 'feminine', [
            'kobieta', 'ulica', 'Polska', 'gospodyni', 'noc', 'część', 'jesień', 'wieś', 'mysz', 'miłość', 'ciekawość'
        ]);
    },

    testNounGenderNeuter: function () {
        this.checkOptionMulti('gender', 'neuter', [
            'okno', 'dziecko', 'życie', 'imię', 'szczenię', 'zwierzę', 'niemowlę', 'muzeum', 'gimnazjum'
        ]);
    },

    testAdjectiveSoft: function () {
        // not soft!
        this.checkClassMulti('soft', false, [
            'duży', 'mały', 'dobry', 'zły', 'wysoki', 'niski', 'polski', 'długi', 'drogi', 'drugi'
        ]);

        // soft
        this.checkClassMulti('soft', true, [
            'głupi', 'tani', 'trzeci', 'ostatni', 'średni'
        ]);
    },

    testAdjectiveFormStem: function () {
        this.checkFormMulti('*stem', {
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
        });
    },

    testAdjectiveNominativeSingularMasculine: function () {
        this.checkFormMulti('nominative.singular.masculine', {
            'mały': 'mały',
            'wysoki': 'wysoki',
            'drogi': 'drogi',
            'głupi': 'głupi'
        });
    },

    testAdjectiveNominativeSingularFeminine: function () {
        this.checkFormMulti('nominative.singular.feminine', {
            'mały': 'mała',
            'wysoki': 'wysoka',
            'drogi': 'droga',
            'głupi': 'głupia'
        });
    },

    testAdjectiveNominativeSingularNeuter: function () {
        this.checkFormMulti('nominative.singular.neuter', {
            'mały': 'małe',
            'wysoki': 'wysokie',
            'drogi': 'drogie',
            'głupi': 'głupie'
        });
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

    testNounMasculineNonVirilePlural: function () {
        this.checkFormMulti('nominative.plural', {
            // -y group
            'dom': 'domy',
            'kot': 'koty',
            'sklep': 'sklepy',
            'stół': 'stoły',
            'ząb': 'zęby',
            'kościół': 'kościoły',
            'samochód': 'samochody',

            // -i group
            'bank': 'banki',
            'ptak': 'ptaki',
            'dzwonek': 'dzwonki',
            'róg': 'rogi',
            'pociąg': 'pociągi',

            // -e group
            'kraj': 'kraje',
            'pokój': 'pokoje',
            'parasol': 'parasole',
            'hotel': 'hotele',
            'szpital': 'szpitale',
            'pałac': 'pałace',
            'tysiąc': 'tysiące',
            'pieniądz': 'pieniądze',
            'grosz': 'grosze',
            'nóż': 'noże',
            'miesiąc': 'miesiące',
            'talerz': 'talerze',
            'klucz': 'klucze',

            // -ie group
            'koń': 'konie',
            'ogień': 'ognie',
            'tydzień': 'tygodnie',
            'liść': 'liście',
            'niedźwiedź': 'niedźwiedzie',
            'gołąb': 'gołębie',
            'karp': 'karpie'
        });
    },

    testNounFemininePlural: function () {
        this.checkFormMulti('nominative.plural', {
            // -y group
            'kobieta': 'kobiety',
            'szkoła': 'szkoły',
            'gwiazda': 'gwiazdy',
            'ryba': 'ryby',
            'siostra': 'siostry',
            'kiełbasa': 'kiełbasy',
            'mysz': 'myszy',
            'rzecz': 'rzeczy',

            // -i group
            'matka': 'matki',
            'córka': 'córki',
            'droga': 'drogi',
            'Polka': 'Polki',
            'figa': 'figi',

            // an exception (in the -e group, not the -i as you would expect)
            'ręka': 'ręce',

            // -e group
            'lekcja': 'lekcje',
            'kolej': 'koleje',
            'kąpiel': 'kąpiele',
            'chwila': 'chwile',
            'aleja': 'aleje',
            'sala': 'sale',
            'babcia': 'babcie',
            'kuchnia': 'kuchnie',
            'historia': 'historie',
            'gospodyni': 'gospodynie',
            'noc': 'noce',
            'ulica': 'ulice',
            'tęcza': 'tęcze',
            'burza': 'burze',
            'wieża': 'wieże',
            'podróż': 'podróże',
            'owca': 'owce',
            'róża': 'róże',
            'grusza': 'grusze',

            // -i group (we consider this group an exception because its unpredictable, except for -ość)
            'miłość': 'miłości',
            'opowieść': 'opowieści',
            'nić': 'nici',
            'pieśń': 'pieśni',
            'przyjaźń': 'przyjaźni',

            // -ie group
            'jabłoń': 'jabłonie',
            'łódź': 'łodzie',
            'gałąź': 'gałęzie',
            'wieś': 'wsie'
        });
    },

    testNounNeuterPlural: function () {
        this.checkFormMulti('nominative.plural', {
            // -a group
            'jabłko': 'jabłka',
            'morze': 'morza',
            'krzesło': 'krzesła',
            'pole': 'pola',
            'zdjęcie': 'zdjęcia',
            'muzeum': 'muzea',

            // -iona group
            'imię': 'imiona',
            'ramię': 'ramiona',

            // -eta
            'jagnię': 'jagnięta',
            'prosię': 'prosięta',
            'kurczę': 'kurczęta',
            'zwierzę': 'zwierzęta',
            'dziewczę': 'dziewczęta',
            'niemowlę': 'niemowlęta'
        });
    },

    testAdjectiveNominativePluralNonVirile: function () {
        this.checkFormMulti('nominative.plural.non_virile', {
            'mały': 'małe',
            'młody': 'młode',
            'duży': 'duże',
            'niski': 'niskie',
            'drogi': 'drogie',
            'głupi': 'głupie'
        });
    }
});

(new PolishTest()).run();

