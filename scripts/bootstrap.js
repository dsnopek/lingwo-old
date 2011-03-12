
// Gets our environment ready to rock!

(function (args) {
    LINGWO_DICTIONARY_PATH = (function () {
        var run_js_path = ''+java.lang.System.getenv('RUNJS_PATH');
        var parts = run_js_path.split('/');
        parts.pop();
        return parts.join('/');
    })();

    // load requirejs
    require = {
        paths: {
            'lingwo': LINGWO_DICTIONARY_PATH+'/../lingwo_oss/js',
            'lingwo_old': LINGWO_DICTIONARY_PATH+'/js',
            'lingwo/languages': LINGWO_DICTIONARY_PATH+'/../drupal/sites/default/files/lingwo/languages',
        }
    };
    load(LINGWO_DICTIONARY_PATH + '/js/require.js');
    load(LINGWO_DICTIONARY_PATH + '/js/require/rhino.js');

    // ultimately, load the actual script
    load(args[0]);
})(arguments);

