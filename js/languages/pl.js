
/*
 * Defines the morphology of the Polish language.
 */

require.def('lingwo_dictionary/js/languages/pl',
    ['lingwo_dictionary/js/languages/common/Language'],
    function (Language) {
        var lang = Language.defineLanguage('pl');

        function generateAlphabet (single_letters, diagraphs, class_func) {
            class_func = class_func || function () { return []; };
            var alphabet = {}, i;
            var makeLetter = function (letter) {
                alphabet[letter] = {
                    'classes': class_func(letter),
                    'default_form': 'lower',
                    'forms': {
                        'lower': letter,
                        'upper': letter.substr(0,1).toUpperCase() + letter.substr(1)
                    }
                };
            };
            for (i = 0; i < single_letters.length; i++) {
                makeLetter(single_letters.substr(i,1));
            }
            for (i = 0; i < diagraphs.length; i++) {
                makeLetter(diagraphs[i]);
            }
            return alphabet;
        };
        
        // must be done for diagraphs, maintaining forms and setting letter classes (ie. vowel).
        lang.alphabet = generateAlphabet('aąbcćdeęfghijklłmnńoópqrsśtuvwxyzżź', ['ch','dz','dż','dź','sz','rz','sz'],
            function (l) {
                var classes = [];
                if (l == 'a' || l == 'ą' || l == 'e' || l == 'ę' || l == 'i' || l == 'o' || l == 'ó' || l == 'u' || l == 'y') {
                    classes.push('vowel');
                } else {
                    classes.push('consonant');
                }
                if (l == 'ą' || l == 'ę') {
                    classes.push('nasal');
                }
                if (l == 'ć' || l == 'ń' || l == 'ś' || l == 'ź' || l == 'dź') {
                    classes.push('soft');
                }
                return classes;
            }
        );

        /*
        lang.Word.extend({
            'thinger': function () { return 'blarney2' }
        });
        var word = new lang.Word('blah');
        print(word.thinger());
        */

        function stemChange (word) {
            return word.ending('k').replace('c') ||
                   word.ending('g').replace('dz') ||
                   word.ending('r').replace('rz') ||
                   word.ending('st').replace('ści') ||
                   word.ending('t').replace('ci') ||
                   word.ending('sn').replace('śni') ||
                   word.ending('zn').replace('źni') ||
                   word.ending('sm').replace('śmi') ||
                   word.ending('ch').replace('sz') ||
                   word.ending('zd').replace('ździ') ||
                   word.ending('d').replace('dzi') ||
                   word.ending('sł').replace('śl') ||
                   word.ending('zł').replace('źl') ||
                   word.ending('ł').replace('l') ||
                   word.ending('b','f','p','s','w','z','m','n').append('i') ||
                   word;
        };

        function append_i (word) {
            if (word.hasEnding('j', 'l'))
                return word;

            return word.ending('ń').replace('ni') ||
                   word.ending('ć').replace('ci') ||
                   word.ending('ź').replace('zi') ||
                   word.ending('dź').replace('dzi') ||
                   word.ending('ś').replace('si') ||
                   word.append('i');
        };

        // Calls the append_i function if last letter is soft.
        function append_i_on_soft (word) {
            if (word.hasEnding(Language.cls('soft'))) {
                return append_i(word);
            }
            return word;
        };

        // Appends -y to the end of a word, converting to -i if proceded by
        // a 'k' or 'g'.
        function append_y (word, soft) {
            if (soft) {
                return word.append('i');
            }
            return word.ending('k','g').append('i') ||
                   word.append('y');
        };

        function append_e (word, soft) {
            if (soft) {
                return word.append('ie');
            }
            return word.ending('k','g').append('ie') ||
                   word.append('e');
        };

        /*
         * Nouns
         */

        lang.fields.noun = {
            'animate': {
                type: 'class',
                automatic: function (entry) {
                    return entry.getField('virile');
                }
            },

            'virile': {
                type: 'class'
            },

            'animate': {
                type: 'class'
            },

            'gender': {
                type: 'option',
                automatic: function (entry) {
                    var word = entry.getWord();
                    return word.ending('o', 'e', 'ę', 'um').result('neuter')  ||
                           word.ending(Language.cls('vowel')).result('feminine') ||
                           'masculine';
                }
            },

            '*stem': {
                type: 'form',
                automatic: function (entry) {
                    var word = entry.getWord();
                    return word.ending('a', 'o', 'e', 'um').drop() ||
                           word;
                }
            },

            '*stem.singular': {
                type: 'form',
                automatic: function (entry) {
                    var word = entry.getWord();
                    return word.ending('mię').replace('mieni') ||
                           word.ending('ę').append('ci')       ||
                           entry.getWord('*stem');
                }
            },

            '*stem.plural': {
                type: 'form',
                automatic: function (entry) {
                    var word = entry.getWord();
                    return word.ending('mię').replace('mion') ||
                           word.ending('ę').append('t')       ||
                           entry.getWord('*stem');
                }
            },

            /*
             * Nominative.
             */

            'nominative.singular': {
                type: 'form',
                automatic: function (entry) {
                    return entry.getWord();
                }
            },

            'nominative.plural': {
                type: 'form',
                automatic: function (entry) {
                    var word = entry.getWord(), ending;
                    if (entry.getField('gender') == 'masculine' && entry.getField('virile')) {
                        // masculine virile, yo!
                        var stem = entry.getWord('*stem.plural');

                        if (ending = stem.endingOrFalse('rz','sz','cz','l','j')) {
                            // softs and psuedo softs that take -e
                            return ending.append('e');
                        }
                        else if (ending = stem.endingOrFalse('ch')) {
                            return ending.replace('si');
                        }
                        else {
                            stem = stemChange(stem);
                            // apply the hard ending of necessary
                            return stem.ending('c','dz','rz').append('y') ||
                                   stem.ending('l').append('i')           ||
                                   stem;
                        }
                    }
                    else if (entry.getField('gender') == 'feminine' && word.hasEnding('cz', 'sz')) {
                        // this is a sort of funny case, thats different than you would expect
                        return word.append('y');
                    }
                    else if ((ending = word.endingOrFalse('ość')) && entry.getField('gender') == 'feminine') {
                        // feminine abstract nouns
                        return ending.replace('ości');
                    }
                    else {
                        // the "standard" cases
                        var stem = entry.getWord('*stem.plural');
                        
                        if (entry.getField('gender') == 'neuter')
                            return stem.append('a');

                        if (stem.hasEnding(Language.cls('soft')))
                            return append_i(stem).append('e');

                        // l and j, i, and all the hard husher-like things
                        return stem.ending('j', 'l', 'i', 'c', 'cz', 'rz', 'sz', 'dz', 'ż', 'dż').append('e') ||
                               append_y(stem);
                    }
                }
            },

            /* 
             * Accusative
             */

            'accusative.singular': {
                type: 'form',
                automatic: function (entry) {
                    var word = entry.getWord();

                    if (word.hasEnding('a','i')) {
                        return entry.getWord('*stem.singular').append('ę');
                    }
                    else if (entry.getField('gender') == 'masculine' && entry.getField('animate')) {
                        return entry.getWord('genitive.singular');
                    }
                    
                    return word;
                }
            },

            'accusative.plural': {
                type: 'form',
                automatic: function (entry) {
                    if (entry.getField('virile')) {
                        return entry.getWord('genitive.plural');
                    }
                    return entry.getWord('nominative.plural');
                }
            },

            /*
             * Genetive
             */

            'genitive.singular': {
                type: 'form',
                automatic: function (entry) {
                    var word = entry.getWord(), stem = entry.getWord('*stem.singular');
                    var gender = entry.getField('gender');

                    if (gender == 'masculine' && word.hasEnding('a')) {
                        return stem.ending('g','k').append('i') ||
                               stem.append('y');
                    }
                    else if (gender == 'feminine') {
                        if (stem.hasEnding('j')) {
                            return stem.ending('cj','zj','sj').append('i') ||
                                   stem.ending(1).replace('i');
                        }
                        else if (stem.hasEnding('i')) {
                            return stem.ending('di','chi','fi','gi','ki','li','ri','ti').append('i') ||
                                   stem;
                        }

                        return stem.ending('l','w').append('i') ||
                               stem.ending(Language.cls('soft')).result(append_i(stem)) ||
                               append_y(stem);
                    }
                    else if (gender == 'masculine') {
                        if (entry.getField('animate')) {
                            if (stem.hasEnding(Language.cls('soft'))) {
                                return append_i(stem).append('a');
                            }

                            return stem.append('a');
                        }

                        // the default ending for inanimate is 'u'
                        return stem.append('u');
                    }
                    else if (gender == 'neuter') {
                        return stem.append('a');
                    }
                }
            },

            'genitive.plural': {
                type: 'form',
                automatic: function (entry) {
                    var word = entry.getWord(), stem = entry.getWord('*stem.plural'), ending, endWord;
                    var gender = entry.getField('gender');

                    if (gender == 'masculine') {
                        if (ending = stem.endingOrFalse('ń')) {
                            if (entry.getField('virile')) {
                                return ending.replace('niów');
                            }
                            return ending.replace('ni');
                        }
                        else if (stem.hasEnding('l')) {
                            return stem.append('i');
                        }
                        else if (ending = stem.endingOrFalse('j')) {
                            return ending.replace('i');
                        }
                        else if (stem.hasEnding(Language.cls('soft'))) {
                            return append_i(stem);
                        }

                        return stem.ending('cz','rz','sz','dz','ż').append('y') ||
                               stem.append('ów');
                    }
                    else if (word.hasEnding('um')) {
                        return stem.append('ów');
                    }
                    else if (word.hasEnding('c','cz','sz','rz','ż','nia','ja','j')) {
                        return entry.getWord('genitive.singular');
                    }
                    else {
                        if (stem.hasEnding('i')) {
                            stem = stem.ending(1).drop();
                            // soften consonants
                            stem = stem.ending('n').replace('ń') ||
                                   stem.ending('c').replace('ć') ||
                                   stem.ending('s').replace('ś') ||
                                   stem;
                        }

                        // there is a consonant shift in this form
                        if (ending = stem.endingOrFalse('ęt')) {
                            stem = ending.replace('ąt');
                        }

                        // Now!  We attempt to make the consonant clusters pronouncable
                        if ((stem.hasEnding([Language.cls('consonant'), Language.cls('consonant'), Language.cls('consonant')]) && !stem.hasEnding('r')) ||
                            (stem.hasEnding([Language.cls('consonant'), Language.cls('consonant')]) && !stem.hasEnding('r','ć','sk','zd','rc','st')))
                        {
                            // take the final consonant off and save it in a word
                            ending = stem.ending(Language.cls('consonant'));
                            endWord = ending.toWord();
                            stem = ending.drop();

                            // put the final consonant back on
                            stem = append_e(stem).concat(endWord);
                        }

                        return stem;
                    }
                }
            },

            /*
             * Dative.
             */

            'dative.singular': {
                type: 'form',
                automatic: function (entry) {
                    var gender = entry.getField('gender'),
                        word   = entry.getWord(),
                        stem   = entry.getWord('*stem.singular');
                    if (gender == 'feminine' || word.hasEnding('a')) {
                        if (stem.hasEnding('i')) {
                            // maybe?
                            return entry.getWord('genitive.singular');
                        }

                        return stem.ending('c', 'cz').append('y') ||
                               stemChange(stem).append('e');
                    }
                    else if (gender == 'masculine') {
                        return append_i_on_soft(stem).append('owi');
                    }
                    else if (gender == 'neuter') {
                        if (word.hasEnding('um')) {
                            return word;
                        }
                        return stem.append('u');
                    }
                }
            },

            'dative.plural': {
                type: 'form',
                automatic: function (entry) {
                    return append_i_on_soft(entry.getWord('*stem.plural')).append('om');
                }
            },

            /*
             * Instrumental
             */

            'instrumental.singular': {
                type: 'form',
                automatic: function (entry) {
                    var gender = entry.getField('gender'),
                        word   = entry.getWord(),
                        stem   = entry.getWord('*stem.singular');
                    
                    if (gender == 'feminine' || word.hasEnding('a')) {
                        return append_i_on_soft(stem).append('ą');
                    }

                    return append_e(append_i_on_soft(stem)).append('m');
                }
            },

            'instrumental.plural': {
                type: 'form',
                automatic: function (entry) {
                    return append_i_on_soft(entry.getWord('*stem.plural')).append('ami');
                }
            },

            /*
             * Locative
             */

            'locative.singular': {
                type: 'form',
                automatic: function (entry) {
                    var word = entry.getWord(),
                        stem = entry.getWord('*stem.singular');

                    if (entry.getField('gender') == 'feminine' || word.hasEnding('a')) {
                        return entry.getWord('dative.singular');
                    }

                    if (word.hasEnding('um')) {
                        return word;
                    }

                    if (stem.hasEnding(
                        /* hard */
                        'k', 'g', 'ch', 'j', 'l', 'c', 'cz', 'sz', 'rz', 'ż', 'dż',
                        /* soft */
                        'i', 'ń', 'ć', 'ź', 'dź'))
                    {
                        return append_i_on_soft(stem).append('u');
                    }

                    return stemChange(stem).append('e');
                }
            },

            'locative.plural': {
                type: 'form',
                automatic: function (entry) {
                    return append_i_on_soft(entry.getWord('*stem.plural')).append('ach');
                }
            }
        };

        /*
         * Adjectives
         */

        lang.fields.adjective = {
            'soft': {
                type: 'class',
                automatic: function (entry) {
                    var word = entry.getWord();
                    return word.hasEnding('i') && !word.hasEnding('ki', 'gi');
                }
            },

            '*stem': {
                type: 'form',
                automatic: function (entry) {
                    return entry.getWord().ending(1).drop();
                }
            },

            /*
             * Nominative
             */

            'nominative.singular.masculine': {
                type: 'form',
                automatic: function (entry) {
                    return append_y(entry.getWord('*stem'), entry.getField('soft'));
                }
            },

            'nominative.singular.feminine': {
                type: 'form',
                automatic: function (entry) {
                    return entry.getWord('*stem').append(
                        entry.getField('soft') ? 'ia' : 'a'
                    );
                }
            },

            'nominative.singular.neuter': {
                type: 'form',
                automatic: function (entry) {
                    return append_e(entry.getWord('*stem'), entry.getField('soft'));
                }
            },

            'nominative.plural.non_virile': {
                type: 'form',
                automatic: function (entry) {
                    return entry.getWord('nominative.singular.neuter');
                }
            },

            'nominative.plural.virile': {
                type: 'form',
                automatic: function (entry) {
                    var stem = entry.getWord('*stem'), ending;

                    if (entry.getField('soft'))
                        return stem.append('i');
                    
                    if (ending = stem.endingOrFalse('ż')) {
                        // TODO: shouldn't nouns do this transformation too?
                        return ending.replace('zi');
                    }
                    else if (ending = stem.endingOrFalse('sz')) {
                        // TODO: shouldn't nouns do this transformation too?
                        return ending.replace('si');
                    }
                    else if (ending = stem.endingOrFalse('on')) {
                        return ending.replace('eni');
                    }
                    else {
                        stem = stemChange(stem);
                        
                        if (stem.hasEnding('c','dz','rz')) {
                            return stem.append('y');
                        }
                        else if (!stem.hasEnding('i')) {
                            return stem.append('i');
                        }

                        return stem;
                    }
                }
            },

            /*
             * Accusative.
             */

            'accusative.singular.feminine': {
                type: 'form',
                automatic: function (entry) {
                    return entry.getWord('*stem').append(
                        entry.getField('soft') ? 'ią' : 'ą'
                    );
                }
            },

            'accusative.singular.neuter': {
                type: 'form',
                automatic: function (entry) {
                    return entry.getWord('nominative.singular.neuter');
                }
            },

            'accusative.singular.masculine.animate': {
                type: 'form',
                automatic: function (entry) {
                    return entry.getWord('genitive.singular.masculine');
                }
            },

            'accusative.singular.masculine.inanimate': {
                type: 'form',
                automatic: function (entry) {
                    return entry.getWord('nominative.singular.masculine');
                }
            },

            'accusative.plural.virile': {
                type: 'form',
                automatic: function (entry) {
                    return entry.getWord('genitive.plural');
                }
            },

            'accusative.plural.non_virile': {
                type: 'form',
                automatic: function (entry) {
                    return entry.getWord('nominative.plural.non_virile');
                }
            },

            /*
             * Genitive
             */

            'genitive.singular.feminine': {
                type: 'form',
                automatic: function (entry) {
                    return append_e(entry.getWord('*stem'), entry.getField('soft')).append('j');
                }
            },

            'genitive.singular.masculine': {
                type: 'form',
                automatic: function (entry) {
                    return append_e(entry.getWord('*stem'), entry.getField('soft')).append('go');
                }
            },

            'genitive.singular.neuter': {
                type: 'form',
                automatic: function (entry) {
                    return entry.getWord('genitive.singular.masculine');
                }
            },

            'genitive.plural': {
                type: 'form',
                automatic: function (entry) {
                    return append_y(entry.getWord('*stem'), entry.getField('soft')).append('ch');
                }
            },

            /*
             * Dative
             */

            'dative.singular.feminine': {
                type: 'form',
                automatic: function (entry) {
                    return append_e(entry.getWord('*stem'), entry.getField('soft')).append('j');
                }
            },

            'dative.singular.masculine': {
                type: 'form',
                automatic: function (entry) {
                    return append_e(entry.getWord('*stem'), entry.getField('soft')).append('mu');
                }
            },

            'dative.singular.neuter': {
                type: 'form',
                automatic: function (entry) {
                    return entry.getWord('dative.singular.masculine');
                }
            },

            'dative.plural': {
                type: 'form',
                automatic: function (entry) {
                    return append_y(entry.getWord('*stem'), entry.getField('soft')).append('m');
                }
            },

            /*
             * Instrumental
             */

            'instrumental.singular.feminine': {
                type: 'form',
                automatic: function (entry) {
                    return entry.getWord('*stem').append(
                        entry.getField('soft') ? 'ią' : 'ą'
                    );
                }
            },

            'instrumental.singular.masculine': {
                type: 'form',
                automatic: function (entry) {
                    return append_y(entry.getWord('*stem'), entry.getField('soft')).append('m');
                }
            },

            'instrumental.singular.neuter': {
                type: 'form',
                automatic: function (entry) {
                    return entry.getWord('instrumental.singular.masculine');
                }
            },

            'instrumental.plural': {
                type: 'form',
                automatic: function (entry) {
                    return append_y(entry.getWord('*stem'), entry.getField('soft')).append('mi');
                }
            },

            /*
             * Locative
             */

            'locative.singular.masculine': {
                type: 'form',
                automatic: function (entry) {
                    return append_y(entry.getWord('*stem'), entry.getField('soft')).append('m');
                }
            },

            'locative.singular.feminine': {
                type: 'form',
                automatic: function (entry) {
                    return append_e(entry.getWord('*stem'), entry.getField('soft')).append('j');
                }
            },

            'locative.singular.neuter': {
                type: 'form',
                automatic: function (entry) {
                    return entry.getWord('locative.singular.masculine');
                }
            },

            'locative.plural': {
                type: 'form',
                automatic: function (entry) {
                    return append_y(entry.getWord('*stem'), entry.getField('soft')).append('ch');
                }
            }
        };

        /*
         * Verbs
         */

        lang.fields.verb = {
            'conjugation': {
                type: 'option',
                automatic: function (entry) {
                    // Here we attempt to guess the conjugation class, which has the highest
                    // likelyhood of being inaccurate.
                    var word = entry.getWord();
                    return word.ending('ować','iwać','awać','ywać').result('first') ||
                           word.ending('ać','ieć').result('third') ||
                           word.ending('ić', 'yć', 'eć').result('second') ||
                           // TODO: 'unknown' is probably better, but we need something is acceptable to
                           // the server.
                           '';
                           //'unknown';
                }
            },

            '*stem': {
                type: 'form',
                automatic: function (entry) {
                    // Now, we attempt to guess the verb stem using what we know about the conjugation
                    // class.  This has the second highest likelyhood of being a bad guess.
                    var word = entry.getWord(), ending;
                    var conj = entry.getField('conjugation');

                    if ((ending = word.endingOrFalse('ować','iwać','ywać')) && conj != 'third') {
                        // an -ować, -iwać, or -ywać verb where we didn't manually set the conjugation class
                        // to the third.
                        word = ending.replace('u');
                    }
                    else if (ending = word.endingOrFalse('awać')) {
                        word = ending.replace('a');
                    }
                    else if (ending = word.endingOrFalse('ć')) {
                        word = ending.drop();
                    }

                    if ((ending = word.endingOrFalse('e')) && conj == 'second') {
                        word = ending.replace('y');
                    }

                    if (word.hasEnding(Language.cls('vowel')) && (conj == 'first' || conj == 'third')) {
                        word = word.append('j');
                    }

                    return word;
                }
            },

            'nonpast.singular.1p': {
                type: 'form',
                automatic: function (entry) {
                    var word = entry.getWord('*stem'), ending;
                    if (entry.getField('conjugation') == 'third') {
                        return word.ending(1).drop().append('m');
                    }

                    if (ending = word.endingOrFalse('y')) {
                        word = ending.drop();
                    }
                    
                    return word.append('ę');
                }
            },

            'nonpast.singular.2p': {
                type: 'form',
                automatic: function (entry) {
                    return entry.getWord('nonpast.singular.3p').append('sz');
                }
            },

            'nonpast.singular.3p': {
                type: 'form',
                automatic: function (entry) {
                    var stem = entry.getWord('*stem');
                    var conj = entry.getField('conjugation');

                    if (conj == 'first') {
                        return stem.append('e');
                    }
                    else if (conj == 'third') {
                        return stem.ending(1).drop();
                    }

                    return stem;
                }
            },

            'nonpast.plural.1p': {
                type: 'form',
                automatic: function (entry) {
                    return entry.getWord('nonpast.singular.3p').append('my');
                }
            },

            'nonpast.plural.2p': {
                type: 'form',
                automatic: function (entry) {
                    return entry.getWord('nonpast.singular.3p').append('cie');
                }
            },

            'nonpast.plural.3p': {
                type: 'form',
                automatic: function (entry) {
                    var word = entry.getWord('*stem'), ending;

                    if (ending = word.endingOrFalse('y')) {
                        word = ending.drop();
                    }

                    return word.append('ą');
                }
            }
        };

        return lang;
    }
);

