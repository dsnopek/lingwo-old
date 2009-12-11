
/*
 * A database object.
 */

importPackage(java.sql);

setObject('Lingwo.importer.db');

(function () {
    Lingwo.importer.db.Database = declare({
        _constructor: function (filename) {
            if (typeof filename == 'undefined') {
                filename = ':memory:';
            }
            this.filename = filename;
            this._initDb();
        },
        _initDb: function () {
            java.lang.Class.forName('org.sqlite.JDBC');
            var newFile = (this.filename == ':memory:') || !(new File(this.filename)).exists();
            this._conn = DriverManager.getConnection("jdbc:sqlite:"+this.filename);
            if (newFile) {
                this.resetDb();
            }
            this._insert_stmt = this._conn.prepareStatement("REPLACE INTO entry VALUES (?, ?, ?, ?)");
            this._select_stmt = this._conn.prepareStatement("SELECT data FROM entry WHERE lang = ? AND pos = ? AND headword = ? LIMIT 1");
        },
        resetDb: function () {
            var stmt = this._conn.createStatement();
            stmt.executeUpdate('DROP TABLE IF EXISTS entry');
            stmt.executeUpdate('CREATE TABLE entry (lang, pos, headword, data)');
            stmt.executeUpdate('CREATE INDEX IF NOT EXISTS entry_index ON entry (lang, pos, headword)');
        },
        setEntry: function (entry) {
            var prep = this._insert_stmt;
            prep.setString(1, entry.language);
            prep.setString(2, entry.pos);
            prep.setString(3, entry.headword);
            prep.setString(4, JSON.stringify(entry));
            prep.addBatch();
        },
        getEntry: function (lang, pos, headword) {
            var prep = this._select_stmt;
            prep.setString(1, lang);
            prep.setString(2, pos);
            prep.setString(3, headword);
            var rs = prep.executeQuery();
            if (rs.next()) {
                return JSON.parse(rs.getString("data"));
            }
            return null;
        },
        query: function (sql) {
            var stmt = this._conn.createStatement();
            var rs = stmt.executeQuery(sql);
            var meta = rs.getMetaData();
            var ret = [], obj;
            while (rs.next()) {
                obj = {};
                for(var i = 1; i < meta.getColumnCount()+1; i++) {
                    obj[meta.getColumnName(i)] = rs.getString(i);
                }
                ret.push(obj);
            }
            return ret;
        },
        commit: function () {
            this._conn.setAutoCommit(false);
            this._insert_stmt.executeBatch();
            this._conn.setAutoCommit(true);
        }
    });

    Lingwo.importer.db.DatabaseProducer = declare({
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
})();

