
/*
 * This bit would be some library file (ie. js/lingwo_dictionary.js).
 */

Lingwo = {'dictionary': {} };
(function () {
    var lib = Lingwo.dictionary;

    // stores all the language definitions
    lib.languages = {};

    // returns a function which can be called with a language object,
    // to create a constructor for the object specific to this language object.
    var makeClassMaker = function (actualCons, props) {
        return function (lang) {
            var cons = function () {
                actualCons.apply(this, arguments);
            };
            for (var name in props) {
                cons.prototype[name] = props[name];
            }
            cons.prototype.lang = lang;

            // used to extend the class
            cons.extend = function (obj) {
                for (var name in obj) {
                    this.prototype[name] = obj[name];
                };
            };

            return cons;
        };
    };

    var makeWordClass = makeClassMaker(
        function (text) {
            this.text = text || '';
        },
        {
            'test': function () { return 'zumma'; },
        }
    );

    // language constructor
    var Language = function () {
        this.Word = makeWordClass(this);

        this.morphology = {
            'option': {},
            'form': {},
        };
    };
    // take a string and get word out of it.
    Language.prototype.parseWord = function (s) {
    };

    // the external function used to create new language definitions.
    lib.defineLanguage = function (name, func) {
        var lang = new Language();
        lang.name = name;
        func.apply(lang, [lang]);
        lib.languages[name] = lang;
        return lang;
    };

    /*
     * TODO: Define an entry.
     */
    lib.Entry = function () { };
})();

/*
 * This would be loaded by another script tag (ie. js/pol.js)
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

    lang.Word.extend({
        'thinger': function () { return 'blarney2' }
    });

    var word = new lang.Word('blah');
    print(word.thinger());

    var stemChange = function (word) {
        return 
            word.ending('k').replace('c') ||
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

    lang.morphology.option.noun = {
        'gender': function (entry) {
            // TODO: giving no form is the base form?  Does that sound cool?
            var word = entry.getForm();
            return 
                word.ending('o', 'e', 'ę', 'um').result('neuter') ||
                word.ending(utils.cls('vowel')).result('feminine') ||
                'masculine';
        }
    };

    lang.morphology.form.noun = {
        '$stem': function (entry) {
            var word = entry.getForm();
            return
                word.ending('a', 'o', 'e', 'um').drop() ||
                word;
        },

        '$stem.singular': function (entry) {
            var word = entry.getForm();
            return
                word.ending('mię').replace('mieni') ||
                word.ending('ę').append('ci') ||
                entry.getForm('$stem');
        },

        '$stem.plural': function (entry) {
            var word = entry.getForm();
            return
                word.ending('mię').replace('mion') ||
                word.ending('ę').append('t') ||
                entry.getForm('$stem');
        },

        'nominative.singular': function (entry) {
            return entry.getForm();
        },
    };

    /*
     * Adjectives
     */
    lang.morphology.option.adjective = {
        'soft': function (entry) {
            var word = entry.getForm();
            // TODO: there has to be someway to force this to be a boolean without 
            // making the user add all kinds of ugly here.
            return word.ending('i').bool() && !word.ending('ki', 'gi').bool();
        }
    };

    lang.morphology.form.adjective = {
        '$stem': function (entry) {
            return entry.getForm().ending(1).drop();
        },

        'nominative.singular.masculine': function (entry) {
            return entry.getForm();
        },

        'nominative.singular.feminin': function (entry) {
            return entry.getForm('$stem').append(
                entry.getOption('soft') ? 'ia' : 'a'
            );
        },
    };
});

/*
 * This would exist on the entry edit page.  As the entry is editted, this object too
 * would be modified and queried from.
 */
var entry = new Lingwo.dictionary.Entry({
    'lang': Lingwo.dictionary.languages['pol'],
    'name': 'chłopiec',
    'pos': 'noun',
    'classes': ['animate','virile'],
    'forms': {
        '$stem': 'chłopc',
        'dative.singular': 'chłopcu'
    }
});

