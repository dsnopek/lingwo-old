
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

        function append_s (word) {
            if (word.hasEnding([Language.cls('consonant'), 'y'])) {
                return word.ending(1).replace('ies');
            }
            return word.ending('sh','ch','s','z','o').append('es') ||
                   word.append('s');
        }

        lang.fields.noun = {
            'plural': {
                type: 'form',
                label: 'Plural',
                automatic: function (entry) {
                    return append_s(entry.getWord());
                }
            }
        };

        lang.fields.verb = {
            // TODO: do we want to do other persons just to accomidate the verb "to be"?  Its
            // the *only* word in the language that would need it...
            'simple.present.3p': {
                type: 'form',
                label: 'Simple Present 3rd Person',
                automatic: function (entry) {
                    return append_s(entry.getWord());
                }
            }
        }

        return lang;
    }
);

