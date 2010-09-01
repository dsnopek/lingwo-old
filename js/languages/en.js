
/*
 * Defines the English language.
 */

require.def('lingwo_dictionary/languages/en',
    ['lingwo_dictionary/Language'],
    function (Language) {
        var lang = Language.defineLanguage('en');

        lang.alphabet = Language.generateAlphabet('abcdefghijklmnopqrstuvwxyz', ['ch','sh','th'],
            function (l) {
                var classes = [];
                if (l == 'a' || l == 'e' || l == 'i' || l == 'o' || l == 'u') {
                    classes.push('vowel');
                }
                else {
                    classes.push('consonant');
                }
                return classes;
            }
        );

        // some punctuation for the alphabet
        function addPunctuation(v) {
            lang.alphabet[v] = {
                'classes': ['punctuation'],
                'default_form': 'default',
                'forms': {
                    'default': v,
                }
            };
        }
        "'-".split('').forEach(addPunctuation);

        function append_s (word) {
            if (word.hasEnding([Language.cls('consonant'), 'y'])) {
                return word.ending(1).replace('ies');
            }
            return word.ending('sh','ch','s','z','o').append('es') ||
                   word.append('s');
        }

        function double_last_cvc (word) {
            if (word.letters.length == 3 && word.hasEnding([Language.cls('consonant'), Language.cls('vowel'), Language.cls('consonant')])) {
                return word.append(word.letters[word.letters.length-1][0]);
            }
            return word;
        }

        // TODO: in the future base this off the IPA!!
        function syllable_count (word) {
            var scount = 0, vlast = 0, i;
            for(i = 0; i < word.letters.length; i++) {
                if (lang.letterHasClass(word.letters[i][0], 'vowel')) {
                    // count this as a syllable, if the last letter was a consonant,
                    // or we have already encountered two vowels in a row, and this
                    // is the third...
                    if (vlast == 0 || vlast == 2) {
                        // a special exception, we don't count a lone 'e' on the 
                        // end of a word.
                        if (word.letters[i][0] == 'e' && vlast == 0 && i == word.letters.length-1) {
                            break;
                        }

                        // otherwise, it was a syllable!
                        scount++;
                    }
                    // mark that we encountered a vowel
                    vlast++;
                }
                else {
                    // mark that we encountered a consonant
                    vlast = 0;
                }
            }

            return scount;
        }

        lang.fields.noun = {
            'plural_type': {
                type: 'option',
                label: 'Plural Type',
                options: {
                    'both': 'Has singular and plural',
                    'singular': 'Singular only',
                    'plural': 'Plural only'
                },
                automatic: function (entry) {
                    return 'both';
                }
            },
            'plural': {
                type: 'form',
                label: 'Plural',
                automatic: function (entry) {
                    var type = entry.getField('plural_type');
                    switch (type) {
                        case 'both':
                            return append_s(entry.getWord());
                        case 'singular':
                            return null;
                        case 'plural':
                            return entry.getWord();
                    }
                }
            }
        };

        lang.fields.adjective = {
            'not_comparable': {
                type: 'class',
                label: 'Not comparable'
            },
            'more': {
                type: 'form',
                label: 'more Form',
                automatic: function (entry) {
                    if (entry.getField('not_comparable')) return null;
                    var word = entry.getWord();
                    if (syllable_count(word) >= 3) {
                        return [lang.parseWord('more'), word];
                    }
                    word = double_last_cvc(word);
                    return word.ending('e').append('r') ||
                           word.ending('y').replace('ier') ||
                           word.append('er');
                }
            },
            'most': {
                type: 'form',
                label: 'most Form',
                automatic: function (entry) {
                    if (entry.getField('not_comparable')) return null;
                    var word = entry.getWord();
                    if (syllable_count(word) >= 3) {
                        return [lang.parseWord('most'), word];
                    }
                    word = double_last_cvc(word);
                    return word.ending('e').append('st') ||
                           word.ending('y').replace('iest') ||
                           word.append('est');
                }
            }
        };

        // a 'determiner' gets the same fields as an 'adjective'
        lang.fields.determiner = lang.fields.adjective;

        lang.fields.adverb = {
            'not_comparable': {
                type: 'class',
                label: 'Not comparable'
            },
            'more': {
                type: 'form',
                label: 'more Form',
                automatic: function (entry) {
                    if (entry.getField('not_comparable')) return null;
                    return [lang.parseWord('more'), entry.getWord()];
                }
            },
            'most': {
                type: 'form',
                label: 'most Form',
                automatic: function (entry) {
                    if (entry.getField('not_comparable')) return null;
                    return [lang.parseWord('most'), entry.getWord()];
                }
            }
        };


        lang.fields.verb = {
            // TODO: do we want to do other persons just to accomidate the verb "to be"?  Its
            // the *only* word in the language that would need it...
            '-s': {
                type: 'form',
                label: '-s Form',
                automatic: function (entry) {
                    return append_s(entry.getWord());
                }
            },

            '-ing': {
                type: 'form',
                label: '-ing Form',
                automatic: function (entry) {
                    var word = entry.getWord();
                    // TODO: Integrate the consonant doubling rules..
                    return word.ending('ee').append('ing') ||
                           word.ending('ie').replace('ying') ||
                           word.ending('e').replace('ing') ||
                           word.append('ing');
                }
            },

            '2nd': {
                type: 'form',
                label: '2nd Form (past)',
                automatic: function (entry) {
                    var word = entry.getWord();
                    return word.ending('e').append('d') ||
                           word.append('ed');
                }
            },

            '3rd': {
                type: 'form',
                label: '3rd Form (past participle)',
                automatic: function (entry) {
                    return entry.getWord('2nd');
                }
            },

            'infinitive': {
                type: 'form',
                label: 'Infinitive',
                automatic: function (entry) {
                    return [lang.parseWord('to')].concat(entry.getWords());
                }
            }
        }
        
        // an 'auxilary verb' has all the same fields as a normal 'verb'
        lang.fields['auxilary verb'] = lang.fields.verb;

        return lang;
    }
);

