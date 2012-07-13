
define(
    ['lingwo_old/parseTemplate',
     'text!lingwo_old/buildForm/wrapper.html',
     'text!lingwo_old/buildForm/text.html',
     'text!lingwo_old/buildForm/select.html',
     'text!lingwo_old/buildForm/checkbox.html',
     'text!lingwo_old/buildForm/radio.html',
     'text!lingwo_old/buildForm/radios.html'
    ],
    function (parseTemplate, wrapperTmpl, textTmpl, selectTmpl, checkboxTmpl, radioTmpl, radiosTmpl) {
        var wrapper = parseTemplate(wrapperTmpl),
            itemTypes = {
                text: {
                    defaults: {
                        maxlength: 128,
                        size: 60,
                        default_value: ''
                    },
                    tmpl: textTmpl
                },
                select: {
                    tmpl: selectTmpl
                },
                checkbox: {
                    tmpl: checkboxTmpl
                },
                radio: {
                    tmpl: radioTmpl,
                    defaults: {
                        checked: false
                    }
                },
                radios: {
                    tmpl: radiosTmpl,
                    defaults: {
                        default_value: ''
                    }
                }
            }, name;

        // compile the templates
        for(name in itemTypes) {
            itemTypes[name].func = (function (type) {
                var compiled = parseTemplate(type.tmpl),
                    func = function (data) {
                        data.content = compiled(data);
                        return wrapper(data);
                    };
                return func;
            })(itemTypes[name]);
        }

        function htmlEscape(str) {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        }

        function generateAttributes(attributes) {
            var output = '';
            $.each(attributes, function (name, value) {
                output += ' ' + name + '="' + htmlEscape(value) + '"';
            });
            return output;
        }
        
        function applyDefaults(item) {
            var name, typeDefaults = itemTypes[item.type].defaults;
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
            // TODO: maybe mix this in from somewhere?
            if (typeof item.label == 'undefined') {
                item.label = '';
            }

            if (typeof item.attributes == 'undefined') {
                item.attributes = {}
            }
            item.attributes['class'] = 'form-' + item.type + ' ' + item.attributes['class'];
            item.attributes = generateAttributes(item.attributes);

            return item;
        }

        function render (item) {
            var output;
            if (typeof item.type == 'undefined' || item.type == 'markup') {
                if (typeof item.value != 'undefined') {
                    output = item.value;
                }
            }
            else if (typeof itemTypes[item.type] != 'undefined') {
                output = itemTypes[item.type].func(applyDefaults(item));
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

        function buildForm (item) {
            var i, output = [];
            if (item instanceof Array) {
                for(i = 0; i < item.length; i++) {
                    output.push(render(item[i]));
                }
                return output.join('');
            }

            return render(item);
        };

        // we want to be able to use 'buildForm' in templates!
        parseTemplate.defaults.buildForm = buildForm;

        return buildForm;
});
