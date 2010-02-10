
require.def('lingwo_dictionary/js/escapeRegex',
    [],
    function () {
        var regexSpecial = ['(',')','{','}','*'];

        return function (s) {
            // TODO: if this is going to run in the browser, it can't use .forEach()!
            regexSpecial.forEach(function (c) {
                var r = new RegExp('\\'+c, 'g');
                s = s.replace(r, '\\'+c);
            });
            return s;
        };
    }
);
