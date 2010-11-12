
/*
 * Connects the bits to make an Polish language importer.
 */

require.def('lingwo_dictionary/importer/languages/pl', 
    ['lingwo_dictionary/importer/MultiProducer',
     'lingwo_dictionary/importer/makeMultiParser',
     'lingwo_dictionary/importer/wiktionary/pl',
     'lingwo_dictionary/importer/OpenDictionaries',
     'lingwo_dictionary/languages/pl'],
    function (MultiProducer, makeMultiParser, wiktionary_pl, OpenDictionaries, pl) {
        var opendictionaries_pl_en = OpenDictionaries.generateModule('pl', 'en'),
            modules = [
                wiktionary_pl,
                opendictionaries_pl_en
            ];

        return {
            makeProducer: function (args) {
                args['modules'] = modules;
                args['code'] = "pl";
                return new MultiProducer(args);
            },

            makeParser: function () {
                return makeMultiParser(modules);
            }
        };
    }
);

