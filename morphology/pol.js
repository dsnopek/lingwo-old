
/*
 * Defines the morphology of the Polish language.
 */

Lingwo.dictionary.defineLanguage('pol', function (lang, utils) {
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

                return stem.ending('k', 'g').append('i') ||
                       // l and j, i, and all the hard husher-like things
                       stem.ending('j', 'l', 'i', 'c', 'cz', 'rz', 'sz', 'dz', 'ż', 'dż').append('e') ||
                       stem.append('y');
            }
        },

        'accusative.singular': function (entry) {
            var word = entry.getForm();

            if (word.hasEnding('a','i')) {
                return entry.getForm('*stem.singular').append('ę');
            }
            else if (entry.getOption('gender') == 'masculine' && entry.isClass('animate')) {
                return entry.getForm('genitive.singular');
            }
            
            return word;
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
            return entry.getForm().ending(1).drop();
        },

        'nominative.singular.masculine': function (entry) {
            return entry.getForm();
        },

        'nominative.singular.feminine': function (entry) {
            return entry.getForm('*stem').append(
                entry.isClass('soft') ? 'ia' : 'a'
            );
        },

        'nominative.singular.neuter': function (entry) {
            var stem = entry.getForm('*stem');
            return stem.append(
                (stem.hasEnding('k', 'g') || entry.isClass('soft')) ? 'ie': 'e'
            );
        },

        'nominative.plural.non_virile': function (entry) {
            return entry.getForm('nominative.singular.neuter');
        },

        'nominative.plural.virile': function (entry) {
            var stem = entry.getForm('*stem'), ending;
            
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
        'accusative.singular.feminine': function () {
            
        }
        */
    };
});


