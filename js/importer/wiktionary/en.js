
/*
 * For parsing data from en.wikitionary.org.
 */

require.def('lingwo_dictionary/importer/wiktionary/en',
    ['lingwo_dictionary/Entry',
     'lingwo_dictionary/Language',
     'lingwo_dictionary/importer/mediawiki/WikiText',
     'lingwo_dictionary/importer/mediawiki/Producer',
    ],
    function (Entry, Language, WikiText, Producer) {
        var posList = ['Noun','Adjective','Verb','Proper noun','Interjection','Conjunction','Preposition','Pronoun',
            'Prefix','Initialism','Phrase','Adverb','Cardinal number','Ordinal number','Suffix','Idiom','Numeral'];

        var posMap = {
            'Noun': 'noun',
            'Adjective': 'adjective',
            'Verb': 'verb',
            'Proper noun': 'noun',
            'Interjection': 'exclamation',
            'Conjunction': 'conjunction',
            'Preposition': 'preposition',
            'Pronoun': 'pronoun',
            'Prefix': 'prefix',
            'Initialism': 'abbreviation',
            'Phrase': 'phrase',
            'Adverb': 'adverb',
            'Cardinal number': 'noun',
            'Ordinal number': 'noun',
            'Suffix': 'suffix',
            'Idiom': 'phrase',
            'Numeral': 'noun',
        };

        var langNames = {
            'en': 'English',
            'pl': 'Polish',
        };

        var parsers = {
            'en': function (entry) {
                //print (entry.serialize());
            }
        };

        function process(args) {
            var producer = new Producer(args.filename),
                handler = args.handler,
                code = args.lang_code,
                lang_name = langNames[code];

            function MyHandler(page) {
                var text = new WikiText(page.revision.text),
                    entry, found, pos;

                if (text.hasSection(lang_name)) {
                    text.text = text.getSection(lang_name);
                    found = false;

                    for(pos in posMap) {
                        if (text.hasSection(pos, 2)) {
                            entry = new Entry({
                                headword: page.title.toString(),
                                language: Language.languages[code],
                                pos: posMap[pos],
                            });
                            entry.setSource('en.wiktionary.org', {
                                raw: '=='+lang_name+'==\n\n'+text.getSection(pos, 2),
                                url: 'http://en.wiktionary.org/wiki/'+entry.headword,
                                license: 'CC-BY-SA-3.0',
                                timestamp: page.revision.timestamp.toString()
                            });

                            // pass to the language specific parser if there is one, to the
                            // handler and mark as found.
                            if (parsers[code]) {
                                parsers[code](entry);
                            }
                            handler(entry);
                            found = true;
                        }
                    }

                    if (!found) {
                        print ('Unknown POS: '+page.title);
                    }
                }
            }

            // execule it!
            args.handler = MyHandler;
            producer.run(args);
        }

        return {
            process: process,
            parsers: parsers
        };
    }
);


