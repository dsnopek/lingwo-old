
require(
    ['lingwo_dictionary/scripts/common/TestCase',
     'lingwo_dictionary/scripts/importer/common/Entry',
     'lingwo_dictionary/scripts/importer/common/wiktionary/pl',
     'lingwo_dictionary/js/util/json2',
    ],
    function (TestCase, Entry, wiktionary_pl, JSON) {
        TestCase.subclass({
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


                var entry = new Entry();
                entry.headword = 'pies';
                entry.language = 'pl';
                entry.setSource('pl.wiktionary.org', {raw: text});

                var parser = wiktionary_pl.parsers.pl;
                parser(entry);

                this.assertEquals(entry.pos, 'noun');
                this.assertEquals(entry.pron, 'pʲɛs');
                this.assertEquals(entry.fields.gender.value, 'masculine');

                // senses
                this.assertEquals(entry.senses[0].difference, '(zool) Canis familiaris, zwierzę domowe');
                this.assertEquals(entry.senses[0].example, 'Pies jest najlepszym przyjacielem człowieka.');

                this.assertEquals(entry.senses[1].difference, 'samiec psa');
                this.assertEquals(entry.senses[1].example, 'Czy to jest pies, czy suka?');
                this.assertEquals(entry.senses[2].difference, '(slang) policjant');
                this.assertEquals(entry.senses[2].example, 'Psy stoją na patrolu.');

                // translations
                this.assertEquals(entry.translations.en.senses[0].trans[0], 'dog');
                this.assertEquals(entry.translations.be.senses[0].trans[0], 'сабака (sabaka)');
                this.assertEquals(entry.translations.cz.senses[0].trans[0], 'pes (m)');
                this.assertEquals(entry.translations.ru.senses[0].trans[0], 'собака (f) (sobaka)');
                this.assertEquals(entry.translations.ru.senses[0].trans[1], 'пёс (m)');

                //print (JSON.stringify(entry.translations));
            },
        }).run();
    }
);


