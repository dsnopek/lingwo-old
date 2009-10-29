
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

    var extendPrototype = function (cons, props) {
        for (var name in props) {
            cons.prototype[name] = props[name];
        }
    };

    // A helper for making Array.splice() a little easier to work with.
    var arrayReplace = function (arr, i, len, items) {
        arr.splice.apply(arr, [i, len].concat(items));
    };

    var SubWord = function (word, start, len) {
        this.word = word;
        this.start = start || -1;
        this.len = len || 0;
    };
    extendPrototype(SubWord, {
        'drop': function () {
            if (this.start == -1)
                return false;

            var newWord = this.word.clone();
            newWord.letters.splice(this.start, this.len);
            return newWord;
        },
        'replace': function (text) {
            if (this.start == -1)
                return false;

            var rWord = this.word.lang.parseWord(text);
            var newWord = this.word.clone();
            arrayReplace(newWord.letters, this.start, this.len, rWord.letters);
            return newWord;
        },
        'append': function (text) {
            if (this.start == -1)
                return false;

            var rWord = this.word.lang.parseWord(text);
            var newWord = this.word.clone();
            arrayReplace(newWord.letters, this.start+this.len, 0, rWord.letters);
            return newWord;
        },
        'result': function (value) {
            if (this.start == -1)
                return false;
            return value;
        },
        'bool': function () {
            return this.start != -1;
        },
    });

    var makeWordClass = makeClassMaker(
        function (letters) {
            this.letters = letters || [];
        },
        {
            '_parseSpec': function (spec) {
                if (typeof spec == 'string') {
                    return this.lang.parseWord(spec).letters;
                }
                if (typeof spec == 'object') {
                    if (typeof spec['length'] == 'number') {
                        // this is an Array, just return it
                        return spec;
                    }
                    
                    // pack into an array and return it
                    return [spec];
                }

                throw ("Bad spec error");
            },

            '_compLetter': function (letter, letter_spec) {
                switch (letter_spec.spec) {
                    case 'cls':
                        var letterDef = this.lang.alphabet[letter[0]];
                        for (var i = 0; i < letterDef.classes.length; i++) {
                            if (letterDef.classes[i] == letter_spec.value)
                                return true;
                        }
                        return false;
                    default:
                        // it is a letter!
                        return letter[0] == letter_spec[0];
                };
            },

            'clone': function () {
                return new this.lang.Word(this.letters.slice(0));
            },

            'append': function (text) {
                var newWord = this.clone();
                var rWord = this.lang.parseWord(text);
                arrayReplace(newWord.letters, newWord.letters.length, 0, rWord.letters);
                return newWord;
            },

            'ending': function () {
                if (arguments.length == 1 && typeof arguments[0] == 'number') {
                    // A length-based ending spec
                    var len = arguments[0];
                    if (len <= this.letters.length) {
                        return new SubWord(this, this.letters.length - len, len);
                    }
                }
                else {
                    checki:
                    for (var i = 0; i < arguments.length; i++) {
                        // TODO: attempt to match one of the things given and return
                        // a sub-word object.
                        var testSpec = this._parseSpec(arguments[i]);
                        if (testSpec.length > this.letters.length)
                            continue checki;

                        for (var e = 0; e < testSpec.length; e++) {
                            if (!this._compLetter(this.letters[this.letters.length-e-1], testSpec[testSpec.length-e-1]))
                                continue checki;
                        }

                        return new SubWord(this, this.letters.length - testSpec.length, testSpec.length);
                    }
                }

                return new SubWord(this);
            },
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
    extendPrototype(Language, {
        alphabet: null,

        callMorphologyFunc: function (entry, type, which) {
            return this.morphology[type][entry.pos][which].apply(this, new Array(entry));
        },

        // creates a Word's "letter" from a string.
        //
        // A letter in this implementation is a 2 item array: [letter name, form name]
        //
        parseLetter: function (s) {
            if (!this.alphabet)
                throw ("Cannot parseLetter() without a defined alphabet");

            for (name in this.alphabet)
            {
                var letter_def = this.alphabet[name];
                for (form_name in letter_def.forms)
                {
                    if (letter_def.forms[form_name] == s)
                        return [name, form_name];
                }
            }

            return null;
        },

        // take a string and get word out of it.
        parseWord: function (s) {
            // This function works by trying the whole text, and progressively
            // moving the start index forward, until a letter is found, then ignoring
            // the chunk that was found.  So, for example, if we had the word "mila"
            // we would try:
            //
            // 1. mila (no letter)
            // 2. ila  (no letter)
            // 3. la   (no letter)
            // 4. a    (found "a")
            // 5. mil  (no letter)
            // 6. il   (no letter)
            // 7. l    (found "l")
            // 8. mi   (... and so on)
            //
            // It is done this way to try and detect diagraphs in left-to-right
            // languages.  This will distinguish both "ch" from "h" and letters with
            // trailing accents like "o" from "o'".  I imagine, but havent tested, that
            // this would have to be reversed for right-to-left languages.

            if (!this.alphabet)
                throw ("Cannot parseWord() without a defined alphabet");

            var index = 0;
            var end   = s.length;

            var letters = [ ];
            while (end > 0)
            {
                index = 0;

                while (index <= end)
                {
                    var test = s.substring(index, end);
                    var res  = this.parseLetter(test);

                    if (res != null)
                    {
                        letters.push(res);
                        end -= test.length;
                        break;
                    }

                    index ++;
                }
                
                if (index > end)
                {
                    // Nothing was found.
                    print ("nothing was found");
                    return null;
                }
            }

            // reverse the array
            letters.reverse();

            // build the word
            return new this.Word(letters);
        },

        // Makes a word into a string
        // TODO: This is copied from old code, modernize it!  This should really be put into the
        // constructor for Word.  We should accept an array of tuples, or possibly tuplize arguments
        // as shown below.
        /*
        createWord: function (letter_names, form) {
        //unparseWord: function (letter_names, form) {
            // Like the inverse of parse_word.  This takes a list of letter names and produces a 
            // word object.  The letter names can be a two item array with a specific form, or 
            // just a string that uses the form given.
            //
            //  For example:
            //
            // var word = lang.create_word([ 'b', 'y', 'c\'' ], 'lower');
            // var word = lang.create_word([ 'h', 'o', 'r', 'o', 'sh', ['o', 'lower.accent'] ], 'lower');
            //
            // Omitting the form will use the LetterDefs default form.
            //
            var word = new Lingwo.Word(this);

            for( var i = 0; i < letter_names.length; i++ )
            {
                var item = letter_names[i];
                if ( dojo.lang.isString(item) )
                {
                    word.append_letter(item, form);
                }
                else
                {
                    word.append_letter(item[0], item[1]);
                }
            }

            return word;
        }
        */
    });

    var utils = {
        'cls': function (cls) {
            return {'spec': 'cls', 'value': cls};
        },
    };

    // the external function used to create new language definitions.
    lib.defineLanguage = function (name, func) {
        var lang = new Language();
        lang.name = name;
        func.apply(lang, [lang, utils]);
        lib.languages[name] = lang;
        return lang;
    };

    /*
     * TODO: Define an entry.
     */
    lib.Entry = function (args) {
        this.lang = args.lang;
        this.name = args.name;
        this.pos = args.pos;
        // TODO: Not filling in any of the above should probobaly be an exception?


        this.classes = args.classes || [];
        this.options = args.options || {};
        this.forms = args.forms || {};

        this.clearCache();
    };
    extendPrototype(lib.Entry, {
        clearCache: function () {
            this._baseForm = null;
            this._cachedForms = {};
            this._cachedOptions = {};
        },

        getForm: function (name) {
            if (!name) {
                if (this._baseForm === null)
                    this._baseForm = this.lang.parseWord(this.name);
                return this._baseForm;
            }

            if (this._cachedForms[name])
                return this._cachedForms[name];

            var word;
            if (this.forms[name]) {
                word = this._cachedForms[name] = this.lang.parseWord(this.forms[name]);
            }
            else {
                word = this._cachedForms[name] = this.lang.callMorphologyFunc(this, 'form', name);
            }

            return word;
        },

        getOption: function (name) {
            if (this.options[name])
                return this.options[name];
            if (this._cachedOptions[name])
                return this._cachedOptions[name];
            
            var option = this._cachedOptions[name] = this.lang.callMorphologyFunc(this, 'option', name);
            return option;
        }
    });
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

    lang.morphology.option.noun = {
        'gender': function (entry) {
            // TODO: giving no form is the base form?  Does that sound cool?
            var word = entry.getForm();
            return word.ending('o', 'e', 'ę', 'um').result('neuter')  ||
                   word.ending(utils.cls('vowel')).result('feminine') ||
                   'masculine';
        }
    };

    lang.morphology.form.noun = {
        '$stem': function (entry) {
            var word = entry.getForm();
            return word.ending('a', 'o', 'e', 'um').drop() ||
                   word;
        },

        '$stem.singular': function (entry) {
            var word = entry.getForm();
            return word.ending('mię').replace('mieni') ||
                   word.ending('ę').append('ci')       ||
                   entry.getForm('$stem');
        },

        '$stem.plural': function (entry) {
            var word = entry.getForm();
            return word.ending('mię').replace('mion') ||
                   word.ending('ę').append('t')       ||
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
            // TODO: maybe provide a convenience hasEnding() function?
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

        'nominative.singular.feminine': function (entry) {
            return entry.getForm('$stem').append(
                entry.getOption('soft') ? 'ia' : 'a'
            );
        },
    };
});

//var w = Lingwo.dictionary.languages['pol'].parseWord('miła');
/*
var w = Lingwo.dictionary.languages['pol'].parseWord('gitarze');
for(var i = 0; i < w.letters.length; i++) {
    print(w.letters[i][0] + ' ' + w.letters[i][1]);
}
*/

/*
 * This would exist on the entry edit page.  As the entry is editted, this object too
 * would be modified and queried from.
 */
/*
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
*/

/*
var entry = new Lingwo.dictionary.Entry({
    'lang': Lingwo.dictionary.languages['pol'],
    'name': 'kobieta',
    'pos': 'noun'
});
print (entry.getForm('$stem.singular').letters);
print (entry.getOption('gender'));
*/

var entry = new Lingwo.dictionary.Entry({
    'lang': Lingwo.dictionary.languages['pol'],
    'name': 'głupi',
    'pos': 'adjective'
});
print (entry.getForm('$stem').letters);
print (entry.getOption('soft'));
print (entry.getForm('nominative.singular.feminine').letters);

