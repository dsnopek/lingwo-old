
/*
 * For parsing data from en.wikitionary.org.
 */

define(
    ['lingwo/util/declare',
     'lingwo/Entry',
     'lingwo/Language',
     'lingwo_old/importer/mediawiki/WikiText',
     'lingwo_old/importer/mediawiki/Producer',
     'lingwo_old/util/text',
     'lingwo_old/util/json2',
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
            'sv': 'Swedish',
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
                sense = null, sensesMap = {};

            // normalize to just the bare text bits
            function normalize(s) {
                s = WikiText.clean(s);
                s = s.replace(/[.,;:()"]/g, '');
                s = s.toLowerCase();
                return s;
            };

            // if we are importing a non-English word, make sure we are ready
            // to create some English translations.
            if (entry.language.name != 'en') {
                entry.translations.en = {'senses':[]};
            }

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
                    // if we are parsing an English word, that means what we are meeting here are senses.
                    if (entry.language.name == 'en') {
                        sense = {
                            difference: clean(line, 255),
                        };
                        
                        sensesMap[normalize(sense.difference)] = sense;
                    }
                    // if not, these are translations!
                    else {
                        // put a an empty sense
                        entry.senses.push({});
                        // put a new translation
                        entry.translations.en.senses.push({'trans': clean(line).split(/,\s*/)});
                    }
                }
                else if (sense !== null && /^#:/.exec(line)) {
                    if (typeof sense.example == 'undefined') {
                        sense.example = [];
                    }
                    sense.example.push(clean(line, 255));
                }
                else {
                    sense = null;
                }
            }

            if (entry.language.name == 'en') {
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
        }

        function getFormsInfo(text) {
            var input = new LineReader(text), line, match;

            // attempt to find the line defining the forms
            while (!input.eof()) {
                line = input.readline();
                if (match = /^\{\{(en-[^|}]+)(.*)\}\}$/.exec(line)) {
                    // there are some errors where someone wrote {{en-verb}} or {{en-verb|...}}.  Since
                    // we can't correctly process this, we should just return the no arguments version.
                    if (/\{\{en-verb\}\}/.test(line)) {
                        return ['en-verb', []];
                    }
                    // to correct for a very specific data irregularity, where a {{i|...}} template
                    // is put on the same line as the form information.
                    match[2] = match[2].replace(/\}\}\s*\{\{i\|.*$/, '');
                    // also, happens with {{US}}, {{idiom}}, {{transitive}} and {{intransitive}}
                    match[2] = match[2].replace(/\}\}\s*\{\{(?:US|idiom|transitive|intransitive).*$/, '');

                    return [match[1], match[2].substr(1).split('|')];
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

        // basically takes care of splitting forms into multiples when they are specified
        function postProcessForms(forms, headword) {
            var formName, val;
            for(formName in forms) {
                val = forms[formName];

                // process the value (mainly, we want to clean it up and see
                // if there are any alternatives)
                val = WikiText.clean(val);
                // some qualifier words (unless they *are* the headword!)
                val = val.replace(/obsolete|collectively|dialect|in (\S+) sense only|archaic|less commonly|dated|poetic|rarely|transitive|intransitive|US|mostly UK|UK|chiefly|North American|British|Commonwealth|plural|common noun|collective noun|and|Depending on meaning, either|when used attributively|otherwise/g, function ($0) {
                    return headword.indexOf($0) != -1 ? $0 : ' ';
                });
                // remove comments
                val = val.replace(/<!--.*?-->/g, ' ');
                // sometimes people write "or," which needs to become a normal " or "
                val = val.replace(/or,/g, ' or ');
                // if there is no 'or' but there is a comma, slash or semi-colon, then we
                // convert those to an 'or'.
                /*
                ',/;'.split('').forEach(function (c) {
                    if (val.indexOf(' or ') == -1 && val.indexOf(c)) {
                        val = val.replace(c, ' or ');
                    }
                });
                */
                // TODO: I don't know if this is safe to do if there is already a 'or' in it!
                val = val.replace(/[,\/;]/g, ' or ');
                // remove random symbols and punctuation
                val = val.replace(/[\{\}(),]/g, ' ');
                // split on 'or'
                val = val.split(' or ');
                // clean up the result
                val = val.map(trim);
                val = val.map(function (v) { return v == '-' ? '' : v; });

                forms[formName] = val;
            }


            return forms;
         }

        var formParsers = {
            // this is basically a literal port of the code in the Wiktionary's template:en-verb
            'verb': function (formInfoName, entry, formInfo) {
                if (formInfoName != 'en-verb') return;

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
                        else if (formInfo.length == 3) {
                            return formInfo[2];
                        }
                        else if (formInfo.length > 3) {
                            return formInfo[3];
                        }

                        return headword + 'ed';
                    },
                    match, forms;

                if (match = /^inf=(.*)$/.exec(formInfo[0])) {
                    infinitive = match[1];
                    formInfo = formInfo.slice(1);
                }

                forms = postProcessForms({
                    'infinitive': infinitive,
                    '-s': getPres3rdSg(),
                    '-ing': getPresP(),
                    '2nd': getPast(),
                    '3rd': getPastP(),
                }, headword);

                // sometimes when specifying non-standard infinitives, the editors forget to put the 'to' in
                if (forms['infinitive'][0].length > 0 && forms['infinitive'][0].slice(0, 3) != 'to ') {
                    forms['infinitive'][0] = 'to ' + forms['infinitive'][0];
                }

                return forms
            },

            'adjective': function (formInfoName, entry, formInfo) {
                if (formInfoName != 'en-adj') return;

                var headword = entry.headword, most = '', more = '', forms;

                if (/^pos=/.test(formInfo[0])) {
                    formInfo.shift();
                }
                if (formInfo.length == 1 && formInfo[0] == 'more') {
                    formInfo = [];
                }

                if (formInfo[0] == '-' || formInfo[0] == '?') {
                    // simple!
                    return {'not_comparable': [true]};
                }
                else if (formInfo[1] == 'er') {
                    more = formInfo[0]+'er';
                    most = formInfo[0]+'est';
                }
                else if (formInfo[1] == 'r') {
                    more = formInfo[0]+'r';
                    most = formInfo[0]+'st';
                }
                else if (formInfo[1] == 'ier') {
                    more = formInfo[0]+'ier';
                    most = formInfo[0]+'iest';
                }
                else if (formInfo[0] == 'er') {
                    more = headword+'er';
                    most = headword+'est';
                }
                else if (formInfo.length == 2 && formInfo[1] != 'more') {
                    more = formInfo[0];
                    most = formInfo[1];
                }
                else if (formInfo.length == 1 && formInfo[0] != '') {
                    more = formInfo[0];
                    most = 'most '+headword;
                }
                else {
                    more = 'more '+headword;
                    most = 'most '+headword;
                }

                forms = postProcessForms({ more: more, most: most }, headword);

                if (formInfo[1] == 'more' || formInfo[2] == 'more') {
                    forms['more'].push('more '+headword);
                    forms['most'].push('most '+headword);
                }

                return forms;
            },

            'adverb': function (formInfoName, entry, formInfo) {
                if (formInfoName != 'en-adv') return;

                // re-use the adjective parser
                return formParsers['adjective']('en-adj', entry, formInfo);
            },

            'noun': function (formInfoName, entry, formInfo) {
                if (formInfoName == 'en-plural-noun' || formInfoName == 'en-plural noun') return {plural_type: ['plural']};
                else if (formInfoName != 'en-noun') return;

                var headword = entry.headword, plural = '', forms, extras;

                if (/^sg=|head=/.test(formInfo[0])) {
                    formInfo.shift();
                }
                extras   = formInfo.filter(function (v) { return  /^pl[23]=/.test(v); });
                formInfo = formInfo.filter(function (v) { return !/^pl[23]=/.test(v); });
                if (/^pl=/.test(formInfo[0])) {
                    formInfo[0] = formInfo[0].replace(/^pl=/, '');
                }

                if (formInfo[0] == '!' || formInfo[0] == '?' || (formInfo.length == 1 && formInfo[0] == '-')) {
                    return {plural_type: ['singular']};
                }
                else if (formInfo[0] == 's' || formInfo[0] == 'es') {
                    plural = headword + formInfo[0];
                }
                else if (formInfo[1] == 's' || formInfo[1] == 'es' || formInfo[1] == 'ies') {
                    if (!/^[-!?]$/.test(formInfo[0])) {
                        plural = formInfo[0] + formInfo[1];
                    }
                    else {
                        plural = headword + formInfo[1];
                    }
                }
                else if (formInfo.length >= 2 && formInfo[1] && formInfo[1] != '-') {
                    if (formInfo[0] != '-') {
                        plural = formInfo[0] + formInfo[1];
                    }
                    else {
                        plural = formInfo[1];
                    }
                }
                else if (formInfo.length >= 1 && formInfo[0]) {
                    plural = formInfo[0];
                }
                else {
                    plural = headword + 's';
                }

                forms = postProcessForms({ plural: plural }, headword);

                // assign the multiples
                extras.forEach(function (v) {
                    var match;
                    if (match = /^pl([23])=(.*)$/.exec(v)) {
                        forms['plural'][parseInt(match[1])-1] = match[2];
                    }
                });

                return forms;
            },
        };

        function parseForms(entry, text) {
            // don't even mess with it, if we have no parser for it...
            if (typeof formParsers[entry.pos] === 'undefined') {
                return;
            }

            var formInfo = getFormsInfo(text), formInfoName, forms, formName, val, origLength;
            if (typeof formInfo === 'undefined') {
                print ('** '+entry.headword +' ** Has no forms data!  Needs to be checked by a human!');
                return;
            }
            formInfoName = formInfo[0];
            formInfo     = formInfo[1];

            print ('formInfo: '+formInfo);

            forms = formParsers[entry.pos](formInfoName, entry, formInfo);
            if (typeof forms != 'object') return;

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

        function parsePronunciation(entry, text) {
            var input = new LineReader((new WikiText(text)).getSection('Pronunciation', 2)),
                line, matches, accent, value, pronList = [], pronTagged = {};

            function addPron(accent, type, value) {
                var pron;
                //print (accent + ' ' + type + ' ' + value);
                if (accent !== null && typeof pronTagged[accent] != 'undefined') {
                    pron = pronTagged[accent];
                }
                else {
                    if (accent !== null) {
                        pronTagged[accent] = pron = {tag: accent};
                    }
                    else {
                        pron = {};
                    }
                    pronList.push(pron);
                }

                pron[type] = value;
            }

            function cleanAccent(accent) {
                if (/[Dd]ialect/.exec(accent)) {
                    // snag our special dialectual tag
                    accent = 'dialectual';
                }
                else if (/GA|GenAm|US|Standard|America/i.exec(accent)) {
                    // if US or Standard are mentioned at all, then it is our default (US)!
                    accent = 'US';
                }
                else if (/noun/i.exec(accent)) {
                    // TODO: we really should do something smarter!  Like put one on the verb and the
                    // other on the noun, etc..  But for now, we just make the noun version standard
                    // and discard the verb version.
                    accent = 'US';
                }
                else if (/verb/i.exec(accent)) {
                    accent = null;
                }
                else if (/UK|British/i.exec(accent)) {
                    accent = 'UK';
                }
                else if (/Scot/i.exec(accent)) {
                    accent = 'Scotland';
                }
                else if (/Canada|CAN/i.exec(accent)) {
                    accent = 'CA';
                }
                else if (accent == 'AusE') {
                    accent = 'AU';
                }
                else if (accent == 'Tasmanian') {
                    accent = 'TAS';
                }
                // TODO: we should be doing this in reverse, where we remove all not-valid options, but while I'm
                // working on the importer this is helpful in finding the list of valid ones
                else if (['WEAE','?'].indexOf(accent) != -1) {
                    accent = null;
                }
                
                return accent;
            }

            function getFullFilename(fn) {
                var md = java.security.MessageDigest.getInstance('md5'),
                    fn = fn.substr(0, 1).toUpperCase() + fn.substr(1),
                     d = md.digest((new java.lang.String(fn)).getBytes()),
                     h = ""+(new java.math.BigInteger(1, d)).toString(16);
                while (h.length < 32) {
                    h = "0" + h
                }
                return 'http://upload.wikimedia.org/wikipedia/commons/'+h.substr(0, 1)+'/'+h.substr(0,2)+'/'+fn;
            }

            while (!input.eof()) {
                line = input.readline();

                // get the accent specifier
                if (matches = /\{\{a\|([^\}]+)\}\}/.exec(line)) {
                    accent = cleanAccent(matches[1]);
                }
                else {
                    accent = null;
                }

                // get the ipa bit
                if (/===Pronunciation===/.exec(line)) {
                    // ignore it
                }
                else if (matches = /\{\{IPA\|([^}]+)\}\}/.exec(line)) {
                    value = matches[1];
                    // remove the outter slashes "/"
                    if (matches = /\/([^\/]+)\//.exec(value)) {
                        value = matches[1];
                    }
                    addPron(accent, 'ipa', value);
                }
                else if (matches = /\{\{[Aa]udio\|([^|]+)\|[Aa]udio \(([^\)]+)\)\}\}/.exec(line)) {
                    addPron(cleanAccent(matches[2]), 'audio', getFullFilename(matches[1]));
                }
                else if (line !== null) {
                    print ('Unknown pron: '+line);
                }
            }

            if (pronList.length > 0) {
                // we try to reduce the pron sections by applying the following rule:
                //
                //   * If a IPA (with no tag) is specified before an audio with no IPA,
                //     that the IPA is added to that audio and the IPA section is removed.
                //
                // we implement it, by looping backwards
                entry.pron = (function () {
                    var ret = [], noIpaList = [];
                    pronList.reverse();
                    pronList.forEach(function (pron) {
                        if (typeof pron.ipa == 'undefined') {
                            noIpaList.push(pron);
                            ret.unshift(pron);
                        }
                        else if (noIpaList.length > 0 && typeof pron.tag == 'undefined') {
                            noIpaList.forEach(function (noIpa) {
                                noIpa.ipa = pron.ipa;
                            });
                            noIpaList = [];
                        }
                        else {
                            ret.unshift(pron);
                        }
                    });
                    return ret;
                })();
            }
        }

        function parse(entry, text) {
            parseTranslations(entry, text);
            parseSenses(entry, text);
            parseForms(entry, text);
            parsePronunciation(entry, text);
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
                formParsers: formParsers,
                parsePronunciation: parsePronunciation,
            }
        };
    }
);


