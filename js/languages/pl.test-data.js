
/*
 * Test data for Polish
 */

require.def('lingwo_dictionary/js/languages/pl.test-data',
    ['lingwo_dictionary/js/languages/common/Entry',
     'lingwo_dictionary/js/languages/pl',
    ],
    function (Entry, pl) {
        entries = {};

        entries["jaki"] = new Entry({
            "language": pl,
            "headword": "jaki",
            "pos": "question",
            "like": "adjective"
        });

        entries["stół"] = new Entry({
            "language": pl,
            "headword": "stół",
            "pos": "noun",
            "fields": {
                "*stem": "stoł"
            }
        });

        entries["kot"] = new Entry({
            "language": pl,
            "headword": "kot",
            "pos": "noun",
            "fields": {
                "animate": true,
                "dative.singular": "kotu"
            }
        });

        entries["pokój"] = new Entry({
            "language": pl,
            "headword": "pokój",
            "pos": "noun",
            "fields": {
                "*stem": "pokoj"
            }
        });

        entries["chłopiec"] = new Entry({
            "language": pl,
            "headword": "chłopiec",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,

                "*stem": "chłopc",
                "dative.singular": "chłopcu"
            }
        });

        entries["kolega"] = new Entry({
            "language": pl,
            "headword": "kolega",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "gender": "masculine"
            }
        });

        entries["dentysta"] = new Entry({
            "language": pl,
            "headword": "dentysta",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "gender": "masculine"
            }
        });

        entries["mężczyzna"] = new Entry({
            "language": pl,
            "headword": "mężczyzna",
            "pos": "noun",
            "fields": {
                "gender": "masculine",
                "animate": true,
                "virile": true,
                "genitive.plural": "mężczyzn"
            }
        });

        entries["kobieta"] = new Entry({
            "language": pl,
            "headword": "kobieta",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["ulica"] = new Entry({
            "language": pl,
            "headword": "ulica",
            "pos": "noun"
        });

        entries["Polska"] = new Entry({
            "language": pl,
            "headword": "Polska",
            "pos": "noun"
        });

        entries["gospodyni"] = new Entry({
            "language": pl,
            "headword": "gospodyni",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["noc"] = new Entry({
            "language": pl,
            "headword": "noc",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["część"] = new Entry({
            "language": pl,
            "headword": "część",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["jesień"] = new Entry({
            "language": pl,
            "headword": "jesień",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["wieś"] = new Entry({
            "language": pl,
            "headword": "wieś",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "*stem": "wś"
            }
        });

        entries["mysz"] = new Entry({
            "language": pl,
            "headword": "mysz",
            "pos": "noun",
            "fields": {
                "animate": true,
                "gender": "feminine"
            }
        });

        entries["miłość"] = new Entry({
            "language": pl,
            "headword": "miłość",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["ciekawość"] = new Entry({
            "language": pl,
            "headword": "ciekawość",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["okno"] = new Entry({
            "language": pl,
            "headword": "okno",
            "pos": "noun"
        });

        entries["dziecko"] = new Entry({
            "language": pl,
            "headword": "dziecko",
            "pos": "noun",
            "fields": {
                "animate": true,
                "genitive.plural": "dzieci",
                "instrumental.plural": "dziećmi",
                "nominative.plural": "dzieci"
            }
        });

        entries["życie"] = new Entry({
            "language": pl,
            "headword": "życie",
            "pos": "noun"
        });

        entries["morze"] = new Entry({
            "language": pl,
            "headword": "morze",
            "pos": "noun",
            "fields": {
                "genitive.plural": "mórz"
            }
        });

        entries["imię"] = new Entry({
            "language": pl,
            "headword": "imię",
            "pos": "noun"
        });

        entries["szczenię"] = new Entry({
            "language": pl,
            "headword": "szczenię",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["zwierzę"] = new Entry({
            "language": pl,
            "headword": "zwierzę",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["niemowlę"] = new Entry({
            "language": pl,
            "headword": "niemowlę",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["muzeum"] = new Entry({
            "language": pl,
            "headword": "muzeum",
            "pos": "noun"
        });

        entries["gimnazjum"] = new Entry({
            "language": pl,
            "headword": "gimnazjum",
            "pos": "noun"
        });

        entries["duży"] = new Entry({
            "language": pl,
            "headword": "duży",
            "pos": "adjective"
        });

        entries["mały"] = new Entry({
            "language": pl,
            "headword": "mały",
            "pos": "adjective"
        });

        entries["dobry"] = new Entry({
            "language": pl,
            "headword": "dobry",
            "pos": "adjective"
        });

        entries["zły"] = new Entry({
            "language": pl,
            "headword": "zły",
            "pos": "adjective"
        });

        entries["wysoki"] = new Entry({
            "language": pl,
            "headword": "wysoki",
            "pos": "adjective"
        });

        entries["niski"] = new Entry({
            "language": pl,
            "headword": "niski",
            "pos": "adjective"
        });

        entries["polski"] = new Entry({
            "language": pl,
            "headword": "polski",
            "pos": "adjective"
        });

        entries["długi"] = new Entry({
            "language": pl,
            "headword": "długi",
            "pos": "adjective"
        });

        entries["drogi"] = new Entry({
            "language": pl,
            "headword": "drogi",
            "pos": "adjective"
        });

        entries["drugi"] = new Entry({
            "language": pl,
            "headword": "drugi",
            "pos": "adjective"
        });

        entries["głupi"] = new Entry({
            "language": pl,
            "headword": "głupi",
            "pos": "adjective"
        });

        entries["tani"] = new Entry({
            "language": pl,
            "headword": "tani",
            "pos": "adjective"
        });

        entries["trzeci"] = new Entry({
            "language": pl,
            "headword": "trzeci",
            "pos": "adjective"
        });

        entries["ostatni"] = new Entry({
            "language": pl,
            "headword": "ostatni",
            "pos": "adjective"
        });

        entries["średni"] = new Entry({
            "language": pl,
            "headword": "średni",
            "pos": "adjective"
        });

        entries["być"] = new Entry({
            "language": pl,
            "headword": "być",
            "pos": "verb",
            "fields": {
                "nonpast.singular.1p": "jestem",
                "nonpast.singular.2p": "jesteś",
                "nonpast.plural.1p": "jesteśmy",
                "nonpast.singular.3p": "jest",
                "nonpast.plural.3p": "są",
                "nonpast.plural.2p": "jesteście"
            }
        });

        entries["dom"] = new Entry({
            "language": pl,
            "headword": "dom",
            "pos": "noun"
        });

        entries["sklep"] = new Entry({
            "language": pl,
            "headword": "sklep",
            "pos": "noun"
        });

        entries["ząb"] = new Entry({
            "language": pl,
            "headword": "ząb",
            "pos": "noun",
            "fields": {
                "*stem": "zęb",
                "genitive.singular": "zęba"
            }
        });

        entries["kościół"] = new Entry({
            "language": pl,
            "headword": "kościół",
            "pos": "noun",
            "fields": {
                "*stem": "kościoł",
                "genitive.singular": "kościoła"
            }
        });

        entries["samochód"] = new Entry({
            "language": pl,
            "headword": "samochód",
            "pos": "noun",
            "fields": {
                "*stem": "samochod"
            }
        });

        entries["dzwonek"] = new Entry({
            "language": pl,
            "headword": "dzwonek",
            "pos": "noun",
            "fields": {
                "nominative.plural": "dzwonki"
            }
        });

        entries["róg"] = new Entry({
            "language": pl,
            "headword": "róg",
            "pos": "noun",
            "fields": {
                "nominative.plural": "rogi"
            }
        });

        entries["bank"] = new Entry({
            "language": pl,
            "headword": "bank",
            "pos": "noun"
        });

        entries["ptak"] = new Entry({
            "language": pl,
            "headword": "ptak",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["pociąg"] = new Entry({
            "language": pl,
            "headword": "pociąg",
            "pos": "noun"
        });

        entries["kraj"] = new Entry({
            "language": pl,
            "headword": "kraj",
            "pos": "noun",
            "fields": {
                "genitive.plural": "krajów"
            }
        });

        entries["parasol"] = new Entry({
            "language": pl,
            "headword": "parasol",
            "pos": "noun"
        });

        entries["hotel"] = new Entry({
            "language": pl,
            "headword": "hotel",
            "pos": "noun"
        });

        entries["szpital"] = new Entry({
            "language": pl,
            "headword": "szpital",
            "pos": "noun"
        });

        entries["pałac"] = new Entry({
            "language": pl,
            "headword": "pałac",
            "pos": "noun"
        });

        entries["tysiąc"] = new Entry({
            "language": pl,
            "headword": "tysiąc",
            "pos": "noun",
            "fields": {
                "genitive.plural": "tysięcy"
            }
        });

        entries["pieniądz"] = new Entry({
            "language": pl,
            "headword": "pieniądz",
            "pos": "noun",
            "fields": {
                "genitive.plural": "pieniędzy",
                "instrumental.plural": "pieniędzmi"
            }
        });

        entries["grosz"] = new Entry({
            "language": pl,
            "headword": "grosz",
            "pos": "noun"
        });

        entries["miesiąc"] = new Entry({
            "language": pl,
            "headword": "miesiąc",
            "pos": "noun",
            "fields": {
                "genitive.plural": "miesięcy",
                "genitive.singular": "miesiąca"
            }
        });

        entries["talerz"] = new Entry({
            "language": pl,
            "headword": "talerz",
            "pos": "noun"
        });

        entries["klucz"] = new Entry({
            "language": pl,
            "headword": "klucz",
            "pos": "noun"
        });

        entries["nóż"] = new Entry({
            "language": pl,
            "headword": "nóż",
            "pos": "noun",
            "fields": {
                "genitive.plural": "noży",
                "locative.singular": "nożu",
                "genitive.singular": "noża",
                "nominative.plural": "noże"
            }
        });

        entries["koń"] = new Entry({
            "language": pl,
            "headword": "koń",
            "pos": "noun",
            "fields": {
                "animate": true,
                "instrumental.plural": "końmi"
            }
        });

        entries["liść"] = new Entry({
            "language": pl,
            "headword": "liść",
            "pos": "noun",
            "fields": {
                "instrumental.plural": "liśćmi"
            }
        });

        entries["niedźwiedź"] = new Entry({
            "language": pl,
            "headword": "niedźwiedź",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["ogień"] = new Entry({
            "language": pl,
            "headword": "ogień",
            "pos": "noun",
            "fields": {
                "*stem": "ogń"
            }
        });

        entries["tydzień"] = new Entry({
            "language": pl,
            "headword": "tydzień",
            "pos": "noun",
            "fields": {
                "*stem": "tygodń"
            }
        });

        entries["gołąb"] = new Entry({
            "language": pl,
            "headword": "gołąb",
            "pos": "noun",
            "fields": {
                "animate": true,
                "nominative.plural": "gołębie"
            }
        });

        entries["karp"] = new Entry({
            "language": pl,
            "headword": "karp",
            "pos": "noun",
            "fields": {
                "nominative.plural": "karpie"
            }
        });

        entries["szkoła"] = new Entry({
            "language": pl,
            "headword": "szkoła",
            "pos": "noun",
            "fields": {
                "genitive.plural": "szkół"
            }
        });

        entries["ryba"] = new Entry({
            "language": pl,
            "headword": "ryba",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["gwiazda"] = new Entry({
            "language": pl,
            "headword": "gwiazda",
            "pos": "noun"
        });

        entries["siostra"] = new Entry({
            "language": pl,
            "headword": "siostra",
            "pos": "noun",
            "fields": {
                "animate": true,
                "genitive.plural": "sióstr"
            }
        });

        entries["kiełbasa"] = new Entry({
            "language": pl,
            "headword": "kiełbasa",
            "pos": "noun"
        });

        entries["rzecz"] = new Entry({
            "language": pl,
            "headword": "rzecz",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["matka"] = new Entry({
            "language": pl,
            "headword": "matka",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["córka"] = new Entry({
            "language": pl,
            "headword": "córka",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["Polka"] = new Entry({
            "language": pl,
            "headword": "Polka",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["figa"] = new Entry({
            "language": pl,
            "headword": "figa",
            "pos": "noun"
        });

        entries["droga"] = new Entry({
            "language": pl,
            "headword": "droga",
            "pos": "noun",
            "fields": {
                "genitive.plural": "dróg"
            }
        });

        entries["ręka"] = new Entry({
            "language": pl,
            "headword": "ręka",
            "pos": "noun",
            "fields": {
                "genitive.plural": "rąk",
                "nominative.plural": "ręce"
            }
        });

        entries["lekcja"] = new Entry({
            "language": pl,
            "headword": "lekcja",
            "pos": "noun"
        });

        entries["kolej"] = new Entry({
            "language": pl,
            "headword": "kolej",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["kąpiel"] = new Entry({
            "language": pl,
            "headword": "kąpiel",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["chwila"] = new Entry({
            "language": pl,
            "headword": "chwila",
            "pos": "noun"
        });

        entries["aleja"] = new Entry({
            "language": pl,
            "headword": "aleja",
            "pos": "noun"
        });

        entries["sala"] = new Entry({
            "language": pl,
            "headword": "sala",
            "pos": "noun"
        });

        entries["babcia"] = new Entry({
            "language": pl,
            "headword": "babcia",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["kuchnia"] = new Entry({
            "language": pl,
            "headword": "kuchnia",
            "pos": "noun"
        });

        entries["historia"] = new Entry({
            "language": pl,
            "headword": "historia",
            "pos": "noun"
        });

        entries["tęcza"] = new Entry({
            "language": pl,
            "headword": "tęcza",
            "pos": "noun"
        });

        entries["burza"] = new Entry({
            "language": pl,
            "headword": "burza",
            "pos": "noun"
        });

        entries["wieża"] = new Entry({
            "language": pl,
            "headword": "wieża",
            "pos": "noun"
        });

        entries["podróż"] = new Entry({
            "language": pl,
            "headword": "podróż",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["owca"] = new Entry({
            "language": pl,
            "headword": "owca",
            "pos": "noun"
        });

        entries["róża"] = new Entry({
            "language": pl,
            "headword": "róża",
            "pos": "noun"
        });

        entries["grusza"] = new Entry({
            "language": pl,
            "headword": "grusza",
            "pos": "noun"
        });

        entries["miłość"] = new Entry({
            "language": pl,
            "headword": "miłość",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["opowieść"] = new Entry({
            "language": pl,
            "headword": "opowieść",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "nominative.plural": "opowieści"
            }
        });

        entries["nić"] = new Entry({
            "language": pl,
            "headword": "nić",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "instrumental.plural": "nićmi",
                "nominative.plural": "nici"
            }
        });

        entries["pieśń"] = new Entry({
            "language": pl,
            "headword": "pieśń",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "nominative.plural": "pieśni"
            }
        });

        entries["przyjaźń"] = new Entry({
            "language": pl,
            "headword": "przyjaźń",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "nominative.plural": "przyjaźni"
            }
        });

        entries["jabłoń"] = new Entry({
            "language": pl,
            "headword": "jabłoń",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["łódź"] = new Entry({
            "language": pl,
            "headword": "łódź",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "*stem": "łodź"
            }
        });

        entries["gałąź"] = new Entry({
            "language": pl,
            "headword": "gałąź",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "*stem": "gałęź"
            }
        });

        entries["wieś"] = new Entry({
            "language": pl,
            "headword": "wieś",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "*stem": "wś"
            }
        });

        entries["jabłko"] = new Entry({
            "language": pl,
            "headword": "jabłko",
            "pos": "noun"
        });

        entries["krzesło"] = new Entry({
            "language": pl,
            "headword": "krzesło",
            "pos": "noun"
        });

        entries["zdjęcie"] = new Entry({
            "language": pl,
            "headword": "zdjęcie",
            "pos": "noun"
        });

        entries["pole"] = new Entry({
            "language": pl,
            "headword": "pole",
            "pos": "noun"
        });

        entries["ramię"] = new Entry({
            "language": pl,
            "headword": "ramię",
            "pos": "noun"
        });

        entries["jagnię"] = new Entry({
            "language": pl,
            "headword": "jagnię",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["prosię"] = new Entry({
            "language": pl,
            "headword": "prosię",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["kurczę"] = new Entry({
            "language": pl,
            "headword": "kurczę",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["dziewczę"] = new Entry({
            "language": pl,
            "headword": "dziewczę",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["młody"] = new Entry({
            "language": pl,
            "headword": "młody",
            "pos": "adjective"
        });

        entries["Polak"] = new Entry({
            "language": pl,
            "headword": "Polak",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["Chińczyk"] = new Entry({
            "language": pl,
            "headword": "Chińczyk",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["Anglik"] = new Entry({
            "language": pl,
            "headword": "Anglik",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["kaleka"] = new Entry({
            "language": pl,
            "headword": "kaleka",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "gender": "masculine",
                "genitive.plural": "kalek"
            }
        });

        entries["Norweg"] = new Entry({
            "language": pl,
            "headword": "Norweg",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["inżynier"] = new Entry({
            "language": pl,
            "headword": "inżynier",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["kelner"] = new Entry({
            "language": pl,
            "headword": "kelner",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["doktor"] = new Entry({
            "language": pl,
            "headword": "doktor",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["kierowca"] = new Entry({
            "language": pl,
            "headword": "kierowca",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "gender": "masculine"
            }
        });

        entries["sprzedawca"] = new Entry({
            "language": pl,
            "headword": "sprzedawca",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "gender": "masculine"
            }
        });

        entries["Niemiec"] = new Entry({
            "language": pl,
            "headword": "Niemiec",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "*stem": "Niemc"
            }
        });

        entries["mieszkaniec"] = new Entry({
            "language": pl,
            "headword": "mieszkaniec",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "*stem": "mieszkańc"
            }
        });

        entries["lekarz"] = new Entry({
            "language": pl,
            "headword": "lekarz",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["złodziej"] = new Entry({
            "language": pl,
            "headword": "złodziej",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["towarzysz"] = new Entry({
            "language": pl,
            "headword": "towarzysz",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["słuchacz"] = new Entry({
            "language": pl,
            "headword": "słuchacz",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["nauczyciel"] = new Entry({
            "language": pl,
            "headword": "nauczyciel",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["góral"] = new Entry({
            "language": pl,
            "headword": "góral",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["Francuz"] = new Entry({
            "language": pl,
            "headword": "Francuz",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["chłop"] = new Entry({
            "language": pl,
            "headword": "chłop",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["architekt"] = new Entry({
            "language": pl,
            "headword": "architekt",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["poeta"] = new Entry({
            "language": pl,
            "headword": "poeta",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "gender": "masculine"
            }
        });

        entries["specjalista"] = new Entry({
            "language": pl,
            "headword": "specjalista",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "gender": "masculine"
            }
        });

        entries["turysta"] = new Entry({
            "language": pl,
            "headword": "turysta",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "gender": "masculine"
            }
        });

        entries["Czech"] = new Entry({
            "language": pl,
            "headword": "Czech",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["Szwed"] = new Entry({
            "language": pl,
            "headword": "Szwed",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["student"] = new Entry({
            "language": pl,
            "headword": "student",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["Włoch"] = new Entry({
            "language": pl,
            "headword": "Włoch",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["sąsiad"] = new Entry({
            "language": pl,
            "headword": "sąsiad",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "nominative.plural": "sąsiedzi"
            }
        });

        entries["diabeł"] = new Entry({
            "language": pl,
            "headword": "diabeł",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "*stem": 'diabł'
            }
        });

        entries["syn"] = new Entry({
            "language": pl,
            "headword": "syn",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "nominative.plural": "synowie"
            }
        });

        entries["mąż"] = new Entry({
            "language": pl,
            "headword": "mąż",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "genitive.plural": "mężów",
                "*stem": "męż",
                "nominative.plural": "mężowie"
            }
        });

        entries["Belg"] = new Entry({
            "language": pl,
            "headword": "Belg",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "nominative.plural": "Belgowie"
            }
        });

        entries["professor"] = new Entry({
            "language": pl,
            "headword": "professor",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "nominative.plural": "professorowie"
            }
        });

        entries["uczeń"] = new Entry({
            "language": pl,
            "headword": "uczeń",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "*stem": "uczń",
                "nominative.plural": "uczniowie"
            }
        });

        entries["więzień"] = new Entry({
            "language": pl,
            "headword": "więzień",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "*stem": "więźń",
                "nominative.plural": "więźniowie"
            }
        });

        entries["brat"] = new Entry({
            "language": pl,
            "headword": "brat",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "genitive.plural": "braci",
                "dative.singular": "bratu",
                "instrumental.plural": "braćmi",
                "nominative.plural": "bracia"
            }
        });

        entries["Amerykanin"] = new Entry({
            "language": pl,
            "headword": "Amerykanin",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "*stem": "Amerykan",
                "nominative.plural": "Amerykanie"
            }
        });

        entries["Rosjanin"] = new Entry({
            "language": pl,
            "headword": "Rosjanin",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "nominative.plural": "Rosjanie"
            }
        });

        entries["brzydki"] = new Entry({
            "language": pl,
            "headword": "brzydki",
            "pos": "adjective"
        });

        entries["bliski"] = new Entry({
            "language": pl,
            "headword": "bliski",
            "pos": "adjective"
        });

        entries["ubogi"] = new Entry({
            "language": pl,
            "headword": "ubogi",
            "pos": "adjective"
        });

        entries["stary"] = new Entry({
            "language": pl,
            "headword": "stary",
            "pos": "adjective"
        });

        entries["były"] = new Entry({
            "language": pl,
            "headword": "były",
            "pos": "adjective"
        });

        entries["biedny"] = new Entry({
            "language": pl,
            "headword": "biedny",
            "pos": "adjective"
        });

        entries["zadowolony"] = new Entry({
            "language": pl,
            "headword": "zadowolony",
            "pos": "adjective"
        });

        entries["zmęczony"] = new Entry({
            "language": pl,
            "headword": "zmęczony",
            "pos": "adjective"
        });

        entries["pierwszy"] = new Entry({
            "language": pl,
            "headword": "pierwszy",
            "pos": "adjective"
        });

        entries["lepszy"] = new Entry({
            "language": pl,
            "headword": "lepszy",
            "pos": "adjective"
        });

        entries["gotowy"] = new Entry({
            "language": pl,
            "headword": "gotowy",
            "pos": "adjective"
        });

        entries["ciekawy"] = new Entry({
            "language": pl,
            "headword": "ciekawy",
            "pos": "adjective"
        });

        entries["bogaty"] = new Entry({
            "language": pl,
            "headword": "bogaty",
            "pos": "adjective"
        });

        entries["smutny"] = new Entry({
            "language": pl,
            "headword": "smutny",
            "pos": "adjective"
        });

        entries["miły"] = new Entry({
            "language": pl,
            "headword": "miły",
            "pos": "adjective"
        });

        entries["zajęty"] = new Entry({
            "language": pl,
            "headword": "zajęty",
            "pos": "adjective"
        });

        entries["twarz"] = new Entry({
            "language": pl,
            "headword": "twarz",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["piękny"] = new Entry({
            "language": pl,
            "headword": "piękny",
            "pos": "adjective"
        });

        entries["wierzyć"] = new Entry({
            "language": pl,
            "headword": "wierzyć",
            "pos": "verb"
        });

        entries["słyszeć"] = new Entry({
            "language": pl,
            "headword": "słyszeć",
            "pos": "verb"
        });

        entries["dzwonić"] = new Entry({
            "language": pl,
            "headword": "dzwonić",
            "pos": "verb"
        });

        entries["mieszkać"] = new Entry({
            "language": pl,
            "headword": "mieszkać",
            "pos": "verb"
        });

        entries["wiedzieć"] = new Entry({
            "language": pl,
            "headword": "wiedzieć",
            "pos": "verb",
            "fields": {
                "*stem": "wiej",
                "nonpast.plural.3p": "wiedzą"
            }
        });

        entries["dziękować"] = new Entry({
            "language": pl,
            "headword": "dziękować",
            "pos": "verb"
        });

        entries["obiecywać"] = new Entry({
            "language": pl,
            "headword": "obiecywać",
            "pos": "verb"
        });

        entries["oczekiwać"] = new Entry({
            "language": pl,
            "headword": "oczekiwać",
            "pos": "verb"
        });

        entries["dawać"] = new Entry({
            "language": pl,
            "headword": "dawać",
            "pos": "verb"
        });

        entries["nazywać"] = new Entry({
            "language": pl,
            "headword": "nazywać",
            "pos": "verb",
            "fields": {
                "conjugation": "third"
            }
        });

        entries["pies"] = new Entry({
            "language": pl,
            "headword": "pies",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "*stem": "ps",
                "dative.singular": "psu"
            }
        });

        entries["królik"] = new Entry({
            "language": pl,
            "headword": "królik",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["siostrzeniec"] = new Entry({
            "language": pl,
            "headword": "siostrzeniec",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "*stem": "siostrzeńc"
            }
        });

        entries["dziadek"] = new Entry({
            "language": pl,
            "headword": "dziadek",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "*stem": "dziadk"
            }
        });

        entries["szwagier"] = new Entry({
            "language": pl,
            "headword": "szwagier",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "*stem": "szwagr"
            }
        });

        entries["gość"] = new Entry({
            "language": pl,
            "headword": "gość",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "instrumental.plural": "gośćmi"
            }
        });

        entries["artysta"] = new Entry({
            "language": pl,
            "headword": "artysta",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "gender": "masculine"
            }
        });

        entries["ojciec"] = new Entry({
            "language": pl,
            "headword": "ojciec",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "*stem": "ojc",
                "dative.singular": "ojcu",
                "nominative.plural": "ojcowie"
            }
        });

        entries["listonosz"] = new Entry({
            "language": pl,
            "headword": "listonosz",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["żołnierz"] = new Entry({
            "language": pl,
            "headword": "żołnierz",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["obiad"] = new Entry({
            "language": pl,
            "headword": "obiad",
            "pos": "noun"
        });

        entries["wiatr"] = new Entry({
            "language": pl,
            "headword": "wiatr",
            "pos": "noun"
        });

        entries["kosz"] = new Entry({
            "language": pl,
            "headword": "kosz",
            "pos": "noun",
            "fields": {
                "genitive.singular": "kosza"
            }
        });

        entries["palec"] = new Entry({
            "language": pl,
            "headword": "palec",
            "pos": "noun",
            "fields": {
                "*stem": "palc",
                "genitive.singular": "palca"
            }
        });

        entries["kwiatek"] = new Entry({
            "language": pl,
            "headword": "kwiatek",
            "pos": "noun",
            "fields": {
                "*stem": "kwiatk",
                "genitive.singular": "kwiatka"
            }
        });

        entries["lampa"] = new Entry({
            "language": pl,
            "headword": "lampa",
            "pos": "noun"
        });

        entries["łza"] = new Entry({
            "language": pl,
            "headword": "łza",
            "pos": "noun"
        });

        entries["pamięć"] = new Entry({
            "language": pl,
            "headword": "pamięć",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["szyja"] = new Entry({
            "language": pl,
            "headword": "szyja",
            "pos": "noun"
        });

        entries["nadzieja"] = new Entry({
            "language": pl,
            "headword": "nadzieja",
            "pos": "noun"
        });

        entries["żmija"] = new Entry({
            "language": pl,
            "headword": "żmija",
            "pos": "noun"
        });

        entries["cebula"] = new Entry({
            "language": pl,
            "headword": "cebula",
            "pos": "noun"
        });

        entries["krew"] = new Entry({
            "language": pl,
            "headword": "krew",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "*stem": "krw"
            }
        });

        entries["chorągiew"] = new Entry({
            "language": pl,
            "headword": "chorągiew",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "*stem": "chorągw"
            }
        });

        entries["myśl"] = new Entry({
            "language": pl,
            "headword": "myśl",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["sól"] = new Entry({
            "language": pl,
            "headword": "sól",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "*stem": "sol"
            }
        });

        entries["idea"] = new Entry({
            "language": pl,
            "headword": "idea",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "genitive.singular": "idei"
            }
        });

        entries["statua"] = new Entry({
            "language": pl,
            "headword": "statua",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "genitive.singular": "statui"
            }
        });

        entries["melodia"] = new Entry({
            "language": pl,
            "headword": "melodia",
            "pos": "noun"
        });


        entries["Belgia"] = new Entry({
            "language": pl,
            "headword": "Belgia",
            "pos": "noun"
        });

        entries["Anglia"] = new Entry({
            "language": pl,
            "headword": "Anglia",
            "pos": "noun"
        });

        entries["sympatia"] = new Entry({
            "language": pl,
            "headword": "sympatia",
            "pos": "noun"
        });

        entries["telewizja"] = new Entry({
            "language": pl,
            "headword": "telewizja",
            "pos": "noun"
        });

        entries["poezja"] = new Entry({
            "language": pl,
            "headword": "poezja",
            "pos": "noun"
        });

        entries["Francja"] = new Entry({
            "language": pl,
            "headword": "Francja",
            "pos": "noun"
        });

        entries["stacja"] = new Entry({
            "language": pl,
            "headword": "stacja",
            "pos": "noun"
        });

        entries["Szkocja"] = new Entry({
            "language": pl,
            "headword": "Szkocja",
            "pos": "noun"
        });

        entries["procesja"] = new Entry({
            "language": pl,
            "headword": "procesja",
            "pos": "noun"
        });

        entries["źrebię"] = new Entry({
            "language": pl,
            "headword": "źrebię",
            "pos": "noun"
        });

        entries["mieszkanie"] = new Entry({
            "language": pl,
            "headword": "mieszkanie",
            "pos": "noun"
        });

        entries["koniec"] = new Entry({
            "language": pl,
            "headword": "koniec",
            "pos": "noun",
            "fields": {
                "*stem": "końc"
            }
        });

        entries["zegarek"] = new Entry({
            "language": pl,
            "headword": "zegarek",
            "pos": "noun",
            "fields": {
                "*stem": "zegark"
            }
        });

        entries["kapelusz"] = new Entry({
            "language": pl,
            "headword": "kapelusz",
            "pos": "noun"
        });

        entries["garaż"] = new Entry({
            "language": pl,
            "headword": "garaż",
            "pos": "noun"
        });

        entries["łabędź"] = new Entry({
            "language": pl,
            "headword": "łabędź",
            "pos": "noun"
        });

        entries["płaszcz"] = new Entry({
            "language": pl,
            "headword": "płaszcz",
            "pos": "noun"
        });

        entries["orkiestra"] = new Entry({
            "language": pl,
            "headword": "orkiestra",
            "pos": "noun"
        });

        entries["żona"] = new Entry({
            "language": pl,
            "headword": "żona",
            "pos": "noun"
        });

        entries["cegła"] = new Entry({
            "language": pl,
            "headword": "cegła",
            "pos": "noun"
        });

        entries["ziemia"] = new Entry({
            "language": pl,
            "headword": "ziemia",
            "pos": "noun"
        });

        entries["ciocia"] = new Entry({
            "language": pl,
            "headword": "ciocia",
            "pos": "noun"
        });

        entries["głowa"] = new Entry({
            "language": pl,
            "headword": "głowa",
            "pos": "noun",
            "fields": {
                "genitive.plural": "głów"
            }
        });

        entries["drzewo"] = new Entry({
            "language": pl,
            "headword": "drzewo",
            "pos": "noun"
        });

        entries["mieszkanie"] = new Entry({
            "language": pl,
            "headword": "mieszkanie",
            "pos": "noun"
        });

        entries["pióro"] = new Entry({
            "language": pl,
            "headword": "pióro",
            "pos": "noun"
        });

        entries["lato"] = new Entry({
            "language": pl,
            "headword": "lato",
            "pos": "noun"
        });

        entries["serce"] = new Entry({
            "language": pl,
            "headword": "serce",
            "pos": "noun"
        });

        entries["jezioro"] = new Entry({
            "language": pl,
            "headword": "jezioro",
            "pos": "noun"
        });

        entries["miasto"] = new Entry({
            "language": pl,
            "headword": "miasto",
            "pos": "noun",
            "fields": {
                "locative.singular": "mieście"
            }
        });

        entries["słowo"] = new Entry({
            "language": pl,
            "headword": "słowo",
            "pos": "noun",
            "fields": {
                "genitive.plural": "słów"
            }
        });

        entries["święto"] = new Entry({
            "language": pl,
            "headword": "święto",
            "pos": "noun",
            "fields": {
                "genitive.plural": "świąt"
            }
        });

        entries["piętro"] = new Entry({
            "language": pl,
            "headword": "piętro",
            "pos": "noun",
            "fields": {
                "genitive.plural": "pięter"
            }
        });

        entries["śniadanie"] = new Entry({
            "language": pl,
            "headword": "śniadanie",
            "pos": "noun"
        });

        entries["książę"] = new Entry({
            "language": pl,
            "headword": "książę",
            "pos": "noun"
        });

        entries["narzędzie"] = new Entry({
            "language": pl,
            "headword": "narzędzie",
            "pos": "noun",
            "fields": {
                "genitive.plural": "narzędzi"
            }
        });

        entries["wybrzeże"] = new Entry({
            "language": pl,
            "headword": "wybrzeże",
            "pos": "noun",
            "fields": {
                "genitive.plural": "wybrzeży"
            }
        });

        entries["świat"] = new Entry({
            "language": pl,
            "headword": "świat",
            "pos": "noun",
            "fields": {
                "dative.singular": "światu"
            }
        });

        entries["Bóg"] = new Entry({
            "language": pl,
            "headword": "Bóg",
            "pos": "noun",
            "fields": {
                "*stem": "Bog",
                "dative.singular": "Bogu"
            }
        });

        entries["sosna"] = new Entry({
            "language": pl,
            "headword": "sosna",
            "pos": "noun"
        });

        entries["kapusta"] = new Entry({
            "language": pl,
            "headword": "kapusta",
            "pos": "noun"
        });

        entries["lista"] = new Entry({
            "language": pl,
            "headword": "lista",
            "pos": "noun"
        });

        entries["bielizna"] = new Entry({
            "language": pl,
            "headword": "bielizna",
            "pos": "noun"
        });

        entries["ojczyzna"] = new Entry({
            "language": pl,
            "headword": "ojczyzna",
            "pos": "noun"
        });

        entries["podłoga"] = new Entry({
            "language": pl,
            "headword": "podłoga",
            "pos": "noun"
        });

        entries["mucha"] = new Entry({
            "language": pl,
            "headword": "mucha",
            "pos": "noun"
        });

        entries["osoba"] = new Entry({
            "language": pl,
            "headword": "osoba",
            "pos": "noun"
        });

        entries["prasa"] = new Entry({
            "language": pl,
            "headword": "prasa",
            "pos": "noun"
        });

        entries["mama"] = new Entry({
            "language": pl,
            "headword": "mama",
            "pos": "noun"
        });

        entries["koza"] = new Entry({
            "language": pl,
            "headword": "koza",
            "pos": "noun"
        });

        entries["Europa"] = new Entry({
            "language": pl,
            "headword": "Europa",
            "pos": "noun"
        });

        entries["dzień"] = new Entry({
            "language": pl,
            "headword": "dzień",
            "pos": "noun",
            "fields": {
                "*stem": "dń"
            }
        });

        entries["wuj"] = new Entry({
            "language": pl,
            "headword": "wuj",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "nominative.plural": "wujowie"
            }
        });

        entries["las"] = new Entry({
            "language": pl,
            "headword": "las",
            "pos": "noun"
        });

        entries["gwóźdź"] = new Entry({
            "language": pl,
            "headword": "gwóźdź",
            "pos": "noun",
            "fields": {
                "*stem": "gwoźdź"
            }
        });

        entries["słońce"] = new Entry({
            "language": pl,
            "headword": "słońce",
            "pos": "noun"
        });

        entries["zboże"] = new Entry({
            "language": pl,
            "headword": "zboże",
            "pos": "noun"
        });

        entries["przyjaciel"] = new Entry({
            "language": pl,
            "headword": "przyjaciel",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "genitive.plural": "przyjaciół",
                "instrumental.plural": "przyjaciółmi",
                "*stem.plural": "przyjaciół"
            }
        });

        entries["dłoń"] = new Entry({
            "language": pl,
            "headword": "dłoń",
            "pos": "noun",
            "fields": {
                "instrumental.plural": "dłońmi"
            }
        });

        entries["kość"] = new Entry({
            "language": pl,
            "headword": "kość",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "instrumental.plural": "kośćmi"
            }
        });

        entries["dach"] = new Entry({
            "language": pl,
            "headword": "dach",
            "pos": "noun"
        });

        entries["marzec"] = new Entry({
            "language": pl,
            "headword": "marzec",
            "pos": "noun",
            "fields": {
                "*stem": "marc"
            }
        });

        entries["cmentarz"] = new Entry({
            "language": pl,
            "headword": "cmentarz",
            "pos": "noun"
        });

        entries["pomysł"] = new Entry({
            "language": pl,
            "headword": "pomysł",
            "pos": "noun"
        });

        entries["wykład"] = new Entry({
            "language": pl,
            "headword": "wykład",
            "pos": "noun"
        });

        entries["wyjazd"] = new Entry({
            "language": pl,
            "headword": "wyjazd",
            "pos": "noun",
            "fields": {
                "*stem": "wyjezd"
            }
        });

        entries["Rzym"] = new Entry({
            "language": pl,
            "headword": "Rzym",
            "pos": "noun"
        });

        entries["szef"] = new Entry({
            "language": pl,
            "headword": "szef",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["wóz"] = new Entry({
            "language": pl,
            "headword": "wóz",
            "pos": "noun",
            "fields": {
                "*stem": "woz"
            }
        });

        entries["pończocha"] = new Entry({
            "language": pl,
            "headword": "pończocha",
            "pos": "noun"
        });

        entries["wojsko"] = new Entry({
            "language": pl,
            "headword": "wojsko",
            "pos": "noun"
        });

        entries["ucho"] = new Entry({
            "language": pl,
            "headword": "ucho",
            "pos": "noun"
        });

        entries["echo"] = new Entry({
            "language": pl,
            "headword": "echo",
            "pos": "noun"
        });

        entries["mydło"] = new Entry({
            "language": pl,
            "headword": "mydło",
            "pos": "noun"
        });

        entries["złoto"] = new Entry({
            "language": pl,
            "headword": "złoto",
            "pos": "noun"
        });

        entries["oko"] = new Entry({
            "language": pl,
            "headword": "oko",
            "pos": "noun",
            "fields": {
                "*stem.plural": "ocz"
            }
        });

        entries["stado"] = new Entry({
            "language": pl,
            "headword": "stado",
            "pos": "noun"
        });

        entries["gniazdo"] = new Entry({
            "language": pl,
            "headword": "gniazdo",
            "pos": "noun",
            "fields": {
                "*stem": "gniezd"
            }
        });

        entries["pismo"] = new Entry({
            "language": pl,
            "headword": "pismo",
            "pos": "noun"
        });

        entries["jajko"] = new Entry({
            "language": pl,
            "headword": "jajko",
            "pos": "noun"
        });

        entries["mięso"] = new Entry({
            "language": pl,
            "headword": "mięso",
            "pos": "noun"
        });

        return entries;
    }
);

