
/*
 * Here we will develop an importer for Polish language.
 */

importPackage(java.io);

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

WikiText = declare({
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
        var regex = new RegExp(sep+'\\s*'+name+'\\s*'+sep+'\n[.\n]*');//, 'g');
        var match = regex.exec(this.text);
        if (match) {
            return match[0];
        }
        return '';
    }
});

WiktionaryENHandler = declare({
    _constructor: function (db) {
        this.db = db;
    },

    process: function (page) {
        var text = new WikiText(page.revision.text);
        if (text.hasSection('Polish')) {
            print (page.title);
            print (text.getSection('Polish'));
        }
    },
});

function main() {
    var db = null;
    var remote = null;
    var producer = new Lingwo.importer.MediaWikiProducer('/home/dsnopek/dl/enwiktionary-latest-pages-articles.xml.bz2');
    var handler = new WiktionaryENHandler(db);
    producer.run(handler, remote, 100);
}
main();

