
/*
 * Here we will develop an importer for English language.
 */

// save the arguments for later
ARGV = arguments.splice(0);

// TODO: is this still necessary?  It used to be used by the morphology code.
console = {
    debug: print
};

// Super-simple argument parsing
function getopts(l) {
    var args=[], opts={}, i, x, name, value;

    for (i = 0; i < l.length; i++) {
        x = l[i];
        if (x.substring(0, 2) == '--') {
            name = x.substring(2);
            if (name.indexOf('=') != -1) {
                [name, value] = name.split('=');
            }
            else {
                value = l[i+1];
                i++;
            }

            opts[name] = value;
        }
        else {
            args.push(x);
        }
    }

    return [opts, args];
}

require([
        'lingwo_dictionary/importer/Database',
        'lingwo_dictionary/importer/Service',
        'lingwo_dictionary/importer/wiktionary/en',
        'lingwo_dictionary/languages/en',
    ],
    function (Database, Service, wiktionary_en, en) {
        var JSON = require('lingwo_dictionary/util/json2');
        print (JSON.stringify(ARGV));

        function connectToService(opts) {
            var service, res;
            
            service = new Service({
                url: opts['service'],
                domain: opts['service-domain'],
                key: opts['service-key'],
            });

            if (service.connect()) {
                res = service.login(
                    opts['service-username'],
                    opts['service-password']
                );
                print(res);
            }

            return service;
        };

        var opts, args, source, service;
        [opts, args] = getopts(ARGV);

        source = opts['source'];
        if (!source) {
            print ('Must pass --source argument');
            quit(1);
        }

        service = connectToService(opts);

        // Handle each item.
        function handler(entry) {
            if (!entry.pos) {
                print('!*** Skipping entry because it has no POS: '+entry.headword);
                return;
            }

            print(service.update_entry(entry));
        }

        wiktionary_en.process({
            lang_code: 'en',
            filename: source,
            handler: handler,
            limit: 10
        });
    }
);

