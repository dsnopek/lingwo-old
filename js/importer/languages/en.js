
/*
 * Connects the bits to make an English language importer.
 */

define(
    ['lingwo_old/importer/MultiProducer',
     'lingwo_old/importer/makeMultiParser',
     'lingwo_old/importer/wiktionary/en',
     'lingwo_old/importer/wiktionary/pl',
     'lingwo_old/importer/OpenDictionaries',
     'lingwo/languages/en'],
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

