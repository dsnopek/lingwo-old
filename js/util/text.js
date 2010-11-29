
// text utilities
define(function () {
    return {
        limitString: function (s, max) {
            if (s.length > max) {
                s = s.substr(0, max);
            }
            return s;
        }
    };
});
