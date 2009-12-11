
load('src/importer.js');
load('src/mediawiki.js');
load('src/db.js');
load('src/pl-wiktionary-org.js');
load('src/en-wiktionary-org.js');

load('../morphology/test.js');

DatabaseProducerTest = TestCase.subclass({
    setUp: function () {
        this.db = new Lingwo.importer.db.Database();
        for(var i = 0; i < 20; i++) {
            this.db.setEntry('xxx', 'noun', 'entry'+i, 'entry'+i);
        }
        this.db.commit();
    },

    testLimit: function () {
        var producer = new Lingwo.importer.db.DatabaseProducer(this.db);

        var count = function (limit) {
            var i = 0;
            var handler = {
                process: function (data) {
                    i++;
                },
            };
            producer.run({ handler: handler, limit: limit });
            return i;
        };

        this.assertEquals(count(), 20);
        this.assertEquals(count(10), 10);
        this.assertEquals(count(15), 15);
    },
});

WikiTextTest = TestCase.subclass({
    testSections: function () {
        var text = "== Blarney ==\n\nsomething\n\n=== Sub-section ===\n\n" +
                   "Here is data in a subsection\n\n=== Sub-section 2 ===\n\nSome other subsection\n";

        var wiki = new Lingwo.importer.mediawiki.WikiText(text);

        this.assert(wiki.hasSection('Blarney'));
        this.assert(!wiki.hasSection('Zumma'));
        this.assert(!wiki.hasSection('Sub-section'));
        this.assert(wiki.hasSection('Sub-section', 2));
        this.assert(wiki.hasSection('Sub-section 2', 2));

        this.assertEquals(wiki.getSection('Blarney'), text);
        this.assertEquals(wiki.getSection('Sub-section', 2), '=== Sub-section ===\n\nHere is data in a subsection\n');
        this.assertEquals(wiki.getSection('Sub-section 2', 2), '=== Sub-section 2 ===\n\nSome other subsection\n');
    },
});

PLWiktionaryParserTest = TestCase.subclass({
    testParse1: function () {
        var text = "== pies ({{język polski}}) ==\n" +
            "[[Plik:YellowLabradorLooking.jpg|thumb|right|pies (1.1)]]\n" +
            "{{wymowa}} {{IPA3|pʲɛs}} {{audio|pl-pies.ogg}}\n" +
            "{{znaczenia}}\n" +
            "''rzeczownik, rodzaj męski''\n" +
            ": (1.1) {{zool}} ''Canis familiaris'', [[zwierzę]] [[domowy|domowe]]; {{wikipedia}}\n" +
            ": (1.2) [[samiec]] psa (1.1)\n" +
            ": (1.3) {{slang}} [[policjant]]<ref>{{Czeszewski2006|strony=231}}</ref>\n" +
            "{{odmiana|polski}} (1) {{lp}} pies, psa, psu, psa, psem, psie, psie; {{lm}} ps|y, ~ów, ~om, ~y, ~ami, ~ach, ~y\n" +
            "{{przykłady}}\n" +
            ": (1.1) ''[[pies|Pies]] [[być|jest]] [[dobry|najlepszym]] [[przyjaciel]]em [[człowiek]]a.''\n" +
            ": (1.2) ''[[czy|Czy]] [[to#to (język polski)|to]] [[być|jest]] [[pies]], [[czy]] [[suka]]?''\n" +
            ": (1.3) ''[[pies|Psy]] [[stać|stoją]] [[na#na (język polski)|na]] [[patrol]]u''.\n" +
            "{{składnia}}\n" +
            "{{kolokacje}} (1.1) [[mieć]] psa ■ [[wyprowadzać]] psa [[na#na (język polski)|na]] [[spacer]] ■ ~ [[gryźć|gryzie]]/[[warczeć|warczy]]/[[szczekać|szczeka]]/[[merdać|merda]] [[ogon]]em\n" +
            "{{synonimy}} (1.1) [[kundel]]; (1.3) zob. [[policjant]]\n" +
            "{{antonimy}} (1.1) [[kot]], [[wilk]]; (1.2) [[suka]]\n" +
            "{{pokrewne}} {{rzecz}} [[psiadusza]], [[psiajucha]], [[psiak]], [[psiakostka]], [[psiakość]], [[psiakrew]], [[psiamać]], [[psiarnia]], [[psiarz]], [[psica]], [[psiątko]], [[psina]], [[psubrat]], [[psiawiara]]; {{przym}} [[psi]]; {{zdrobn}} [[piesek]], [[psiaczek]], [[psinka]], {{zgrub}} [[psisko]]\n" +
            "{{frazeologia}} [[tu leży pies pogrzebany]], [[pies kogoś jebał]], [[pies ogrodnika]], [[pies na baby]], [[pogoda pod psem]], [[psu na budę]], [[pieskie życie]], [[psia wachta]], [[psia koja]], [[pies Pawłowa]], [[nie dla psa kiełbasa]], [[pies łańcuchowy Darwina]], [[na psa urok]], [[ni pies, ni wydra]], [[schodzić na psy]], [[łżeć jak pies]], [[delikatny jak francuski piesek]], [[pies z nim tańcował]], [[psi żywot]], [[psie figle]], [[psi obowiązek]], [[całować psa w nos]], [[wyć jak pies do księżyca]], [[żyć jak pies z kotem]], [[wieszać na kimś psy]], [[lubić kogoś jak psy dziada w ciasnej ulicy]], [[robić coś psim swędem]], [[wyglądać jak zbity pies]], [[być wyszczekanym jak pies]], [[Psia kość !]], [[kupować za psie pieniądze]], [[wyszczekać/odszczekać coś jak pies]], [[wierny jak pies]]; zobacz też: [[Aneks:Przysłowia polskie - zwierzęta#pies|przysłowia o psie]]\n" +
            "{{etymologia}} źródłosłów dla {{źródło dla|pl|Psary}}<ref>{{Malec2003|strony=201|hasło=Psary}}</ref>\n" +
            "{{uwagi}}\n" +
            "* (1.1) zobacz też: [[Indeks:Polski - Ssaki]]\n" +
            "* (1.2) samica psa → [[suka]]\n" +
            "{{tłumaczenia}}\n" +
            "* angielski: (1.1) [[dog]]\n" +
            "* białoruski: (1.1) [[сабака]] (sabaka)\n" +
            "* czeski: (1.1) [[pes#pes (język czeski)|pes]] {{m}}\n" +
            "* rosyjski: (1.1) [[собака#собака (język rosyjski)|собака]] {{f}} (sobaka), [[пёс]] {{m}}\n";


        var entry = new Lingwo.importer.Entry();
        entry.headword = 'pies';
        entry.language = 'pl';
        entry.setSource('pl.wiktionary.org', {raw: text});

        var parser = Lingwo.importer.sources['pl.wiktionary.org'].parsers.pl;
        parser(entry);

        this.assertEquals(entry.pos, 'noun');
        this.assertEquals(entry.pron, 'pʲɛs');
        this.assertEquals(entry.fields.gender, 'masculine');

        // senses
        this.assertEquals(entry.senses[0].difference, '(zool) Canis familiaris, zwierzę domowe');
        this.assertEquals(entry.senses[0].example, 'Pies jest najlepszym przyjacielem człowieka.');
        this.assertEquals(entry.senses[0].trans.en[0], 'dog');
        this.assertEquals(entry.senses[0].trans.be[0], 'сабака (sabaka)');
        this.assertEquals(entry.senses[0].trans.cz[0], 'pes (m)');
        this.assertEquals(entry.senses[0].trans.ru[0], 'собака (f) (sobaka)');
        this.assertEquals(entry.senses[0].trans.ru[1], 'пёс (m)');

        this.assertEquals(entry.senses[1].difference, 'samiec psa');
        this.assertEquals(entry.senses[1].example, 'Czy to jest pies, czy suka?');
        this.assertEquals(entry.senses[2].difference, '(slang) policjant');
        this.assertEquals(entry.senses[2].example, 'Psy stoją na patrolu.');

        //print (JSON.stringify(entry.senses));
    },
});

function main() {
    for (var name in this) {
        if (/Test$/.exec(name)) {
            print ('=='+name+'==');
            (new this[name]()).run();
            print ();
        }
    }
}
main();


