
require.def('lingwo_dictionary/util/text',
    [],
    function () {
        return {
            limitString: function (s, max) {
                if (s.length > max) {
                    s = s.substr(0, max);
                }
                return s;
            }
        };
    }
);
