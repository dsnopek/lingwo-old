
import unittest
from xml.dom.minidom import parseString as minidom_parseString
from LingwoNLP.document import Simplifier, _serializeBody

def simplify(data, lang):
    doc = minidom_parseString('<body>'+data+'</body>')
    Simplifier(doc, lang).simplify()
    return _serializeBody(doc)

class SimplifierTest(unittest.TestCase):
    def testSimple(self):
        self.assertEqual(simplify('<word>red</word>', 'en'),
            '<span class="anno">red</span>')
        self.assertEqual(simplify('<word pos="adjective">red</word>', 'en'),
            '<span class="anno" data-entry="93a2b8b9bcbece6ea8b0d1a3b09394c9d6990174">red</span>')
        self.assertEqual(simplify('<word headword="red" pos="adjective">redly</word>', 'en'),
            '<span class="anno" data-entry="93a2b8b9bcbece6ea8b0d1a3b09394c9d6990174">redly</span>')
        self.assertEqual(simplify('<word pos="adjective" sense="c46d6d5e-2735-4dc2-b0fe-f5432650d8d9">red</word>', 'en'),
            '<span class="anno" data-entry="93a2b8b9bcbece6ea8b0d1a3b09394c9d6990174#c46d6d5e-2735-4dc2-b0fe-f5432650d8d9">red</span>')

    def testRemoveSents(self):
        self.assertEqual(simplify('<sent><word>red</word></sent>', 'en'),
            '<span class="anno">red</span>')
        self.assertEqual(simplify('<sent><word>red</word> <word>red</word></sent>', 'en'),
            '<span class="anno">red</span> <span class="anno">red</span>')

    def testNested(self):
        self.assertEqual(simplify('<a href="http://www.example.com"><word pos="adjective">sliding</word> <word headword="door" pos="noun">doors</word></a>', 'en'),
            '<a class="external" href="http://www.example.com" target="_blank"><span class="anno-text" id="anno-text-1">sliding</span><span class="anno-anchor anno-anchor-1 anno-anchor-only" data-anno="anno-text-1" data-entry="6a2cd28ee7c6f3b987deb8976b2ab8e9db8470af">1</span> <span class="anno-text" id="anno-text-0">doors</span></a><span class="anno-anchor anno-anchor-1 anno-anchor-only" data-anno="anno-text-0" data-entry="79d1123800393ead56c1dd81c5adba658cae5a5a">1</span>')
        self.assertEqual(simplify('<word pos="noun"><word pos="adjective">sliding</word> <word headword="door" pos="noun">doors</word></word>', 'en'),
            '<span class="anno-text" id="anno-text-0"><span class="anno" data-entry="6a2cd28ee7c6f3b987deb8976b2ab8e9db8470af">sliding</span> <span class="anno" data-entry="79d1123800393ead56c1dd81c5adba658cae5a5a">doors</span></span><span class="anno-anchor anno-anchor-1 anno-anchor-only" data-anno="anno-text-0" data-entry="05d0ad50636aa708f22c7d9932adcb55fb3d4880">1</span>')
        self.assertEqual(simplify('<a href="http://www.example.com"><word pos="noun"><word pos="adjective">sliding</word> <word headword="door" pos="noun">doors</word></word></a>', 'en'),
            '<a class="external" href="http://www.example.com" target="_blank"><span class="anno-text" id="anno-text-2"><span class="anno-text" id="anno-text-1">sliding</span><span class="anno-anchor anno-anchor-1 anno-anchor-only" data-anno="anno-text-1" data-entry="6a2cd28ee7c6f3b987deb8976b2ab8e9db8470af">1</span> <span class="anno-text" id="anno-text-0">doors</span></span></a><span class="anno-anchor anno-anchor-1" data-anno="anno-text-0" data-entry="79d1123800393ead56c1dd81c5adba658cae5a5a">1</span><span class="anno-anchor anno-anchor-2" data-anno="anno-text-2" data-entry="05d0ad50636aa708f22c7d9932adcb55fb3d4880">2</span>')

#    def testProblematic(self):
#        orig = """
#        <p><img align="right" alt="David Lowery of Cracker (singer, guitarist, song writer)" class="imagecache-Small" src="http://www.linguatrek.com/sites/default/files/imagecache/Small/node/4/david_lowery.jpg/david_lowery.jpg" title="" /><sent> <word headword="one" pos="pronoun">One</word> <word pos="preposition">of</word> <word pos="pronoun">my</word> <word>favorite</word> <word pos="adjective">American</word> <word>bands</word> <word form="-s" headword="be" pos="verb">is</word> <a href="http://en.wikipedia.org/wiki/Cracker_%28band%29"><word>Cracker</word></a>.</sent>  <sent><word headword="they" pos="pronoun">They</word> <word pos="verb">have</word> <word>an</word> <a href="http://en.wikipedia.org/wiki/Alternative_rock"><word>alternative</word> <word>rock</word></a> <word pos="noun">sound</word> <word>mixed</word> <word pos="preposition">with</word> <word pos="determiner">some</word> <a href="http://en.wikipedia.org/wiki/Country_music"><word>country</word></a> <word>stylings</word> <word pos="conjunction">and</word> <word>intelligent</word> <word pos="conjunction">but</word> <word>frequently</word> <word>funny</word> <word>lyrics</word>.</sent>  <sent>"<word>Big</word> <word>Dipper</word>" <word form="-s" headword="be" pos="verb">is</word> <word pos="article">a</word> <word>sad</word> <word pos="noun">song</word> <word pos="conjunction">but</word> <word pos="pronoun">one</word> <word pos="preposition">of</word> <word pos="pronoun">my</word> <word>favorites</word>.</sent>  <sent><word headword="listen" pos="verb">Listen</word> <word pos="preposition">to</word> <word pos="article">the</word> <word>video</word> <word pos="conjunction">and</word> <word pos="verb">read</word> <word pos="article">the</word> <word>lyrics</word> <word pos="preposition">below</word>!</sent></p>
#        """
#
#        small_test = """
#        <sent><word headword="one" pos="pronoun">One</word> <word pos="preposition">of</word> <word pos="pronoun">my</word> <word>favorite</word> <word pos="adjective">American</word> <word>bands</word> <word form="-s" headword="be" pos="verb">is</word> <a href="http://en.wikipedia.org/wiki/Cracker_%28band%29"><word>Cracker</word></a>.</sent>
#        """
#
#        test = """
#        <sent><word headword="one" pos="pronoun">One</word> <word pos="preposition">of</word></sent>
#        """
#
#        print simplify(test, 'en')

if __name__ == '__main__': unittest.main()

