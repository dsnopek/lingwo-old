
/*
 * Produce entries from a Database.
 */

importPackage(java.sql);
importPackage(java.io);

define(
    ['lingwo/util/declare',
     'lingwo/Entry'],
    function (declare, Entry) {
        return declare({
            _constructor: function (db, lang, entry_list) {
                this.db = db;
                this.lang = lang;
                this.entry_list = entry_list;
            },

            PAGE_SIZE: 10,

            _runAll: function (args) {
                var handler = args.handler;
                var limit = args.limit || 0;
                var offset = 0, entry, self = this, _limit = 10, counter = 0;

                while(true) {
                    if (limit != 0) {
                        if (offset >= limit) {
                            break;
                        }
                        _limit = Math.min(this.PAGE_SIZE, (limit - offset));
                    }

                    var query = 'SELECT data FROM entry';
                    if (this.lang) {
                        query += ' WHERE lang = \''+this.lang+'\'';
                    }
                    query += ' LIMIT '+_limit+' OFFSET '+offset;

                    var rows = this.db.query(query);
                    if (rows.length == 0) {
                        break;
                    }

                    rows.forEach(function (row) {
                        counter++;
                        // build a fake entry
                        var entry = Entry.deserialize(''+row.data);
                        handler(entry);
                    });

                    offset += this.PAGE_SIZE;
                }

                return counter;
            },

            _runList: function (args) {
                var handler = args.handler,
                    limit = args.limit || 0,
                    entry, counter = 0,
                    spec, headword, lang, pos;

                for (spec in this.entry_list) {
                    [lang, pos, headword] = spec.split(':');
                    if (lang != this.lang) continue;

                    entry = this.db.getEntry(lang, pos, headword);
                    if (entry) {
                        handler(entry);
                        counter++;
                    }
                    else {
                        print ('Database has no such entry: '+spec);
                    }

                    if (limit && counter >= limit) break;
                }

                return counter;
            },

            run: function (args) {
                if (this.entry_list) {
                    return this._runList(args);
                }
                else {
                    return this._runAll(args);
                }
            }
        });
    }
);

