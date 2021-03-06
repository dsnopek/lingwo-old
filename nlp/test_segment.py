
import unittest
from xml.dom.minidom import parseString as minidom_parseString
from xml.dom import Node
from LingwoNLP.segment import ElementString, SentenceSegmenter, WordSegmenter

def parseString(t):
    return minidom_parseString('<body>'+t+'</body>').documentElement

def buildElementString(elem):
    s = ElementString()
    def buildInner(parent):
        child = parent.firstChild
        while child:
            if child.nodeType == Node.ELEMENT_NODE:
                buildInner(child)
            elif child.nodeType in (Node.TEXT_NODE, Node.CDATA_SECTION_NODE):
                s.add(child)
            child = child.nextSibling
    buildInner(elem)
    return s

def doSegment(elem):
    SentenceSegmenter().run(elem)
    word_segmenter = WordSegmenter();
    for sent in elem.getElementsByTagName('sent'):
        word_segmenter.run(sent)

class SegmentTest(unittest.TestCase):
    def testEndTagSegment(self):
        elem = parseString('this is a sentence<br />.')
        doSegment(elem)
        self.assertEqual(elem.toxml(), '<body><sent><word>this</word> <word>is</word> <word>a</word> <word>sentence</word><br/>.</sent></body>');

class ElementStringTest(unittest.TestCase):
    def testLookup(self):
        s = buildElementString(parseString('<word name="1">first</word> <word name="2">second</word> <word name="3">third</word>'))
        self.assertEqual(str(s), 'first second third')
        self.assertEqual(s.find_element(0).parentNode.getAttribute('name'), '1')
        self.assertEqual(s.find_element(4).parentNode.getAttribute('name'), '1')
        self.assertEqual(s.find_element(5).parentNode.tagName, 'body')
        self.assertEqual(s.find_element(6).parentNode.getAttribute('name'), '2')
        self.assertEqual(s.find_element(9).parentNode.getAttribute('name'), '2')
        self.assertEqual(s.find_element(12).parentNode.tagName, 'body')
        self.assertEqual(s.find_element(13).parentNode.getAttribute('name'), '3')
        self.assertEqual(s.find_element(17).parentNode.getAttribute('name'), '3')
        self.assertEqual(s.find_element(18).parentNode.getAttribute('name'), '3')

    def testWrap1(self):
        elem = parseString('first second third.')
        s = buildElementString(elem)
        raw = str(s)
        self.assertEqual(raw, 'first second third.')

        # we want our indexes working in the same as standard slicing.  Here I am checking
        # that my logic is sound.
        self.assertEqual(raw[0:5], 'first')
        self.assertEqual(raw[6:12], 'second')
        self.assertEqual(raw[13:18], 'third')
        self.assertEqual(raw[18:19], '.')

        # do the wrapping
        s.wrap_in_element('x', 0, 5)
        s.wrap_in_element('x', 6, 12)
        s.wrap_in_element('x', 13, 18)
        s.wrap_in_element('z', 18, 19)

        # check that it went correctly
        self.assertEqual(elem.toxml(),
            '<body><x>first</x> <x>second</x> <x>third</x><z>.</z></body>')

    def testWrap2(self):
        elem = parseString('this is a sentence<br />\n')
        s = buildElementString(elem)
        raw = str(s)
        self.assertEqual(raw, 'this is a sentence\n');

        self.assertEqual(raw[10:18], 'sentence')
        s.wrap_in_element('x', 10, 18)

        self.assertEqual(elem.toxml(), '<body>this is a <x>sentence</x><br/>\n</body>')

    def testWrap3(self):
        elem = parseString('<a href="away">link text</a>')
        s = buildElementString(elem)
        raw = str(s)
        self.assertEqual(raw, 'link text')

        self.assertEqual(raw[0:9], 'link text')
        s.wrap_in_element('x', 0, 9, flags=ElementString.FAVOR_INNER)

        self.assertEqual(elem.toxml(), '<body><a href="away"><x>link text</x></a></body>')

    def testWrap4(self):
        elem = parseString('<a href="away">link text</a>')
        s = buildElementString(elem)
        raw = str(s)
        self.assertEqual(raw, 'link text')

        self.assertEqual(raw[0:9], 'link text')
        s.wrap_in_element('x', 0, 9, flags=ElementString.FAVOR_OUTER)

        self.assertEqual(elem.toxml(), '<body><x><a href="away">link text</a></x></body>')

    def testWrap5(self):
        elem = parseString('<a href="away">link text</a>')
        s = buildElementString(elem)
        raw = str(s)
        self.assertEqual(raw, 'link text')

        self.assertEqual(raw[0:4], 'link')
        s.wrap_in_element('x', 0, 4, flags=ElementString.FAVOR_OUTER)

        self.assertEqual(elem.toxml(), '<body><a href="away"><x>link</x> text</a></body>')

    def testWrap6(self):
        elem = parseString('<a href="away">link text</a>')
        s = buildElementString(elem)
        raw = str(s)
        self.assertEqual(raw, 'link text')

        self.assertEqual(raw[5:9], 'text')
        s.wrap_in_element('x', 5, 9, flags=ElementString.FAVOR_OUTER)

        self.assertEqual(elem.toxml(), '<body><a href="away">link <x>text</x></a></body>')

    def testWrap7(self):
        elem = parseString('<p>First Sentence.  <strong>This is:</strong> the second sentence.</p>')
        s = buildElementString(elem)
        raw = str(s)
        self.assertEqual(raw, 'First Sentence.  This is: the second sentence.')

        self.assertEqual(raw[17:46], 'This is: the second sentence.')
        s.wrap_in_element('x', 17, 46)

        self.assertEqual(elem.toxml(), '<body><p>First Sentence.  <x><strong>This is:</strong> the second sentence.</x></p></body>')

    def testWrap8(self):
        elem = parseString('<p>First Sentence <strong>is Awesome!</strong>  The second sentence.</p>')
        s = buildElementString(elem)
        raw = str(s)
        self.assertEqual(raw, 'First Sentence is Awesome!  The second sentence.')

        self.assertEqual(raw[0:26], 'First Sentence is Awesome!')
        s.wrap_in_element('x', 0, 26)

        self.assertEqual(elem.toxml(), '<body><p><x>First Sentence <strong>is Awesome!</strong></x>  The second sentence.</p></body>')


if __name__ == '__main__': unittest.main()

