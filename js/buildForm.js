
require.def('lingwo_dictionary/buildForm',
    ['lingwo_dictionary/parseTemplate',
     'text!lingwo_dictionary/buildForm/wrapper.html',
     'text!lingwo_dictionary/buildForm/text.html',
     'text!lingwo_dictionary/buildForm/select.html',
     'text!lingwo_dictionary/buildForm/checkbox.html'
    ],
    function (parseTemplate, wrapperTmpl) {
        var wrapper = parseTemplate(wrapperTmpl),
            generators = (function (lst) {
                var res = {}, i;
                for(i = 0; i < lst.length; i++) {
                    res[lst[i]] = (function (f) {
                        return function (data) {
                            data.content = f(data);
                            return wrapper(data);
                        };
                    })(parseTemplate(require('lingwo_dictionary/buildForm/'+lst[i]+'.html')));
                }
                return res;
            })(['text','select','checkbox']),
            defaults = {
                text: {
                    maxlength: 128,
                    size: 60,
                    default_value: ''
                }
            };

        function applyDefaults(item) {
            var name, typeDefaults = defaults[item.type];
            if (typeof typeDefaults != 'undefined') {
                for(name in typeDefaults) {
                    if (typeof item[name] == 'undefined') {
                        item[name] = typeDefaults[name];
                    }
                }
            }
            if (typeof item.id == 'undefined' && typeof item.name != 'undefined') {
                item.id = item.name;
            }
            else if (typeof item.name == 'undefined' && typeof item.id != 'undefined') {
                item.name = item.id;
            }
            return item;
        }

        function render_one (item) {
            var output;
            if (typeof item.type == 'undefined' || item.type == 'markup') {
                if (typeof item.value != 'undefined') {
                    output = item.value;
                }
            }
            else if (typeof generators[item.type] != 'undefined') {
                output = generators[item.type](applyDefaults(item));
            }
            else {
                throw new Error("Unknown type '"+item.type+"'");
            }

            // put output together with $prefix and $suffix
            if (typeof item.prefix != 'undefined') {
                output = item.prefix + output;
            }
            if (typeof item.suffix != 'undefined') {
                output = output + item.suffix;
            }
            return output;
        }

        return function (item) {
            var i, output = [];
            if (item instanceof Array) {
                for(i = 0; i < item.length; i++) {
                    output.push(render_one(item[i]));
                }
                return output.join('');
            }

            return render_one(item);
        };
});
