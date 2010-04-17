
/*
 * Connects the bits to make an English language importer.
 */

require.def('lingwo_dictionary/importer/languages/en', 
    ['lingwo_dictionary/importer/MultiProducer',
     'lingwo_dictionary/importer/wiktionary/en',
     'lingwo_dictionary/importer/wiktionary/pl',
     'lingwo_dictionary/languages/en'],
    function (MultiProducer, wiktionary_en, wiktionary_pl, en) {
        return {
            makeProducer: function (source) {
                return new MultiProducer({
                    modules: [wiktionary_en, wiktionary_pl],
                    code: "en",
                    // TODO: should be 'source'!
                    filename: source
                });
            },

            makeParser: function () {
                return wiktionary_en.parser;
                //return wiktionary_pl.parser;
            }
        };
    }
);

