
require.def('lingwo_dictionary/scripts/importer/common/mediawiki/WikiText',
    ['lingwo_dictionary/js/declare',
     'lingwo_dictionary/js/escapeRegex',
    ],
    function (declare, escapeRegex) {
        return declare({
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
    }
);

