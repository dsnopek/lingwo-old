
require(
    ['lingwo_dictionary/util/TestCase',
     'lingwo_dictionary/Entry',
     'lingwo_dictionary/languages/en',
     'lingwo_dictionary/importer/wiktionary/en',
     'lingwo_dictionary/util/json2',
    ],
    function (TestCase, Entry, en, wiktionary_en, JSON) {
        TestCase.subclass({
            testParseFormsVerb: function () {
                var doit = function (headword, parts) {
                    var forms = wiktionary_en._internal.formParsers.verb(
                        new Entry({ headword: headword }), parts);
                    return [forms['infinitive'], forms['-s'], forms['-ing'], forms['2nd'], forms['3rd']].join(':');
                };

                this.assertEquals(doit('buzz',   ['buzz',  'es']), 'to buzz:buzzes:buzzing:buzzed:buzzed');
                this.assertEquals(doit('dye',    ['dye',   'd' ]), 'to dye:dyes:dyeing:dyed:dyed');
                this.assertEquals(doit('admire', ['admir', 'es']), 'to admire:admires:admiring:admired:admired');

                this.assertEquals(doit('bus',    ['bus', 's', 'es' ]), 'to bus:busses:bussing:bussed:bussed');
                this.assertEquals(doit('cry',    ['cr',  'i', 'ed' ]), 'to cry:cries:crying:cried:cried');
                this.assertEquals(doit('tie',    ['t',   'y', 'ing']), 'to tie:ties:tying:tied:tied');
                this.assertEquals(doit('trek',   ['trek','k', 'ed' ]), 'to trek:treks:trekking:trekked:trekked');

                this.assertEquals(doit('set', ['sets','setting','set']), 'to set:sets:setting:set:set');
                this.assertEquals(doit('do',  ['does','doing','did','done']), 'to do:does:doing:did:done');

                this.assertEquals(doit('can',  ['inf=-','can','-','could','-']), ':can::could:');

            },

            testParseFormsAdj: function () {
                var doit = function (headword, parts) {
                    var forms = wiktionary_en._internal.formParsers.adjective(
                        new Entry({ headword: headword }), parts);
                    for(var name in forms) {
                        if (forms[name] instanceof Array) {
                            forms[name] = forms[name].join(',');
                        }
                    }
                    return [forms['more'], forms['most']].join(':');
                };

                this.assertEquals(doit('beautiful', []),                'more beautiful:most beautiful');
                this.assertEquals(doit('tall',      ['er']),            'taller:tallest');
                this.assertEquals(doit('pretty',    ['pretti','er']),   'prettier:prettiest');
                this.assertEquals(doit('good',      ['better','best']), 'better:best');
                this.assertEquals(doit('annual',    ['-']),             ':');
                this.assertEquals(doit('abject',    ['er','more']),     'abjecter,more abject:abjectest,most abject');
                this.assertEquals(doit('funky',     ['funkier']),       'funkier:most funky');
            },
        }).run();
    }
);


