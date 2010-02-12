
/*
 * Very simple utility function for creating a "class".
 */

require.def('lingwo_dictionary/util/declare',
    ['lingwo_dictionary/util/extendPrototype'],
    function (extendPrototype) {
        return function (props) {
            var cons = props['_constructor'];
            delete props['_constructor'];
            extendPrototype(cons, props);
            return cons;
        };
    }
);

