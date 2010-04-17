
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
     'lingwo_dictionary/util/json2',
    ],
    function (declare, Entry, Language, WikiText, MediawikiProducer, text_utils, JSON) {
        var posMap = {
            'Abbreviation': 'abbreviation',
            'Initialism': 'abbreviation',
            'Adjective': 'adjective',
            'Adverb': 'adverb',
            'Article': 'article',
            'Conjunction': 'conjunction',
            'Determiner': 'determiner',
            'Interjection': 'exclamation',
            'Noun': 'noun',
            'Proper noun': 'noun',
            'Cardinal number': 'noun',
            'Ordinal number': 'noun',
            'Numeral': 'noun',
            'Onomatopoeia': 'onomatopoeia',
            'Particle': 'particle',
            'Phrase': 'phrase',
            'Idiom': 'phrase',
            'Prefix': 'prefix',
            'Preposition': 'preposition',
            'Pronoun': 'pronoun',
            'Suffix': 'suffix',
            'Symbol': 'symbol',
            'Title': 'title',
            'Verb': 'verb',
            'Phrase': 'phrase',
        };

        var langNames = {
            'en': 'English',
            'pl': 'Polish',
        };

        var langCodes = (function () {
            var r={}, code;
            for (code in langNames) {
                r[langNames[code]] = code;
            }
            return r;
        })();

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
                    line = null;
                }
                else {
                    line = this.lines[cur++];
                }

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

        function reduceTranslations(senses) {
            var i, x, sense1, sense2;
            for(i = 0; i < senses.length; i++) {
                sense1 = senses[i];
                for(x = 0; x < i; x++) {
                    sense2 = senses[x];
                    if (sense1 && sense2 && sense1.trans && sense2.trans &&
                        sense1.trans.join('-') == sense2.trans.join('-'))
                    {
                        senses[i] = {'same_as': x};
                    }
                }
            }
        };

        function parseTranslations(entry, text) {
            var input = new LineReader((new WikiText(text)).getSection('Translations', 3)),
                line, matches, langCode, tmp, senseIndex = 0, inSense = false;

            entry.senses = [];
            entry.translations = {};

            while (!input.eof()) {
                line = input.readline();

                if (matches = /^{{trans-top\|([^}]+)}}/.exec(line)) {
                    entry.senses.push({
                        difference: matches[1]
                    });
                    inSense = true;
                }
                else if (/^{{trans-bottom}}/.exec(line)) {
                    inSense = false;
                    senseIndex++;
                }
                else if (senseIndex != null && (matches = /^\* ([^:]+): (.*)$/.exec(line))) {
                    langCode = WikiText.clean(matches[1]);
                    langCode = langCodes[langCode] || langCode;
                    if (typeof entry.translations[langCode] == 'undefined') {
                        entry.translations[langCode] = {senses: []};
                    }

                    // parse the actual translation string
                    tmp = matches[2];
                    tmp = tmp.replace(/{{[mfn]}}/g, '');
                    if (entry.pos == 'adjective') {
                        // We don't need all the genders, we're too cool for that.
                        tmp = tmp.replace(/{{t[+-]?\|[^|]*\|[^|]*\|[^m]}}/g, '');
                        tmp = tmp.replace(/{{t[+-]?\|[^|]*\|[^|]*\|[^|]*\|[^m]}}/g, '');
                    }
                    tmp = tmp.replace(/{{t[+-]?\|([^}]+)}}/g, function (s, p1) {
                        if (p1) {
                            return p1.split('|')[1];
                        }
                        return '';
                    });
                    tmp = tmp.replace(/{{l\|([^}]+)}}/g, function (s, p1) {
                        if (p1) {
                            return p1.split('|')[1];
                        }
                        return '';
                    });
                    tmp = WikiText.clean(tmp);
                    tmp = tmp.split(/,\s*/);
                    tmp = tmp.map(trim);
                    tmp = tmp.filter(function (item) { return !!item; });

                    entry.translations[langCode].senses[senseIndex] = {trans: tmp};
                }
            }

            for(langCode in entry.translations) {
                reduceTranslations(entry.translations[langCode].senses);
            }
        }

        function parseSenses(entry, text) {
            var input = new LineReader(text), line, parsing = false,
                sense, sensesMap = {};

            // normalize to just the bare text bits
            function normalize(s) {
                s = WikiText.clean(s);
                s = s.replace(/[.,;:()"]/g, '');
                s = s.toLowerCase();
                return s;
            };

            // first we read in the main senses
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

                    sensesMap[normalize(sense.difference)] = sense;
                }
            }

            // then we try to match them with existing senses and fill in the
            // missing data.
            entry.senses.forEach(function (sense) {
                var senseKey = normalize(sense.difference), mainSenseKey, mainSense;
                for (mainSenseKey in sensesMap) {
                    // if its found anywhere in the string, we call it a match.
                    if (mainSenseKey.indexOf(senseKey) != -1) {
                        mainSense = sensesMap[mainSenseKey];
                        sense.difference = mainSense.difference;
                        sense.example = mainSense.example;
                    }
                }
            });
        }

        function parseSensesAndTranslations(entry, text) {
            parseTranslations(entry, text);
            parseSenses(entry, text);
        }

        return {
            name: 'en.wiktionary.org',

            Producer: declare({
                _constructor: function (args) {
                    var fn = args.filename['en.wiktionary.org'] || args.filename;
                    this.producer = new MediawikiProducer(fn);
                    this.code = args.code;
                    this.lang_name = langNames[args.code];
                },

                run: function (args) {
                    var self = this, handler = args.handler;
                    args.handler = function (page) {
                        var text = new WikiText(page.revision.text),
                            entry, found, pos;

                        if (text.hasSection(self.lang_name)) {
                            text.text = text.getSection(self.lang_name);
                            found = false;

                            for(pos in posMap) {
                                if (text.hasSection(pos, 2)) {
                                    entry = new Entry({
                                        headword: page.title.toString(),
                                        language: Language.languages[self.code],
                                        pos: posMap[pos],
                                    });
                                    entry.setSource('en.wiktionary.org', {
                                        raw: '=='+self.lang_name+'==\n\n'+text.getSection(pos, 2)+'\n\n'+text.getSection('Pronunciation', 2),
                                        url: 'http://en.wiktionary.org/wiki/'+entry.headword,
                                        license: 'CC-BY-SA-3.0',
                                        timestamp: page.revision.timestamp.toString()
                                    });

                                    handler(entry);
                                    found = true;
                                }
                            }

                            if (!found) {
                                print ('Unknown POS: '+page.title);
                            }
                        }
                    };

                    this.producer.run(args);
                }
            }),

            parser: function (entry) {
                var raw = entry.getSource('en.wiktionary.org').raw;
                parseSensesAndTranslations(entry, raw);
            }
        };
    }
);


