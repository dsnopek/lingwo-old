
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

class Process2Test(unittest.TestCase):
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

if __name__ == '__main__': unittest.main()

