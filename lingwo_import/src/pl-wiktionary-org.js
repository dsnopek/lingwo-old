
load('src/importer.js');
load('src/json2.js');

(function () {
    var langNames = {
        'ab': 'abchaski',
        'af': 'afrykanerski',
        'en': 'angielski',
        'ar': 'arabski',
        'av': 'awarski',
        'bm': 'bambara',
        'be': 'białoruski',
        'bs': 'bośniacki',
        'bg': 'bułgarski',
        'hr': 'chorwacki',
        'zh': 'chiński',
        'cz': 'czeski',
        'dsb': 'dolnołużycki',
        'da': 'duński',
        'eo': 'esperanto',
        'et': 'estoński',
        'fi': 'fiński',
        'fr': 'francuski',
        'hsb': 'górnołużycki',
        'el': 'grecki',
        'kl': 'grenlandzki',
        'ka': 'gruziński',
        'he': 'hebrajski',
        'hi': 'hindi',
        'es': 'hiszpański',
        'nl': 'holenderski',
        'io': 'ido',
        'ia': 'interlingua',
        'is': 'islandzki',
        'ja': 'japoński',
        'yi': 'jidysz',
        'csb': 'kaszubski',
        'ko': 'koreański',
        'lt': 'litewski',
        'la': 'łaciński',
        'lv': 'łotewski',
        'mt': 'maltański',
        'de': 'niemiecki',
        'nb': 'norweski (bokmål)',
        'fa': 'perski',
        'pl': 'polski',
        'pt': 'portugalski',
        'ru': 'rosyjski',
        'ro': 'rumuński',
        'sc': 'sardyński',
        'sdc': 'sassarski',
        'hbs': 'serbsko-chorwacki',
        'sr': 'serbski',
        // this isn't a real code!
        //'art': 'slovio',
        'sk': 'słowacki',
        'slv': 'słoweński',
        'srn': 'sranan tongo',
        'ang': 'staroangielski',
        'cu': 'staro-cerkiewno-słowiański',
        'sw': 'suahili',
        'sco': 'szkocki',
        'gd': 'szkocki gaelicki',
        'sv': 'szwedzki',
        'szl': 'śląski',
        'enm': 'średnioangielski',
        'tg': 'tadżycki',
        'tl': 'tagalski',
        'th': 'tajski',
        'ta': 'tamilski',
        'tt': 'tatarski',
        'te': 'telugu',
        'tet': 'tetum',
        'tpi': 'tok pisin',
        'tvl': 'tuvalu',
        'bo': 'tybetański',
        'tr': 'turecki',
        'udm': 'udmurcki',
        'uk': 'ukraiński',
        'ug': 'ujgurski',
        'uz': 'uzbecki',
        'vo': 'volapük',
        // TODO: this one is also "fiu"!
        //'': 'võro',
        'cy': 'walijski',
        'war': 'warajski',
        // TODO: in iso-639-2 its "roa"
        'vec': 'wenecki',
        'fiu': 'wepski',
        'hu': 'węgierski',
        'vi': 'wietnamski',
        'wym': 'wilamowski',
        'it': 'włoski',
        'wo': 'wolof',
        // TODO: also falls under 'zh' (Chinese)
        //'': 'wu',
        // TODO: no code to be found!
        //'': 'wysokoislandzki',
        // TODO: no code to be found!
        //'': 'zachodnioflamandzki',
        'zza': 'zazaki',
        'zu': 'zuluski',
        // TODO: in iso-639-3 its "lit"
        'bat': 'żmudzki',
    };

    var langCodes = (function () {
        var res = {};
        for (var name in langNames) {
            res[langNames[name]] = name;
        }
        return res;
    })();

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
        'rzeczownik': 'noun',
        'czasownik przechodni': 'transitive verb',
        'czasownik nieprzechodni': 'intransitive verb',
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
            if (name && typeof v != 'undefined' && v !== null) {
                entry[name] = v;
            }
        });
    };

    var makeStructureExtractor = function (sourceName, structure) {
        return function (entry) {
            var sections = splitSections(entry.getSource(sourceName).raw);
            return extractStructure(entry, sections, structure);
        };
    };

    var extractRegex = function (text, regex, index, trans) {
        var match;
        if (match = regex.exec(text)) {
            var value = match[index || 0];
            if (value != '') {
                if (trans && (value in trans)) {
                    value = trans[value];
                }
                else if (trans) {
                    // DEBUGGING!
                    print ('No trans for: '+value);
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

    var removeWikiText = function (line) {
        // Remove indent
        line = line.replace(/^:/g, '');

        // remove wikipedia references
        line = line.replace(/\{\{wikipedia\}\}/g, '');

        // replace the the funky {{template}} things with paren phrases
        line = line.replace(/\{\{(\S+)\}\}/g, '($1)');

        // [[link|link text]] -> link text
        line = line.replace(/\[\[(?:[^|\]]+\|)?([^\]]+)\]\]/g, '$1');

        // [[link]] -> link
        //line = line.replace(/\[\[([^\]]+)\]\]/g, '$1');

        // Remove <ref></ref> tags
        line = line.replace(/<ref>.*?<\/ref>/g, '');

        // Remove various text emphasis markup
        line = line.replace(/'{2,3}/g, '');

        // clean up the whitespace
        line = line.replace(/^\s+/, '');
        line = line.replace(/\s+$/, '');
        line = line.replace(/\s\s+/g, ' ');

        // remove trailing semi-colons
        line = line.replace(/;+$/g, '');

        return line;
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
            // TODO: load up the forms!!

            return res;
        }],
        ['senses', function (entry, sections) {
            var map = {};
            var res = [];

            sections['meaning'].slice(1).forEach(function (line) {
                var name = extractRegex(line, /\((\d\.\d)\)/, 1);

                // Remove the sense numbers
                line = line.replace(/\(\d\.\d\)/g, '');
                line = removeWikiText(line);

                // stash the difference
                var sense = {
                    difference: line,
                    trans: {}
                };
                res.push(sense);
                map[name] = sense;
            });

            if (sections['examples']) {
                sections['examples'].forEach(function (line) {
                    var name = extractRegex(line, /\((\d\.\d)\)/, 1);

                    // Remove the sense numbers
                    line = line.replace(/\(\d\.\d\)/g, '');
                    line = removeWikiText(line);

                    map[name].example = line;
                });
            }

            if (sections['translations']) {
                sections['translations'].forEach(function (line) {
                    var lang = extractRegex(line, /^\* ([^:]+):/, 1, langCodes);

                    // Remove the language name
                    line = line.replace(/^\* [^:]+:/, '');

                    // TODO: This only reads a single sense translation, make this read all of them!!
                    //       Shouldn't be too hard..

                    var name = extractRegex(line, /\((\d\.\d)(?:-[^\)]+)?\)/, 1);

                    // Remove the sense numbers
                    line = line.replace(/\((\d\.\d)(?:-[^\)]+)?\)/g, '');
                    line = removeWikiText(line);

                    map[name].trans[lang] = line.split(/,\s*/);
                });
            }

            return res;
        }],
    ];

    var parsers = {
        pl: makeStructureExtractor('pl.wiktionary.org', polishStructure)
    };

    var makeHandlerFunc = function(handler, code) {
        return function(page) {
            var text = new Lingwo.importer.mediawiki.WikiText(page.revision.text);
            
            var sec = page.title + ' ({{język '+langNames[code]+'}})';
            if (text.hasSection(sec)) {
                var entry = new Lingwo.importer.Entry();
                entry.headword = page.title;
                entry.language = code;
                entry.setSource('pl.wiktionary.org', {raw: text.getSection(sec)});

                // Run a language specific parser on the wikitext
                var parser = parsers[code];
                if (parser) {
                    parser(entry);
                }

                handler(entry);
            }
        };
    };

    Lingwo.importer.sources['pl.wiktionary.org'] = {
        process: function (args) {
            var producer = new Lingwo.importer.mediawiki.Producer(args.filename);
            args.handler = makeHandlerFunc(args.handler, 'pl');
            producer.run(args);
        },
        parsers: parsers,
    };

})();

