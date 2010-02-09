
/*
 * Produce entries from a Database.
 */

importPackage(java.sql);
importPackage(java.io);

require.def('lingwo_dictionary/scripts/importer/common/DatabaseProducer',
    ['lingwo_dictionary/js/declare'],
    function (declare) {
        return declare({
            _constructor: function (db) {
                this.db = db;
            },

            PAGE_SIZE: 10,

            run: function (args) {
                var handler = args.handler;
                var limit = args.limit || 0;
                var remote = args.remote;
                var offset = 0, entry, self = this, _limit = 10;

                while(true) {
                    if (limit != 0) {
                        if (offset >= limit) {
                            break;
                        }
                        _limit = Math.min(this.PAGE_SIZE, (limit - offset));
                    }

                    var rows = this.db.query('SELECT headword, data FROM entry LIMIT '+_limit+' OFFSET '+offset);
                    if (rows.length == 0) {
                        break;
                    }

                    rows.forEach(function (row) {
                        // build a fake entry
                        var entry = {
                            title: row.headword,
                            revision: { text: row.data }
                        };
                        handler.process(entry);
                    });

                    offset += this.PAGE_SIZE;
                }
            },
        });
    }
);

