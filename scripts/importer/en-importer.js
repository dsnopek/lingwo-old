
/*
 * Here we will develop an importer for English language.
 */

// TODO: is this still necessary?  It used to be used by the morphology code.
console = {
    debug: print
};

function die(s) {
    print (s);
    quit(1);
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

function loadconfig(fn, opts) {
    var config = eval('('+readFile(fn, 'utf-8')+')'), name;
    if (opts) {
        // overwrite the config file opts with the command-line opts
        for (name in opts) {
            config[name] = opts[name];
        }
    }
    return config;
}

[OPTS, ARGS] = getopts(arguments);
if (OPTS['config']) {
    OPTS = loadconfig(OPTS['config'], OPTS);
}

if (!OPTS['lang']) {
    die ('Must pass --lang argument!');
}

require([
        'lingwo_dictionary/importer/Database',
        'lingwo_dictionary/importer/Service',
        'lingwo_dictionary/importer/DatabaseProducer',
        'lingwo_dictionary/importer/languages/'+OPTS['lang'],
    ],
    function (Database, Service, DatabaseProducer, importer) {
        var source, service, db, handler, limit, producer, parser;

        function connectToService(args) {
            var service, res;
            
            service = new Service({
                url: args['service'],
                domain: args['service-domain'],
                key: args['service-key'],
            });

            if (service.connect()) {
                res = service.login(
                    args['service-username'],
                    args['service-password']
                );
                print(res);
            }

            return service;
        };

        function checkEntry(entry) {
            if (!entry.pos) {
                print('!*** Skipping entry because it has no POS: '+entry.headword);
                return false;
            }
            return true;
        };

        function saveToDatabase(entry) {
            if (!checkEntry(entry)) return;
            db.setEntry(entry);
            db.commit();
        }

        function sendToService(entry) {
            if (!checkEntry(entry)) return;

            // pass into the language specific parser
            parser(entry);

            print(service.update_entry(entry));
        }

        if (OPTS['source'] && OPTS['input-staging']) {
            die ('Can\'t pass both --source and --input-staging');
        }
        if (!OPTS['source'] && !OPTS['input-staging']) {
            die ('Must pass either --source or --input-staging');
        }
        if (OPTS['service'] && OPTS['output-staging']) {
            die ('Can\'t pass both --service and --output-staging');
        }
        if (!OPTS['service'] && !OPTS['output-staging']) {
            die ('Must pass either --service or --output-staging');
        }
        if (OPTS['input-staging'] || OPTS['output-staging']) {
            // TODO: If input-staging, we need to check that it exists!
            db = new Database(OPTS['input-staging'] || OPTS['output-staging']);
        }

        source = OPTS['source'];
        limit = OPTS['limit'];
        if (typeof limit != 'undefined') {
            limit = parseInt(limit);
        }

        // set-up "outputs"
        if (OPTS['service']) {
            service = connectToService(OPTS);
            parser  = importer.makeParser();
            handler = sendToService;
        }
        else {
            handler = saveToDatabase;
        }

        // set-up "inputs"
        if (source) {
            producer = importer.makeProducer(source);
        }
        else {
            producer = new DatabaseProducer(db, OPTS['lang']);
        }

        // run
        producer.run({
            handler: handler,
            limit: limit
        });
    }
);

