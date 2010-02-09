
(function () {
    Lingwo.importer.WiktionaryENSplitter = declare({
        _constructor: function (db, lang, code) {
            this.db = db;
            this.lang = lang;
            this.code = code;
        },

        posList: ['Noun','Adjective','Verb','Proper noun','Interjection','Conjunction','Preposition','Pronoun','Prefix','Initialism','Phrase','Adverb','Cardinal number','Ordinal number','Suffix','Idiom','Numeral'],

        process: function (page) {
            var text = new Lingwo.importer.WikiText(page.revision.text);
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
        },
    });
});


