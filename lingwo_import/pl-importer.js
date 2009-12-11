
/*
 * Here we will develop an importer for Polish language.
 */

function main() {
    var db = new Lingwo.importer.Database('staging.db');
    var remote = null;

    //var producer = new Lingwo.importer.MediaWikiProducer('/home/dsnopek/dl/enwiktionary-latest-pages-articles.xml.bz2');
    //var handler = new Lingwo.importer.WiktionaryENSplitter(db, 'Polish', 'pl');

    //var producer = new Lingwo.importer.MediaWikiProducer('/home/dsnopek/dl/plwiktionary-20091202-pages-articles.xml.bz2');
    //var handler = new Lingwo.importer.WiktionaryPLSplitter(db, 'język polski', 'pl');

    var db2 = new Lingwo.importer.Database('staging-pl.db');
    var producer = new Lingwo.importer.DatabaseProducer(db2);
    var handler = new Lingwo.importer.PLWikitionaryPLHandler(db);

    producer.run({
        handler: handler,
        remote: remote,
        limit: 5
    });
}
main();

