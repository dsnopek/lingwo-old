
/*
 * Very simple function for mixing properties into a constructors prototype.
 */

require.def('lingwo_dictionary/util/extendPrototype',
    [],
    function () {
        return function (cons, props) {
            for (var name in props) {
                cons.prototype[name] = props[name];
            }
        };
    }
);

