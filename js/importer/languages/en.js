
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
                // Reduces all of an entries translations to a single list
                function getTranslations(entry, langCode) {
                    var trans = [];

                    if (entry.translations && entry.translations[langCode] &&
                        entry.translations[langCode].senses)
                    {
                        entry.translations[langCode].senses.forEach(function (sense) {
                            if (sense.trans) {
                                trans = trans.concat(sense.trans);
                            }
                        });
                    }

                    return trans;
                }

                function copyTranslations(to_entry, from_entry) {
                    var langCode;
                    if (from_entry.translations) {
                        for (langCode in from_entry.translations) {
                            if (!to_entry.translations || !to_entry.translations[langCode]) {
                                if (!to_entry.translations) {
                                    to_entry.translations = {};
                                }
                                to_entry.translations[langCode] = {
                                    'senses': [{'trans': getTranslations(from_entry, langCode)}]
                                };
                            }
                        }
                    }
                }

                return makeMultiParser(modules, function (entry) {
                    var copied = false;

                    // copy from the first module in the preferred order
                    modules.forEach(function (module) {
                        var source, sourceEntry;
                        if (source = entry.getSource(module.name)) {
                            sourceEntry = source._parsed;
                            if (!copied) {
                                // this entry forms the basis of the entry
                                entry.copyFrom(sourceEntry);
                                copied = true;
                            }
                            else {
                                // if the entry lacks Polish translations, but the sourceEntry
                                // has them, then we pull them in.
                                copyTranslations(entry, sourceEntry);

                                // same deal, but for pron.
                                if (!entry.pron && sourceEntry.pron) {
                                    entry.pron = sourceEntry.pron;
                                }
                            }
                        }
                    });

                    //print (entry.serialize());
                });
            }
        };
    }
);

