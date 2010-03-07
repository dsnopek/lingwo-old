
/*
 * Defines the English language.
 */

require.def('lingwo_dictionary/languages/en',
    ['lingwo_dictionary/Language'],
    function (Language) {
        var lang = Language.defineLanguage('en');

        lang.alphabet = Language.generateAlphabet('abcdefghijklmnopqrstuvwxyz', ['ch','sh']);

        lang.fields.noun = {
            'plural': {
                type: 'form',
                label: 'Plural',
                automatic: function (entry) {
                    var word = entry.getWord();
                    return word.append('s');
                }
            }
        };

        return lang;
    }
);

