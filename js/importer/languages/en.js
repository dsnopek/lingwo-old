
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
                return makeMultiParser(modules, function (entry) {
                    var source;

                    // copy from the first module in the preferred order
                    try {
                        modules.forEach(function (module) {
                            var source;
                            if (source = entry.getSource(module.name)) {
                                entry.copyFrom(source._parsed);
                                throw StopIteration;
                            }
                        });
                    }
                    catch (e) {
                        if (e != StopIteration) throw e;
                    }

                    // if there are no Polish translations, then we try to dig them out of lower
                    // quality modules.
                    // TODO: maybe we should make an Entry.hasTranslations(lang) function to be exhaustive about the translations.
                    if (!entry.translations.pl || !entry.translation.pl.senses || !entry.translations.pl.senses.length == 0) {
                        if (source = entry.getSource(wiktionary_pl.name)) {
                            if (source._parsed.translations.pl) {
                                // TODO: get all the translations and put them on the first sense
                            }
                        }
                        else if (source = entry.getSource(opendictionaries_en_pl.name)) {
                            // TODO: get all the translations and put them on the first sense
                        }
                    }

                    //print (entry.serialize());

                });
            }
        };
    }
);

