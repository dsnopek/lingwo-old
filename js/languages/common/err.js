
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
        }
    }
);

