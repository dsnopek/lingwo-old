
// Gets our environment ready to rock!

(function (args) {
    var lingwo_dictionary_path = (function () {
        var run_js_path = ''+java.lang.System.getenv('RUNJS_PATH');
        var parts = run_js_path.split('/');
        parts.pop();
        return parts.join('/');
    })();

    // load requirejs
    load(lingwo_dictionary_path + '/js/allplugins-require.js');

    // override the load function
    require.load = function (moduleName, contextName) {
         var context = s.contexts[contextName], url;
         s.isDone = false;

         // load the module
         url = require.nameToUrl(moduleName, null, contextName);
         context.startTime = (new Date()).getTime();
         load(moduleName);

         context.loaded[moduleName] = true;
         require.checkLoaded(contextName);
    };

    // ultimately, load the actual script
    load(args[0]);
})(arguments);

