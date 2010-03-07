
/*
 * Test data for English
 */

require.def('lingwo_dictionary/languages/en.test-data',
    ['lingwo_dictionary/Entry',
     'lingwo_dictionary/languages/en',
    ],
    function (Entry, en) {
        entries = {};

        entries["house"] = new Entry({
            "language": en,
            "headword": "house",
            "pos": "noun"
        });

        return entries;
    }
);

