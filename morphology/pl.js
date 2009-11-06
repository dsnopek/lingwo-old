
/*
 * Defines the morphology of the Polish language.
 */

Lingwo.dictionary.defineLanguage('pl', function (lang, utils) {
    var generateAlphabet = function (single_letters, diagraphs, class_func) {
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
            makeLetter(single_letters[i]);
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

    var stemChange = function (word) {
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
               word.ending('sł').replace('śli') ||
               word.ending('zł').replace('źli') ||
               word.ending('ł').replace('li') ||
               word.ending('b','f','p','s','w','z','m','n').append('i') ||
               word;
    };

    var append_i = function (word) {
        if (word.hasEnding('j', 'l'))
            return word;

        return word.ending('ń').replace('ni') ||
               word.ending('ć').replace('ci') ||
               word.ending('ź').replace('zi') ||
               word.ending('dź').replace('dzi') ||
               word.ending('ś').replace('si') ||
               word.append('i');
    };

    var append_y = function (word) {
        return word.ending('k','g').append('i') ||
               word.append('y');
    };

    var append_e = function (word) {
        return word.ending('k','g').append('ie') ||
               word.append('e');
    };

    /*
     * Nouns
     */

    lang.morphology.options.noun = {
        'gender': function (entry) {
            var word = entry.getForm();
            return word.ending('o', 'e', 'ę', 'um').result('neuter')  ||
                   word.ending(utils.cls('vowel')).result('feminine') ||
                   'masculine';
        }
    };

    lang.morphology.forms.noun = {
        '*stem': function (entry) {
            var word = entry.getForm();
            return word.ending('a', 'o', 'e', 'um').drop() ||
                   word;
        },

        '*stem.singular': function (entry) {
            var word = entry.getForm();
            return word.ending('mię').replace('mieni') ||
                   word.ending('ę').append('ci')       ||
                   entry.getForm('*stem');
        },

        '*stem.plural': function (entry) {
            var word = entry.getForm();
            return word.ending('mię').replace('mion') ||
                   word.ending('ę').append('t')       ||
                   entry.getForm('*stem');
        },

        /*
         * Nominative.
         */

        'nominative.singular': function (entry) {
            return entry.getForm();
        },

        'nominative.plural': function (entry) {
            var word = entry.getForm(), ending;
            if (entry.getOption('gender') == 'masculine' && entry.isClass('virile')) {
                // masculine virile, yo!
                var stem = entry.getForm('*stem.plural');

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
                    return stem.ending('c','dz','rz').append('y') || stem;
                }
            }
            else if (entry.getOption('gender') == 'feminine' && word.hasEnding('cz', 'sz')) {
                // this is a sort of funny case, thats different than you would expect
                return word.append('y');
            }
            else if ((ending = word.endingOrFalse('ość')) && entry.getOption('gender') == 'feminine') {
                // feminine abstract nouns
                return ending.replace('ości');
            }
            else {
                // the "standard" cases
                var stem = entry.getForm('*stem.plural');
                
                if (entry.getOption('gender') == 'neuter')
                    return stem.append('a');

                if (stem.hasEnding(utils.cls('soft')))
                    return append_i(stem).append('e');

                // l and j, i, and all the hard husher-like things
                return stem.ending('j', 'l', 'i', 'c', 'cz', 'rz', 'sz', 'dz', 'ż', 'dż').append('e') ||
                       append_y(stem);
            }
        },

        /* 
         * Accusative
         */

        'accusative.singular': function (entry) {
            var word = entry.getForm();

            if (word.hasEnding('a','i')) {
                return entry.getForm('*stem.singular').append('ę');
            }
            else if (entry.getOption('gender') == 'masculine' && entry.isClass('animate')) {
                return entry.getForm('genitive.singular');
            }
            
            return word;
        },

        'accusative.plural': function (entry) {
            if (entry.isClass('virile')) {
                return entry.getForm('genitive.plural');
            }
            return entry.getForm('nominative.plural');
        },

        /*
         * Genetive
         */

        'genitive.singular': function (entry) {
            var word = entry.getForm(), stem = entry.getForm('*stem.singular');
            var gender = entry.getOption('gender');

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
                       stem.ending(utils.cls('soft')).result(append_i(stem)) ||
                       append_y(stem);
            }
            else if (gender == 'masculine') {
                if (entry.isClass('animate')) {
                    if (stem.hasEnding(utils.cls('soft'))) {
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
        },

        'genitive.plural': function (entry) {
            var word = entry.getForm(), stem = entry.getForm('*stem.plural'), ending;
            var gender = entry.getOption('gender');

            if (gender == 'masculine') {
                if (ending = stem.endingOrFalse('ń')) {
                    if (entry.isClass('virile')) {
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
                else if (stem.hasEnding(utils.cls('soft'))) {
                    return append_i(stem);
                }

                return stem.ending('cz','rz','sz','dz','ż').append('y') ||
                       stem.append('ów');
            }
            else if (word.hasEnding('um')) {
                return stem.append('ów');
            }
            else if (word.hasEnding('c','cz','sz','rz','ż','nia','ja','j')) {
                return entry.getForm('genitive.singular');
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
                if ((stem.hasEnding([utils.cls('consonant'), utils.cls('consonant'), utils.cls('consonant')]) && !stem.hasEnding('r')) ||
                    (stem.hasEnding([utils.cls('consonant'), utils.cls('consonant')]) && !stem.hasEnding('r','ć','sk','zd','rc','st')))
                {
                    // take the final consonant off and save it in a word
                    ending = stem.ending(utils.cls('consonant'));
                    endWord = ending.toWord();
                    stem = ending.drop();

                    // put the final consonant back on
                    stem = append_e(stem).concat(endWord);
                }

                return stem;
            }
        }
    };

    /*
     * Adjectives
     */

    lang.morphology.classes.adjective = {
        'soft': function (entry) {
            var word = entry.getForm();
            return word.hasEnding('i') && !word.hasEnding('ki', 'gi');
        }
    };

    lang.morphology.forms.adjective = {
        '*stem': function (entry) {
            var word = entry.getForm();
            return entry.isClass('soft') ? word : word.ending(1).drop();
        },

        /*
         * Nominative
         */

        'nominative.singular.masculine': function (entry) {
            return entry.getForm();
        },

        'nominative.singular.feminine': function (entry) {
            return entry.getForm('*stem').append('a');
        },

        'nominative.singular.neuter': function (entry) {
            return append_e(entry.getForm('*stem'));
        },

        'nominative.plural.non_virile': function (entry) {
            return entry.getForm('nominative.singular.neuter');
        },

        'nominative.plural.virile': function (entry) {
            var stem = entry.getForm('*stem'), ending;

            if (entry.isClass('soft'))
                return stem;
            
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
        },

        /*
         * Accusative.
         */

        'accusative.singular.feminine': function (entry) {
            return entry.getForm('*stem').append('ą');
        },

        'accusative.singular.neuter': function (entry) {
            return entry.getForm('nominative.singular.neuter');
        },

        'accusative.singular.masculine.animate': function (entry) {
            return entry.getForm('genitive.singular.masculine');
        },

        'accusative.singular.masculine.inanimate': function (entry) {
            return entry.getForm('nominative.singular.masculine');
        },

        'accusative.plural.virile': function (entry) {
            return entry.getForm('genitive.plural');
        },

        'accusative.plural.non_virile': function (entry) {
            return entry.getForm('nominative.plural.non_virile');
        },

        /*
         * Genitive
         */

        'genitive.singular.feminine': function (entry) {
            return append_e(entry.getForm('*stem')).append('j');
        },

        'genitive.singular.masculine': function (entry) {
            return append_e(entry.getForm('*stem')).append('go');
        },

        'genitive.singular.masculine': function (entry) {
            return entry.getForm('genitive.singular.masculine');
        },

        'genitive.plural': function (entry) {
            var stem = entry.getForm('*stem');
            return entry.isClass('soft') ? stem.append('ch') : append_y(stem).append('ch');
        }
    };

    /*
     * Verbs
     */

    lang.morphology.options.verb = {
        'conjugation': function (entry) {
            // Here we attempt to guess the conjugation class, which has the highest
            // likelyhood of being inaccurate.
            var word = entry.getForm();
            return word.ending('ować','iwać','awać','ywać').result('first') ||
                   word.ending('ać','ieć').result('third') ||
                   word.ending('ić', 'yć', 'eć').result('second') ||
                   'unknown';
        }
    };

    lang.morphology.forms.verb = {
        '*stem': function (entry) {
            // Now, we attempt to guess the verb stem using what we know about the conjugation
            // class.  This has the second highest likelyhood of being a bad guess.
            var word = entry.getForm(), ending;
            var conj = entry.getOption('conjugation');

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

            if (word.hasEnding(utils.cls('vowel')) && (conj == 'first' || conj == 'third')) {
                word = word.append('j');
            }

            return word;
        },

        'nonpast.singular.1p': function (entry) {
            var word = entry.getForm('*stem'), ending;
            if (entry.getOption('conjugation') == 'third') {
                return word.ending(1).drop().append('m');
            }

            if (ending = word.endingOrFalse('y')) {
                word = ending.drop();
            }
            
            return word.append('ę');
        },

        'nonpast.singular.2p': function (entry) {
            return entry.getForm('nonpast.singular.3p').append('sz');
        },

        'nonpast.singular.3p': function (entry) {
            var stem = entry.getForm('*stem');
            var conj = entry.getOption('conjugation');

            if (conj == 'first') {
                return stem.append('e');
            }
            else if (conj == 'third') {
                return stem.ending(1).drop();
            }

            return stem;
        },

        'nonpast.plural.1p': function (entry) {
            return entry.getForm('nonpast.singular.3p').append('my');
        },

        'nonpast.plural.2p': function (entry) {
            return entry.getForm('nonpast.singular.3p').append('cie');
        },

        'nonpast.plural.3p': function (entry) {
            var word = entry.getForm('*stem'), ending;

            if (ending = word.endingOrFalse('y')) {
                word = ending.drop();
            }

            return word.append('ą');
        }
    };
});


