
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
    },

    testNounMasculinePluralVirile: function () {
        this.checkFormMulti('nominative.plural', {
            // -y group (hard which remains hard)
            'Polak': 'Polacy',
            'Chińczyk': 'Chińczycy',
            'Anglik': 'Anglicy',
            'kaleka': 'kalecy',
            'Norweg': 'Norwedzy',
            'kolega': 'koledzy',
            'inżynier': 'inżynierzy',
            'kelner': 'kelnerzy',
            'doktor': 'doktorzy',
            'kierowca': 'kierowcy',
            'chłopiec': 'chłopcy',
            'sprzedawca': 'sprzedawcy',
            'Niemiec': 'Niemcy',
            'mieszkaniec': 'mieszkańcy',

            // -e gorup (soft and psuedo soft)
            'lekarz': 'lekarze',
            'złodziej': 'złodzieje',
            'towarzysz': 'towarzysze',
            'słuchacz': 'słuchacze',
            'nauczyciel': 'nauczyciele',
            'góral': 'górale',

            // -i group (from hard to soft)
            'Francuz': 'Francuzi',
            'mężczyzna': 'mężczyźni',
            'chłop': 'chłopi',
            'student': 'studenci',
            'architekt': 'architekci',
            'poeta': 'poeci',
            'dentysta': 'dentyści',
            'specjalista': 'specjaliści',
            'turysta': 'turyści',
            'Czech': 'Czesi',
            'Włoch': 'Włosi',
            'sąsiad': 'sąsiedzi',
            'Szwed': 'Szwedzi',
            'diabeł': 'diabli',

            // -owie (we are treating these as exceptions)
            'syn': 'synowie',
            'mąż': 'mężowie',
            'Belg': 'Belgowie',
            'professor': 'professorowie',
            'uczeń': 'uczniowie',
            'więzień': 'więźniowie',

            // exceptions, pure.
            'brat': 'bracia',
            'Amerykanin': 'Amerykanie',
            'Rosjanin': 'Rosjanie'
        });
    },

    testAdjectiveNominativePluralVirile: function () {
        this.checkFormMulti('nominative.plural.virile', {
            // -y group (hard which remain hard
            'polski': 'polscy',
            'wysoki': 'wysocy',
            'brzydki': 'brzydcy',
            'bliski': 'bliscy',
            'drogi': 'drodzy',
            'ubogi': 'ubodzy',
            'dobry': 'dobrzy',
            'stary': 'starzy',

            // -i group (from hard to soft, or just plain soft)
            'młody': 'młodzi',
            'miły': 'mili',
            'mały': 'mali',
            'zły': 'źli',
            'były': 'byli',
            'biedny': 'biedni',
            'smutny': 'smutni',
            'zadowolony': 'zadowoleni',
            'zmęczony': 'zmęczeni',
            'zajęty': 'zajęci',
            'bogaty': 'bogaci',
            'pierwszy': 'pierwsi',
            'lepszy': 'lepsi',
            'duży': 'duzi',
            'gotowy': 'gotowi',
            'ciekawy': 'ciekawi',

            // soft adjectives don't change in the plural
            'głupi': 'głupi',
            'ostatni': 'ostatni'
        });
    },

    testNounFeminineAccusativeSingular: function () {
        this.checkFormMulti('accusative.singular', {
            'matka': 'matkę',
            'kobieta': 'kobietę',
            'babcia': 'babcię',
            'szkoła': 'szkołę',
            'Polska': 'Polskę',
            'gospodyni': 'gospodynię',
            'rzecz': 'rzecz',
            'podróż': 'podróż',
            'noc': 'noc',
            'miłość': 'miłość',
            'twarz': 'twarz'
        });
    },

    testAdjectiveAccusativeSingularFeminine: function () {
        this.checkFormMulti('accusative.singular.feminine', {
            'duży': 'dużą',
            'piękny': 'piękną',
            'tani': 'tanią',
            'głupi': 'głupią',
            'polski': 'polską'
        });
    },

    testVerbSecondConjugation: function () {
        this.assertEquals(getEntry('wierzyć').getOption('conjugation'), 'second');

        this.checkForms('wierzyć', {
            'nonpast.singular.1p': 'wierzę',
            'nonpast.singular.2p': 'wierzysz',
            'nonpast.singular.3p': 'wierzy',
            'nonpast.plural.1p': 'wierzymy',
            'nonpast.plural.2p': 'wierzycie',
            'nonpast.plural.3p': 'wierzą'
        });
    },
});

(new PolishTest()).run();

