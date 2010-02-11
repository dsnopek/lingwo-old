
require.def('lingwo_dictionary/js/languages/common/Entry',
    ['lingwo_dictionary/js/util/declare',
     'lingwo_dictionary/js/languages/common/err',
    ],
    function (declare, err) {
        return declare({
            _constructor: function (args) {
                args = args || {};

                this.lang = args.lang;
                // TODO: should we call this 'headword' to fit with everything else?
                this.name = args.name;
                this.pos = args.pos;
                // TODO: Not filling in any of the above should probobaly be an exception?

                this.like = args.like || null;

                this.forms = args.forms || {};
                this.options = args.options || {};

                // we can get classes as either an Array of strings or an Object of booleans
                var classes = args.classes || {};
                if (classes.length) {
                    this.classes = {};
                    for(var i = 0; i < classes.length; i++) {
                        if (classes[i].substr(0, 1) == '!') {
                            this.classes[classes[i].substr(1)] = false;
                        }
                        else {
                            this.classes[classes[i]] = true;
                        }
                    }
                }
                else {
                    this.classes = classes;
                }

                this.clearCache();
            },

            clearCache: function () {
                this._baseForm = null;

                this._cachedForms = {};
                this._cachedOptions = {};
                this._cachedClasses = {};
            },

            getForm: function (name) {
                if (!name) {
                    if (this._baseForm === null) {
                        this._baseForm = this.lang.parseWord(this.name);
                    }
                    return this._baseForm;
                }

                if (this._cachedForms[name]) {
                    return this._cachedForms[name];
                }

                var word;
                if (this.forms[name]) {
                    word = this.lang.parseWord(this.forms[name]);
                }
                else {
                    word = this.lang.callMorphologyFunc(this, 'forms', name);
                }

                if (!word instanceof this.lang.Word) {
                    throw("Value returned from morphology function '"+name+"' is not a Word!");
                }

                this._cachedForms[name] = word;

                return word;
            },

            getOption: function (name) {
                if (this.options[name]) {
                    return this.options[name];
                }
                if (this._cachedOptions[name]) {
                    return this._cachedOptions[name];
                }
                
                var option = this._cachedOptions[name] =
                    this.lang.callMorphologyFunc(this, 'options', name).toString();
                return option;
            },

            isClass: function (name) {
                if (typeof this.classes[name] != 'undefined') {
                    return this.classes[name];
                }

                if (typeof this._cachedClasses[name] != 'undefined') {
                    return this._cachedClasses[name];
                }

                var value;

                try {
                    value = this.lang.callMorphologyFunc(this, 'classes', name);
                }
                catch (e) {
                    if (e instanceof err.NoSuchMorphologyFunction) {
                        value = false;
                    }
                    else {
                        throw e;
                    }
                }

                // super-explicit conversion to boolean
                value = !!value;

                this._cachedClasses[name] = value;
                return value;
            },
        });
    }
);

