
require.def('lingwo_dictionary/parseTemplate', [], function () {
    // Modified from:
    //
    //   Simple JavaScript Templating
    //   John Resig - http://ejohn.org/ - MIT Licensed
    //
    function parseTemplate(str) {
        // Generate a reusable function that will serve as a template
        // generator (and which will be cached).
        return wrapWithDefaults(new Function("obj",
            "var p=[],print=function(){p.push.apply(p,arguments);};" +

            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +

            // Convert the template into pure JavaScript
            str.replace(/[\r\t\n]/g, " ")
               .replace(/'(?=[^%]*%>)/g,"\t")
               .split("'").join("\\'")
               .split("\t").join("'")
               .replace(/<%=(.+?)%>/g, "',$1,'")
               .split("<%").join("');")
               .split("%>").join("p.push('")
               + "');}return p.join('');"));
    };

    function wrapWithDefaults (func) {
        return function (obj) {
            for(var name in parseTemplate.defaults) {
                if (typeof obj[name] == 'undefined') {
                    obj[name] = parseTemplate.defaults[name];
                }
            }
            return func(obj);
        };
    };

    parseTemplate.defaults = {};

    return parseTemplate;
});

