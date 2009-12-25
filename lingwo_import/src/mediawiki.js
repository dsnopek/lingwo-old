
/*
 * MediaWiki code
 */

importPackage(java.io);

module('Lingwo.importer.mediawiki', function () {
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

    return {
        Producer: declare({
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

            _runOne: function (args) {
                // TODO: handle errors and stuff
                // TODO: maybe we should re-package this, because we really don't need the whole
                // XML document, really just the title and the text data...
                var pageXml = new XML(this._readPage());
                args.handler(pageXml);
            },

            run: function (args) {
                this._stream = openStream(this.filename);

                var i = 0;
                // TODO: report progress
                if (typeof args.limit == 'undefined') {
                    while (true) {
                        this._runOne(args);
                    }
                }
                else {
                    for (i = 0; i < args.limit; i++) {
                        this._runOne(args);
                    }
                }
            }
        }),

        WikiText: declare({
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
                var regex = new RegExp('^'+sep+'\\s*'+escapeRegex(name)+'\\s*'+sep+'$', 'm');
                return !!regex.exec(this.text);
            },

            getSection: function (name, level) {
                var sep = this._makeSep(level);
                var regex, match;

                regex = new RegExp(sep+'\\s*'+escapeRegex(name)+'\\s*'+sep+'\n([\\s\\S])*$');
                match = regex.exec(this.text);
                if (!match) {
                    return '';
                }

                var text = match[0];
                regex = new RegExp('\n'+sep+'[^=][\\s\\S]*');
                return text.replace(regex, '');
            }
        }),
    };
});


