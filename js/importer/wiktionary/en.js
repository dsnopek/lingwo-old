
/*
 * For parsing data from en.wikitionary.org.
 */

require.def('lingwo_dictionary/importer/wiktionary/en',
    ['lingwo_dictionary/util/declare',
     'lingwo_dictionary/Entry',
     'lingwo_dictionary/Language',
     'lingwo_dictionary/importer/mediawiki/WikiText',
     'lingwo_dictionary/importer/mediawiki/Producer',
     'lingwo_dictionary/util/text',
    ],
    function (declare, Entry, Language, WikiText, Producer, text_utils) {
        var posList = ['Noun','Adjective','Verb','Proper noun','Interjection','Conjunction','Preposition','Pronoun',
            'Prefix','Initialism','Phrase','Adverb','Cardinal number','Ordinal number','Suffix','Idiom','Numeral'];

        var posMap = {
            'Noun': 'noun',
            'Adjective': 'adjective',
            'Verb': 'verb',
            'Proper noun': 'noun',
            'Interjection': 'exclamation',
            'Conjunction': 'conjunction',
            'Preposition': 'preposition',
            'Pronoun': 'pronoun',
            'Prefix': 'prefix',
            'Initialism': 'abbreviation',
            'Phrase': 'phrase',
            'Adverb': 'adverb',
            'Cardinal number': 'noun',
            'Ordinal number': 'noun',
            'Suffix': 'suffix',
            'Idiom': 'phrase',
            'Numeral': 'noun',
        };

        var langNames = {
            'en': 'English',
            'pl': 'Polish',
        };

        function trim(s) {
            s = s.replace(/^\s+/, '');
            s = s.replace(/\s+$/, '');
            return s;
        }

        var LineReader = declare({
            _constructor: function (text) {
                this.lines = text.split('\n');
                this.cur = 0;
            },

            reset: function () {
                this.cur = 0;
            },

            eof: function () {
                return this.cur >= this.lines.length;
            },

            _next: function (updatePosition, allowEmpty) {
                var cur = this.cur, line;

                if (typeof allowEmpty == 'undefined') {
                    allowEmpty = false;
                }
                if (!allowEmpty) {
                    while(cur < this.lines.length && trim(this.lines[cur]) == '') {
                        cur++;
                    }
                }

                if (cur >= this.lines.length) {
                    return null;
                }

                line = this.lines[cur++];
                if (updatePosition) {
                    this.cur = cur;
                }
                return line;
            },

            peekline: function (allowEmpty) {
                return this._next(false, allowEmpty);
            },

            readline: function (allowEmpty) {
                return this._next(true, allowEmpty);
            }
        });

        function clean(line, max) {
            line = line.replace(/^#:?/, '');
            line = WikiText.clean(line);
            line = trim(line);

            if (typeof max != 'undefined') {
                line = text_utils.limitString(line, max);
            }

            return line;
        }

        function parseSenses(text) {
            var input = new LineReader(text), line, parsing = false,
                senses = [], sense;

            while (!input.eof()) {
                line = input.readline();
                
                // we start parsing on encountering the first '===' section
                if (!parsing) {
                    if (/^===[^=]/.exec(line)) {
                        parsing = true;
                    }
                    continue;
                }

                // we stop parsing when we encounter another wikitext section
                if (/^=/.exec(line)) {
                    break;
                }
                // we find a difference, on a line marked '#'
                else if (/^#[^:*]/.exec(line)) {
                    sense = {
                        difference: clean(line, 255),
                    };
                    
                    // If its followed by an example, read that too.
                    if (/^#:/.exec(input.peekline())) {
                        sense.example = clean(input.readline());
                    }

                    senses.push(sense);
                }
            }

            return senses;
        }

        var parsers = {
            'en': function (entry) {
                var raw = entry.getSource('en.wiktionary.org').raw;
                entry.senses = parseSenses(raw);
                print (entry.serialize());
            }
        };

        function process(args) {
            var producer = new Producer(args.filename),
                handler = args.handler,
                code = args.lang_code,
                lang_name = langNames[code];

            function MyHandler(page) {
                var text = new WikiText(page.revision.text),
                    entry, found, pos;

                if (text.hasSection(lang_name)) {
                    text.text = text.getSection(lang_name);
                    found = false;

                    for(pos in posMap) {
                        if (text.hasSection(pos, 2)) {
                            entry = new Entry({
                                headword: page.title.toString(),
                                language: Language.languages[code],
                                pos: posMap[pos],
                            });
                            entry.setSource('en.wiktionary.org', {
                                raw: '=='+lang_name+'==\n\n'+text.getSection(pos, 2)+'\n\n'+text.getSection('Pronunciation', 2),
                                url: 'http://en.wiktionary.org/wiki/'+entry.headword,
                                license: 'CC-BY-SA-3.0',
                                timestamp: page.revision.timestamp.toString()
                            });

                            // pass to the language specific parser if there is one, to the
                            // handler and mark as found.
                            if (parsers[code]) {
                                parsers[code](entry);
                            }
                            handler(entry);
                            found = true;
                        }
                    }

                    if (!found) {
                        print ('Unknown POS: '+page.title);
                    }
                }
            }

            // execule it!
            args.handler = MyHandler;
            producer.run(args);
        }

        return {
            process: process,
            parsers: parsers
        };
    }
);


