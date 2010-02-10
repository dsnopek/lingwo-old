
// Gets our environment ready to rock!

(function (args) {
    var lingwo_dictionary_path = (function () {
        var run_js_path = ''+java.lang.System.getenv('RUNJS_PATH');
        var parts = run_js_path.split('/');
        parts.pop();
        return parts.join('/');
    })();

    // load requirejs
    require = {
        paths: {
            'lingwo_dictionary': lingwo_dictionary_path,
        }
    };
    load(lingwo_dictionary_path + '/js/allplugins-require.js');

    // override the load function
    require.load = function (moduleName, contextName) {
         var context = require.s.contexts[contextName], url;
         require.s.isDone = false;
         context.loaded[moduleName] = false;

         // load the module
         url = require.nameToUrl(moduleName, null, contextName);
         context.startTime = (new Date()).getTime();
         //print (url);
         load(url);

         context.loaded[moduleName] = true;
    };

    // ultimately, load the actual script
    load(args[0]);
})(arguments);

