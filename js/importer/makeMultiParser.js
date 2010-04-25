
require.def('lingwo_dictionary/importer/makeMultiParser',
    ['lingwo_dictionary/Entry'],
    function (Entry) {
        return function (modules, parser) {
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
