
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
            'lingwo_dictionary': lingwo_dictionary_path+'/js',
        }
    };
    load(lingwo_dictionary_path + '/js/require.js');
    load(lingwo_dictionary_path + '/js/require/rhino.js');

    // ultimately, load the actual script
    load(args[0]);
})(arguments);

