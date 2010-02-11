
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
            "forms": {
                "*stem": "stoł"
            }
        });

        entries["kot"] = new Entry({
            "lang": pl,
            "name": "kot",
            "pos": "noun",
            "classes": ["animate"],
            "forms": {
                "dative.singular": "kotu"
            }
        });

        entries["pokój"] = new Entry({
            "lang": pl,
            "name": "pokój",
            "pos": "noun",
            "forms": {
                "*stem": "pokoj"
            }
        });

        entries["chłopiec"] = new Entry({
            "lang": pl,
            "name": "chłopiec",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "forms": {
                "*stem": "chłopc",
                "dative.singular": "chłopcu"
            }
        });

        entries["kolega"] = new Entry({
            "lang": pl,
            "name": "kolega",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "options": {
                "gender": "masculine"
            }
        });

        entries["dentysta"] = new Entry({
            "lang": pl,
            "name": "dentysta",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "options": {
                "gender": "masculine"
            }
        });

        entries["mężczyzna"] = new Entry({
            "lang": pl,
            "name": "mężczyzna",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "options": {
                "gender": "masculine"
            },
            "forms": {
                "genitive.plural": "mężczyzn"
            }
        });

        entries["kobieta"] = new Entry({
            "lang": pl,
            "name": "kobieta",
            "pos": "noun",
            "classes": ["animate"]
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
            "classes": ["animate"]
        });

        entries["noc"] = new Entry({
            "lang": pl,
            "name": "noc",
            "pos": "noun",
            "options": {
                "gender": "feminine"
            }
        });

        entries["część"] = new Entry({
            "lang": pl,
            "name": "część",
            "pos": "noun",
            "options": {
                "gender": "feminine"
            }
        });

        entries["jesień"] = new Entry({
            "lang": pl,
            "name": "jesień",
            "pos": "noun",
            "options": {
                "gender": "feminine"
            }
        });

        entries["wieś"] = new Entry({
            "lang": pl,
            "name": "wieś",
            "pos": "noun",
            "options": {
                "gender": "feminine"
            },
            "forms": {
                "*stem": "wś"
            }
        });

        entries["mysz"] = new Entry({
            "lang": pl,
            "name": "mysz",
            "pos": "noun",
            "classes": ["animate"],
            "options": {
                "gender": "feminine"
            }
        });

        entries["miłość"] = new Entry({
            "lang": pl,
            "name": "miłość",
            "pos": "noun",
            "options": {
                "gender": "feminine"
            }
        });

        entries["ciekawość"] = new Entry({
            "lang": pl,
            "name": "ciekawość",
            "pos": "noun",
            "options": {
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
            "classes": ["animate"],
            "forms": {
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
            "forms": {
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
            "classes": ["animate"]
        });

        entries["zwierzę"] = new Entry({
            "lang": pl,
            "name": "zwierzę",
            "pos": "noun",
            "classes": ["animate"]
        });

        entries["niemowlę"] = new Entry({
            "lang": pl,
            "name": "niemowlę",
            "pos": "noun",
            "classes": ["animate"]
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
            "forms": {
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
            "forms": {
                "*stem": "zęb",
                "genitive.singular": "zęba"
            }
        });

        entries["kościół"] = new Entry({
            "lang": pl,
            "name": "kościół",
            "pos": "noun",
            "forms": {
                "*stem": "kościoł",
                "genitive.singular": "kościoła"
            }
        });

        entries["samochód"] = new Entry({
            "lang": pl,
            "name": "samochód",
            "pos": "noun",
            "forms": {
                "*stem": "samochod"
            }
        });

        entries["dzwonek"] = new Entry({
            "lang": pl,
            "name": "dzwonek",
            "pos": "noun",
            "forms": {
                "nominative.plural": "dzwonki"
            }
        });

        entries["róg"] = new Entry({
            "lang": pl,
            "name": "róg",
            "pos": "noun",
            "forms": {
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
            "classes": ["animate"]
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
            "forms": {
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
            "forms": {
                "genitive.plural": "tysięcy"
            }
        });

        entries["pieniądz"] = new Entry({
            "lang": pl,
            "name": "pieniądz",
            "pos": "noun",
            "forms": {
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
            "forms": {
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
            "forms": {
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
            "classes": ["animate"],
            "forms": {
                "instrumental.plural": "końmi"
            }
        });

        entries["liść"] = new Entry({
            "lang": pl,
            "name": "liść",
            "pos": "noun",
            "forms": {
                "instrumental.plural": "liśćmi"
            }
        });

        entries["niedźwiedź"] = new Entry({
            "lang": pl,
            "name": "niedźwiedź",
            "pos": "noun",
            "classes": ["animate"]
        });

        entries["ogień"] = new Entry({
            "lang": pl,
            "name": "ogień",
            "pos": "noun",
            "forms": {
                "*stem": "ogń"
            }
        });

        entries["tydzień"] = new Entry({
            "lang": pl,
            "name": "tydzień",
            "pos": "noun",
            "forms": {
                "*stem": "tygodń"
            }
        });

        entries["gołąb"] = new Entry({
            "lang": pl,
            "name": "gołąb",
            "pos": "noun",
            "classes": ["animate"],
            "forms": {
                "nominative.plural": "gołębie"
            }
        });

        entries["karp"] = new Entry({
            "lang": pl,
            "name": "karp",
            "pos": "noun",
            "forms": {
                "nominative.plural": "karpie"
            }
        });

        entries["szkoła"] = new Entry({
            "lang": pl,
            "name": "szkoła",
            "pos": "noun",
            "forms": {
                "genitive.plural": "szkół"
            }
        });

        entries["ryba"] = new Entry({
            "lang": pl,
            "name": "ryba",
            "pos": "noun",
            "classes": ["animate"]
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
            "classes": ["animate"],
            "forms": {
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
            "options": {
                "gender": "feminine"
            }
        });

        entries["matka"] = new Entry({
            "lang": pl,
            "name": "matka",
            "pos": "noun",
            "classes": ["animate"]
        });

        entries["córka"] = new Entry({
            "lang": pl,
            "name": "córka",
            "pos": "noun",
            "classes": ["animate"]
        });

        entries["Polka"] = new Entry({
            "lang": pl,
            "name": "Polka",
            "pos": "noun",
            "classes": ["animate"]
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
            "forms": {
                "genitive.plural": "dróg"
            }
        });

        entries["ręka"] = new Entry({
            "lang": pl,
            "name": "ręka",
            "pos": "noun",
            "forms": {
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
            "options": {
                "gender": "feminine"
            }
        });

        entries["kąpiel"] = new Entry({
            "lang": pl,
            "name": "kąpiel",
            "pos": "noun",
            "options": {
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
            "classes": ["animate"]
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
            "options": {
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
            "options": {
                "gender": "feminine"
            }
        });

        entries["opowieść"] = new Entry({
            "lang": pl,
            "name": "opowieść",
            "pos": "noun",
            "options": {
                "gender": "feminine"
            },
            "forms": {
                "nominative.plural": "opowieści"
            }
        });

        entries["nić"] = new Entry({
            "lang": pl,
            "name": "nić",
            "pos": "noun",
            "options": {
                "gender": "feminine"
            },
            "forms": {
                "instrumental.plural": "nićmi",
                "nominative.plural": "nici"
            }
        });

        entries["pieśń"] = new Entry({
            "lang": pl,
            "name": "pieśń",
            "pos": "noun",
            "options": {
                "gender": "feminine"
            },
            "forms": {
                "nominative.plural": "pieśni"
            }
        });

        entries["przyjaźń"] = new Entry({
            "lang": pl,
            "name": "przyjaźń",
            "pos": "noun",
            "options": {
                "gender": "feminine"
            },
            "forms": {
                "nominative.plural": "przyjaźni"
            }
        });

        entries["jabłoń"] = new Entry({
            "lang": pl,
            "name": "jabłoń",
            "pos": "noun",
            "options": {
                "gender": "feminine"
            }
        });

        entries["łódź"] = new Entry({
            "lang": pl,
            "name": "łódź",
            "pos": "noun",
            "options": {
                "gender": "feminine"
            },
            "forms": {
                "*stem": "łodź"
            }
        });

        entries["gałąź"] = new Entry({
            "lang": pl,
            "name": "gałąź",
            "pos": "noun",
            "options": {
                "gender": "feminine"
            },
            "forms": {
                "*stem": "gałęź"
            }
        });

        entries["wieś"] = new Entry({
            "lang": pl,
            "name": "wieś",
            "pos": "noun",
            "options": {
                "gender": "feminine"
            },
            "forms": {
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
            "classes": ["animate"]
        });

        entries["prosię"] = new Entry({
            "lang": pl,
            "name": "prosię",
            "pos": "noun",
            "classes": ["animate"]
        });

        entries["kurczę"] = new Entry({
            "lang": pl,
            "name": "kurczę",
            "pos": "noun",
            "classes": ["animate"]
        });

        entries["dziewczę"] = new Entry({
            "lang": pl,
            "name": "dziewczę",
            "pos": "noun",
            "classes": ["animate"]
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
            "classes": ["animate", "virile"]
        });

        entries["Chińczyk"] = new Entry({
            "lang": pl,
            "name": "Chińczyk",
            "pos": "noun",
            "classes": ["animate", "virile"]
        });

        entries["Anglik"] = new Entry({
            "lang": pl,
            "name": "Anglik",
            "pos": "noun",
            "classes": ["animate", "virile"]
        });

        entries["kaleka"] = new Entry({
            "lang": pl,
            "name": "kaleka",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "options": {
                "gender": "masculine"
            },
            "forms": {
                "genitive.plural": "kalek"
            }
        });

        entries["Norweg"] = new Entry({
            "lang": pl,
            "name": "Norweg",
            "pos": "noun",
            "classes": ["animate", "virile"]
        });

        entries["inżynier"] = new Entry({
            "lang": pl,
            "name": "inżynier",
            "pos": "noun",
            "classes": ["animate", "virile"]
        });

        entries["kelner"] = new Entry({
            "lang": pl,
            "name": "kelner",
            "pos": "noun",
            "classes": ["animate", "virile"]
        });

        entries["doktor"] = new Entry({
            "lang": pl,
            "name": "doktor",
            "pos": "noun",
            "classes": ["animate", "virile"]
        });

        entries["kierowca"] = new Entry({
            "lang": pl,
            "name": "kierowca",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "options": {
                "gender": "masculine"
            }
        });

        entries["sprzedawca"] = new Entry({
            "lang": pl,
            "name": "sprzedawca",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "options": {
                "gender": "masculine"
            }
        });

        entries["Niemiec"] = new Entry({
            "lang": pl,
            "name": "Niemiec",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "forms": {
                "*stem": "Niemc"
            }
        });

        entries["mieszkaniec"] = new Entry({
            "lang": pl,
            "name": "mieszkaniec",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "forms": {
                "*stem": "mieszkańc"
            }
        });

        entries["lekarz"] = new Entry({
            "lang": pl,
            "name": "lekarz",
            "pos": "noun",
            "classes": ["animate", "virile"]
        });

        entries["złodziej"] = new Entry({
            "lang": pl,
            "name": "złodziej",
            "pos": "noun",
            "classes": ["animate", "virile"]
        });

        entries["towarzysz"] = new Entry({
            "lang": pl,
            "name": "towarzysz",
            "pos": "noun",
            "classes": ["animate", "virile"]
        });

        entries["słuchacz"] = new Entry({
            "lang": pl,
            "name": "słuchacz",
            "pos": "noun",
            "classes": ["animate", "virile"]
        });

        entries["nauczyciel"] = new Entry({
            "lang": pl,
            "name": "nauczyciel",
            "pos": "noun",
            "classes": ["animate", "virile"]
        });

        entries["góral"] = new Entry({
            "lang": pl,
            "name": "góral",
            "pos": "noun",
            "classes": ["animate", "virile"]
        });

        entries["Francuz"] = new Entry({
            "lang": pl,
            "name": "Francuz",
            "pos": "noun",
            "classes": ["animate", "virile"]
        });

        entries["chłop"] = new Entry({
            "lang": pl,
            "name": "chłop",
            "pos": "noun",
            "classes": ["animate", "virile"]
        });

        entries["architekt"] = new Entry({
            "lang": pl,
            "name": "architekt",
            "pos": "noun",
            "classes": ["animate", "virile"]
        });

        entries["poeta"] = new Entry({
            "lang": pl,
            "name": "poeta",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "options": {
                "gender": "masculine"
            }
        });

        entries["specjalista"] = new Entry({
            "lang": pl,
            "name": "specjalista",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "options": {
                "gender": "masculine"
            }
        });

        entries["turysta"] = new Entry({
            "lang": pl,
            "name": "turysta",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "options": {
                "gender": "masculine"
            }
        });

        entries["Czech"] = new Entry({
            "lang": pl,
            "name": "Czech",
            "pos": "noun",
            "classes": ["animate", "virile"]
        });

        entries["Szwed"] = new Entry({
            "lang": pl,
            "name": "Szwed",
            "pos": "noun",
            "classes": ["animate", "virile"]
        });

        entries["student"] = new Entry({
            "lang": pl,
            "name": "student",
            "pos": "noun",
            "classes": ["animate", "virile"]
        });

        entries["Włoch"] = new Entry({
            "lang": pl,
            "name": "Włoch",
            "pos": "noun",
            "classes": ["animate", "virile"]
        });

        entries["sąsiad"] = new Entry({
            "lang": pl,
            "name": "sąsiad",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "forms": {
                "nominative.plural": "sąsiedzi"
            }
        });

        entries["diabeł"] = new Entry({
            "lang": pl,
            "name": "diabeł",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "forms": {
                "*stem": 'diabł'
            }
        });

        entries["syn"] = new Entry({
            "lang": pl,
            "name": "syn",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "forms": {
                "nominative.plural": "synowie"
            }
        });

        entries["mąż"] = new Entry({
            "lang": pl,
            "name": "mąż",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "forms": {
                "genitive.plural": "mężów",
                "*stem": "męż",
                "nominative.plural": "mężowie"
            }
        });

        entries["Belg"] = new Entry({
            "lang": pl,
            "name": "Belg",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "forms": {
                "nominative.plural": "Belgowie"
            }
        });

        entries["professor"] = new Entry({
            "lang": pl,
            "name": "professor",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "forms": {
                "nominative.plural": "professorowie"
            }
        });

        entries["uczeń"] = new Entry({
            "lang": pl,
            "name": "uczeń",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "forms": {
                "*stem": "uczń",
                "nominative.plural": "uczniowie"
            }
        });

        entries["więzień"] = new Entry({
            "lang": pl,
            "name": "więzień",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "forms": {
                "*stem": "więźń",
                "nominative.plural": "więźniowie"
            }
        });

        entries["brat"] = new Entry({
            "lang": pl,
            "name": "brat",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "forms": {
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
            "classes": ["animate", "virile"],
            "forms": {
                "*stem": "Amerykan",
                "nominative.plural": "Amerykanie"
            }
        });

        entries["Rosjanin"] = new Entry({
            "lang": pl,
            "name": "Rosjanin",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "forms": {
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
            "options": {
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
            "forms": {
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
            "options": {
                "conjugation": "third"
            }
        });

        entries["pies"] = new Entry({
            "lang": pl,
            "name": "pies",
            "pos": "noun",
            "classes": ["animate"],
            "forms": {
                "*stem": "ps",
                "dative.singular": "psu"
            }
        });

        entries["królik"] = new Entry({
            "lang": pl,
            "name": "królik",
            "pos": "noun",
            "classes": ["animate"]
        });

        entries["siostrzeniec"] = new Entry({
            "lang": pl,
            "name": "siostrzeniec",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "forms": {
                "*stem": "siostrzeńc"
            }
        });

        entries["dziadek"] = new Entry({
            "lang": pl,
            "name": "dziadek",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "forms": {
                "*stem": "dziadk"
            }
        });

        entries["szwagier"] = new Entry({
            "lang": pl,
            "name": "szwagier",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "forms": {
                "*stem": "szwagr"
            }
        });

        entries["gość"] = new Entry({
            "lang": pl,
            "name": "gość",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "forms": {
                "instrumental.plural": "gośćmi"
            }
        });

        entries["artysta"] = new Entry({
            "lang": pl,
            "name": "artysta",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "options": {
                "gender": "masculine"
            }
        });

        entries["ojciec"] = new Entry({
            "lang": pl,
            "name": "ojciec",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "forms": {
                "*stem": "ojc",
                "dative.singular": "ojcu",
                "nominative.plural": "ojcowie"
            }
        });

        entries["listonosz"] = new Entry({
            "lang": pl,
            "name": "listonosz",
            "pos": "noun",
            "classes": ["animate", "virile"]
        });

        entries["żołnierz"] = new Entry({
            "lang": pl,
            "name": "żołnierz",
            "pos": "noun",
            "classes": ["animate", "virile"]
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
            "forms": {
                "genitive.singular": "kosza"
            }
        });

        entries["palec"] = new Entry({
            "lang": pl,
            "name": "palec",
            "pos": "noun",
            "forms": {
                "*stem": "palc",
                "genitive.singular": "palca"
            }
        });

        entries["kwiatek"] = new Entry({
            "lang": pl,
            "name": "kwiatek",
            "pos": "noun",
            "forms": {
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
            "options": {
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
            "options": {
                "gender": "feminine"
            },
            "forms": {
                "*stem": "krw"
            }
        });

        entries["chorągiew"] = new Entry({
            "lang": pl,
            "name": "chorągiew",
            "pos": "noun",
            "options": {
                "gender": "feminine"
            },
            "forms": {
                "*stem": "chorągw"
            }
        });

        entries["myśl"] = new Entry({
            "lang": pl,
            "name": "myśl",
            "pos": "noun",
            "options": {
                "gender": "feminine"
            }
        });

        entries["sól"] = new Entry({
            "lang": pl,
            "name": "sól",
            "pos": "noun",
            "options": {
                "gender": "feminine"
            },
            "forms": {
                "*stem": "sol"
            }
        });

        entries["idea"] = new Entry({
            "lang": pl,
            "name": "idea",
            "pos": "noun",
            "options": {
                "gender": "feminine"
            },
            "forms": {
                "genitive.singular": "idei"
            }
        });

        entries["statua"] = new Entry({
            "lang": pl,
            "name": "statua",
            "pos": "noun",
            "options": {
                "gender": "feminine"
            },
            "forms": {
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
            "forms": {
                "*stem": "końc"
            }
        });

        entries["zegarek"] = new Entry({
            "lang": pl,
            "name": "zegarek",
            "pos": "noun",
            "forms": {
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
            "forms": {
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
            "forms": {
                "locative.singular": "mieście"
            }
        });

        entries["słowo"] = new Entry({
            "lang": pl,
            "name": "słowo",
            "pos": "noun",
            "forms": {
                "genitive.plural": "słów"
            }
        });

        entries["święto"] = new Entry({
            "lang": pl,
            "name": "święto",
            "pos": "noun",
            "forms": {
                "genitive.plural": "świąt"
            }
        });

        entries["piętro"] = new Entry({
            "lang": pl,
            "name": "piętro",
            "pos": "noun",
            "forms": {
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
            "forms": {
                "genitive.plural": "narzędzi"
            }
        });

        entries["wybrzeże"] = new Entry({
            "lang": pl,
            "name": "wybrzeże",
            "pos": "noun",
            "forms": {
                "genitive.plural": "wybrzeży"
            }
        });

        entries["świat"] = new Entry({
            "lang": pl,
            "name": "świat",
            "pos": "noun",
            "forms": {
                "dative.singular": "światu"
            }
        });

        entries["Bóg"] = new Entry({
            "lang": pl,
            "name": "Bóg",
            "pos": "noun",
            "forms": {
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
            "forms": {
                "*stem": "dń"
            }
        });

        entries["wuj"] = new Entry({
            "lang": pl,
            "name": "wuj",
            "pos": "noun",
            "classes": ["animate", "virile"],
            "forms": {
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
            "forms": {
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
            "classes": ["animate", "virile"],
            "forms": {
                "genitive.plural": "przyjaciół",
                "instrumental.plural": "przyjaciółmi",
                "*stem.plural": "przyjaciół"
            }
        });

        entries["dłoń"] = new Entry({
            "lang": pl,
            "name": "dłoń",
            "pos": "noun",
            "forms": {
                "instrumental.plural": "dłońmi"
            }
        });

        entries["kość"] = new Entry({
            "lang": pl,
            "name": "kość",
            "pos": "noun",
            "options": {
                "gender": "bone"
            },
            "forms": {
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
            "forms": {
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
            "forms": {
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
            "classes": ["animate", "virile"]
        });

        entries["wóz"] = new Entry({
            "lang": pl,
            "name": "wóz",
            "pos": "noun",
            "forms": {
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
            "forms": {
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
            "forms": {
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

