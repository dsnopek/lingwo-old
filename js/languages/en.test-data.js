
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
    ]);
    }
);

