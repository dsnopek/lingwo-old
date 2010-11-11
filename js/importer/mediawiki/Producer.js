
/*
 * MediaWiki Producer
 */

importPackage(java.io);

require.def('lingwo_dictionary/importer/mediawiki/Producer',
    ['lingwo_dictionary/util/declare',
    ],
    function (declare) {
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

        return declare ({
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
                if (!/^\S+:/.exec(pageXml.title.toString())) {
                    args.handler(pageXml);
                }
            },

            run: function (args) {
                this._stream = openStream(this.filename);

                var limit = -1;
                // TODO: report progress
                try {
                    if (typeof args.limit != 'undefined') {
                        limit = args.limit;
                    }
                    while (true) {
                        if (limit == 0) return;

                        try {
                            this._runOne(args);
                        }
                        catch (e) {
                            print ('ERROR: importing one record: '+e);
                        }

                        if (limit != -1) limit--;
                    }
                }
                catch (e) {
                    if (e == 'EOF') return;
                    throw(e);
                }
            }
        });
    }
);

