
import unittest
from xml.dom.minidom import parseString
from process2 import buildOuter

def _parse(t):
    return parseString('<body>'+t+'</body>').documentElement

class Process2Test(unittest.TestCase):
    def testLookup(self):
        s = buildOuter(_parse('<word name="1">first</word> <word name="2">second</word> <word name="3">third</word>'))
        self.assertEqual(str(s), 'first second third')
        self.assertEqual(s.find_element(0).parentNode.getAttribute('name'), '1')
        self.assertEqual(s.find_element(4).parentNode.getAttribute('name'), '1')
        self.assertEqual(s.find_element(5).parentNode.tagName, 'body')
        self.assertEqual(s.find_element(6).parentNode.getAttribute('name'), '2')
        self.assertEqual(s.find_element(9).parentNode.getAttribute('name'), '2')
        self.assertEqual(s.find_element(12).parentNode.tagName, 'body')
        self.assertEqual(s.find_element(13).parentNode.getAttribute('name'), '3')
        self.assertEqual(s.find_element(17).parentNode.getAttribute('name'), '3')

        try:
            s.find_element(18)
            self.fail()
        except:
            pass

if __name__ == '__main__': unittest.main()

