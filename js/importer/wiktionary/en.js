
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
            'Acronym': 'abbreviation',
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
            'Ordinal number': 'adjective',
            'Numeral': 'noun',
            'Onomatopoeia': 'onomatopoeia',
            'Particle': 'particle',
            'Phrase': 'phrase',
            'Proverb': 'phrase',
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
            // sometimes Translations are entered with 5 equal signs, fix that ...
            text = text.replace(new RegExp('^====+\s*Translations\s*====+$', 'm'), '====Translations====\n');
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

        function getFormsInfo(text) {
            var input = new LineReader(text), line, match;

            // attempt to find the line defining the forms
            while (!input.eof()) {
                line = input.readline();
                if (match = /^\{\{en-[^|}]+(.*)\}\}$/.exec(line)) {
                    if (match.length == 2) {
                        return match[1].substr(1).split('|');
                    }
                    return;
                }
                else if(!/^==/.test(line)) {
                    // if we encouter a line which isn't part of the
                    // lead in (ie. ==English== ===Verb===) then we know
                    // that we have gone too far and haven't located the
                    // appropriate line
                    return;
                }
            }
        }

        var formParsers = {
            // this is basically a literal port of the code in the Wiktionary's template:en-verb
            'verb': function (entry, formInfo) {
                var headword = entry.headword,
                    infinitive = 'to '+headword,
                    getPres3rdSg = function () {
                        if (formInfo[1] == 'es' || formInfo[2] == 'es') {
                            if (formInfo.length == 2) {
                                return formInfo[0] + 'es';
                            }
                            return formInfo[0] + formInfo[1] + 'es';
                        }
                        else if (formInfo[1] + formInfo[2] == 'ied') {
                            return formInfo[0] + formInfo[1] + 'es';
                        }
                        else if (/^(d|ed|ing)$/.test(formInfo[1]) || /^(d|ed|ing)$/.test(formInfo[2])) {
                            return headword + 's';
                        }
                        else if (formInfo.length >= 3) {
                            return formInfo[0];
                        }

                        return headword + 's';
                    },
                    getPresP = function () {
                        if (formInfo[1] == 'es' || formInfo[2] == 'es') {
                            if (formInfo.length == 2) {
                                return formInfo[0] + 'ing';
                            }
                            return formInfo[0] + formInfo[1] + 'ing';
                        }
                        else if (formInfo[1] + formInfo[2] == 'ied') {
                            return headword + 'ing';
                        }
                        else if (/^(d|ed|ing)$/.test(formInfo[1]) || /^(d|ed|ing)$/.test(formInfo[2])) {
                            if (formInfo.length == 2) {
                                return formInfo[0] + 'ing';
                            }
                            return formInfo[0] + formInfo[1] + 'ing';
                        }
                        else if (formInfo.length >= 3) {
                            return formInfo[1];
                        }

                        return headword + 'ing';
                        
                    },
                    getPast = function () {
                        if (formInfo[1] == 'd' || formInfo[1] == 'ed') {
                            return formInfo[0] + formInfo[1];
                        }
                        else if (formInfo[2] == 'd' || formInfo[2] == 'ed') {
                            return formInfo[0] + formInfo[1] + formInfo[2];
                        }
                        else if (formInfo[1] == 'es' || formInfo[2] == 'es') {
                            if (formInfo.length == 2) {
                                return formInfo[0] + 'ed';
                            }
                            return formInfo[0] + formInfo[1] + 'ed';
                        }
                        else if (formInfo[1] + formInfo[2] == 'ying') {
                            return headword + 'd';
                        }
                        else if (formInfo[1] == 'ing' || formInfo[2] == 'ing') {
                            if (formInfo.length == 2) {
                                return formInfo[0] + 'ed';
                            }
                            return formInfo[0] + formInfo[1] + 'ed';
                        }
                        else if (formInfo.length >= 3) {
                            return formInfo[2];
                        }

                        return headword + 'ed';
                    },
                    getPastP = function () {
                        if (formInfo[1] == 'd' || formInfo[1] == 'ed') {
                            return formInfo[0] + formInfo[1];
                        }
                        else if (formInfo[2] == 'd' || formInfo[2] == 'ed') {
                            return formInfo[0] + formInfo[1] + formInfo[2];
                        }
                        else if (formInfo[1] == 'es' || formInfo[2] == 'es') {
                            if (formInfo.length == 2) {
                                return formInfo[0] + 'ed';
                            }
                            return formInfo[0] + formInfo[1] + 'ed';
                        }
                        else if (formInfo[1] + formInfo[2] == 'ying') {
                            return headword + 'd';
                        }
                        else if (formInfo[1] == 'ing' || formInfo[2] == 'ing') {
                            if (formInfo.length == 2) {
                                return formInfo[0] + 'ed';
                            }
                            return formInfo[0] + formInfo[1] + 'ed';
                        }
                        else if (formInfo.length >= 3) {
                            return formInfo[formInfo.length-1];
                        }

                        return headword + 'ed';
                    },
                    postProcess = function (forms) {
                        var formName, val;
                        for(formName in forms) {
                            val = forms[formName];

                            // process the value (mainly, we want to clean it up and see
                            // if there are any alternatives)
                            val = WikiText.clean(val);
                            // some qualifier words
                            val = val.replace(/obsolete|dialect|archaic|poetic|rarely|US|UK|chiefly|North American|British/g, ' ');
                            // if there is no 'or' but there is a comma, then we convert the comma
                            // to an 'or'.
                            if (val.indexOf(' or ') == -1 && val.indexOf(',')) {
                                val = val.replace(',', ' or ');
                            }
                            // remove random symbols and punctuation
                            val = val.replace(/[\{\}(),]/g, ' ');
                            // split on 'or'
                            val = val.split(' or ');
                            // clean up the result
                            val = val.map(trim);
                            val = val.map(function (v) { return v == '-' ? '' : v; });

                            forms[formName] = val;
                        }

                        // sometimes when specifying non-standard infinitives, the editors forget to put the 'to' in
                        if (forms['infinitive'][0].length > 0 && forms['infinitive'][0].slice(0, 3) != 'to ') {
                            forms['infinitive'][0] = 'to ' + forms['infinitive'][0];
                        }

                        return forms;
                    },
                    match;

                if (match = /^inf=(.*)$/.exec(formInfo[0])) {
                    infinitive = match[1];
                    formInfo = formInfo.slice(1);
                }

                return postProcess({
                    'infinitive': infinitive,
                    '-s': getPres3rdSg(),
                    '-ing': getPresP(),
                    '2nd': getPast(),
                    '3rd': getPastP(),
                });
            },
        };

        function parseForms(entry, text) {
            // don't even mess with it, if we have no parser for it...
            if (typeof formParsers[entry.pos] === 'undefined') {
                return;
            }

            var formInfo = getFormsInfo(text), forms, formName, val, origLength;
            if (typeof formInfo === 'undefined') {
                print ('** '+entry.headword +' ** Has no forms data!  Needs to be checked by a human!');
                return;
            }

            print ('formInfo: '+formInfo);

            forms = formParsers[entry.pos](entry, formInfo);
            for (formName in forms) {
                val = forms[formName];

                // put the first value as the main form (we trust the Wiktionary's order)
                if (entry.getField(formName) != val[0]) {
                    print ('form: '+formName+' = '+val[0]);
                    entry.setField(formName, val[0]);
                }

                // put the rest as alternatives
                val = val.slice(1);
                val = val.filter(function (v) { return v != ''; });
                if (val.length > 0) {
                    print ('alternatives for '+formName+' = '+val);
                    entry.setFieldAlternatives(formName, val);
                }
            }
        }

        function parse(entry, text) {
            parseTranslations(entry, text);
            parseSenses(entry, text);
            parseForms(entry, text);
        }

        function getData(text, pos, type) {
            var data = text.getSection(pos, type == 1 ? 2 : 3), lines;
            // if this is buried in an "Etymology 1" style heading, we need to adjust the headings
            // such that the text appears like it isn't
            if (type == 2) {
                lines = [];
                data.split('\n').forEach(function (line) {
                    var match, i, sep = '';
                    if (match = /^(===+)([^=]+)===+/.exec(line)) {
                        for(i = 0; i < match[1].length - 1; i++) {
                            sep += '=';
                        }
                        line = sep + match[2] + sep;
                    }
                    lines.push(line);
                });
                data = lines.join('\n');
            }
            return data;
        }

        // takes funky templatized headings like "==={{initialism}}==" and converts
        // it into "===Initialism===" with WikiText.getSection() can work with.
        function _fixHeadings(text) {
            return text.replace(new RegExp('^(==+)\\{\\{(.+?)\\}\\}==+$', 'm'), function (s, p1, p2) {
                p2 = p2.substr(0, 1).toUpperCase() + p2.substr(1);
                return p1+p2+p1;
            });
        }

        return {
            name: 'en.wiktionary.org',

            Producer: declare({
                _constructor: function (args) {
                    var fn = args.source['en.wiktionary.org'] || args.source['default'];
                    this.producer = new MediawikiProducer(fn);
                    this.code = args.code;
                    this.lang_name = langNames[args.code];
                },

                run: function (args) {
                    var self = this, handler = args.handler;
                    args.handler = function (page) {
                        var text = new WikiText(page.revision.text),
                            entry, found, pos, type;

                        if (text.hasSection(self.lang_name)) {
                            text.text = text.getSection(self.lang_name);
                            // normalize some of the very UN-normal data
                            text.text = _fixHeadings(text.text);
                            found = false;

                            for(pos in posMap) {
                                type = text.hasSection(pos, 2) ? 1 : (text.hasSection(pos, 3) ? 2 : 0);
                                if (type) {
                                    entry = new Entry({
                                        headword: page.title.toString(),
                                        language: Language.languages[self.code],
                                        pos: posMap[pos],
                                    });
                                    entry.setSource('en.wiktionary.org', {
                                        raw: '=='+self.lang_name+'==\n\n'+getData(text, pos, type)+'\n\n'+text.getSection('Pronunciation', 2),
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
                parse(entry, raw);
            },

            _internal: {
                formParsers: formParsers
            }
        };
    }
);


