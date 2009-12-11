
load('src/importer.js');

(function () {
    var LangNames = {
        'pl': 'język polski',
        'en': 'język angielski'
    };

    var Parsers = {
    };

    var Handler = declare({
        _constructor: function (handler, code) {
            this.handler = handler;
            this.code = code;
        },

        process: function (page) {
            var text = new Lingwo.importer.WikiText(page.revision.text);
            
            var sec = page.title + ' ({{'+LangNames[this.code]+'}})';
            if (text.hasSection(sec)) {
                var entry = {
                    'headword': page.title,
                    'sources': {
                        'pl.wiktionary.org': {
                            'raw': text.getSection(sec)
                        }
                    }
                };
                // TODO: run the this.code parser on the entry before passing it to the handler
                this.handler.process(entry);
            }
        }
    });

    Lingwo.importer.sources['pl.wiktionary.org'] = function (args) {
        var producer = new Lingwo.importer.mediawiki.Producer({ filename: args.filename });
        producer.run(new Handler(args.handler, 'pl'));
    };
})();

