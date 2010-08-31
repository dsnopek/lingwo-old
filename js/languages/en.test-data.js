
/*
 * Test data for English
 */

require.def('lingwo_dictionary/languages/en.test-data',
    ['lingwo_dictionary/Entry',
     'lingwo_dictionary/languages/en',
    ],
    function (Entry, en) {
        function createEntries(l) {
            var entries = {}, i, args;
            for(i = 0; i < l.length; i++) {
                args = l[i];
                args.language = en;
                entries[args.headword] = new Entry(args);
            }
            return entries;
        };

        return createEntries([
            {   headword: 'house',
                pos: 'noun'
            },
            {   headword: 'kiss',
                pos: 'noun'
            },
            {   headword: 'dish',
                pos: 'noun'
            },
            {   headword: 'watch',
                pos: 'noun'
            },
            {   headword: 'boy',
                pos: 'noun'
            },
            {   headword: 'hero',
                pos: 'noun'
            },
            {   headword: 'lady',
                pos: 'noun'
            },
            {   headword: 'water',
                pos: 'noun',
                fields: {
                    plural_type: 'singular'
                }
            },
            {   headword: 'pants',
                pos: 'noun',
                fields: {
                    plural_type: 'plural'
                }
            },

            // verbs
            {   headword: 'read',
                pos: 'verb'
            },
            {   headword: 'try',
                pos: 'verb'
            },
            {   headword: 'buzz',
                pos: 'verb'
            },
            {   headword: 'veto',
                pos: 'verb'
            },
            {   headword: 'agree',
                pos: 'verb'
            },
            {   headword: 'believe',
                pos: 'verb'
            },
            {   headword: 'lie',
                pos: 'verb'
            },
            {   headword: 'work out',
                pos: 'verb'
            },

            // adjectives
            {   headword: 'old',
                pos: 'adjective'
            },
            {   headword: 'late',
                pos: 'adjective'
            },
            {   headword: 'easy',
                pos: 'adjective'
            },
            {   headword: 'fat',
                pos: 'adjective',
            },
            {   headword: 'intelligent',
                pos: 'adjective'
            },

            // adverbs
            {   headword: 'quietly',
                pos: 'adverb'
            }
    ]);
    }
);

