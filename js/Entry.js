
require.def('lingwo_dictionary/Entry',
    ['lingwo_dictionary/util/declare',
     'lingwo_dictionary/err',
     'lingwo_dictionary/util/json2',
     'lingwo_dictionary/Language',
    ],
    function (declare, err, JSON, Language) {
        var Entry = declare({
            sources: null,

            _constructor: function (args) {
                args = args || {};

                this.language = args.language;
                // TODO: should we call this 'headword' to fit with everything else?
                this.headword = args.headword;
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

            getFieldsPos: function () {
                // TODO: 'like' should be a field just like any other field!
                return this.like || this.pos;
            },

            getFields: function () {
                var pos = this.getFieldsPos(), fields = {}, name, def;

                if (typeof this.language.fields[pos] != 'undefined') {
                    for (name in this.language.fields[pos]) {
                        def = this.language.fields[pos][name];
                        fields[name] = {
                            type: def.type,
                            value: this.getField(name),
                            automatic: this.isAutomatic(name),
                        };
                    }
                }

                return fields;
            },

            isAutomatic: function (name) {
                return typeof this.fields[name] === 'undefined';
            },

            getFieldInfo: function (name) {
                // TODO: 'like' should be a field just like any other field!  We will need some
                // special support here if we are trying to generate like itself.
                var pos = this.getFieldsPos();
                if (typeof this.language.fields[pos] == 'undefined' ||
                    typeof this.language.fields[pos][name] == 'undefined')
                {
                    throw new err.NoSuchField(name, pos);
                }
                return this.language.fields[pos][name];
                
            },

            getField: function (name) {
                var field, value = null;

                if (typeof this.fields[name] != 'undefined') {
                    return this.fields[name];
                }
                if (typeof this._cachedFields[name] != 'undefined') {
                    return this._cachedFields[name];
                }

                field = this.getFieldInfo(name);
                if (field.automatic) {
                    value = field.automatic.apply(this.language, new Array(this));
                }

                if (field.type == 'form') {
                    if (!(value instanceof this.language.Word)) {
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
                    this._cachedWords[name] = this.language.parseWord(this.headword);
                }
                else if (typeof this.fields[name] != 'undefined') {
                    this._cachedWords[name] = this.language.parseWord(this.fields[name]);
                }
                else {
                    // we want to trigger caching the word via getField().
                    this.getField(name);
                }

                return this._cachedWords[name];
            },

            setSource: function (name, args) {
                if (this.sources === null) {
                    this.sources = {};
                }
                this.sources[name] = args;
            },

            getSource: function (name) {
                if (this.sources === null) {
                    return undefined;
                }
                return this.sources[name];
            },

            serialize: function () {
                return JSON.stringify(this, function (key, value) {
                    if (key == 'fields') {
                        return this.getFields();
                    }
                    else if (key == 'language') {
                        return value.name;
                    }
                    else if (key.toString().substr(0, 1) == '_') {
                        return undefined;
                    }
                    return value;
                });
            },
        });

        Entry.deserialize = function (text) {
            return new Entry(JSON.parse(text, function (key, value) {
                var name, fields = {};
                if (key == 'fields') {
                    for(name in value) {
                        if (!value[name].automatic) {
                            fields[name] = value[name].value;
                        }
                    }
                    return fields;
                }
                else if (key == 'language') {
                    return Language.languages[value];
                }
                return value;
            }));
        };

        return Entry;
    }
);
