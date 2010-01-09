
/*
 * Here we will develop an importer for Polish language.
 */

load('src/importer.js');
load('src/mediawiki.js');
load('src/db.js');
load('src/pl-wiktionary-org.js');
load('src/service.js');

// save the arguments for later
opts = arguments.splice(0);

function main() {
    var db = new Lingwo.importer.db.Database('staging.db');

    var service = new Lingwo.importer.Service({
        domain: 'localhost',
        url: 'http://127.0.0.1:8082/services/xmlrpc',
        key: '028edd447fce610ef46dd685ae186d7f'
    });
    if (service.connect()) {
        var res = service.login('Normal User', 'test');
        print(res);
    }

    // TODO: This handler really should put items on the server!
    function handler(entry) {
        db.setEntry(entry);
        db.commit();
        print(service.update_entry(entry));
    }

    // TODO: We really should be combining the two sources
    Lingwo.importer.processSource({
        type: 'pl-wiktionary-org',
        filename: '/home/dsnopek/dl/plwiktionary-20091202-pages-articles.xml.bz2',
        handler: handler,
        limit: 10
    });
}
main();

