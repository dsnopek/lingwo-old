
define(
    ['lingwo/Entry',
     'lingwo/Language',
     'lingwo_old/util/json2'
    ],
    function (Entry, Language, JSON) {
    // we monkey patch Entry to have some clever serialize/deserialize functions -- these
    // would be part of the core Entry code, except then we'd need JSON bundled with it..
    Entry.prototype.serialize = function () {
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
    };
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
});

