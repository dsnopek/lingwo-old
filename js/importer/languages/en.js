
/*
 * Connects the bits to make an English language importer.
 */

require.def('lingwo_dictionary/importer/languages/en', 
    ['lingwo_dictionary/importer/wiktionary/en',
     'lingwo_dictionary/importer/wiktionary/pl',
     'lingwo_dictionary/languages/en'],
    function (wiktionary_en, wiktionary_pl, en) {
        return {
            makeProducer: function (source) {
                return new wiktionary_en.Producer({
                    filename: source,
                    code: "en"
                });
                /*
                return new wiktionary_pl.Producer({
                    filename: source,
                    code: "en"
                });
                */
            },

            makeParser: function () {
                return wiktionary_en.parsers["en"];
                //return wiktionary_pl.parsers["en"];
            }
        };
    }
);

