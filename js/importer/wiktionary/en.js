
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

        return {
            process: function (page) {
                var text = new WikiText(page.revision.text);
                if (text.hasSection(this.lang)) {
                    text.text = text.getSection(this.lang);
                    var found = false;
                    var self = this;
                    this.posList.forEach(function (pos) {
                        if (text.hasSection(pos, 2)) {
                            self.db.setEntry(self.code, pos.toLowerCase(), page.title,
                                '==Polish==\n\n'+text.getSection(pos, 2));
                            found = true;
                        }
                    });
                    if (!found) {
                        self.db.setEntry(self.code, 'unknown', page.title, text.text);
                        print ('Unknown POS: '+page.title);
                    }
                    else {
                        this.db.commit();
                    }
                }
            }
        };
    }
);


