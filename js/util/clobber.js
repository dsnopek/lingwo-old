
// clobber
define(function () {
    return function (obj, old_fn_name, new_fn) {
        old_fn = obj[old_fn_name];
        obj[old_fn_name] = function () {
            old_fn.apply(this, arguments);
            new_fn();
        };
    };
});

