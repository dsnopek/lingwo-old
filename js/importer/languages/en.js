
/*
 * Connects the bits to make an English language importer.
 */

require.def('lingwo_dictionary/importer/languages/en', 
    ['lingwo_dictionary/importer/wiktionary/en',
     'lingwo_dictionary/languages/en'],
    function (wiktionary_en, en) {
        return {
            makeProducer: function (source) {
                return new wiktionary_en.Producer({
                    filename: source,
                    code: "en"
                });
            },

            makeParser: function () {
                return wiktionary_en.parsers["en"];
            }
        };
    }
);

