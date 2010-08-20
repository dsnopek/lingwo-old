
from xml.dom import Node as XmlNode
import html5lib

# A generally useful DOM extension
def Node_insertAfter(parent, newElem, refElem):
    if parent.lastChild == refElem:
        parent.appendChild(newElem)
    else:
        parent.insertBefore(newElem, refElem.nextSibling)

# Missing in minidom!
def Text_split(node, index):
    doc = node.ownerDocument
    parent = node.parentNode
    sibling = doc.createTextNode(node.nodeValue[index:])
    Node_insertAfter(parent, sibling, node)
    node.nodeValue = node.nodeValue[:index]
    return sibling

class _DomWrapper(object):
    def __init__(self, dom):
        self._dom = dom

    @property
    def dom(self):
        return self._dom

class DocumentError(Exception):
    pass

class Document(_DomWrapper):
    def __init__(self, dom):
        if dom.nodeType != XmlNode.DOCUMENT_NODE:
            raise DocumentError('Document must be based around a Document node')
        _DomWrapper.__init__(self, dom)

    def segment(self):
        from LingwoNLP.segment import segmentDocument
        segmentDocument(self._dom)

    @property
    def sents(self):
        for elem in self._dom.getElementsByTagName('s'):
            yield TokenStream(elem)

    @property
    def words(self):
        return self._dom.getElementsByTagName('word')

class Token(_DomWrapper):
    def __init__(self, dom):
        if dom.nodeType != XmlNode.ELEMENT_NODE or dom.tagName != 'word':
            raise DocumentError('Token must wrap around a <word> element')
        _DomWrapper.__init__(self, dom)

class TokenStream(_DomWrapper):
    def __init__(self, dom):
        if dom.nodeType != XmlNode.ELEMENT_NODE or dom.tagName != 's':
            raise DocumentError('TokenStream must wrap around a <s> sentence element')
        _DomWrapper.__init__(self, dom)

        self.tokens = []
        for child in dom.childNodes:
            if child.nodeType == XmlNode.ELEMENT_NODE and node.tagName == 'word':
                self.tokens.append(Token(child))

def parse(fd):
    return Document(html5lib.parse(fd, treebuilder='dom'))

def parseString(s):
    from StringIO import StringIO
    return parse(StringIO(s))


