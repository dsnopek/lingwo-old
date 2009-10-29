
load('morphology.js');
load('pol.js');
load('pol.test-data.js');
load('test.js');

PolishTest = TestCase.subclass({
    test_kobieta: function () {
        var entry = entries['kobieta'];

        //print (entry.getForm('$stem.singular').letters);
        this.assertEquals(entry.getOption('gender'), 'feminine');
    }
});

(new PolishTest()).run();

//var w = Lingwo.dictionary.languages['pol'].parseWord('miła');
/*
var w = Lingwo.dictionary.languages['pol'].parseWord('gitarze');
for(var i = 0; i < w.letters.length; i++) {
    print(w.letters[i][0] + ' ' + w.letters[i][1]);
}
*/

/*
 * This would exist on the entry edit page.  As the entry is editted, this object too
 * would be modified and queried from.
 */
/*
var entry = new Lingwo.dictionary.Entry({
    'lang': Lingwo.dictionary.languages['pol'],
    'name': 'chłopiec',
    'pos': 'noun',
    'classes': ['animate','virile'],
    'forms': {
        '$stem': 'chłopc',
        'dative.singular': 'chłopcu'
    }
});
*/

/*
var entry = new Lingwo.dictionary.Entry({
    'lang': Lingwo.dictionary.languages['pol'],
    'name': 'kobieta',
    'pos': 'noun'
});
print (entry.getForm('$stem.singular').letters);
print (entry.getOption('gender'));
*/

/*
var entry = new Lingwo.dictionary.Entry({
    'lang': Lingwo.dictionary.languages['pol'],
    'name': 'głupi',
    'pos': 'adjective'
});
print (entry.getForm('$stem').letters);
print (entry.getOption('soft'));
print (entry.getForm('nominative.singular.feminine').letters);
*/

