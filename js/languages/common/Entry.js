
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

                // TODO: this should be a normal field!
                this.like = args.like || null;

                this.fields = args.fields || {};

                this.clearCache();
            },

            clearCache: function () {
                this._cachedFields = {};
                this._cachedWords = {};
            },

            getField: function (name) {
                var pos, field, value = null;

                if (typeof this.fields[name] != 'undefined') {
                    return this.fields[name];
                }
                if (typeof this._cachedFields[name] != 'undefined') {
                    return this._cachedFields[name];
                }

                // TODO: 'like' should be a field just like any other field!  We will need some
                // special support here if we are trying to generate like itself.
                pos = this.like || this.pos;
                if (typeof this.lang.fields[pos] == 'undefined' ||
                    typeof this.lang.fields[pos][name] == 'undefined')
                {
                    throw new err.NoSuchField(name, pos);
                }

                field = this.lang.fields[pos][name];
                if (field.automatic) {
                    value = field.automatic.apply(this.lang, new Array(this));
                }

                if (field.type == 'form') {
                    if (!(value instanceof this.lang.Word)) {
                        throw("Value returned from automatic function '"+name+"' is not a Word!");
                    }

                    // form functions return a word object, so we cache it with the words
                    // and convert it to a string, which the field value is supposed to be.
                    this._cachedWords[name] = value;
                    value = value.toString();
                }
                else if (field.type == 'class') {
                    // super-explicit conversion to boolean
                    value = !!value;
                }
                else if (field.type == 'option') {
                    // explicitly make this into a string
                    value = value.toString();
                    // TODO: we should check that it has a valid value
                }

                this._cachedFields[name] = value;
                
                return value;
            },

            getWord: function (name) {
                if (typeof name == 'undefined') {
                    name = '';
                }
                if (typeof this._cachedWords[name] != 'undefined') {
                    return this._cachedWords[name];
                }

                if (name == '') {
                    this._cachedWords[name] = this.lang.parseWord(this.name);
                }
                else if (typeof this.fields[name] != 'undefined') {
                    this._cachedWords[name] = this.lang.parseWord(this.fields[name]);
                }
                else {
                    // we want to trigger caching the word via getField().
                    this.getField(name);
                }

                return this._cachedWords[name];
            }
        });
    }
);

