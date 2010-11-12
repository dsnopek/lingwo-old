
/*
 * Connects the bits to make an English language importer.
 */

require.def('lingwo_dictionary/importer/languages/en', 
    ['lingwo_dictionary/importer/MultiProducer',
     'lingwo_dictionary/importer/makeMultiParser',
     'lingwo_dictionary/importer/wiktionary/en',
     'lingwo_dictionary/importer/wiktionary/pl',
     'lingwo_dictionary/importer/OpenDictionaries',
     'lingwo_dictionary/languages/en'],
    function (MultiProducer, makeMultiParser, wiktionary_en, wiktionary_pl, OpenDictionaries, en) {
        var opendictionaries_en_pl = OpenDictionaries.generateModule('en', 'pl'),
            modules = [
                wiktionary_en,
                wiktionary_pl,
                opendictionaries_en_pl
            ];

        return {
            makeProducer: function (args) {
                args['modules'] = modules;
                args['code'] = "en";
                return new MultiProducer(args);
            },

            makeParser: function () {
                return makeMultiParser(modules);
            }
        };
    }
);

