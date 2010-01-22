
load('src/importer.js');
load('src/json2.js');

module('Lingwo.importer.sources.pl-wiktionary-org', function () {
    var langNames = {
        'ab': 'abchaski',
        'af': 'afrykanerski',
        'aym': 'ajmara',
        'sq': 'albański',
        'gsw': 'alemański',
        'am': 'amharski',
        'en': 'angielski',
        'ar': 'arabski',
        'arz': 'arabski egipski',
        'an': 'aragoński',
        'arc': 'aramejski',
        'rup': 'arumuński',
        'as': 'asturyjski',
        'av': 'awarski',
        'az': 'azerski',
        'bm': 'bambara',
        // TODO: this shares the code 'jv' with java!
        'Banyumasan': 'banjumasański',
        'eu': 'baskijski',
        // TODO: the iso-639-2 code is "gem"
        'bar': 'bawarski',
        'bn': 'bengalski',
        'be': 'białoruski',
        'bik': 'bikolski',
        // TODO: the iso-639-2 code is "inc"
        'bpy': 'bisznuprija-manipuri',
        // TODO: probably should be 'egl' or 'rgn' (Emilian/Romagnol)
        'Bolognese': 'boloński',
        'bs': 'bośniacki',
        'br': 'bretoński',
        'bg': 'bułgarski',
        'ceb': 'cebuański',
        'hr': 'chorwacki',
        'zh': 'chiński',
        // TODO: This should also be 'zh'!
        'Standard Mandarin': 'chiński standardowy',
        'Cockney': 'cockney',
        'ce': 'czeczeński',
        'cz': 'czeski',
        'cv': 'czuwaski',
        'dsb': 'dolnołużycki',
        'nds': 'dolnosaksoński',
        // TODO: This should also be 'nds'
        'Low Saxon Holland Dialect': 'dolnosaksoński holenderski',
        'da': 'duński',
        // TODO: No ISO code to be found!
        'ekspreso': 'ekspreso',
        'eo': 'esperanto',
        'et': 'estoński',
        // TODO: This isn't an iso-639 code!!  Its from SIL.
        'ext': 'estremadurski',
        'ee': 'ewe',
        'fo': 'farerski',
        'fi': 'fiński',
        'fr': 'francuski',
        // TODO: the iso-639-2 code is "roa"
        'frp': 'franko-prowansalski',
        'fur': 'friulski',
        'fy': 'fryzyjski',
        // TODO: the iso-639-2 code is "frs"
        'stq': 'fryzyjski saterlandzki',
        'gl': 'galicyjski',
        // TODO: this is also 'zh'!
        'gan': 'gan',
        'got': 'gocki',
        'hsb': 'górnołużycki',
        'el': 'grecki',
        'kl': 'grenlandzki',
        'ka': 'gruziński',
        'gn': 'guarani',
        'ht': 'haitański',
        // TODO: this is also 'zh'!
        'Hakka': 'hakka',
        'ks': 'kaszmirski',
        'haw': 'hawajski',
        'he': 'hebrajski',
        'hi': 'hindi',
        'hif': 'hindi fidżyjskie',
        'es': 'hiszpański',
        'nl': 'holenderski',
        'ig': 'ibo',
        'io': 'ido',
        'ilo': 'ilokano',
        'id': 'indonezyjski',
        'ia': 'interlingua',
        'iu': 'inuktitut',
        'ga': 'irlandzki',
        'is': 'islandzki',
        'sah': 'jakucki',
        'ja': 'japoński',
        'jv': 'jawajski',
        'yi': 'jidysz',
        // TODO: this is not an ISO-639 code!  Its SIL.
        'yor': 'joruba',
        'kab': 'kabylski',
        'xal': 'kałmucki',
        'kn': 'kannada',
        // TODO: this is also 'zh'!
        'yue': 'kantoński',
        'myn': 'kakczikel',
        'csb': 'kaszubski',
        'ca': 'kataloński',
        'kk': 'kazachski',
        'qu': 'keczua',
        'km': 'khmerski',
        'ky': 'kirgiski',
        'tlh': 'klingoński',
        'kv': 'komi',
        'kg': 'kongo',
        'ko': 'koreański',
        'kw': 'kornwalijski',
        'co': 'korsykański',
        'crn': 'krymskotatarski',
        'ku': 'kurdyjski',
        'kj': 'kwanyama',
        // TODO: the iso-639-2 code is "roa"
        'lld': 'ladyński',
        'lez': 'lezgiński',
        'lij': 'liguryjski',
        'li': 'limburgijski',
        'ln': 'lingala',
        'lt': 'litewski',
        'jbo': 'lojban',
        'lmo': 'lombardzki',
        'lg': 'luganda',
        'lb': 'luksemburski',
        'la': 'łaciński',
        'lv': 'łotewski',
        'mk': 'macedoński',
        'ml': 'malajalam',
        'ms': 'malajski',
        'dv': 'malediwski',
        'mg': 'malgaski',
        'mt': 'maltański',
        'gv': 'manx',
        'mi': 'maoryski',
        'mnc': 'mandżurski',
        'mi': 'maoryski',
        'mr': 'marathi',
        'chm': 'maryjski',
        // TODO: the iso-639-2 code is 'roa'
        'ruq': 'meglenorumuński',
        // TODO: the iso-639-2 code is 'zh'
        'nan': 'minnański',
        'mwl': 'mirandyjski',
        'mdf': 'moksza',
        // TODO: this shares the code 'ro' with Romanian!  Originally had the code 'mol'
        //       but it was deprecatedin November 2008:
        //
        //       http://www.alvestrand.no/pipermail/ietf-languages/2008-November/008635.html
        //
        'moldovan': 'mołdawski',
        'mn': 'mongolski',
        'nah': 'nahuatl',
        'na': 'nauruański',
        'nap': 'neapolitański',
        'ne': 'nepalski',
        'de': 'niemiecki',
        'pfl': 'niemiecki palatynacki',
        'sli': 'niemiecki śląski',
        // TODO: The iso-639-2 code is 'roa'!
        'Norman': 'normandzki',
        'no': 'norweski',
        'nb': 'norweski (bokmål)',
        'nn': 'norweski (nynorsk)',
        'nov': 'novial',
        'oc': 'oksytański',
        'hy': 'ormiański',
        'os': 'osetyjski',
        'Owambo': 'owambo',
        'pam': 'pampango',
        'pdc': 'pensylwański',
        'fa': 'perski',
        // TODO: The iso-639-2 code is 'roa'
        'pms': 'piemoncki',
        'pcd': 'pikardyjski',
        'pih': 'pitkern',
        'pdt': 'plautdietsch',
        'pl': 'polski',
        // TODO: The iso-639-2 code is 'sla'
        'pox': 'połabski',
        'pnt': 'pontyjski',
        'pt': 'portugalski',
        'oci': 'prowansalski',
        'prg': 'pruski',
        // TODO: This should also include the language 'sami'
        'se': 'północnolapoński',
        // TODO: No code to be found!  (would probably be 'roa')
        'Rhaetian': 'retoromański',
        'roh': 'romansz',
        'rom': 'romski',
        'ru': 'rosyjski',
        'ro': 'rumuński',
        'ry': 'rusiński',
        // TODO: The iso-639-2 code is 'gem'
        'ripuarian': 'rypuaryjski',
        'sm': 'samoański',
        'sa': 'sanskryt',
        'sc': 'sardyński',
        'sdc': 'sassarski',
        'hbs': 'serbsko-chorwacki',
        'sr': 'serbski',
        // TODO: 'art' isn't a real code!
        'Slovio': 'slovio',
        'sk': 'słowacki',
        'slv': 'słoweński',
        'srn': 'sranan tongo',
        'ang': 'staroangielski',
        'egy': 'staroegipski',
        'non': 'staronordyjski',
        'cu': 'staro-cerkiewno-słowiański',
        'goh': 'staro-wysoko-niemiecki',
        'sw': 'suahili',
        'scn': 'sycylijski',
        'sin': 'syngaleski',
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
        'Tupinambá': 'tupinambá',
        'tr': 'turecki',
        'tk': 'turkmeński',
        'udm': 'udmurcki',
        'uk': 'ukraiński',
        'ug': 'ujgurski',
        'ur': 'urdu',
        'uz': 'uzbecki',
        'vo': 'volapük',
        // TODO: this one is also "fiu"!
        'Võro': 'võro',
        'cy': 'walijski',
        'war': 'warajski',
        // TODO: No ISO code to be found!
        'Early Modern English': 'wczesny nowoangielski',
        // TODO: in iso-639-2 its "roa"
        'vec': 'wenecki',
        'fiu': 'wepski',
        'hu': 'węgierski',
        'vi': 'wietnamski',
        'wym': 'wilamowski',
        'it': 'włoski',
        'wo': 'wolof',
        // TODO: also falls under 'zh' (Chinese)
        'wu': 'wu',
        // TODO: no code to be found!
        'High Icelandic': 'wysokoislandzki',
        // TODO: no code to be found!
        'West Flemish': 'zachodnioflamandzki',
        'zza': 'zazaki',
        'zea': 'zelandzki',
        'zu': 'zuluski',
        // TODO: It shares the code 'lit' with 'Lithuanian'
        'Samogitian': 'żmudzki',
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
        'rzeczownik męski': 'noun',
        'rzeczownik rodzaj żeński': 'noun',
        'rzeczownik własny': 'proper noun',
        'czasownik przechodni': 'transitive verb',
        'czasownik przechodni (modalny)': 'modal verb',
        'czasownik nieprzechodni': 'intransitive verb',
        'czasownik nieprzechodni lub zwrotny': 'intransitive or reflexive verb',
        'czasownik modalny': 'modal verb',
        'czasownik zwrotny': 'reflexive verb',
        'czasownik zwrotni': 'reflexive verb',
        'czasownik': 'verb',
        'zaimek wskazujący': 'demonstrative pronoun',
        'zaimek osobowy': 'personal pronoun',
        'zaimek zwrotny': 'reflexive pronoun',
        'zaimek dzierżawczy': 'possesive pronoun',
        'zaimek przysłowny upowszechniający': 'indefinite pronoun',
        'zaimek przysłowny przeczący': 'negative indefinite pronoun',
        'zaimek nieokreślony': 'indefinite pronoun',
        'zaimek określony': 'definite pronoun',
        'zaimek pytający': 'interrogative pronoun',
        'zaimek': 'pronoun',
        'imiesłów czynny': 'active participle',
        'imiesłów przymiotnikowy bierny': 'past participle',
        // TODO: should this be a noun?
        'liczebnik ułamkowy': 'fraction',
        'liczebnik główny': 'cardinal number',
        'liczebnik nieokreślony': 'indefinite number',
        'liczebnik porządkowy': 'ordinal number',
        'przedrostek': 'prefix',
        // TODO: what kind of prepositions are these?
        'przyimek określający': 'proposition',
        'przyimek opisujący': 'proposition',
        'przyimek tworzący konstrukcję opisującą': 'proposition',
        'przyimek tworzący zwroty wyrażające': 'proposition',
        'przyimek': 'proposition',
        'przymiotnik': 'adjective',
        'przyrostek': 'suffix',
        'przysłówek': 'adverb',
        'partykuła': 'particle',
        'skrót': 'abbreviation',
        'skrótowiec': 'abbreviation',
        // TODO: This is an important point..  Something can be an abbreviation, but it still
        // has a base part of speech, ie: noun, adj, verb, etc...
        'skrót/rzeczownik': 'abbreviation',
        'spójnik': 'conjunction',
        'symbol': 'symbol',
        'tytuł': 'title',
        'wyraz dźwiękonaśladowczy': 'onomatopoeia',
        'wyrażenie idiomatyczne': 'idiom',
        'wykrzyknik': 'exclamation',
        'związek': 'phrase',
        'związek wyrazowy': 'phrase',
        // TODO: This is a phrase, but it represents a noun which is masculine.  How do 
        // we represent that and similar cases?
        'związek wyrazowy w funkcji rzeczownika rodzaju męskiego': 'noun phrase',
        'związek wyrazów w funkcji rzeczownika rodzaju męskoosobowego': 'noun phrase',
        'związek wyrazów w funkcji rzeczownika rodzaju żeńskiego': 'noun phrase',
        'związek wyrazów w funkcji rzeczownika własnego rodzaju żeńskiego': 'noun phrase',
        'związek wyrazowy w funkcji rzeczownika': 'noun phrase',
    };

    // TODO: we have dropped this for a straight regex
    /*
    genderTrans = {
        'rodzaj męski': 'masculine',
        'męski': 'masculine',
        'rodzaj żeński': 'feminine',
        'rodzaj nijaki': 'neuter'
    };
    */

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
        print ('++ '+entry.headword);
        structure.forEach(function (x) {
            var name = x[0];
            var f = x[1], v;
            
            //print (' |--> '+name);

            v = f(entry, sections);
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

    var transValue = function (value, trans, dbg) {
        if (trans && (value in trans)) {
            return trans[value];
        }
        else if (trans) {
            // DEBUGGING!
            var s = 'No trans for: '+value;
            if (dbg) {
                s = dbg+': '+s;
            }
            print (s);
            //throw (s);
        }

        return value;
    };

    var extractRegex = function (text, regex, index, trans, dbg) {
        var match;
        if (match = regex.exec(text)) {
            var value = match[index || 0];
            if (value != '') {
                return transValue(value, trans, dbg);
            }
        }
    };

    var makeRegexExtractor = function (name, regex, index, trans, dbg) {
        return function (entry, sections) {
            return extractRegex(sections[name], regex, index, trans, dbg);
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
            if (!sections['meaning']) {
                return;
            }

            var s = sections['meaning'][0];
            // remove periods from pos (strange data inconsistency)
            s = s.replace(/\./g, '');
            var pos = extractRegex(s, /^''([^\<,'$]+)/, 1, posTrans, 'posTrans');
            // We want to break these down to the most basic types (basically, we want these to be
            // broad categories, to seperate it from other words.  Read as a transitive verb would
            // not have another entry that is an intransitive verb. -- actually we might!)
            // TODO: I'm not sure this is the correct thing to do..
            if (/phrase/.exec(pos)) {
                pos = 'phrase';
            }
            else if (/noun/.exec(pos)) {
                pos = 'noun';
            }
            else if (/adjective/.exec(pos)) {
                pos = 'adjective';
            }
            else if (/verb/.exec(pos)) {
                pos = 'verb';
            }
            else if (/pronoun/.exec(pos)) {
                pos = 'pronoun';
            }
            else if (/participle/.exec(pos)) {
                pos = 'participle';
            }
            else if (pos == 'ordinal number') {
                pos = 'adjective';
            }
            else if (/number/.exec(pos) || pos == 'fraction') {
                pos = 'noun';
            }

            return pos;
        }],
        ['fields', function (entry, sections) {
            if (!sections['meaning']) {
                return;
            }

            var pos = entry.pos;
            var res = {};
            var types = sections['meaning'][0].replace(/''/g, '').split(/,\s*/);

            if (pos == 'noun') {
                var type = sections['meaning'][0];
                // TODO: make into a library function
                if (/męski/.exec(type)) {
                    res.gender = 'masculine';
                }
                else if (/żeński/.exec(type)) {
                    res.gender = 'feminine';
                }
                else if (/nijaki/.exec(type)) {
                    res.gender = 'neuter';
                }

                if (!res.gender) {
                    // TODO: should this be done with the morphology engine instead??
                    // we attempt to guess!
                    if (/a|i$/.exec(entry.headword)) {
                        res.gender = 'feminine';
                    }
                    else if (/e|o$/.exec(entry.headword)) {
                        res.gender = 'neuter';
                    }
                    else {
                        res.gender = 'masculine';
                    }
                }
            }
            // TODO: load up the forms!!

            // re-layout into the format that the service wants
            for(var name in res) {
                 res[name] = {
                     'value': res[name],
                     'automatic': false,
                 };
            }

            return res;
        }],
        ['senses', function (entry, sections) {
            if (!sections['meaning']) {
                return;
            }

            var map = {};
            var idx = {};
            var res = [];

            sections['meaning'].slice(1).forEach(function (line, i) {
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
                idx[name] = i;
            });

            var getName = function (line) {
                var name = extractRegex(line, /\((\d\.\d?)(?:[^\)]+)?\)/, 1);
                // For partial sense numbers like "1." we make them into "1.1"
                if (name && name.length == 2) {
                    name += '1';
                }
                if (!name) {
                    name = '1.1';
                }
                if (!(name in map)) {
                    print ('Found item for non-existant sense "'+name+'" in: '+line);
                    name = null;
                }
                return name;
            };

            if (sections['examples']) {
                sections['examples'].forEach(function (line) {
                    //var name = extractRegex(line, /\((\d\.\d)\)/, 1);
                    var name = getName(line);
                    if (name === null) {
                        return;
                    }


                    // Remove the sense numbers
                    line = line.replace(/\(\d\.\d\)/g, '');
                    line = removeWikiText(line);

                    map[name].example = line;
                });
            }

            if (sections['translations']) {
                entry.translations = {};
                sections['translations'].forEach(function (line) {
                    var lang = extractRegex(line, /^\* ([^:]+):/, 1, langCodes, 'langCodes');

                    // Remove the language name
                    line = line.replace(/^\* [^:]+:/, '');

                    // TODO: This only reads a single sense translation, make this read all of them!!
                    //       Shouldn't be too hard..

                    var name = getName(line);
                    if (name === null) {
                        return;
                    }

                    line = line.replace(/\((\d\.\d)(?:-[^\)]+)?\)/g, '');
                    line = removeWikiText(line);

                    // TODO: only on one sense!  Do more!
                    entry.translations[lang] = [];
                    entry.translations[lang][idx[name]] = {'trans': line.split(/,\s*/)};
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
                entry.headword = page.title.toString();
                entry.language = code;
                entry.setSource('pl.wiktionary.org', {
                    raw: text.getSection(sec),
                    url: 'http://pl.wiktionay.org/wiki/'+entry.headword,
                    license: 'CC-BY-SA',
                    // what is the copyright for this?
                    //copyright: '',
                    timestamp: page.revision.timestamp.toString(),
                });

                // Run a language specific parser on the wikitext
                var parser = parsers[code];
                if (parser) {
                    parser(entry);
                }

                handler(entry);
            }
        };
    };

    return {
        process: function (args) {
            var producer = new Lingwo.importer.mediawiki.Producer(args.filename);
            args.handler = makeHandlerFunc(args.handler, 'pl');
            producer.run(args);
        },
        parsers: parsers,
    };
});

