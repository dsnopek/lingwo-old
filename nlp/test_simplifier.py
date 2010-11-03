
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

    def testNested(self):
        self.assertEqual(simplify('<a href="http://www.example.com"><word pos="adjective">sliding</word> <word headword="door" pos="noun">doors</word></a>', 'en'),
            '<a href="http://www.example.com"><span class="anno-text" data-entry="6a2cd28ee7c6f3b987deb8976b2ab8e9db8470af" id="anno-text-1">sliding</span><span class="anno-anchor" data-anno="anno-text-1">1</span> <span class="anno-text" data-entry="79d1123800393ead56c1dd81c5adba658cae5a5a" id="anno-text-0">doors</span></a><span class="anno-anchor" data-anno="anno-text-0">1</span>')
        self.assertEqual(simplify('<word pos="noun"><word pos="adjective">sliding</word> <word headword="door" pos="noun">doors</word></word>', 'en'),
            '<span class="anno-text" data-entry="05d0ad50636aa708f22c7d9932adcb55fb3d4880" id="anno-text-2"><span class="anno-text" data-entry="6a2cd28ee7c6f3b987deb8976b2ab8e9db8470af" id="anno-text-1">sliding</span><span class="anno-anchor" data-anno="anno-text-1">1</span> <span class="anno-text" data-entry="79d1123800393ead56c1dd81c5adba658cae5a5a" id="anno-text-0">doors</span></span><span class="anno-anchor" data-anno="anno-text-0">1</span><span class="anno-anchor" data-anno="anno-text-2">2</span>')



if __name__ == '__main__': unittest.main()

