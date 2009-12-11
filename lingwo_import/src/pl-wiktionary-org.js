
load('src/importer.js');
load('src/json2.js');

(function () {
    var LangNames = {
        'pl': 'polski',
        'en': 'angielski'
    };

    var Handler = declare({
        _constructor: function (handler, code) {
            this.handler = handler;
            this.code = code;
        },

        process: function (page) {
            var text = new Lingwo.importer.WikiText(page.revision.text);
            
            var sec = page.title + ' ({{język '+LangNames[this.code]+'}})';
            if (text.hasSection(sec)) {
                var entry = new Lingwo.importer.Entry();
                entry.headword = page.title;
                entry.language = this.code;
                entry.setSource('pl.wiktionary.org', {raw: text.getSection(sec)});
                // TODO: run the this.code parser on the entry before passing it to the handler
                this.handler.process(entry);
            }
        }
    });

    var sectionTrans = {
        'wymowa': 'pron',
        'znaczenia': 'meaning',
        'przykłady': 'examples',
        'składnia': 'syntax',
        'kolokacje': 'collocations',
        'synonimy': 'synonyms',
        'antonimy': 'antonyms',
        'pokrewne': 'related',
        'frazeologia': 'phraseology',
        'etymologia': 'etymology',
        'uwagi': 'notes',
        'tłumaczenia': 'translations',
    };

    posTrans = {
        'rzeczownik': 'noun'
    };

    genderTrans = {
        'rodzaj męski': 'masculine',
        'rodzaj żenski': 'feminine',
        'rodzaj nijaki': 'neuter'
    };

    var sectionRegex = new RegExp('^\\{\\{(\\S+)\\}\\}(.*)$');
    var splitSections = function (text) {
        var lines = text.split('\n');
        var header = null, res = {};

        lines.forEach(function (line) {
            var match;
            if (match = sectionRegex.exec(line)) {
                header = match[1];
                line = match[2];

                if (header in sectionTrans) {
                    header = sectionTrans[header];
                }

                res[header] = [];
            }
            if (header !== null && line) {
                res[header].push(line);
            }
        });

        return res;
    };

    var extractStructure = function (entry, sections, structure) {
        structure.forEach(function (x) {
            var name = x[0];
            var f = x[1];
            var v = f(entry, sections);
            if (typeof v != 'undefined' && v !== null) {
                entry[name] = v;
            }
        });
    };

    var extractRegex = function (text, regex, index, trans) {
        var match;
        if (match = regex.exec(text)) {
            var value = match[index || 0];
            if (value != '') {
                if (trans && (value in trans)) {
                    value = trans[value];
                }
                return value;
            }
        }
    };

    var makeRegexExtractor = function (name, regex, index, trans) {
        return function (entry, sections) {
            return extractRegex(sections[name], regex, index, trans);
        };
    };

    var polishStructure = [
        ['pron', makeRegexExtractor('pron', /\{\{IPA3\|([^\}]+)\}\}/, 1)],
        ['pos', function (entry, sections) {
            return extractRegex(sections['meaning'][0], /^''([^,'$]+)/, 1, posTrans);
        }],
        ['fields', function (entry, sections) {
            var pos = entry.pos;
            var res = {};

            if (pos == 'noun') {
                res.gender = extractRegex(sections['meaning'][0], /^''(?:[^,]+),\s*([^']+)''$/, 1, genderTrans);
            }

            return res;
        }],
        ['senses', function (entry, sections) {
            var raw = sections['senses'];
            //print (raw);
        }],
    ];

    var PolishParser = function (entry) {      
        var sections = splitSections(entry.getSource('pl.wiktionary.org'));

        extractStructure(entry, sections, polishStructure);
        
        delete entry.sources;
        print (JSON.stringify(entry));
    };

    Lingwo.importer.sources['pl.wiktionary.org'] = {
        process: function (args) {
            var producer = new Lingwo.importer.mediawiki.Producer({ filename: args.filename });
            producer.run(new Handler(args.handler, 'pl'));
        },
        parsers: {
            'pl': PolishParser
        },
    };

})();

