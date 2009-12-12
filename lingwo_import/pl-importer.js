
/*
 * Here we will develop an importer for Polish language.
 */

load('src/importer.js');
load('src/mediawiki.js');
load('src/db.js');
load('src/pl-wiktionary-org.js');

function main() {
    var db = new Lingwo.importer.db.Database('staging.db');

    // TODO: This handler really should put items on the server!
    function handler(entry) {
        db.setEntry(entry);
        db.commit();
    }

    // TODO: We really should be combining the two sources
    Lingwo.importer.processSource({
        type: 'pl.wiktionary.org',
        filename: '/home/dsnopek/dl/plwiktionary-20091202-pages-articles.xml.bz2',
        handler: handler,
        limit: 100
    });

}
main();

