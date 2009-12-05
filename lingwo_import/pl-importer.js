
/*
 * Here we will develop an importer for Polish language.
 */

importPackage(java.io);
importPackage(java.sql);

if (typeof Lingwo == 'undefined')
    Lingwo = {};
if (typeof Lingwo.importer == 'undefined')
    Lingwo.importer = {};

function declare(props) {
    var cons = props['_constructor'];
    delete props['_constructor'];
    for(var name in props) {
        cons.prototype[name] = props[name];
    }
    return cons;
};

// Define the MediaWikiProducer
(function () {
    IN_BUF_SZ = 1024 * 1024;

    function openStream(fn) {
        var infile = new BufferedInputStream(new FileInputStream(fn), IN_BUF_SZ);

        var first = infile.read();
        var second = infile.read();
        // 66 = B, 90 = Z
        if (first != 66 || second != 90) {
            throw new IOException("Didn't find BZ file signature in .bz2 file");
        }

        // wrap with the BZip2 reader
        infile = new org.apache.tools.bzip2.CBZip2InputStream(infile);

        // wrap with BufferedReader so we can deal with individual lines
        infile = new BufferedReader(new InputStreamReader(infile));

        return infile;
    };

    Lingwo.importer.MediaWikiProducer = declare({
        _stream: null,

        _constructor: function (filename) {
            this.filename = filename;
        },

        _readPage: function () {
            var buffer = "", line, inPage = false;

            while (true) {
                line = this._stream.readLine();
                if (line === null) {
                    throw "EOF";
                }

                if (line == '  <page>') {
                    if (!inPage) {
                        inPage = true;
                    }
                    else {
                        // sanity check
                        throw new IOException("Found a <page> within a <page>");
                    }
                }
                if (inPage) {
                    buffer += (line + "\n");
                }
                if (line == '  </page>') {
                    if (!inPage) {
                        // sanity check
                        throw new IOException("Found </page> before <page>");
                    }
                    break;
                }
            }

            // trim!
            buffer = buffer.replace(/^\s+/, '');
            buffer = buffer.replace(/\s+$/, '');

            return buffer;
        },

        _runOne: function (handler, remote) {
            // TODO: handle errors and stuff
            var pageXml = new XML(this._readPage());
            handler.process(pageXml);
        },

        run: function (handler, remote, limit) {
            this._stream = openStream(this.filename);

            var i = 0;
            // TODO: report progress
            if (typeof limit == 'undefined') {
                while (true) {
                    this._runOne(handler, remote);
                }
            }
            else {
                for (i = 0; i < limit; i++) {
                    this._runOne(handler, remote);
                }
            }
        }
    });
})();

/*
 * A database object.
 */
(function () {
    Lingwo.importer.Database = declare({
        _constructor: function (filename) {
            this.filename = filename;
            this._initDb();
        },
        _initDb: function () {
            java.lang.Class.forName('org.sqlite.JDBC');
            var newFile = !(new File(this.filename)).exists();
            this._conn = DriverManager.getConnection("jdbc:sqlite:"+this.filename);
            if (newFile) {
                this.resetDb();
            }
            this._prep = this._conn.prepareStatement("REPLACE INTO entry VALUES (?, ?, ?, ?)");
        },
        resetDb: function () {
            var stat = this._conn.createStatement();
            stat.executeUpdate('DROP TABLE IF EXISTS entry');
            stat.executeUpdate('CREATE TABLE entry (lang, pos, headword, data)');
            stat.executeUpdate('CREATE INDEX IF NOT EXISTS entry_index ON entry (lang, pos, headword)');
        },
        setEntry: function (lang, pos, headword, data) {
            var prep = this._prep;
            prep.setString(1, lang);
            prep.setString(2, pos);
            prep.setString(3, headword);
            prep.setString(4, data);
            prep.addBatch();
        },
        commit: function () {
            this._conn.setAutoCommit(false);
            this._prep.executeBatch();
            this._conn.setAutoCommit(true);
        }
    });
})();

/*
 * Deal with all the media wiki stuff.
 */
(function () {
    Lingwo.importer.WikiText = declare({
        _constructor: function (text) {
            this.text = text;
        },

        _makeSep: function (level) {
            if (typeof level == 'undefined') {
                level = 1;
            }
            var sep = '';
            for(var i = 0; i < level+1; i++) {
                sep += '=';
            }
            return sep;
        },

        hasSection: function (name, level) {
            var sep = this._makeSep(level);
            var regex = new RegExp('^'+sep+'\\s*'+name+'\\s*'+sep+'$', 'm');
            return !!regex.exec(this.text);
        },

        getSection: function (name, level) {
            var sep = this._makeSep(level);
            var regex, match;

            regex = new RegExp(sep+'\\s*'+name+'\\s*'+sep+'\n([\\s\\S])*$');
            match = regex.exec(this.text);
            if (!match) {
                return '';
            }

            var text = match[0];
            regex = new RegExp('\n'+sep+'[^=][\\s\\S]*');
            return text.replace(regex, '');
        }
    });

    Lingwo.importer.WiktionaryENSplitter = declare({
        _constructor: function (db, lang, code) {
            this.db = db;
            this.lang = lang;
            this.code = code;
        },

        posList: ['Noun','Adjective','Verb','Proper noun','Interjection','Conjunction','Preposition','Pronoun','Prefix','Initialism','Phrase','Adverb','Cardinal number','Ordinal number','Suffix','Idiom','Numeral'],

        process: function (page) {
            var text = new Lingwo.importer.WikiText(page.revision.text);
            if (text.hasSection(this.lang)) {
                text.text = text.getSection(this.lang);
                var found = false;
                var self = this;
                this.posList.forEach(function (pos) {
                    if (text.hasSection(pos, 2)) {
                        self.db.setEntry(self.code, pos.toLowerCase(), page.title,
                            '==Polish==\n\n'+text.getSection(pos, 2));
                        found = true;
                    }
                });
                if (!found) {
                    self.db.setEntry(self.code, 'unknown', page.title, text.text);
                    print ('Unknown POS: '+page.title);
                }
                else {
                    this.db.commit();
                }
            }
        },
    });

})();

function main() {
    var db = new Lingwo.importer.Database('staging.db');
    var remote = null;
    var producer = new Lingwo.importer.MediaWikiProducer('/home/dsnopek/dl/enwiktionary-latest-pages-articles.xml.bz2');
    var handler = new Lingwo.importer.WiktionaryENSplitter(db, 'Polish', 'pl');
    producer.run(handler, remote);//, 100000);
}
main();

