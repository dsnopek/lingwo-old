
from xml.dom import Node as XmlNode
import html5lib

try:
    from cStringIO import StringIO
except ImportError:
    from StringIO import StringIO

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

# A generally useful DOM extension
def Element_text(node):
    s = ""
    for child in node.childNodes:
        if child.nodeType in (XmlNode.TEXT_NODE, XmlNode.CDATA_SECTION_NODE):
            s += child.nodeValue
        elif child.nodeType == XmlNode.ELEMENT_NODE:
            s += Element_text(child)
    return s

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

    def segmentize(self):
        from LingwoNLP.segment import segmentDocument
        segmentDocument(self._dom)

    def __str__(self):
        writer = StringIO()
        body = self._dom.getElementsByTagName('body')[0]
        for child in body.childNodes:
            writer.write(child.toxml('utf-8'))
        return writer.getvalue()

    @property
    def sents(self):
        for elem in self._dom.getElementsByTagName('sent'):
            yield TokenStream(elem)

    @property
    def words(self):
        return self._dom.getElementsByTagName('word')

class Token(_DomWrapper):
    def __init__(self, dom):
        if dom.nodeType != XmlNode.ELEMENT_NODE or dom.tagName != 'word':
            raise DocumentError('Token must wrap around a <word> element')
        _DomWrapper.__init__(self, dom)

    def __str__(self):
        return Element_text(self._dom)

class TokenStream(_DomWrapper):
    def __init__(self, dom):
        if dom.nodeType != XmlNode.ELEMENT_NODE or dom.tagName != 'sent':
            raise DocumentError('TokenStream must wrap around a <sent> sentence element')
        _DomWrapper.__init__(self, dom)

        self.tokens = []
        for child in dom.childNodes:
            if child.nodeType == XmlNode.ELEMENT_NODE and child.tagName == 'word':
                self.tokens.append(Token(child))

def parse(fd):
    return Document(html5lib.parse(fd, treebuilder='dom'))

def parseString(s):
    return parse(StringIO(s))


