
define(
    ['lingwo/Entry'],
    function (Entry) {
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

        return function (modules, parser) {
            if (typeof parser == 'undefined') {
                // create a default parser function
                parser = function (entry) {
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
                                // if the entry lacks translations, but the sourceEntry
                                // has them, then we pull them in.
                                copyTranslations(entry, sourceEntry);

                                // same deal, but for pron.
                                if (!entry.pron && sourceEntry.pron) {
                                    entry.pron = sourceEntry.pron;
                                }
                            }
                        }
                    });
                };
            }

            return function (entry) {
                // run the parsers for each of the given modules
                modules.forEach(function (module) {
                    var source = entry.getSource(module.name),
                        sourceEntry = new Entry({
                            headword: entry.headword,
                            pos: entry.pos,
                            language: entry.language
                        });

                    if (source) {
                        // setup the source, parse it, remove the source, and stash on the source
                        sourceEntry.setSource(module.name, source);
                        module.parser(sourceEntry);
                        sourceEntry.sources = null;
                        source._parsed = sourceEntry;
                    }
                });

                // Ultimately, we run the user supplied parser
                parser(entry);
            }
        };
    }
);
