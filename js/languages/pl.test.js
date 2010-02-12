
require(
    ['lingwo_dictionary/scripts/common/TestCase',
     'lingwo_dictionary/js/languages/pl.test-data',
    ],
    function (TestCase, test_data) {
        function getEntry(entry_name) {
            if (typeof test_data[entry_name] == 'undefined')
                throw("No such entry named: "+entry_name);
            return test_data[entry_name];
        }

        TestCase.subclass({
            checkFields: function (entry_name, fields) {
                var entry = getEntry(entry_name);
                for(var name in fields) {
                    this.assertEquals(entry.getField(name), fields[name], entry.name);
                }
            },

            checkFieldMulti: function (field_name, field_map) {
                for (var entry_name in field_map) {
                    this.assertEquals(getEntry(entry_name).getField(field_name), field_map[entry_name]);
                }
            },

            testJaki: function () {
                this.checkFields('jaki', {
                    'nominative.singular.masculine': 'jaki',
                    'nominative.singular.feminine': 'jaka',
                    'nominative.singular.neuter': 'jakie'
                });
            },

            testNounGenderMasculine: function () {
                this.checkFieldMulti('gender', 'masculine', [
                    'stół', 'kot', 'pokój', 'chłopiec', 'kolega', 'dentysta', 'mężczyzna'
                ]);
            },

            testNounGenderFeminine: function () {
                this.checkFieldMulti('gender', 'feminine', [
                    'kobieta', 'ulica', 'Polska', 'gospodyni', 'noc', 'część', 'jesień', 'wieś', 'mysz', 'miłość', 'ciekawość'
                ]);
            },

            testNounGenderNeuter: function () {
                this.checkFieldMulti('gender', 'neuter', [
                    'okno', 'dziecko', 'życie', 'imię', 'szczenię', 'zwierzę', 'niemowlę', 'muzeum', 'gimnazjum'
                ]);
            },

            testAdjectiveSoft: function () {
                // not soft!
                this.checkFieldMulti('soft', false, [
                    'duży', 'mały', 'dobry', 'zły', 'wysoki', 'niski', 'polski', 'długi', 'drogi', 'drugi'
                ]);

                // soft
                this.checkFieldMulti('soft', true, [
                    'głupi', 'tani', 'trzeci', 'ostatni', 'średni'
                ]);
            },

            testAdjectiveFormStem: function () {
                this.checkFieldMulti('*stem', {
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
                this.checkFieldMulti('nominative.singular.masculine', {
                    'mały': 'mały',
                    'wysoki': 'wysoki',
                    'drogi': 'drogi',
                    'głupi': 'głupi'
                });
            },

            testAdjectiveNominativeSingularFeminine: function () {
                this.checkFieldMulti('nominative.singular.feminine', {
                    'mały': 'mała',
                    'wysoki': 'wysoka',
                    'drogi': 'droga',
                    'głupi': 'głupia'
                });
            },

            testAdjectiveNominativeSingularNeuter: function () {
                this.checkFieldMulti('nominative.singular.neuter', {
                    'mały': 'małe',
                    'wysoki': 'wysokie',
                    'drogi': 'drogie',
                    'głupi': 'głupie'
                });
            },

            testToBeNonPast: function () {
                this.checkFields('być', {
                    'nonpast.singular.1p': 'jestem',
                    'nonpast.singular.2p': 'jesteś',
                    'nonpast.singular.3p': 'jest',
                    'nonpast.plural.1p': 'jesteśmy',
                    'nonpast.plural.2p': 'jesteście',
                    'nonpast.plural.3p': 'są'
                });
            },

            testNounMasculineNonVirilePlural: function () {
                this.checkFieldMulti('nominative.plural', {
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
                this.checkFieldMulti('nominative.plural', {
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
                this.checkFieldMulti('nominative.plural', {
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
                this.checkFieldMulti('nominative.plural.non_virile', {
                    'mały': 'małe',
                    'młody': 'młode',
                    'duży': 'duże',
                    'niski': 'niskie',
                    'drogi': 'drogie',
                    'głupi': 'głupie'
                });
            },

            testNounMasculinePluralVirile: function () {
                this.checkFieldMulti('nominative.plural', {
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
                this.checkFieldMulti('nominative.plural.virile', {
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
                this.checkFieldMulti('accusative.singular', {
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
                this.checkFieldMulti('accusative.singular.feminine', {
                    'duży': 'dużą',
                    'piękny': 'piękną',
                    'tani': 'tanią',
                    'głupi': 'głupią',
                    'polski': 'polską'
                });
            },

            testVerbSecondConjugation: function () {
                this.assertEquals(getEntry('wierzyć').getField('conjugation'), 'second');

                this.checkFields('wierzyć', {
                    'nonpast.singular.1p': 'wierzę',
                    'nonpast.singular.2p': 'wierzysz',
                    'nonpast.singular.3p': 'wierzy',
                    'nonpast.plural.1p': 'wierzymy',
                    'nonpast.plural.2p': 'wierzycie',
                    'nonpast.plural.3p': 'wierzą'
                });
            },

            testVerbSecondConjugationEC: function () {
                this.assertEquals(getEntry('słyszeć').getField('conjugation'), 'second');

                this.checkFields('słyszeć', {
                    'nonpast.singular.1p': 'słyszę',
                    'nonpast.singular.2p': 'słyszysz',
                    'nonpast.singular.3p': 'słyszy',
                    'nonpast.plural.1p': 'słyszymy',
                    'nonpast.plural.2p': 'słyszycie',
                    'nonpast.plural.3p': 'słyszą'
                });
            },

            testVerbSecondConjugationIC: function () {
                this.assertEquals(getEntry('dzwonić').getField('conjugation'), 'second');

                this.checkFields('dzwonić', {
                    'nonpast.singular.1p': 'dzwonię',
                    'nonpast.singular.2p': 'dzwonisz',
                    'nonpast.singular.3p': 'dzwoni',
                    'nonpast.plural.1p': 'dzwonimy',
                    'nonpast.plural.2p': 'dzwonicie',
                    'nonpast.plural.3p': 'dzwonią'
                });
            },

            testVerbThirdConjugation: function () {
                this.assertEquals(getEntry('mieszkać').getField('conjugation'), 'third');

                this.checkFields('mieszkać', {
                    'nonpast.singular.1p': 'mieszkam',
                    'nonpast.singular.2p': 'mieszkasz',
                    'nonpast.singular.3p': 'mieszka',
                    'nonpast.plural.1p': 'mieszkamy',
                    'nonpast.plural.2p': 'mieszkacie',
                    'nonpast.plural.3p': 'mieszkają'
                });
            },

            testVerbThirdConjugationIrregularStem: function () {
                this.assertEquals(getEntry('wiedzieć').getField('conjugation'), 'third');

                this.checkFields('wiedzieć', {
                    'nonpast.singular.1p': 'wiem',
                    'nonpast.singular.2p': 'wiesz',
                    'nonpast.singular.3p': 'wie',
                    'nonpast.plural.1p': 'wiemy',
                    'nonpast.plural.2p': 'wiecie',
                    'nonpast.plural.3p': 'wiedzą'
                });
            },

            testVerbOWAC: function () {
                this.assertEquals(getEntry('dziękować').getField('conjugation'), 'first');

                this.checkFields('dziękować', {
                    'nonpast.singular.1p': 'dziękuję',
                    'nonpast.singular.2p': 'dziękujesz',
                    'nonpast.singular.3p': 'dziękuje',
                    'nonpast.plural.1p': 'dziękujemy',
                    'nonpast.plural.2p': 'dziękujecie',
                    'nonpast.plural.3p': 'dziękują'
                });
            },

            testVerbYWAC: function () {
                this.assertEquals(getEntry('obiecywać').getField('conjugation'), 'first');

                this.checkFields('obiecywać', {
                    'nonpast.singular.1p': 'obiecuję',
                    'nonpast.singular.2p': 'obiecujesz',
                    'nonpast.singular.3p': 'obiecuje',
                    'nonpast.plural.1p': 'obiecujemy',
                    'nonpast.plural.2p': 'obiecujecie',
                    'nonpast.plural.3p': 'obiecują'
                });
            },

            testVerbIWAC: function () {
                this.assertEquals(getEntry('oczekiwać').getField('conjugation'), 'first');

                this.checkFields('oczekiwać', {
                    'nonpast.singular.1p': 'oczekuję',
                    'nonpast.singular.2p': 'oczekujesz',
                    'nonpast.singular.3p': 'oczekuje',
                    'nonpast.plural.1p': 'oczekujemy',
                    'nonpast.plural.2p': 'oczekujecie',
                    'nonpast.plural.3p': 'oczekują'
                });
            },

            testVerbAWAC: function () {
                this.assertEquals(getEntry('dawać').getField('conjugation'), 'first');

                this.checkFields('dawać', {
                    'nonpast.singular.1p': 'daję',
                    'nonpast.singular.2p': 'dajesz',
                    'nonpast.singular.3p': 'daje',
                    'nonpast.plural.1p': 'dajemy',
                    'nonpast.plural.2p': 'dajecie',
                    'nonpast.plural.3p': 'dają'
                });
            },

            testVerbThirdConjugationYWAC: function () {
                this.assertEquals(getEntry('nazywać').getField('conjugation'), 'third');

                this.checkFields('nazywać', {
                    'nonpast.singular.1p': 'nazywam',
                    'nonpast.singular.2p': 'nazywasz',
                    'nonpast.singular.3p': 'nazywa',
                    'nonpast.plural.1p': 'nazywamy',
                    'nonpast.plural.2p': 'nazywacie',
                    'nonpast.plural.3p': 'nazywają'
                });
            },

            testNounMasculineAccusativeSingularAnimate: function () {
                this.checkFieldMulti('accusative.singular', {
                    'brat': 'brata',
                    'kelner': 'kelnera',
                    'królik': 'królika',
                    'Polak': 'Polaka',
                    'sąsiad': 'sąsiada',
                    'mąż': 'męża',
                    //'ksiądz': 'księdza',
                    'pies': 'psa',
                    'chłopiec': 'chłopca',
                    'ojciec': 'ojca',
                    'siostrzeniec': 'siostrzeńca',
                    'dziadek': 'dziadka',
                    'szwagier': 'szwagra',
                    'inżynier': 'inżyniera',
                    'koń': 'konia',
                    'gość': 'gościa',
                    'kolega': 'kolegę',
                    'artysta': 'artystę',
                    'kierowca': 'kierowcę'
                });
            },

            testNounMasculineAccusativePluralVirile: function () {
                this.checkFieldMulti('accusative.plural', {
                    'syn': 'synów',
                    'ojciec': 'ojców',
                    'Polak': 'Polaków',
                    'chłopiec': 'chłopców',
                    'Amerykanin': 'Amerykanów',
                    'kolega': 'kolegów',
                    'dentysta': 'dentystów',
                    'mąż': 'mężów',
                    'brat': 'braci',
                    //'ksiądz': 'księźy',
                    'kaleka': 'kalek',
                    'mężczyzna': 'mężczyzn',
                    'uczeń': 'uczniów',
                    'więzień': 'więźniów',
                    'gość': 'gości',
                    'nauczyciel': 'nauczycieli',
                    'złodziej': 'złodziei',
                    'lekarz': 'lekarzy',
                    'słuchacz': 'słuchaczy',
                    'listonosz': 'listonoszy',
                    'żołnierz': 'żołnierzy'
                });
            },

            testNounMasculineGenitiveSingular: function () {
                this.checkFieldMulti('genitive.singular', {
                    'turysta': 'turysty',
                    'mężczyzna': 'mężczyzny',
                    'kierowca': 'kierowcy',
                    'kolega': 'kolegi',
                    'kaleka': 'kaleki',
                    'obiad': 'obiadu',
                    'bank': 'banku',
                    'sklep': 'sklepu',
                    'dom': 'domu',
                    'pokój': 'pokoju',
                    'wiatr': 'wiatru',

                    // irregulars
                    'kosz': 'kosza',
                    'nóż': 'noża',
                    'palec': 'palca',
                    'kwiatek': 'kwiatka',
                    'ząb': 'zęba'
                });
            },

            testNounFeminineGenitiveSingular: function () {
                this.checkFieldMulti('genitive.singular', {
                    'lampa': 'lampy',
                    'szkoła': 'szkoły',
                    'kobieta': 'kobiety',
                    'siostra': 'siostry',
                    'łza': 'łzy',
                    'kiełbasa': 'kiełbasy',
                    'noc': 'nocy',
                    'ulica': 'ulicy',
                    'tęcza': 'tęczy',
                    'mysz': 'myszy',
                    'twarz': 'twarzy',
                    'burza': 'burzy',
                    'róża': 'róży',
                    'grusza': 'gruszy',
                    'rzecz': 'rzeczy',
                    'podróż': 'podróży',
                    'matka': 'matki',
                    'córka': 'córki',
                    'droga': 'drogi',
                    'pieśń': 'pieśni',
                    'nić': 'nici',
                    'pamięć': 'pamięci',
                    'gałąź': 'gałęzi',
                    'łódź': 'łodzi',
                    'miłość': 'miłości',
                    'wieś': 'wsi',
                    'jesień': 'jesieni',
                    'opowieść': 'opowieści',
                    'babcia': 'babci',
                    'kuchnia': 'kuchni',
                    'aleja': 'alei',
                    'szyja': 'szyi',
                    'nadzieja': 'nadziei',
                    'kolej': 'kolei',
                    'żmija': 'żmii',
                    'cebula': 'cebuli',
                    'chwila': 'chwili',
                    'chorągiew': 'chorągwi',
                    'krew': 'krwi',
                    'myśl': 'myśli',
                    'sól': 'soli',
                    'idea': 'idei',
                    'statua': 'statui',
                    'melodia': 'melodii',
                    'Belgia': 'Belgii',
                    'Anglia': 'Anglii',
                    'historia': 'historii',
                    'sympatia': 'sympatii',
                    'telewizja': 'telewizji',
                    'lekcja': 'lekcji',
                    'poezja': 'poezji',
                    'Francja': 'Francji',
                    'stacja': 'stacji',
                    'Szkocja': 'Szkocji',
                    'procesja': 'procesji'
                });
            },

            testNounNeuterGenitiveSingular: function () {
                this.checkFieldMulti('genitive.singular', {
                    'okno': 'okna',
                    'jabłko': 'jabłka',
                    'krzesło': 'krzesła',
                    'morze': 'morza',
                    'mieszkanie': 'mieszkania',
                    'imię': 'imienia',
                    'ramię': 'ramienia',
                    'jagnię': 'jagnięcia',
                    'prosię': 'prosięcia',
                    'źrebię': 'źrebięcia',
                    'zwierzę': 'zwierzęcia',
                    'dziewczę': 'dziewczęcia'
                });
            },

            testNounMasculineGenitivePlural: function () {
                this.checkFieldMulti('genitive.plural', {
                    'bank': 'banków',
                    'pociąg': 'pociągów',
                    'ptak': 'ptaków',
                    'koniec': 'końców',
                    'chłopiec': 'chłopców',
                    'pies': 'psów',
                    'syn': 'synów',
                    'zegarek': 'zegarków',
                    'ząb': 'zębów',
                    'stół': 'stołów',
                    'miesiąc': 'miesięcy',
                    'tysiąc': 'tysięcy',
                    'pieniądz': 'pieniędzy',
                    'samochód': 'samochodów',
                    'klucz': 'kluczy',
                    'kapelusz': 'kapeluszy',
                    'talerz': 'talerzy',
                    'grosz': 'groszy',
                    'lekarz': 'lekarzy',
                    'nóż': 'noży',
                    'garaż': 'garaży',
                    'płaszcz': 'płaszczy',
                    'kosz': 'koszy',
                    'hotel': 'hoteli',
                    'parasol': 'parasoli',
                    'pokój': 'pokoi',
                    'nauczyciel': 'nauczycieli',
                    'koń': 'koni',
                    'łabędź': 'łabędzi',
                    'liść': 'liści',
                    'gość': 'gości',
                    'ogień': 'ogni',
                    'tydzień': 'tygodni',

                    // exception:
                    'kraj': 'krajów'
                });
            },

            testNounFeminineGenitivePlural: function () {
                this.checkFieldMulti('genitive.plural', {
                    'gwiazda': 'gwiazd',
                    'ulica': 'ulic',
                    'żona': 'żon',
                    'orkiestra': 'orkiestr',
                    'kobieta': 'kobiet',
                    'chwila': 'chwil',
                    'aleja': 'alei',
                    'nadzieja': 'nadziei',

                    'droga': 'dróg',
                    'głowa': 'głów',
                    'szkoła': 'szkół',
                    'siostra': 'sióstr',
                    'ręka': 'rąk',

                    'córka': 'córek',
                    'cegła': 'cegieł',
                    'łza': 'łez',
                    'gospodyni': 'gospodyń',
                    'ziemia': 'ziem',
                    'ciocia': 'cioć',
                    'babcia': 'babć',
                    
                    'noc': 'nocy',
                    'twarz': 'twarzy',
                    'rzecz': 'rzeczy',
                    'mysz': 'myszy',
                    'podróż': 'podróży',
                    'kuchnia': 'kuchni',
                    'poezja': 'poezji'
                });
            },

            testNounNeuterGenitivePlural: function () {
                this.checkFieldMulti('genitive.plural', {
                    'drzewo': 'drzew',
                    'pióro': 'piór',
                    'jezioro': 'jezior',
                    'miasto': 'miast',
                    'serce': 'serc',
                    'lato': 'lat',

                    'morze': 'mórz',
                    'słowo': 'słów',
                    'święto': 'świąt',
                    'okno': 'okien',
                    'jabłko': 'jabłek',
                    'piętro': 'pięter',
                    'krzesło': 'krzeseł',
                    'dziecko': 'dzieci',

                    'zdjęcie': 'zdjęć',
                    'mieszkanie': 'mieszkań',
                    'śniadanie': 'śniadań',
                    
                    'imię': 'imion',
                    'ramię': 'ramion',

                    'jagnię': 'jagniąt',
                    'źrebię': 'źrebiąt',
                    'prosię': 'prosiąt',
                    'dziewczę': 'dziewcząt',
                    'zwierzę': 'zwierząt',
                    'książę': 'książąt',

                    'narzędzie': 'narzędzi',
                    'wybrzeże': 'wybrzeży',

                    'muzeum': 'muzeów',
                    'gimnazjum': 'gimnazjów'
                });
            },

            testAdjectiveGenitiveSingularFeminine: function () {
                this.checkFieldMulti('genitive.singular.feminine', {
                    'dobry': 'dobrej',
                    'polski': 'polskiej',
                    'ostatni': 'ostatniej'
                });
            },

            testAdjectiveGenitiveSingularMasculine: function () {
                this.checkFieldMulti('genitive.singular.masculine', {
                    'dobry': 'dobrego',
                    'polski': 'polskiego',
                    'ostatni': 'ostatniego'
                });
            },

            testAdjectiveGenitivePlural: function () {
                this.checkFieldMulti('genitive.plural', {
                    'dobry': 'dobrych',
                    'polski': 'polskich',
                    'ostatni': 'ostatnich'
                });
            },

            testNounMasculineDativeSingular: function () {
                this.checkFieldMulti('dative.singular', {
                    'Polak': 'Polakowi',
                    'sąsiad': 'sąsiadowi',
                    'mąż': 'mężowi',
                    'koń': 'koniowi',
                    'gość': 'gościowi',
                    
                    'brat': 'bratu',
                    'świat': 'światu',
                    'kot': 'kotu',
                    'ojciec': 'ojcu',
                    'chłopiec': 'chłopcu',
                    'pies': 'psu',
                    'Bóg': 'Bogu',
                    //'ksiądz': 'księdzu',

                    'kierowca': 'kierowcy',
                    'kolega': 'koledze',
                    'kaleka': 'kalece',
                    'poeta': 'poecie',
                    'dentysta': 'dentyście',
                    'mężczyzna': 'mężczyźnie'
                });
            },

            testNounFeminineDativeSingular: function () {
                this.checkFieldMulti('dative.singular', {
                    'szkoła': 'szkole',
                    'sosna': 'sośnie',
                    'kobieta': 'kobiecie',
                    'kapusta': 'kapuście',
                    'lista': 'liście',
                    'gwiazda': 'gwiaździe',
                    'bielizna': 'bieliźnie',
                    'ojczyzna': 'ojczyźnie',
                    'siostra': 'siostrze',
                    'Polska': 'Polsce',
                    'droga': 'drodze',
                    'podłoga': 'podłodze',
                    'mucha': 'musze',
                    'osoba': 'osobie',
                    'prasa': 'prasie',
                    'mama': 'mamie',
                    'koza': 'kozie',
                    'Europa': 'Europie',
                    'babcia': 'babci',
                    'tęcza': 'tęczy',
                    'noc': 'nocy'
                });
            },

            testNounNeuterDativeSingular: function () {
                this.checkFieldMulti('dative.singular', {
                    'dziecko': 'dziecku',
                    'pole': 'polu',
                    'życie': 'życiu',
                    'imię': 'imieniu',
                    'ramię': 'ramieniu',
                    'jagnię': 'jagnięciu',
                    'źrebię': 'źrebięciu',
                    'prosię': 'prosięciu',
                    'zwierzę': 'zwierzęciu',
                    'dziewczę': 'dziewczęciu',
                    'niemowlę': 'niemowlęciu'
                });
            },

            testAdjectiveDativeSingularFeminine: function () {
                this.checkFieldMulti('dative.singular.feminine', {
                    'dobry': 'dobrej',
                    'polski': 'polskiej',
                    'ostatni': 'ostatniej'
                });
            },

            testAdjectiveDativeSingularMasculine: function () {
                this.checkFieldMulti('dative.singular.masculine', {
                    'dobry': 'dobremu',
                    'polski': 'polskiemu',
                    'ostatni': 'ostatniemu'
                });
            },

            testNounDativePlural: function () {
                this.checkFieldMulti('dative.plural', {
                    'ojciec': 'ojcom',
                    'kolega': 'kolegom',
                    'mąż': 'mężom',
                    'okno': 'oknom',
                    'wuj': 'wujom',
                    'matka': 'matkom',
                    'muzeum': 'muzeom',
                    'koń': 'koniom',
                    'uczeń': 'uczniom',
                    'gałąź': 'gałęziom',
                    'gość': 'gościom',
                    'łódź': 'łodziom',
                    'pieśń': 'pieśniom',
                    'dzień': 'dniom',
                    'zdjęcie': 'zdjęciom',
                    'kuchnia': 'kuchniom',
                    'imię': 'imionom',
                    'ramię': 'ramionom',
                    'zwierzę': 'zwierzętom',
                    'jagnię': 'jagniętom',
                    'źrebię': 'źrebiętom',
                    'prosię': 'prosiętom',
                    'dziewczę': 'dziewczętom',
                    'kurczę': 'kurczętom'
                });
            },

            testAdjectiveDativePlural: function () {
                this.checkFieldMulti('dative.plural', {
                    'dobry': 'dobrym',
                    'polski': 'polskim',
                    'ostatni': 'ostatnim'
                });
            },

            testNounMasculineInstrumentalSingular: function () {
                this.checkFieldMulti('instrumental.singular', {
                    'syn': 'synem',
                    'brat': 'bratem',
                    'chłopiec': 'chłopcem',
                    'mąż': 'mężem',
                    'pies': 'psem',
                    'pokój': 'pokojem',
                    'las': 'lasem',
                    'ojciec': 'ojcem',
                    'Bóg': 'Bogiem',
                    'pociąg': 'pociągiem',
                    'Polak': 'Polakiem',
                    'Anglik': 'Anglikiem',
                    'koń': 'koniem',
                    'gość': 'gościem',
                    'uczeń': 'uczniem',
                    'gwóźdź': 'gwoździem',
                    'dzień': 'dniem',
                    'tydzień': 'tygodniem',
                    'kolega': 'kolegą',
                    'mężczyzna': 'mężczyzną'
                });
            },

            testNounFeminineInstrumentalSingular: function () {
                this.checkFieldMulti('instrumental.singular', {
                    'matka': 'matką',
                    'lekcja': 'lekcją',
                    'droga': 'drogą',
                    'Polska': 'Polską',
                    'sól': 'solą',
                    'twarz': 'twarzą',
                    'podróż': 'podróżą',
                    'kolej': 'koleją',
                    'rzecz': 'rzeczą',
                    'mysz': 'myszą',
                    'noc': 'nocą',
                    'gospodyni': 'gospodynią',
                    'nić': 'nicią',
                    'część': 'częścią',
                    'gałąź': 'gałęzią',
                    'pieśń': 'pieśnią',
                    'jesień': 'jesienią',
                    'wieś': 'wsią'
                });
            },

            testNounNeuterInstrumentalSingular: function () {
                this.checkFieldMulti('instrumental.singular', {
                    'pióro': 'piórem',
                    'krzesło': 'krzesłem',
                    'morze': 'morzem',
                    'zboże': 'zbożem',
                    'słońce': 'słońcem',
                    'miasto': 'miastem',
                    'życie': 'życiem',
                    'zdjęcie': 'zdjęciem',
                    'jabłko': 'jabłkiem',
                    'dziecko': 'dzieckiem',
                    'imię': 'imieniem',
                    'ramię': 'ramieniem',
                    'źrebię': 'źrebięciem',
                    'prosię': 'prosięciem',
                    'jagnię': 'jagnięciem',
                    'zwierzę': 'zwierzęciem',
                    'dziewczę': 'dziewczęciem'
                });
            },

            testAdjectiveInstrumentalSingularFeminine: function () {
                this.checkFieldMulti('instrumental.singular.feminine', {
                    'dobry': 'dobrą',
                    'polski': 'polską',
                    'ostatni': 'ostatnią'
                });
            },

            testAdjectiveInstrumentalSingularMasculine: function () {
                this.checkFieldMulti('instrumental.singular.masculine', {
                    'dobry': 'dobrym',
                    'polski': 'polskim',
                    'ostatni': 'ostatnim'
                });
            },

            testNounInstrumentalPlural: function () {
                this.checkFieldMulti('instrumental.plural', {
                    // regular, hard
                    'syn': 'synami',
                    'ojciec': 'ojcami',
                    'pies': 'psami',
                    'stół': 'stołami',
                    'lekcja': 'lekcjami',
                    'kolega': 'kolegami',
                    'noc': 'nocami',
                    'córka': 'córkami',
                    'święto': 'świętami',
                    'mąż': 'mężami',
                    'muzeum': 'muzeami',

                    // regular, soft
                    'babcia': 'babciami',
                    'zdjęcie': 'zdjęciami',
                    'wieś': 'wsiami',
                    'pieśń': 'pieśniami',
                    'gałąź': 'gałęziami',
                    'uczeń': 'uczniami',
                    'gwóźdź': 'gwoździami',
                    'tydzień': 'tygodniami',

                    // irregular, hard
                    'brat': 'braćmi',
                    //'ksiądz': 'księdżmi',
                    'pieniądz': 'pieniędzmi',
                    'dziecko': 'dziećmi',
                    'przyjaciel': 'przyjaciółmi',

                    // irregular, soft
                    'gość': 'gośćmi',
                    'kość': 'kośćmi',
                    'liść': 'liśćmi',
                    'nić': 'nićmi',
                    'dłoń': 'dłońmi',
                    'koń': 'końmi',

                    // neuters, yo!
                    'imię': 'imionami',
                    'ramię': 'ramionami',
                    'źrebię': 'źrebiętami',
                    'prosię': 'prosiętami',
                    'jagnię': 'jagniętami',
                    'zwierzę': 'zwierzętami',
                    'dziewczę': 'dziewczętami'
                });
            },

            testAdjectiveInstrumentalPlural: function () {
                this.checkFieldMulti('instrumental.plural', {
                    'dobry': 'dobrymi',
                    'polski': 'polskimi',
                    'ostatni': 'ostatnimi'
                });
            },

            testNounMasculineLocativeSingular: function () {
                this.checkFieldMulti('locative.singular', {
                    'dach': 'dachu',
                    'hotel': 'hotelu',
                    'dziadek': 'dziadku',
                    'Polak': 'Polaku',
                    'Bóg': 'Bogu',
                    'szpital': 'szpitalu',
                    'pokój': 'pokoju',
                    'kraj': 'kraju',
                    'ojciec': 'ojcu',
                    'marzec': 'marcu',
                    'chłopiec': 'chłopcu',
                    'klucz': 'kluczu',
                    'talerz': 'talerzu',
                    'kapelusz': 'kapeluszu',
                    'nóż': 'nożu',
                    'garaż': 'garażu',
                    'cmentarz': 'cmentarzu',
                    'kierowca': 'kierowcy',
                    'sprzedawca': 'sprzedawcy',
                    'stół': 'stole',
                    'pomysł': 'pomyśle',
                    'brat': 'bracie',
                    'wykład': 'wykładzie',
                    'kaleka': 'kalece',
                    'kolega': 'koledze',
                    'Rzym': 'Rzymie',
                    'szef': 'szefie',
                    'wóz': 'wozie'
                });
            },

            testNounFeminineLocativeSingular: function () {
                this.checkFieldMulti('locative.singular', {
                    'szkoła': 'szkole',
                    'sosna': 'sośnie',
                    'kobieta': 'kobiecie',
                    'kapusta': 'kapuście',
                    'gwiazda': 'gwiaździe',
                    'ojczyzna': 'ojczyźnie',
                    'siostra': 'siostrze',
                    'podłoga': 'podłodze',
                    'pończocha': 'pończosze',
                    'osoba': 'osobie',
                    'Europa': 'Europie'
                });
            },

            testNounNeuterLocativeSingular: function () {
                this.checkFieldMulti('locative.singular', {
                    'jabłko': 'jabłku',
                    'ucho': 'uchu',
                    'jajko': 'jajku',
                    'wojsko': 'wojsku',
                    'echo': 'echu',
                    'pole': 'polu',
                    'serce': 'sercu',
                    'słońce': 'słońcu',
                    'życie': 'życiu',
                    'morze': 'morzu',
                    'zdjęcie': 'zdjęciu',
                    'imię': 'imieniu',
                    'ramię': 'ramieniu',
                    'jagnię': 'jagnięciu',
                    'źrebię': 'źrebięciu',
                    'prosię': 'prosięciu',
                    'zwierzę': 'zwierzęciu',
                    'dziewczę': 'dziewczęciu',
                    'niemowlę': 'niemowlęciu',
                    'mydło': 'mydle',
                    'krzesło': 'krześle',
                    'złoto': 'złocie',
                    'miasto': 'mieście',
                    'stado': 'stadzie',
                    'gniazdo': 'gnieździe',
                    'pióro': 'piórze',
                    'pismo': 'piśmie',
                    'mięso': 'mięsie'
                });
            },

            testNounLocativePlural: function () {
                this.checkFieldMulti('locative.plural', {
                    'pies': 'psach',
                    'muzeum': 'muzeach',
                    'pokój': 'pokojach',
                    'matka': 'matkach',
                    'Polak': 'Polakach',
                    'jabłko': 'jabłkach',
                    'lekcja': 'lekcjach',
                    'święto': 'świętach',
                    'oko': 'oczach',
                    'wieś': 'wsiach',
                    'gość': 'gościach',
                    'liść': 'liściach',
                    'koń': 'koniach',
                    'pieśń': 'pieśniach',
                    'gałąź': 'gałęziach',
                    'ciocia': 'ciociach',
                    'imię': 'imionach',
                    'ramię': 'ramionach',
                    'jagnię': 'jagniętach',
                    'źrebię': 'źrebiętach',
                    'prosię': 'prosiętach',
                    'zwierzę': 'zwierzętach',
                    'dziewczę': 'dziewczętach'
                });
            },

            testAdjectiveLocativeSingularMasculine: function () {
               this.checkFieldMulti('locative.singular.masculine', {
                  'dobry': 'dobrym',
                  'polski': 'polskim',
                  'ostatni': 'ostatnim'
               });

            },

            testAdjectiveLocativeSingularFeminine: function () {
               this.checkFieldMulti('locative.singular.feminine', {
                  'dobry': 'dobrej',
                  'polski': 'polskiej',
                  'ostatni': 'ostatniej'
               });
            },

            testAdjectiveLocativePlural: function () {
               this.checkFieldMulti('locative.plural', {
                  'dobry': 'dobrych',
                  'polski': 'polskich',
                  'ostatni': 'ostatnich'
               });
            }
        }).run();
    }
);

