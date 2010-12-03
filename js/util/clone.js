
// clone
define([], function () {
    return function (obj) {
        var copy = {}, name;
        for (name in obj) {
            copy[name] = obj[name];
        }
        return copy;
    };
});

