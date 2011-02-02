
require(
    ['lingwo_dictionary/util/TestCase',
     'lingwo_dictionary/Entry',
     'lingwo_dictionary/languages/en',
     'lingwo_dictionary/importer/wiktionary/en',
     'lingwo_dictionary/util/json2',
    ],
    function (TestCase, Entry, en, wiktionary_en, JSON) {
        function doFormParserFactory(pos, compose) {
            return function (name, headword, parts) {
                var forms = wiktionary_en._internal.formParsers[pos](
                    name, new Entry({ headword: headword }), parts);
                for(name in forms) {
                    if (forms[name] instanceof Array) {
                        forms[name] = forms[name].join(',');
                    }
                }
                return compose(forms).join(':');
            };
        }

        // test form parsing
        TestCase.subclass({
            testParseFormsVerb: function () {
                var doit = doFormParserFactory('verb', function (forms) {
                    return [forms['infinitive'], forms['-s'], forms['-ing'], forms['2nd'], forms['3rd']];
                });

                this.assertEquals(doit('en-verb', 'buzz',   ['buzz',  'es']), 'to buzz:buzzes:buzzing:buzzed:buzzed');
                this.assertEquals(doit('en-verb', 'dye',    ['dye',   'd' ]), 'to dye:dyes:dyeing:dyed:dyed');
                this.assertEquals(doit('en-verb', 'admire', ['admir', 'es']), 'to admire:admires:admiring:admired:admired');

                this.assertEquals(doit('en-verb', 'bus',    ['bus', 's', 'es' ]), 'to bus:busses:bussing:bussed:bussed');
                this.assertEquals(doit('en-verb', 'cry',    ['cr',  'i', 'ed' ]), 'to cry:cries:crying:cried:cried');
                this.assertEquals(doit('en-verb', 'tie',    ['t',   'y', 'ing']), 'to tie:ties:tying:tied:tied');
                this.assertEquals(doit('en-verb', 'trek',   ['trek','k', 'ed' ]), 'to trek:treks:trekking:trekked:trekked');

                this.assertEquals(doit('en-verb', 'set', ['sets','setting','set']), 'to set:sets:setting:set:set');
                this.assertEquals(doit('en-verb', 'do',  ['does','doing','did','done']), 'to do:does:doing:did:done');

                this.assertEquals(doit('en-verb', 'can',  ['inf=-','can','-','could','-']), ':can::could:');

            },

            testParseFormsAdj: function () {
                var doit = doFormParserFactory('adjective', function (forms) {
                    return [forms['more'], forms['most']];
                });

                this.assertEquals(doit('en-adj', 'beautiful', []),                'more beautiful:most beautiful');
                this.assertEquals(doit('en-adj', 'tall',      ['er']),            'taller:tallest');
                this.assertEquals(doit('en-adj', 'pretty',    ['pretti','er']),   'prettier:prettiest');
                this.assertEquals(doit('en-adj', 'good',      ['better','best']), 'better:best');
                this.assertEquals(doit('en-adj', 'annual',    ['-']),             ':');
                this.assertEquals(doit('en-adj', 'abject',    ['er','more']),     'abjecter,more abject:abjectest,most abject');
                this.assertEquals(doit('en-adj', 'funky',     ['funkier']),       'funkier:most funky');
            },

            testParseFormsAdv: function () {
                var doit = doFormParserFactory('adverb', function (forms) {
                    return [forms['more'], forms['most']];
                });

                this.assertEquals(doit('en-adv', 'beautifully', []),                'more beautifully:most beautifully');
                this.assertEquals(doit('en-adv', 'beautifully', ['']),              'more beautifully:most beautifully');
                this.assertEquals(doit('en-adv', 'fast',        ['er']),            'faster:fastest');
                this.assertEquals(doit('en-adv', 'last',        ['lat','er']),      'later:latest');
                this.assertEquals(doit('en-adv', 'well',        ['better','best']), 'better:best');
                this.assertEquals(doit('en-adv', 'uniquely',    ['-']),             ':');
                this.assertEquals(doit('en-adv', 'test',        ['er','more']),     'tester,more test:testest,most test');
            },

            testParseFormsNoun: function () {
                var doit = doFormParserFactory('noun', function (forms) {
                    return [forms['plural_type'],forms['plural']];
                });

                this.assertEquals(doit('en-noun', 'noun',         []),                 ':nouns');
                this.assertEquals(doit('en-noun', 'noun',         ['s']),              ':nouns');
                this.assertEquals(doit('en-noun', 'noun',         ['s','?']),          ':nouns');
                this.assertEquals(doit('en-noun', 'church',       ['es']),             ':churches');
                this.assertEquals(doit('en-noun', 'belfry',       ['belfr','ies']),    ':belfries');
                this.assertEquals(doit('en-noun', 'genus',        ['gen','era']),      ':genera');
                this.assertEquals(doit('en-noun', 'awe',          ['-']),              'singular:');
                this.assertEquals(doit('en-noun', 'beer',         ['s','-']),          ':beers');
                this.assertEquals(doit('en-noun', 'rain',         ['-','s']),          ':rains');
                this.assertEquals(doit('en-noun', 'greenery',     ['-','greeneries']), ':greeneries');
                this.assertEquals(doit('en-noun', 'abliguration', ['!']),              'singular:');
                this.assertEquals(doit('en-noun', 'abliguration', ['!','s']),          'singular:');
                this.assertEquals(doit('en-noun', 'tuchus',       ['?']),              'singular:');
                this.assertEquals(doit('en-noun', 'tuchus',       ['?','s']),          'singular:');
                this.assertEquals(doit('en-noun', 'Abkhaz',       ['Abkhaz']),         ':Abkhaz');
                this.assertEquals(doit('en-noun', 'octopus',      ['es','pl2=octopi','pl3=octopodes']),
                    ':octopuses,octopi,octopodes');
                this.assertEquals(doit('en-noun', 'fuzzy die',
                    ['sg=[[fuzzy]] [[die]]',"pl=''Depending on meaning, either'' '''fuzzy die''' or '''[[fuzzy dice]]'''"]),
                    ':fuzzy die,fuzzy dice');
                this.assertEquals(doit('en-noun', 'minimum', ['pl2=minima','pl=minimums']), ':minimums,minima');

                this.assertEquals(doit('en-plural-noun', 'underpants', []), 'plural:');
                this.assertEquals(doit('en-plural noun', 'underpants', []), 'plural:');
            }
        }).run();

        function parsePronunciation(text) {
            var entry = new Entry();
            wiktionary_en._internal.parsePronunciation(entry, text);
            return entry.pron;
        }

        // test pronunciation parser
        TestCase.subclass({
            testParseSimple: function () {
                var pron = parsePronunciation(
                    "===Pronunciation===\n" +
                    "* {{IPA|/ˈstɔːɹi/}}\n\n"
                );

                this.assertEquals(pron[0].ipa,   "ˈstɔːɹi");
                this.assertEquals(pron[0].tag,   undefined);
                this.assertEquals(pron[0].audio, undefined);
            },

            testParseAccent: function () {
                var pron = parsePronunciation(
                    "===Pronunciation===\n" +
                    "* {{a|US}} {{IPA|/ˈstɔːɹi/}}\n\n"
                );

                this.assertEquals(pron[0].ipa,   "ˈstɔːɹi");
                this.assertEquals(pron[0].tag,   "US");
                this.assertEquals(pron[0].audio, undefined);
            },

            testParseAudio1: function () {
                var pron = parsePronunciation(
                    "===Pronunciation===\n" +
                    "* {{audio|en-us-story.ogg|Audio (US)}}\n\n"
                );

                this.assertEquals(pron[0].ipa,   undefined);
                this.assertEquals(pron[0].tag,   "US");
                this.assertEquals(pron[0].audio, "http://upload.wikimedia.org/wikipedia/commons/1/11/En-us-story.ogg");
            },

            testParseAudio2: function () {
                var pron = parsePronunciation(
                    "===Pronunciation===\n" +
                    "* {{a|US}} {{IPA|/ˈstɔːɹi/}}\n" +
                    "* {{audio|en-us-story.ogg|Audio (US)}}\n\n"
                );

                this.assertEquals(pron[0].ipa,   "ˈstɔːɹi");
                this.assertEquals(pron[0].tag,   "US");
                this.assertEquals(pron[0].audio, "http://upload.wikimedia.org/wikipedia/commons/1/11/En-us-story.ogg");
            },

            testParseAudio3: function () {
                var pron = parsePronunciation(
                    "===Pronunciation===\n" +
                    "* {{IPA|/ˈstɔːɹi/}}\n" +
                    "* {{audio|en-uk-story.ogg|Audio (UK)}}\n" +
                    "* {{audio|en-us-story.ogg|Audio (US)}}\n" +
                    "* {{rhymes|ɔːri}}\n\n"
                );

                this.assertEquals(pron[0].ipa,   "ˈstɔːɹi");
                this.assertEquals(pron[0].tag,   "UK");
                this.assertEquals(pron[0].audio, "http://upload.wikimedia.org/wikipedia/commons/8/8c/En-uk-story.ogg");

                this.assertEquals(pron[1].ipa,   "ˈstɔːɹi");
                this.assertEquals(pron[1].tag,   "US");
                this.assertEquals(pron[1].audio, "http://upload.wikimedia.org/wikipedia/commons/1/11/En-us-story.ogg");
            },

            testParseAudio4: function () {
                var pron = parsePronunciation(
                    "===Pronunciation===\n" +
                    "* {{enPR|bo͝ok}}, {{IPA|/bʊk/}}, {{SAMPA|/bUk/}}\n" +
                    "* {{audio|en-us-book.ogg|Audio (US)}} ''plural'' {{audio|en-us-books.ogg|Audio (US)}}\n" +
                    "* {{audio|En-uk-book.ogg|Audio (UK)}}\n" +
                    "* {{rhymes|ʊk}}\n\n"
                );

                this.assertEquals(pron[0].ipa,   "bʊk");
                this.assertEquals(pron[0].tag,   "US");
                this.assertEquals(pron[0].audio, "http://upload.wikimedia.org/wikipedia/commons/3/3d/En-us-book.ogg");

                this.assertEquals(pron[1].ipa,   "bʊk");
                this.assertEquals(pron[1].tag,   "UK");
                this.assertEquals(pron[1].audio, "http://upload.wikimedia.org/wikipedia/commons/7/70/En-uk-book.ogg");
            },

            testParseAudio5: function () {
                var pron = parsePronunciation(
                    "===Pronunciation===\n" +
                    "* {{a|UK}} {{IPA|/wɜː(ɹ)d/}}\n" +
                    "* {{a|US}} {{enPR|wûrd}}, {{IPA|/wɝd/}}, {{SAMPA|/w3`d/}}\n" +
                    "* {{audio|en-us-word.ogg|Audio (US)}}\n" +
                    "* {{rhymes|ɜː(r)d}}\n\n"
                );

                this.assertEquals(pron[0].ipa,   "wɜː(ɹ)d");
                this.assertEquals(pron[0].tag,   "UK");
                this.assertEquals(pron[0].audio, undefined);

                this.assertEquals(pron[1].ipa,   "wɝd");
                this.assertEquals(pron[1].tag,   "US");
                this.assertEquals(pron[1].audio, "http://upload.wikimedia.org/wikipedia/commons/b/bf/En-us-word.ogg");
            }
        }).run();
    }
);


