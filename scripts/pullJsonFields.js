
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
        var data = JSON.stringify(lang.fields, function (key, value) {
            var s;
            if (typeof value == 'function') {
                s = ''+value;
                s = s.replace(/^\nfunction.*?{\n/, '');
                s = s.replace(/}\n$/,              '');
                s = s.replace(new RegExp('^    ', 'mg'), '');
                return s;
            }
            return value;
        });

        data = data.replace(new RegExp('\\\\u\\w\\w\\w\\w', 'g'), function (s) {
            return (eval("'"+s+"'"));
        });

        WriteFile(code+'.json', data);
    }
);


