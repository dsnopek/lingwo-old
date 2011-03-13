
/*
 * Connects the bits to make an Polish language importer.
 */

define(
    ['lingwo_old/importer/MultiProducer',
     'lingwo_old/importer/makeMultiParser',
     'lingwo_old/importer/wiktionary/pl',
     'lingwo_old/importer/OpenDictionaries',
     'lingwo/languages/pl'],
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

