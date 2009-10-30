
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

    testVerbSecondConjugationEC: function () {
        this.assertEquals(getEntry('słyszeć').getOption('conjugation'), 'second');

        this.checkForms('słyszeć', {
            'nonpast.singular.1p': 'słyszę',
            'nonpast.singular.2p': 'słyszysz',
            'nonpast.singular.3p': 'słyszy',
            'nonpast.plural.1p': 'słyszymy',
            'nonpast.plural.2p': 'słyszycie',
            'nonpast.plural.3p': 'słyszą'
        });
    },

    testVerbSecondConjugationIC: function () {
        this.assertEquals(getEntry('dzwonić').getOption('conjugation'), 'second');

        this.checkForms('dzwonić', {
            'nonpast.singular.1p': 'dzwonię',
            'nonpast.singular.2p': 'dzwonisz',
            'nonpast.singular.3p': 'dzwoni',
            'nonpast.plural.1p': 'dzwonimy',
            'nonpast.plural.2p': 'dzwonicie',
            'nonpast.plural.3p': 'dzwonią'
        });
    },

    testVerbThirdConjugation: function () {
        this.assertEquals(getEntry('mieszkać').getOption('conjugation'), 'third');

        this.checkForms('mieszkać', {
            'nonpast.singular.1p': 'mieszkam',
            'nonpast.singular.2p': 'mieszkasz',
            'nonpast.singular.3p': 'mieszka',
            'nonpast.plural.1p': 'mieszkamy',
            'nonpast.plural.2p': 'mieszkacie',
            'nonpast.plural.3p': 'mieszkają'
        });
    },

    testVerbThirdConjugationIrregularStem: function () {
        this.assertEquals(getEntry('wiedzieć').getOption('conjugation'), 'third');

        this.checkForms('wiedzieć', {
            'nonpast.singular.1p': 'wiem',
            'nonpast.singular.2p': 'wiesz',
            'nonpast.singular.3p': 'wie',
            'nonpast.plural.1p': 'wiemy',
            'nonpast.plural.2p': 'wiecie',
            'nonpast.plural.3p': 'wiedzą'
        });
    },

    testVerbOWAC: function () {
        this.assertEquals(getEntry('dziękować').getOption('conjugation'), 'first');

        this.checkForms('dziękować', {
            'nonpast.singular.1p': 'dziękuję',
            'nonpast.singular.2p': 'dziękujesz',
            'nonpast.singular.3p': 'dziękuje',
            'nonpast.plural.1p': 'dziękujemy',
            'nonpast.plural.2p': 'dziękujecie',
            'nonpast.plural.3p': 'dziękują'
        });
    },

    testVerbYWAC: function () {
        this.assertEquals(getEntry('obiecywać').getOption('conjugation'), 'first');

        this.checkForms('obiecywać', {
            'nonpast.singular.1p': 'obiecuję',
            'nonpast.singular.2p': 'obiecujesz',
            'nonpast.singular.3p': 'obiecuje',
            'nonpast.plural.1p': 'obiecujemy',
            'nonpast.plural.2p': 'obiecujecie',
            'nonpast.plural.3p': 'obiecują'
        });
    },

    testVerbIWAC: function () {
        this.assertEquals(getEntry('oczekiwać').getOption('conjugation'), 'first');

        this.checkForms('oczekiwać', {
            'nonpast.singular.1p': 'oczekuję',
            'nonpast.singular.2p': 'oczekujesz',
            'nonpast.singular.3p': 'oczekuje',
            'nonpast.plural.1p': 'oczekujemy',
            'nonpast.plural.2p': 'oczekujecie',
            'nonpast.plural.3p': 'oczekują'
        });
    },

    testVerbAWAC: function () {
        this.assertEquals(getEntry('dawać').getOption('conjugation'), 'first');

        this.checkForms('dawać', {
            'nonpast.singular.1p': 'daję',
            'nonpast.singular.2p': 'dajesz',
            'nonpast.singular.3p': 'daje',
            'nonpast.plural.1p': 'dajemy',
            'nonpast.plural.2p': 'dajecie',
            'nonpast.plural.3p': 'dają'
        });
    },

    testVerbThirdConjugationYWAC: function () {
        this.assertEquals(getEntry('nazywać').getOption('conjugation'), 'third');

        this.checkForms('nazywać', {
            'nonpast.singular.1p': 'nazywam',
            'nonpast.singular.2p': 'nazywasz',
            'nonpast.singular.3p': 'nazywa',
            'nonpast.plural.1p': 'nazywamy',
            'nonpast.plural.2p': 'nazywacie',
            'nonpast.plural.3p': 'nazywają'
        });
    },

});

(new PolishTest()).run();

