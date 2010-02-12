
/*
 * Standard Exceptions
 */

require.def('lingwo_dictionary/js/languages/common/err',
    [],
    {
        NoSuchMorphologyFunction: function (msg) {
            this.toString = function () {
                return msg;
            };
        },

        NoSuchField: function (field_name, pos) {
            this.name = field_name;
            this.pos = pos;
            this.toString = function () {
                var s = "No such field '"+this.name+"'";
                if (this.pos) {
                    s += " for pos '"+this.pos+"'";
                }
                return s;
            };
        }
    }
);

