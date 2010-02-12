
var opts = arguments.splice(0);
if (opts.length != 2) {
    print ("** ERROR: Invalid arguments!");
    print ("./updatePHP.js <lang_code>");
    quit(1);
}
var code = opts[1];

importPackage(java.io);

function WriteFile(fn, data) {
    var out = new BufferedWriter(new FileWriter(fn));
    out.write(data);
    out.close();
}

require(
    ['lingwo_dictionary/languages/'+code,
     'lingwo_dictionary/util/json2'],
    function (lang, JSON) {
        var data = JSON.stringify(lang.fields);
        var s = '<?php\n\n/*\n * Automatically generated from language definition by updatePHP.js\n */\n\n';
        s += "$GLOBALS['LANG_SETTINGS']['"+code+"']['fields'] = json_decode('"+data+"', TRUE);\n\n";

        //print (s);
        WriteFile(LINGWO_DICTIONARY_PATH+'/lingwo_language/lingwo_language.'+code+'.inc', s);
    }
);


