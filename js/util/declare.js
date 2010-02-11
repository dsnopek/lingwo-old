
/*
 * Very simple utility function for creating a "class".
 */

require.def('lingwo_dictionary/js/util/declare',
    [],
    function () {
        return function (props) {
            var cons = props['_constructor'];
            delete props['_constructor'];
            for(var name in props) {
                cons.prototype[name] = props[name];
            }
            return cons;
        };
    }
);

