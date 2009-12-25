
/*
 * Library functions for the importer.
 */

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

// Provides a very simple gaurd to prevent double loading, with some add syntactical
// prettiness for the module pattern we commonly use.
module = (function () {
    var moduleList = {};

    function mixGlobal(name, value) {
        var scope = this;
        var parts = name.split('.');
        var n;

        parts.forEach(function (part) {
            if (!(part in scope)) {
                scope[part] = {};
            }
            scope = scope[part];
        });

        for (n in value) {
            scope[n] = value[n];
        }
    }

    return function (name, value) {
        if (name in moduleList) {
            return;
        }
        moduleList[name] = true;

        if (typeof value == 'function') {
            value = value();
        }
        mixGlobal(name, value);
    };
})();

// sets up our namespace
module('Lingwo.importer', {
    sources: {},

    // TODO: Will hold our entry objects.  Should be relatively light weight,
    // mostly just a plain object, but a couple functions for integrity sake.
    Entry: declare({
        sources: null,

        _constructor: function () {
        },

        setSource: function (name, args) {
            if (this.sources === null) {
                this.sources = {};
            }
            this.sources[name] = args;
        },

        getSource: function (name) {
            if (this.sources === null) {
                return undefined;
            }
            return this.sources[name];
        },
    }),

    // Runs a particular source
    processSource: function (args) {
        var src = Lingwo.importer.sources[args.type];
        if (typeof src == 'undefined') {
            throw ("Unknown source: "+args.type);
        }

        return src.process(args);
    },
});

