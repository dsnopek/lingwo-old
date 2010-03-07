
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

        lang.fields.noun = {
            'plural': {
                type: 'form',
                label: 'Plural',
                automatic: function (entry) {
                    var word = entry.getWord();
                    if (word.hasEnding([Language.cls('consonant'), 'y'])) {
                        return word.ending(1).replace('ies');
                    }
                    return word.ending('sh','ch','s','o').append('es') ||
                           word.append('s');
                }
            }
        };

        return lang;
    }
);

