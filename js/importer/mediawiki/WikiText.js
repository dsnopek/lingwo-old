
require.def('lingwo_dictionary/importer/mediawiki/WikiText',
    ['lingwo_dictionary/util/declare',
     'lingwo_dictionary/util/escapeRegex',
    ],
    function (declare, escapeRegex) {
        var WikiText = declare({
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
        });

        WikiText.clean = function (line) {
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

        return WikiText;
    }
);

