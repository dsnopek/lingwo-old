
define(
    ['lingwo/util/declare',
     'lingwo/Entry',
     'lingwo/Language'],
    function (declare, Entry, Language) {
        var IN_BUF_SZ = 1024;

        // If you don't love Java now ...
        function openStream(fn) {
            var infile = new BufferedInputStream(new FileInputStream(fn), IN_BUF_SZ);
            // wrap with BufferedReader so we can deal with individual lines
            infile = new BufferedReader(new InputStreamReader(infile));
            return infile;
        }

        var posMap = {
            'rzeczownik': 'noun',
            'czasownik': 'verb',
            'przymiotnik': 'adjective',
            'przysłówek': 'adverb',
            'przyimek': 'preposition',
            'spójnik': 'conjunction',
            'wykrzyknik': 'exclamation',
        };

        function getPos(s) {
            return posMap[s] || null;
        }

        function trim(s) {
            s = s.replace(/^\s+/, '');
            s = s.replace(/\s+$/, '');
            return s;
        }

        function parseLine(s, lang) {
            var match;
            if (match = /^([^\[]+)\[([^\]]+)\] = (.*)$/.exec(s)) {
                return {
                    headword: trim(match[1]),
                    pos: getPos(trim(match[2])),
                    trans: trim(match[3])
                };
            }
            return null;
        }

        function generateModule(source_lang, target_lang) {
            var code = [source_lang,target_lang].join('-'),
                name = 'www.open-dictionaries.com:'+code;

            return {
                name: name,

                Producer: declare({
                    _constructor: function(args) {
                        this.fn = args.source[name] || args.source['default'];
                        this.timestamp = args.timestamp;
                    },

                    run: function (args) {
                        var stream = openStream(this.fn), line, self = this,
                            entry, cur = null, last = null, sourceLines = [], source,
                            handler = args.handler, limit = args.limit,
                            counter = 0;

                        while (true) {
                            line = stream.readLine();

                            // if EOF or a valid line, which is different than the last valid line
                            if (line === null ||
                                ((cur = parseLine(line)) && last !== null && (cur.headword != last.headword || cur.pos != last.pos)))
                            {
                                entry = new Entry({
                                    headword: last.headword,
                                    pos: last.pos,
                                    language: Language.languages[source_lang]
                                });

                                source = {
                                    raw: sourceLines.join('\n')+'\n',
                                    url: 'http://www.open-dictionaries.com/b9.html',
                                    license: 'CC-BY-SA-3.0'
                                };
                                if (self.timestamp) {
                                    source['timestamp'] = timestamp;
                                }
                                entry.setSource(name, source);

                                // pass to the handler
                                handler(entry);
                                counter++;

                                // setup for importing a new word
                                sourceLines = [];
                            }

                            if (line === null) {
                                // EOF
                                return;
                            }
                            if (limit && counter > limit) {
                                // limit met
                                return;
                            }

                            if (cur) {
                                sourceLines.push(line);
                            }

                            last = cur;
                        }
                    }
                }),
                
                parser: function (entry) {
                    var trans = [];
                    entry.getSource(this.name).raw.split('\n').forEach(function (line) {
                        var parsed;
                        if (parsed = parseLine(line)) {
                            trans.push(parsed.trans);
                        }
                    });

                    // we setup a single sense
                    entry.senses = [{}];
                    // with all the translations
                    entry.translations = {};
                    entry.translations[target_lang] = { 'senses': [{'trans': trans}] };
                }
            };
        }

        return { generateModule: generateModule };
    }
);

