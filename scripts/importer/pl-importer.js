
/*
 * Here we will develop an importer for Polish language.
 */

// save the arguments for later
opts = arguments.splice(0);

// TODO: is this still necessary?  It used to be used by the morphology code.
console = {
    debug: print
};

require([
        'lingwo_dictionary/importer/Database',
        'lingwo_dictionary/importer/Service',
        'lingwo_dictionary/importer/wiktionary/pl',
        'lingwo_dictionary/languages/pl',
    ],
    function (Database, Service, wiktionary_pl, pl) {
        var db = new Database('staging.db');

        var service = new Service({
            domain: 'localhost',
            url: 'http://127.0.0.1:8082/services/xmlrpc',
            key: '028edd447fce610ef46dd685ae186d7f'
        });
        if (service.connect()) {
            var res = service.login('Normal User', 'test');
            print(res);
        }

        // Handle each item.
        function handler(entry) {
            if (!entry.pos) {
                print('!*** Skipping entry because it has no POS: '+entry.headword);
                return;
            }

            db.setEntry(entry);
            db.commit();

            print(service.update_entry(entry));
        }

        // TODO: We really should be combining the two sources
        wiktionary_pl.process({
            // TODO: this should really take the language ('pl') that we are processing,
            // since we could pull *any* language out of this dictionary.
            filename: '/home/dsnopek/dl/plwiktionary-20091202-pages-articles.xml.bz2',
            handler: handler,
            //limit: 1500
        });
        /*
        Lingwo.importer.processSource({
            type: 'pl-wiktionary-org',
            filename: '/home/dsnopek/dl/plwiktionary-20091202-pages-articles.xml.bz2',
            handler: handler,
            //limit: 1500
        });
        */
    }
);

