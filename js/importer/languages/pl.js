
/*
 * Connects the bits to make an Polish language importer.
 */

require.def('lingwo_dictionary/importer/languages/pl', 
    ['lingwo_dictionary/importer/wiktionary/pl',
     'lingwo_dictionary/languages/pl'],
    function (wiktionary_pl, pl) {
        return {
            makeProducer: function (source) {
                return new wiktionary_pl.Producer({
                    source: source,
                    code: "pl"
                });
            },

            makeParser: function () {
                return wiktionary_pl.parser;
            }
        };
    }
);

