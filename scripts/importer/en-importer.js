
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

function die(s) {
    print (s);
    quit(1);
};

require([
        'lingwo_dictionary/importer/Database',
        'lingwo_dictionary/importer/Service',
        'lingwo_dictionary/importer/DatabaseProducer',
        'lingwo_dictionary/importer/wiktionary/en',
        'lingwo_dictionary/languages/en',
    ],
    function (Database, Service, DatabaseProducer, wiktionary_en, en) {
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

        var opts, args, source, service, db, handler, limit, parser;
        [opts, args] = getopts(ARGV);

        function saveToDatabase(entry) {
            if (!entry.pos) {
                print('!*** Skipping entry because it has no POS: '+entry.headword);
                return;
            }
            
            db.setEntry(entry);
            db.commit();
        }

        function sendToService(entry) {
            if (!entry.pos) {
                print('!*** Skipping entry because it has no POS: '+entry.headword);
                return;
            }

            // pass into the language specific parser
            wiktionary_en.parsers['en'](entry);

            print(service.update_entry(entry));
        }

        if (opts['source'] && opts['input-staging']) {
            die ('Can\'t pass both --source and --input-staging');
        }
        if (!opts['source'] && !opts['input-staging']) {
            die ('Must pass either --source or --input-staging');
        }
        if (opts['service'] && opts['output-staging']) {
            die ('Can\'t pass both --service and --output-staging');
        }
        if (!opts['service'] && !opts['output-staging']) {
            die ('Must pass either --service or --output-staging');
        }
        if (opts['input-staging'] || opts['output-staging']) {
            // TODO: If input-staging, we need to check that it exists!
            db = new Database(opts['input-staging'] || opts['output-staging']);
        }

        source = opts['source'];
        limit = opts['limit'];
        if (typeof limit != 'undefined') {
            limit = parseInt(limit);
        }

        if (opts['service']) {
            service = connectToService(opts);
            handler = sendToService;
        }
        else {
            handler = saveToDatabase;
        }

        if (source) {
            wiktionary_en.process({
                lang_code: 'en',
                filename: source,
                handler: handler,
                limit: limit
            });
        }
        else {
            (new DatabaseProducer(db)).run({
                handler: handler,
                limit: limit
            });
        }
    }
);

