
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
    
    // TODO: must be done for diagraphs, maintaining forms and setting letter classes (ie. vowel).
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
               word;
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
    };
});


