
/*
 * Produce entries from a Database.
 */

importPackage(java.sql);
importPackage(java.io);

require.def('lingwo_dictionary/importer/DatabaseProducer',
    ['lingwo_dictionary/util/declare',
     'lingwo_dictionary/Entry'],
    function (declare, Entry) {
        return declare({
            _constructor: function (db) {
                this.db = db;
            },

            PAGE_SIZE: 10,

            run: function (args) {
                var handler = args.handler;
                var limit = args.limit || 0;
                var offset = 0, entry, self = this, _limit = 10;

                while(true) {
                    if (limit != 0) {
                        if (offset >= limit) {
                            break;
                        }
                        _limit = Math.min(this.PAGE_SIZE, (limit - offset));
                    }

                    var rows = this.db.query('SELECT data FROM entry LIMIT '+_limit+' OFFSET '+offset);
                    if (rows.length == 0) {
                        break;
                    }

                    rows.forEach(function (row) {
                        // build a fake entry
                        var entry = Entry.deserialize(''+row.data);
                        handler(entry);
                    });

                    offset += this.PAGE_SIZE;
                }
            },
        });
    }
);

