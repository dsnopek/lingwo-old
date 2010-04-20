
/*
 * Command-line script for running our importers.
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
        'lingwo_dictionary/importer/MultiProducer',
        'lingwo_dictionary/importer/languages/'+OPTS['lang'],
        'lingwo_dictionary/util/json2',
    ],
    function (Database, Service, DatabaseProducer, MultiProducer, importer, JSON) {
        var source, service, db, handler, limit, producer, parser, entryList, x;

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

        function readEntryList(fn) {
            var reader = new BufferedReader(new FileReader(fn)),
                line, entryList = {};
            while (line = reader.readLine()) {
                if (line) {
                    entryList[line] = true;
                }
            }
            return entryList;
        }

        function checkEntry(entry) {
            if (!entry.pos) {
                print('!*** Skipping entry because it has no POS: '+entry.headword);
                return false;
            }
            if (entryList) {
                // check if its in the entry list
                if (!entryList[[entry.language.name, entry.pos, entry.headword].join(':')])
                    return false;
            }
            print ('Processing: '+entry.headword);
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
            //print (JSON.stringify(entry.translations.pl));

            print(service.update_entry(entry, OPTS['force-changed'] == 'true'));
        }

        // parse the source arguments into a straight up object
        source = OPTS['source'];
        if (typeof source == 'string') {
            source = { 'default': source };
        }
        for (x in OPTS) {
            if (x.indexOf('source:') == 0) {
                // create on demand (so if there are no sources its never created)
                if (!source) {
                    source = {};
                }
                source[x.substr(7)] = OPTS[x];
            }
        }

        if (source && OPTS['input-staging']) {
            die ('Can\'t pass both --source and --input-staging');
        }
        if (!source && !OPTS['input-staging']) {
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
        if (OPTS['entry-list']) {
            entryList = readEntryList(OPTS['entry-list']);
        }

        limit = OPTS['limit'];
        if (typeof limit != 'undefined') {
            limit = parseInt(limit);
        }

        // set-up "outputs"
        if (OPTS['service']) {
            try {
                service = connectToService(OPTS);
            }
            catch (e) {
                print (e);
                quit(1);
            }
            parser  = importer.makeParser();
            handler = sendToService;
        }
        else {
            handler = saveToDatabase;
        }

        // set-up "inputs"
        if (source) {
            producer = importer.makeProducer({
                source: source,
                // others might accept this one later, but for now, only for MultiProducer
                entry_list: entryList,
                // only for MultiProducer
                _staging_db: db,
            });
        }
        else {
            producer = new DatabaseProducer(db, OPTS['lang'], entryList);
        }

        // If we are saving to the staging database and our producer is a MultiProducer
        // than we are using a sly (yet ugly) hack where the producer is writing directly
        // to the staging db, so we give a null handler.
        if (handler === saveToDatabase && producer instanceof MultiProducer) {
            hander = function () { };
        }

        // run
        producer.run({
            handler: handler,
            limit: limit
        });
    }
);

