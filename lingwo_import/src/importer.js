
/*
 * Library functions for the importer.
 */

function setObject(name, value) {
    if (typeof value == 'undefined') {
        value = {};
    }

    var scope = this;
    var parts = name.split('.');
    var name = parts.pop();

    parts.forEach(function (part) {
        if (!(part in scope)) {
            scope[part] = {};
        }
        scope = scope[part];
    });

    scope[name] = value;
}

function declare(props) {
    var cons = props['_constructor'];
    delete props['_constructor'];
    for(var name in props) {
        cons.prototype[name] = props[name];
    }
    return cons;
};

escapeRegex = (function () {
    var regexSpecial = ['(',')','{','}','*'];

    return function (s) {
        regexSpecial.forEach(function (c) {
            var r = new RegExp('\\'+c, 'g');
            s = s.replace(r, '\\'+c);
        });
        return s;
    };
})();

// sets up our namespace
setObject('Lingwo.importer.sources', {});

// Runs a particular source
Lingwo.importer.handleSource = function (srcName, args) {
    var src = Lingwo.importer.sources[srcName];
    if (typeof src == 'undefined') {
        throw ("Unknown source: "+srcName);
    }

    delete args['source'];

    return src(args);
};


