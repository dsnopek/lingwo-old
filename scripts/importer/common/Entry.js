
/*
 * The importer's idea of an entry object.
 */

require.def('lingwo_dictionary/scripts/importer/common/Entry',
    ['lingwo_dictionary/js/declare',
    ],
    function (declare) {
        return declare({
            sources: null,

            _constructor: function () {
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
            }
        });
    }
);

