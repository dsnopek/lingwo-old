
/*
 * Connects the bits to make an XXX language importer.
 */

define(
    ['lingwo_old/importer/MultiProducer',
     'lingwo_old/importer/makeMultiParser',
     'lingwo_old/importer/wiktionary/en',
     'lingwo_old/importer/wiktionary/pl',
     'lingwo/languages/sv'],
    function (MultiProducer, makeMultiParser, wiktionary_en, wiktionary_pl, sv) {
        var modules = [
                wiktionary_en,
                wiktionary_pl,
            ];

        return {
            makeProducer: function (args) {
                args['modules'] = modules;
                args['code'] = "sv";
                return new MultiProducer(args);
            },

            makeParser: function () {
                return makeMultiParser(modules);
            }
        };
    }
);

