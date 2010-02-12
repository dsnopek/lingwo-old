
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
            "lang": pl,
            "name": "jaki",
            "pos": "question",
            "like": "adjective"
        });

        entries["stół"] = new Entry({
            "lang": pl,
            "name": "stół",
            "pos": "noun",
            "fields": {
                "*stem": "stoł"
            }
        });

        entries["kot"] = new Entry({
            "lang": pl,
            "name": "kot",
            "pos": "noun",
            "fields": {
                "animate": true,
                "dative.singular": "kotu"
            }
        });

        entries["pokój"] = new Entry({
            "lang": pl,
            "name": "pokój",
            "pos": "noun",
            "fields": {
                "*stem": "pokoj"
            }
        });

        entries["chłopiec"] = new Entry({
            "lang": pl,
            "name": "chłopiec",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,

                "*stem": "chłopc",
                "dative.singular": "chłopcu"
            }
        });

        entries["kolega"] = new Entry({
            "lang": pl,
            "name": "kolega",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "gender": "masculine"
            }
        });

        entries["dentysta"] = new Entry({
            "lang": pl,
            "name": "dentysta",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "gender": "masculine"
            }
        });

        entries["mężczyzna"] = new Entry({
            "lang": pl,
            "name": "mężczyzna",
            "pos": "noun",
            "fields": {
                "gender": "masculine",
                "animate": true,
                "virile": true,
                "genitive.plural": "mężczyzn"
            }
        });

        entries["kobieta"] = new Entry({
            "lang": pl,
            "name": "kobieta",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["ulica"] = new Entry({
            "lang": pl,
            "name": "ulica",
            "pos": "noun"
        });

        entries["Polska"] = new Entry({
            "lang": pl,
            "name": "Polska",
            "pos": "noun"
        });

        entries["gospodyni"] = new Entry({
            "lang": pl,
            "name": "gospodyni",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["noc"] = new Entry({
            "lang": pl,
            "name": "noc",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["część"] = new Entry({
            "lang": pl,
            "name": "część",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["jesień"] = new Entry({
            "lang": pl,
            "name": "jesień",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["wieś"] = new Entry({
            "lang": pl,
            "name": "wieś",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "*stem": "wś"
            }
        });

        entries["mysz"] = new Entry({
            "lang": pl,
            "name": "mysz",
            "pos": "noun",
            "fields": {
                "animate": true,
                "gender": "feminine"
            }
        });

        entries["miłość"] = new Entry({
            "lang": pl,
            "name": "miłość",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["ciekawość"] = new Entry({
            "lang": pl,
            "name": "ciekawość",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["okno"] = new Entry({
            "lang": pl,
            "name": "okno",
            "pos": "noun"
        });

        entries["dziecko"] = new Entry({
            "lang": pl,
            "name": "dziecko",
            "pos": "noun",
            "fields": {
                "animate": true,
                "genitive.plural": "dzieci",
                "instrumental.plural": "dziećmi",
                "nominative.plural": "dzieci"
            }
        });

        entries["życie"] = new Entry({
            "lang": pl,
            "name": "życie",
            "pos": "noun"
        });

        entries["morze"] = new Entry({
            "lang": pl,
            "name": "morze",
            "pos": "noun",
            "fields": {
                "genitive.plural": "mórz"
            }
        });

        entries["imię"] = new Entry({
            "lang": pl,
            "name": "imię",
            "pos": "noun"
        });

        entries["szczenię"] = new Entry({
            "lang": pl,
            "name": "szczenię",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["zwierzę"] = new Entry({
            "lang": pl,
            "name": "zwierzę",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["niemowlę"] = new Entry({
            "lang": pl,
            "name": "niemowlę",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["muzeum"] = new Entry({
            "lang": pl,
            "name": "muzeum",
            "pos": "noun"
        });

        entries["gimnazjum"] = new Entry({
            "lang": pl,
            "name": "gimnazjum",
            "pos": "noun"
        });

        entries["duży"] = new Entry({
            "lang": pl,
            "name": "duży",
            "pos": "adjective"
        });

        entries["mały"] = new Entry({
            "lang": pl,
            "name": "mały",
            "pos": "adjective"
        });

        entries["dobry"] = new Entry({
            "lang": pl,
            "name": "dobry",
            "pos": "adjective"
        });

        entries["zły"] = new Entry({
            "lang": pl,
            "name": "zły",
            "pos": "adjective"
        });

        entries["wysoki"] = new Entry({
            "lang": pl,
            "name": "wysoki",
            "pos": "adjective"
        });

        entries["niski"] = new Entry({
            "lang": pl,
            "name": "niski",
            "pos": "adjective"
        });

        entries["polski"] = new Entry({
            "lang": pl,
            "name": "polski",
            "pos": "adjective"
        });

        entries["długi"] = new Entry({
            "lang": pl,
            "name": "długi",
            "pos": "adjective"
        });

        entries["drogi"] = new Entry({
            "lang": pl,
            "name": "drogi",
            "pos": "adjective"
        });

        entries["drugi"] = new Entry({
            "lang": pl,
            "name": "drugi",
            "pos": "adjective"
        });

        entries["głupi"] = new Entry({
            "lang": pl,
            "name": "głupi",
            "pos": "adjective"
        });

        entries["tani"] = new Entry({
            "lang": pl,
            "name": "tani",
            "pos": "adjective"
        });

        entries["trzeci"] = new Entry({
            "lang": pl,
            "name": "trzeci",
            "pos": "adjective"
        });

        entries["ostatni"] = new Entry({
            "lang": pl,
            "name": "ostatni",
            "pos": "adjective"
        });

        entries["średni"] = new Entry({
            "lang": pl,
            "name": "średni",
            "pos": "adjective"
        });

        entries["być"] = new Entry({
            "lang": pl,
            "name": "być",
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
            "lang": pl,
            "name": "dom",
            "pos": "noun"
        });

        entries["sklep"] = new Entry({
            "lang": pl,
            "name": "sklep",
            "pos": "noun"
        });

        entries["ząb"] = new Entry({
            "lang": pl,
            "name": "ząb",
            "pos": "noun",
            "fields": {
                "*stem": "zęb",
                "genitive.singular": "zęba"
            }
        });

        entries["kościół"] = new Entry({
            "lang": pl,
            "name": "kościół",
            "pos": "noun",
            "fields": {
                "*stem": "kościoł",
                "genitive.singular": "kościoła"
            }
        });

        entries["samochód"] = new Entry({
            "lang": pl,
            "name": "samochód",
            "pos": "noun",
            "fields": {
                "*stem": "samochod"
            }
        });

        entries["dzwonek"] = new Entry({
            "lang": pl,
            "name": "dzwonek",
            "pos": "noun",
            "fields": {
                "nominative.plural": "dzwonki"
            }
        });

        entries["róg"] = new Entry({
            "lang": pl,
            "name": "róg",
            "pos": "noun",
            "fields": {
                "nominative.plural": "rogi"
            }
        });

        entries["bank"] = new Entry({
            "lang": pl,
            "name": "bank",
            "pos": "noun"
        });

        entries["ptak"] = new Entry({
            "lang": pl,
            "name": "ptak",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["pociąg"] = new Entry({
            "lang": pl,
            "name": "pociąg",
            "pos": "noun"
        });

        entries["kraj"] = new Entry({
            "lang": pl,
            "name": "kraj",
            "pos": "noun",
            "fields": {
                "genitive.plural": "krajów"
            }
        });

        entries["parasol"] = new Entry({
            "lang": pl,
            "name": "parasol",
            "pos": "noun"
        });

        entries["hotel"] = new Entry({
            "lang": pl,
            "name": "hotel",
            "pos": "noun"
        });

        entries["szpital"] = new Entry({
            "lang": pl,
            "name": "szpital",
            "pos": "noun"
        });

        entries["pałac"] = new Entry({
            "lang": pl,
            "name": "pałac",
            "pos": "noun"
        });

        entries["tysiąc"] = new Entry({
            "lang": pl,
            "name": "tysiąc",
            "pos": "noun",
            "fields": {
                "genitive.plural": "tysięcy"
            }
        });

        entries["pieniądz"] = new Entry({
            "lang": pl,
            "name": "pieniądz",
            "pos": "noun",
            "fields": {
                "genitive.plural": "pieniędzy",
                "instrumental.plural": "pieniędzmi"
            }
        });

        entries["grosz"] = new Entry({
            "lang": pl,
            "name": "grosz",
            "pos": "noun"
        });

        entries["miesiąc"] = new Entry({
            "lang": pl,
            "name": "miesiąc",
            "pos": "noun",
            "fields": {
                "genitive.plural": "miesięcy",
                "genitive.singular": "miesiąca"
            }
        });

        entries["talerz"] = new Entry({
            "lang": pl,
            "name": "talerz",
            "pos": "noun"
        });

        entries["klucz"] = new Entry({
            "lang": pl,
            "name": "klucz",
            "pos": "noun"
        });

        entries["nóż"] = new Entry({
            "lang": pl,
            "name": "nóż",
            "pos": "noun",
            "fields": {
                "genitive.plural": "noży",
                "locative.singular": "nożu",
                "genitive.singular": "noża",
                "nominative.plural": "noże"
            }
        });

        entries["koń"] = new Entry({
            "lang": pl,
            "name": "koń",
            "pos": "noun",
            "fields": {
                "animate": true,
                "instrumental.plural": "końmi"
            }
        });

        entries["liść"] = new Entry({
            "lang": pl,
            "name": "liść",
            "pos": "noun",
            "fields": {
                "instrumental.plural": "liśćmi"
            }
        });

        entries["niedźwiedź"] = new Entry({
            "lang": pl,
            "name": "niedźwiedź",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["ogień"] = new Entry({
            "lang": pl,
            "name": "ogień",
            "pos": "noun",
            "fields": {
                "*stem": "ogń"
            }
        });

        entries["tydzień"] = new Entry({
            "lang": pl,
            "name": "tydzień",
            "pos": "noun",
            "fields": {
                "*stem": "tygodń"
            }
        });

        entries["gołąb"] = new Entry({
            "lang": pl,
            "name": "gołąb",
            "pos": "noun",
            "fields": {
                "animate": true,
                "nominative.plural": "gołębie"
            }
        });

        entries["karp"] = new Entry({
            "lang": pl,
            "name": "karp",
            "pos": "noun",
            "fields": {
                "nominative.plural": "karpie"
            }
        });

        entries["szkoła"] = new Entry({
            "lang": pl,
            "name": "szkoła",
            "pos": "noun",
            "fields": {
                "genitive.plural": "szkół"
            }
        });

        entries["ryba"] = new Entry({
            "lang": pl,
            "name": "ryba",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["gwiazda"] = new Entry({
            "lang": pl,
            "name": "gwiazda",
            "pos": "noun"
        });

        entries["siostra"] = new Entry({
            "lang": pl,
            "name": "siostra",
            "pos": "noun",
            "fields": {
                "animate": true,
                "genitive.plural": "sióstr"
            }
        });

        entries["kiełbasa"] = new Entry({
            "lang": pl,
            "name": "kiełbasa",
            "pos": "noun"
        });

        entries["rzecz"] = new Entry({
            "lang": pl,
            "name": "rzecz",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["matka"] = new Entry({
            "lang": pl,
            "name": "matka",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["córka"] = new Entry({
            "lang": pl,
            "name": "córka",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["Polka"] = new Entry({
            "lang": pl,
            "name": "Polka",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["figa"] = new Entry({
            "lang": pl,
            "name": "figa",
            "pos": "noun"
        });

        entries["droga"] = new Entry({
            "lang": pl,
            "name": "droga",
            "pos": "noun",
            "fields": {
                "genitive.plural": "dróg"
            }
        });

        entries["ręka"] = new Entry({
            "lang": pl,
            "name": "ręka",
            "pos": "noun",
            "fields": {
                "genitive.plural": "rąk",
                "nominative.plural": "ręce"
            }
        });

        entries["lekcja"] = new Entry({
            "lang": pl,
            "name": "lekcja",
            "pos": "noun"
        });

        entries["kolej"] = new Entry({
            "lang": pl,
            "name": "kolej",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["kąpiel"] = new Entry({
            "lang": pl,
            "name": "kąpiel",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["chwila"] = new Entry({
            "lang": pl,
            "name": "chwila",
            "pos": "noun"
        });

        entries["aleja"] = new Entry({
            "lang": pl,
            "name": "aleja",
            "pos": "noun"
        });

        entries["sala"] = new Entry({
            "lang": pl,
            "name": "sala",
            "pos": "noun"
        });

        entries["babcia"] = new Entry({
            "lang": pl,
            "name": "babcia",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["kuchnia"] = new Entry({
            "lang": pl,
            "name": "kuchnia",
            "pos": "noun"
        });

        entries["historia"] = new Entry({
            "lang": pl,
            "name": "historia",
            "pos": "noun"
        });

        entries["tęcza"] = new Entry({
            "lang": pl,
            "name": "tęcza",
            "pos": "noun"
        });

        entries["burza"] = new Entry({
            "lang": pl,
            "name": "burza",
            "pos": "noun"
        });

        entries["wieża"] = new Entry({
            "lang": pl,
            "name": "wieża",
            "pos": "noun"
        });

        entries["podróż"] = new Entry({
            "lang": pl,
            "name": "podróż",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["owca"] = new Entry({
            "lang": pl,
            "name": "owca",
            "pos": "noun"
        });

        entries["róża"] = new Entry({
            "lang": pl,
            "name": "róża",
            "pos": "noun"
        });

        entries["grusza"] = new Entry({
            "lang": pl,
            "name": "grusza",
            "pos": "noun"
        });

        entries["miłość"] = new Entry({
            "lang": pl,
            "name": "miłość",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["opowieść"] = new Entry({
            "lang": pl,
            "name": "opowieść",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "nominative.plural": "opowieści"
            }
        });

        entries["nić"] = new Entry({
            "lang": pl,
            "name": "nić",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "instrumental.plural": "nićmi",
                "nominative.plural": "nici"
            }
        });

        entries["pieśń"] = new Entry({
            "lang": pl,
            "name": "pieśń",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "nominative.plural": "pieśni"
            }
        });

        entries["przyjaźń"] = new Entry({
            "lang": pl,
            "name": "przyjaźń",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "nominative.plural": "przyjaźni"
            }
        });

        entries["jabłoń"] = new Entry({
            "lang": pl,
            "name": "jabłoń",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["łódź"] = new Entry({
            "lang": pl,
            "name": "łódź",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "*stem": "łodź"
            }
        });

        entries["gałąź"] = new Entry({
            "lang": pl,
            "name": "gałąź",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "*stem": "gałęź"
            }
        });

        entries["wieś"] = new Entry({
            "lang": pl,
            "name": "wieś",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "*stem": "wś"
            }
        });

        entries["jabłko"] = new Entry({
            "lang": pl,
            "name": "jabłko",
            "pos": "noun"
        });

        entries["krzesło"] = new Entry({
            "lang": pl,
            "name": "krzesło",
            "pos": "noun"
        });

        entries["zdjęcie"] = new Entry({
            "lang": pl,
            "name": "zdjęcie",
            "pos": "noun"
        });

        entries["pole"] = new Entry({
            "lang": pl,
            "name": "pole",
            "pos": "noun"
        });

        entries["ramię"] = new Entry({
            "lang": pl,
            "name": "ramię",
            "pos": "noun"
        });

        entries["jagnię"] = new Entry({
            "lang": pl,
            "name": "jagnię",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["prosię"] = new Entry({
            "lang": pl,
            "name": "prosię",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["kurczę"] = new Entry({
            "lang": pl,
            "name": "kurczę",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["dziewczę"] = new Entry({
            "lang": pl,
            "name": "dziewczę",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["młody"] = new Entry({
            "lang": pl,
            "name": "młody",
            "pos": "adjective"
        });

        entries["Polak"] = new Entry({
            "lang": pl,
            "name": "Polak",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["Chińczyk"] = new Entry({
            "lang": pl,
            "name": "Chińczyk",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["Anglik"] = new Entry({
            "lang": pl,
            "name": "Anglik",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["kaleka"] = new Entry({
            "lang": pl,
            "name": "kaleka",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "gender": "masculine",
                "genitive.plural": "kalek"
            }
        });

        entries["Norweg"] = new Entry({
            "lang": pl,
            "name": "Norweg",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["inżynier"] = new Entry({
            "lang": pl,
            "name": "inżynier",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["kelner"] = new Entry({
            "lang": pl,
            "name": "kelner",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["doktor"] = new Entry({
            "lang": pl,
            "name": "doktor",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["kierowca"] = new Entry({
            "lang": pl,
            "name": "kierowca",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "gender": "masculine"
            }
        });

        entries["sprzedawca"] = new Entry({
            "lang": pl,
            "name": "sprzedawca",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "gender": "masculine"
            }
        });

        entries["Niemiec"] = new Entry({
            "lang": pl,
            "name": "Niemiec",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "*stem": "Niemc"
            }
        });

        entries["mieszkaniec"] = new Entry({
            "lang": pl,
            "name": "mieszkaniec",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "*stem": "mieszkańc"
            }
        });

        entries["lekarz"] = new Entry({
            "lang": pl,
            "name": "lekarz",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["złodziej"] = new Entry({
            "lang": pl,
            "name": "złodziej",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["towarzysz"] = new Entry({
            "lang": pl,
            "name": "towarzysz",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["słuchacz"] = new Entry({
            "lang": pl,
            "name": "słuchacz",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["nauczyciel"] = new Entry({
            "lang": pl,
            "name": "nauczyciel",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["góral"] = new Entry({
            "lang": pl,
            "name": "góral",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["Francuz"] = new Entry({
            "lang": pl,
            "name": "Francuz",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["chłop"] = new Entry({
            "lang": pl,
            "name": "chłop",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["architekt"] = new Entry({
            "lang": pl,
            "name": "architekt",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["poeta"] = new Entry({
            "lang": pl,
            "name": "poeta",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "gender": "masculine"
            }
        });

        entries["specjalista"] = new Entry({
            "lang": pl,
            "name": "specjalista",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "gender": "masculine"
            }
        });

        entries["turysta"] = new Entry({
            "lang": pl,
            "name": "turysta",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "gender": "masculine"
            }
        });

        entries["Czech"] = new Entry({
            "lang": pl,
            "name": "Czech",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["Szwed"] = new Entry({
            "lang": pl,
            "name": "Szwed",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["student"] = new Entry({
            "lang": pl,
            "name": "student",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["Włoch"] = new Entry({
            "lang": pl,
            "name": "Włoch",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["sąsiad"] = new Entry({
            "lang": pl,
            "name": "sąsiad",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "nominative.plural": "sąsiedzi"
            }
        });

        entries["diabeł"] = new Entry({
            "lang": pl,
            "name": "diabeł",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "*stem": 'diabł'
            }
        });

        entries["syn"] = new Entry({
            "lang": pl,
            "name": "syn",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "nominative.plural": "synowie"
            }
        });

        entries["mąż"] = new Entry({
            "lang": pl,
            "name": "mąż",
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
            "lang": pl,
            "name": "Belg",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "nominative.plural": "Belgowie"
            }
        });

        entries["professor"] = new Entry({
            "lang": pl,
            "name": "professor",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "nominative.plural": "professorowie"
            }
        });

        entries["uczeń"] = new Entry({
            "lang": pl,
            "name": "uczeń",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "*stem": "uczń",
                "nominative.plural": "uczniowie"
            }
        });

        entries["więzień"] = new Entry({
            "lang": pl,
            "name": "więzień",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "*stem": "więźń",
                "nominative.plural": "więźniowie"
            }
        });

        entries["brat"] = new Entry({
            "lang": pl,
            "name": "brat",
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
            "lang": pl,
            "name": "Amerykanin",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "*stem": "Amerykan",
                "nominative.plural": "Amerykanie"
            }
        });

        entries["Rosjanin"] = new Entry({
            "lang": pl,
            "name": "Rosjanin",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "nominative.plural": "Rosjanie"
            }
        });

        entries["brzydki"] = new Entry({
            "lang": pl,
            "name": "brzydki",
            "pos": "adjective"
        });

        entries["bliski"] = new Entry({
            "lang": pl,
            "name": "bliski",
            "pos": "adjective"
        });

        entries["ubogi"] = new Entry({
            "lang": pl,
            "name": "ubogi",
            "pos": "adjective"
        });

        entries["stary"] = new Entry({
            "lang": pl,
            "name": "stary",
            "pos": "adjective"
        });

        entries["były"] = new Entry({
            "lang": pl,
            "name": "były",
            "pos": "adjective"
        });

        entries["biedny"] = new Entry({
            "lang": pl,
            "name": "biedny",
            "pos": "adjective"
        });

        entries["zadowolony"] = new Entry({
            "lang": pl,
            "name": "zadowolony",
            "pos": "adjective"
        });

        entries["zmęczony"] = new Entry({
            "lang": pl,
            "name": "zmęczony",
            "pos": "adjective"
        });

        entries["pierwszy"] = new Entry({
            "lang": pl,
            "name": "pierwszy",
            "pos": "adjective"
        });

        entries["lepszy"] = new Entry({
            "lang": pl,
            "name": "lepszy",
            "pos": "adjective"
        });

        entries["gotowy"] = new Entry({
            "lang": pl,
            "name": "gotowy",
            "pos": "adjective"
        });

        entries["ciekawy"] = new Entry({
            "lang": pl,
            "name": "ciekawy",
            "pos": "adjective"
        });

        entries["bogaty"] = new Entry({
            "lang": pl,
            "name": "bogaty",
            "pos": "adjective"
        });

        entries["smutny"] = new Entry({
            "lang": pl,
            "name": "smutny",
            "pos": "adjective"
        });

        entries["miły"] = new Entry({
            "lang": pl,
            "name": "miły",
            "pos": "adjective"
        });

        entries["zajęty"] = new Entry({
            "lang": pl,
            "name": "zajęty",
            "pos": "adjective"
        });

        entries["twarz"] = new Entry({
            "lang": pl,
            "name": "twarz",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["piękny"] = new Entry({
            "lang": pl,
            "name": "piękny",
            "pos": "adjective"
        });

        entries["wierzyć"] = new Entry({
            "lang": pl,
            "name": "wierzyć",
            "pos": "verb"
        });

        entries["słyszeć"] = new Entry({
            "lang": pl,
            "name": "słyszeć",
            "pos": "verb"
        });

        entries["dzwonić"] = new Entry({
            "lang": pl,
            "name": "dzwonić",
            "pos": "verb"
        });

        entries["mieszkać"] = new Entry({
            "lang": pl,
            "name": "mieszkać",
            "pos": "verb"
        });

        entries["wiedzieć"] = new Entry({
            "lang": pl,
            "name": "wiedzieć",
            "pos": "verb",
            "fields": {
                "*stem": "wiej",
                "nonpast.plural.3p": "wiedzą"
            }
        });

        entries["dziękować"] = new Entry({
            "lang": pl,
            "name": "dziękować",
            "pos": "verb"
        });

        entries["obiecywać"] = new Entry({
            "lang": pl,
            "name": "obiecywać",
            "pos": "verb"
        });

        entries["oczekiwać"] = new Entry({
            "lang": pl,
            "name": "oczekiwać",
            "pos": "verb"
        });

        entries["dawać"] = new Entry({
            "lang": pl,
            "name": "dawać",
            "pos": "verb"
        });

        entries["nazywać"] = new Entry({
            "lang": pl,
            "name": "nazywać",
            "pos": "verb",
            "fields": {
                "conjugation": "third"
            }
        });

        entries["pies"] = new Entry({
            "lang": pl,
            "name": "pies",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "*stem": "ps",
                "dative.singular": "psu"
            }
        });

        entries["królik"] = new Entry({
            "lang": pl,
            "name": "królik",
            "pos": "noun",
            "fields": {
                "animate": true
            }
        });

        entries["siostrzeniec"] = new Entry({
            "lang": pl,
            "name": "siostrzeniec",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "*stem": "siostrzeńc"
            }
        });

        entries["dziadek"] = new Entry({
            "lang": pl,
            "name": "dziadek",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "*stem": "dziadk"
            }
        });

        entries["szwagier"] = new Entry({
            "lang": pl,
            "name": "szwagier",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "*stem": "szwagr"
            }
        });

        entries["gość"] = new Entry({
            "lang": pl,
            "name": "gość",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "instrumental.plural": "gośćmi"
            }
        });

        entries["artysta"] = new Entry({
            "lang": pl,
            "name": "artysta",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "gender": "masculine"
            }
        });

        entries["ojciec"] = new Entry({
            "lang": pl,
            "name": "ojciec",
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
            "lang": pl,
            "name": "listonosz",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["żołnierz"] = new Entry({
            "lang": pl,
            "name": "żołnierz",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["obiad"] = new Entry({
            "lang": pl,
            "name": "obiad",
            "pos": "noun"
        });

        entries["wiatr"] = new Entry({
            "lang": pl,
            "name": "wiatr",
            "pos": "noun"
        });

        entries["kosz"] = new Entry({
            "lang": pl,
            "name": "kosz",
            "pos": "noun",
            "fields": {
                "genitive.singular": "kosza"
            }
        });

        entries["palec"] = new Entry({
            "lang": pl,
            "name": "palec",
            "pos": "noun",
            "fields": {
                "*stem": "palc",
                "genitive.singular": "palca"
            }
        });

        entries["kwiatek"] = new Entry({
            "lang": pl,
            "name": "kwiatek",
            "pos": "noun",
            "fields": {
                "*stem": "kwiatk",
                "genitive.singular": "kwiatka"
            }
        });

        entries["lampa"] = new Entry({
            "lang": pl,
            "name": "lampa",
            "pos": "noun"
        });

        entries["łza"] = new Entry({
            "lang": pl,
            "name": "łza",
            "pos": "noun"
        });

        entries["pamięć"] = new Entry({
            "lang": pl,
            "name": "pamięć",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["szyja"] = new Entry({
            "lang": pl,
            "name": "szyja",
            "pos": "noun"
        });

        entries["nadzieja"] = new Entry({
            "lang": pl,
            "name": "nadzieja",
            "pos": "noun"
        });

        entries["żmija"] = new Entry({
            "lang": pl,
            "name": "żmija",
            "pos": "noun"
        });

        entries["cebula"] = new Entry({
            "lang": pl,
            "name": "cebula",
            "pos": "noun"
        });

        entries["krew"] = new Entry({
            "lang": pl,
            "name": "krew",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "*stem": "krw"
            }
        });

        entries["chorągiew"] = new Entry({
            "lang": pl,
            "name": "chorągiew",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "*stem": "chorągw"
            }
        });

        entries["myśl"] = new Entry({
            "lang": pl,
            "name": "myśl",
            "pos": "noun",
            "fields": {
                "gender": "feminine"
            }
        });

        entries["sól"] = new Entry({
            "lang": pl,
            "name": "sól",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "*stem": "sol"
            }
        });

        entries["idea"] = new Entry({
            "lang": pl,
            "name": "idea",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "genitive.singular": "idei"
            }
        });

        entries["statua"] = new Entry({
            "lang": pl,
            "name": "statua",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "genitive.singular": "statui"
            }
        });

        entries["melodia"] = new Entry({
            "lang": pl,
            "name": "melodia",
            "pos": "noun"
        });


        entries["Belgia"] = new Entry({
            "lang": pl,
            "name": "Belgia",
            "pos": "noun"
        });

        entries["Anglia"] = new Entry({
            "lang": pl,
            "name": "Anglia",
            "pos": "noun"
        });

        entries["sympatia"] = new Entry({
            "lang": pl,
            "name": "sympatia",
            "pos": "noun"
        });

        entries["telewizja"] = new Entry({
            "lang": pl,
            "name": "telewizja",
            "pos": "noun"
        });

        entries["poezja"] = new Entry({
            "lang": pl,
            "name": "poezja",
            "pos": "noun"
        });

        entries["Francja"] = new Entry({
            "lang": pl,
            "name": "Francja",
            "pos": "noun"
        });

        entries["stacja"] = new Entry({
            "lang": pl,
            "name": "stacja",
            "pos": "noun"
        });

        entries["Szkocja"] = new Entry({
            "lang": pl,
            "name": "Szkocja",
            "pos": "noun"
        });

        entries["procesja"] = new Entry({
            "lang": pl,
            "name": "procesja",
            "pos": "noun"
        });

        entries["źrebię"] = new Entry({
            "lang": pl,
            "name": "źrebię",
            "pos": "noun"
        });

        entries["mieszkanie"] = new Entry({
            "lang": pl,
            "name": "mieszkanie",
            "pos": "noun"
        });

        entries["koniec"] = new Entry({
            "lang": pl,
            "name": "koniec",
            "pos": "noun",
            "fields": {
                "*stem": "końc"
            }
        });

        entries["zegarek"] = new Entry({
            "lang": pl,
            "name": "zegarek",
            "pos": "noun",
            "fields": {
                "*stem": "zegark"
            }
        });

        entries["kapelusz"] = new Entry({
            "lang": pl,
            "name": "kapelusz",
            "pos": "noun"
        });

        entries["garaż"] = new Entry({
            "lang": pl,
            "name": "garaż",
            "pos": "noun"
        });

        entries["łabędź"] = new Entry({
            "lang": pl,
            "name": "łabędź",
            "pos": "noun"
        });

        entries["płaszcz"] = new Entry({
            "lang": pl,
            "name": "płaszcz",
            "pos": "noun"
        });

        entries["orkiestra"] = new Entry({
            "lang": pl,
            "name": "orkiestra",
            "pos": "noun"
        });

        entries["żona"] = new Entry({
            "lang": pl,
            "name": "żona",
            "pos": "noun"
        });

        entries["cegła"] = new Entry({
            "lang": pl,
            "name": "cegła",
            "pos": "noun"
        });

        entries["ziemia"] = new Entry({
            "lang": pl,
            "name": "ziemia",
            "pos": "noun"
        });

        entries["ciocia"] = new Entry({
            "lang": pl,
            "name": "ciocia",
            "pos": "noun"
        });

        entries["głowa"] = new Entry({
            "lang": pl,
            "name": "głowa",
            "pos": "noun",
            "fields": {
                "genitive.plural": "głów"
            }
        });

        entries["drzewo"] = new Entry({
            "lang": pl,
            "name": "drzewo",
            "pos": "noun"
        });

        entries["mieszkanie"] = new Entry({
            "lang": pl,
            "name": "mieszkanie",
            "pos": "noun"
        });

        entries["pióro"] = new Entry({
            "lang": pl,
            "name": "pióro",
            "pos": "noun"
        });

        entries["lato"] = new Entry({
            "lang": pl,
            "name": "lato",
            "pos": "noun"
        });

        entries["serce"] = new Entry({
            "lang": pl,
            "name": "serce",
            "pos": "noun"
        });

        entries["jezioro"] = new Entry({
            "lang": pl,
            "name": "jezioro",
            "pos": "noun"
        });

        entries["miasto"] = new Entry({
            "lang": pl,
            "name": "miasto",
            "pos": "noun",
            "fields": {
                "locative.singular": "mieście"
            }
        });

        entries["słowo"] = new Entry({
            "lang": pl,
            "name": "słowo",
            "pos": "noun",
            "fields": {
                "genitive.plural": "słów"
            }
        });

        entries["święto"] = new Entry({
            "lang": pl,
            "name": "święto",
            "pos": "noun",
            "fields": {
                "genitive.plural": "świąt"
            }
        });

        entries["piętro"] = new Entry({
            "lang": pl,
            "name": "piętro",
            "pos": "noun",
            "fields": {
                "genitive.plural": "pięter"
            }
        });

        entries["śniadanie"] = new Entry({
            "lang": pl,
            "name": "śniadanie",
            "pos": "noun"
        });

        entries["książę"] = new Entry({
            "lang": pl,
            "name": "książę",
            "pos": "noun"
        });

        entries["narzędzie"] = new Entry({
            "lang": pl,
            "name": "narzędzie",
            "pos": "noun",
            "fields": {
                "genitive.plural": "narzędzi"
            }
        });

        entries["wybrzeże"] = new Entry({
            "lang": pl,
            "name": "wybrzeże",
            "pos": "noun",
            "fields": {
                "genitive.plural": "wybrzeży"
            }
        });

        entries["świat"] = new Entry({
            "lang": pl,
            "name": "świat",
            "pos": "noun",
            "fields": {
                "dative.singular": "światu"
            }
        });

        entries["Bóg"] = new Entry({
            "lang": pl,
            "name": "Bóg",
            "pos": "noun",
            "fields": {
                "*stem": "Bog",
                "dative.singular": "Bogu"
            }
        });

        entries["sosna"] = new Entry({
            "lang": pl,
            "name": "sosna",
            "pos": "noun"
        });

        entries["kapusta"] = new Entry({
            "lang": pl,
            "name": "kapusta",
            "pos": "noun"
        });

        entries["lista"] = new Entry({
            "lang": pl,
            "name": "lista",
            "pos": "noun"
        });

        entries["bielizna"] = new Entry({
            "lang": pl,
            "name": "bielizna",
            "pos": "noun"
        });

        entries["ojczyzna"] = new Entry({
            "lang": pl,
            "name": "ojczyzna",
            "pos": "noun"
        });

        entries["podłoga"] = new Entry({
            "lang": pl,
            "name": "podłoga",
            "pos": "noun"
        });

        entries["mucha"] = new Entry({
            "lang": pl,
            "name": "mucha",
            "pos": "noun"
        });

        entries["osoba"] = new Entry({
            "lang": pl,
            "name": "osoba",
            "pos": "noun"
        });

        entries["prasa"] = new Entry({
            "lang": pl,
            "name": "prasa",
            "pos": "noun"
        });

        entries["mama"] = new Entry({
            "lang": pl,
            "name": "mama",
            "pos": "noun"
        });

        entries["koza"] = new Entry({
            "lang": pl,
            "name": "koza",
            "pos": "noun"
        });

        entries["Europa"] = new Entry({
            "lang": pl,
            "name": "Europa",
            "pos": "noun"
        });

        entries["dzień"] = new Entry({
            "lang": pl,
            "name": "dzień",
            "pos": "noun",
            "fields": {
                "*stem": "dń"
            }
        });

        entries["wuj"] = new Entry({
            "lang": pl,
            "name": "wuj",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true,
                "nominative.plural": "wujowie"
            }
        });

        entries["las"] = new Entry({
            "lang": pl,
            "name": "las",
            "pos": "noun"
        });

        entries["gwóźdź"] = new Entry({
            "lang": pl,
            "name": "gwóźdź",
            "pos": "noun",
            "fields": {
                "*stem": "gwoźdź"
            }
        });

        entries["słońce"] = new Entry({
            "lang": pl,
            "name": "słońce",
            "pos": "noun"
        });

        entries["zboże"] = new Entry({
            "lang": pl,
            "name": "zboże",
            "pos": "noun"
        });

        entries["przyjaciel"] = new Entry({
            "lang": pl,
            "name": "przyjaciel",
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
            "lang": pl,
            "name": "dłoń",
            "pos": "noun",
            "fields": {
                "instrumental.plural": "dłońmi"
            }
        });

        entries["kość"] = new Entry({
            "lang": pl,
            "name": "kość",
            "pos": "noun",
            "fields": {
                "gender": "feminine",
                "instrumental.plural": "kośćmi"
            }
        });

        entries["dach"] = new Entry({
            "lang": pl,
            "name": "dach",
            "pos": "noun"
        });

        entries["marzec"] = new Entry({
            "lang": pl,
            "name": "marzec",
            "pos": "noun",
            "fields": {
                "*stem": "marc"
            }
        });

        entries["cmentarz"] = new Entry({
            "lang": pl,
            "name": "cmentarz",
            "pos": "noun"
        });

        entries["pomysł"] = new Entry({
            "lang": pl,
            "name": "pomysł",
            "pos": "noun"
        });

        entries["wykład"] = new Entry({
            "lang": pl,
            "name": "wykład",
            "pos": "noun"
        });

        entries["wyjazd"] = new Entry({
            "lang": pl,
            "name": "wyjazd",
            "pos": "noun",
            "fields": {
                "*stem": "wyjezd"
            }
        });

        entries["Rzym"] = new Entry({
            "lang": pl,
            "name": "Rzym",
            "pos": "noun"
        });

        entries["szef"] = new Entry({
            "lang": pl,
            "name": "szef",
            "pos": "noun",
            "fields": {
                "animate": true,
                "virile": true
            }
        });

        entries["wóz"] = new Entry({
            "lang": pl,
            "name": "wóz",
            "pos": "noun",
            "fields": {
                "*stem": "woz"
            }
        });

        entries["pończocha"] = new Entry({
            "lang": pl,
            "name": "pończocha",
            "pos": "noun"
        });

        entries["wojsko"] = new Entry({
            "lang": pl,
            "name": "wojsko",
            "pos": "noun"
        });

        entries["ucho"] = new Entry({
            "lang": pl,
            "name": "ucho",
            "pos": "noun"
        });

        entries["echo"] = new Entry({
            "lang": pl,
            "name": "echo",
            "pos": "noun"
        });

        entries["mydło"] = new Entry({
            "lang": pl,
            "name": "mydło",
            "pos": "noun"
        });

        entries["złoto"] = new Entry({
            "lang": pl,
            "name": "złoto",
            "pos": "noun"
        });

        entries["oko"] = new Entry({
            "lang": pl,
            "name": "oko",
            "pos": "noun",
            "fields": {
                "*stem.plural": "ocz"
            }
        });

        entries["stado"] = new Entry({
            "lang": pl,
            "name": "stado",
            "pos": "noun"
        });

        entries["gniazdo"] = new Entry({
            "lang": pl,
            "name": "gniazdo",
            "pos": "noun",
            "fields": {
                "*stem": "gniezd"
            }
        });

        entries["pismo"] = new Entry({
            "lang": pl,
            "name": "pismo",
            "pos": "noun"
        });

        entries["jajko"] = new Entry({
            "lang": pl,
            "name": "jajko",
            "pos": "noun"
        });

        entries["mięso"] = new Entry({
            "lang": pl,
            "name": "mięso",
            "pos": "noun"
        });

        return entries;
    }
);

