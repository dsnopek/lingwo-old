
// proxy
define([], function () {
    return function (func, obj) {
        return function () {
            return func.apply(obj, arguments);
        }
    }
});

