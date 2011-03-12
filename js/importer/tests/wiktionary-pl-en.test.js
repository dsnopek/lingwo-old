
require(
    ['lingwo_old/util/TestCase',
     'lingwo/Entry',
     'lingwo/languages/en',
     'lingwo_old/importer/wiktionary/pl',
     'lingwo_old/util/json2',
    ],
    function (TestCase, Entry, en, wiktionary_pl, JSON) {
        TestCase.subclass({
            notice_raw: "== notice ({{język angielski}}) ==\n" +
                    "{{wymowa}} {{IPA|ˈnoʊ.təs}} {{audio|en-us-notice.ogg}}\n" +
                    "{{znaczenia}}\n" +
                    "''rzeczownik''\n" +
                    ":(1.1) [[ogłoszenie]]\n" +
                    ":(1.2) [[wypowiedzenie]]\n" +
                    ":(1.3) [[uwaga]]\n" +
                    "''czasownik''\n" +
                    ":(2.1) [[zauważać]]\n" +
                    "{{odmiana|angielski}} (1) {{lm}} notices; (2) notice, ~d, ~d; he ~s; be noticing\n" +
                    "{{przykłady}}\n" +
                    ": (1.1)\n" +
                    "{{składnia}}\n" +
                    "{{kolokacje}}\n" +
                    "{{synonimy}} (1.1) [[announcement]]\n" +
                    "{{antonimy}}\n" +
                    "{{pokrewne}}\n" +
                    "{{frazeologia}}\n" +
                    "{{etymologia}}\n" +
                    "{{uwagi}}\n",

            testParse1: function () {
                var text = this.notice_raw;
                var entry = new Entry();
                entry.headword = 'notice';
                entry.language = en;
                entry.pos = 'noun';
                entry.setSource('pl.wiktionary.org', {raw: text});

                var parser = wiktionary_pl.parsers.en;
                parser(entry);

                this.assertEquals(entry.pos, 'noun');
                this.assertEquals(entry.pron, '\ˈnoʊ.təs');

                // senses
                this.assertEquals(entry.translations.pl.senses[0].trans[0], 'ogłoszenie');
                this.assertEquals(entry.translations.pl.senses[1].trans[0], 'wypowiedzenie');
                this.assertEquals(entry.translations.pl.senses[2].trans[0], 'uwaga');

                //print (JSON.stringify(entry.translations));
            },

            testParse2: function () {
                var text = this.notice_raw;
                var entry = new Entry();
                entry.headword = 'notice';
                entry.language = en;
                entry.pos = 'verb';
                entry.setSource('pl.wiktionary.org', {raw: text});

                var parser = wiktionary_pl.parsers.en;
                parser(entry);

                this.assertEquals(entry.pos, 'verb');
                this.assertEquals(entry.pron, '\ˈnoʊ.təs');

                // senses
                this.assertEquals(entry.translations.pl.senses[0].trans[0], 'zauważać');

                //print (JSON.stringify(entry.translations));
            },
        }).run();
    }
);


