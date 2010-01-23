
/*
 * Here we will develop an importer for Polish language.
 */

load('src/importer.js');
load('src/mediawiki.js');
load('src/db.js');
load('src/pl-wiktionary-org.js');
load('src/service.js');

// save the arguments for later
opts = arguments.splice(0);

// load the morphology stuff
console = {
    debug: print
};
load('../morphology/morphology.js');
load('../morphology/pl.js');

// This list is copied from lingwo_language/lingwo_language.module
// TODO: this should be shared!!
var language_fields = (function () {
    var data = {"pl":{"fields":{"noun":{"classes":[{"name":"virile","label":"Virile","description":"Only important if the Gender is \"masculine\"","show":"entry.getOption(\"gender\") == \"masculine\""},{"name":"animate","label":"Animate","description":"Only important if the Gender is \"masculine\"","show":"entry.getOption(\"gender\") == \"masculine\""}],"options":[{"name":"gender","label":"Gender","options":{"masculine":"Masculine","feminine":"Feminine","neuter":"Neuter"},"required":true}],"forms":[{"name":"*stem"},{"name":"*stem.singular"},{"name":"*stem.plural"},{"name":"nominative.singular"},{"name":"nominative.plural"},{"name":"accusative.singular"},{"name":"accusative.plural"},{"name":"genitive.singular"},{"name":"genitive.plural"},{"name":"instrumental.singular"},{"name":"instrumental.plural"},{"name":"locative.singular"},{"name":"locative.plural"}]},"adjective":{"classes":[{"name":"soft"}],"forms":[{"name":"*stem"},{"name":"nominative.singular.masculine"},{"name":"nominative.singular.feminine"},{"name":"nominative.singular.neuter"},{"name":"nominative.plural.non_virile"},{"name":"nominative.plural.virile"},{"name":"accusative.singular.feminine"},{"name":"accusative.singular.neuter"},{"name":"accusative.singular.masculine.animate"},{"name":"accusative.singular.masculine.inanimate"},{"name":"accusative.plural.virile"},{"name":"accusative.plural.non_virile"},{"name":"genitive.singular.masculine"},{"name":"genitive.singular.feminine"},{"name":"genitive.singular.neuter"},{"name":"genitive.plural"},{"name":"instrumental.singular.masculine"},{"name":"instrumental.singular.feminine"},{"name":"instrumental.singular.neuter"},{"name":"instrumental.plural"},{"name":"locative.singular.masculine"},{"name":"locative.singular.feminine"},{"name":"locative.singular.neuter"},{"name":"locative.plural"}]},"verb":{"options":[{"name":"conjugation","options":{"first":"First","second":"Second","third":"Third"}}],"forms":[{"name":"*stem"},{"name":"nonpast.singular.1p"},{"name":"nonpast.singular.2p"},{"name":"nonpast.singular.3p"},{"name":"nonpast.plural.1p"},{"name":"nonpast.plural.2p"},{"name":"nonpast.plural.3p"}]}}}};

    var fields = {
        'noun': {},
        'verb': {},
        'adjective': {},
    };

    [['classes','class'],['forms','form'],['options','option']].forEach(function (args) {
        var list = args[0], type = args[1];
        var pos;
        for(pos in data.pl.fields) {
            if (!data.pl.fields[pos][list])
                continue;
            data.pl.fields[pos][list].forEach(function (field) {
                fields[pos][field.name] = {
                    name: field.name,
                    type: type,
                };
            });
        }
    });

    return fields;
})();

function generateFields(importer_entry) {
    var entry = new Lingwo.dictionary.Entry({
        lang: Lingwo.dictionary.languages['pl'],
        name: importer_entry.headword,
        pos: importer_entry.pos,
    });

    var type_to_var_map = {
        'form': 'forms',
        'class': 'classes',
        'option': 'options'
    };

    // copy all the fields that the importer got
    var name, field, type;
    for(name in importer_entry.fields) {
        field = importer_entry.fields[name];
        if (!field.automatic) {
            type = language_fields[entry.pos][name].type;
            entry[type_to_var_map[type]][name] = field.value;
        }
    }
    
    // go through each of the possible fields, see if it is set on importer_entry,
    // if not, pull it from the morphology entry.
    for(name in language_fields[entry.pos]) {
        type = language_fields[entry.pos][name].type;

        if (importer_entry.fields[name] && !importer_entry.fields[name].automatic &&
            typeof importer_entry.fields[name].value != 'undefined')
        {
            // if the importer already set this field, don't worry about it.
            continue;
        }

        try {
            // get entry to calculate it for us
            switch (type) {
                case 'form':
                    importer_entry.fields[name] = {
                        'value': entry.getForm(name).toString(),
                        'automatic': true,
                    };
                    break;
                case 'option':
                    importer_entry.fields[name] = {
                        'value': entry.getOption(name),
                        'automatic': true,
                    };
                    break;
                case 'class':
                    importer_entry.fields[name] = {
                        'value': entry.isClass(name),
                        'automatic': true,
                    };
                    break;
            };
        }
        // eat exceptions!  For now, we don't care if we miss some forms
        catch (e) {}
    }
}

function main() {
    var db = new Lingwo.importer.db.Database('staging.db');

    var service = new Lingwo.importer.Service({
        domain: 'localhost',
        url: 'http://127.0.0.1:8082/services/xmlrpc',
        key: '028edd447fce610ef46dd685ae186d7f'
    });
    if (service.connect()) {
        var res = service.login('Normal User', 'test');
        print(res);
    }

    // TODO: This handler really should put items on the server!
    function handler(entry) {
        if (!entry.pos) {
            print('!*** Skipping entry because it has no POS: '+entry.headword);
            return;
        }

        generateFields(entry);
        //print(JSON.stringify(entry));

        db.setEntry(entry);
        db.commit();

        /*
        if (entry.headword == 'drzewo') {
            print(JSON.stringify(entry));
        }
        */

        print(service.update_entry(entry));
    }

    // TODO: We really should be combining the two sources
    Lingwo.importer.processSource({
        type: 'pl-wiktionary-org',
        filename: '/home/dsnopek/dl/plwiktionary-20091202-pages-articles.xml.bz2',
        handler: handler,
        //limit: 1500
    });
}
main();

