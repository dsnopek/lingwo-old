
from xml.dom import Node as XmlNode
import html5lib, codecs

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

# replaces an Element with its children
def Element_replaceWithChildren(node):
    childNodes = node.childNodes[:]
    for child in childNodes:
        node.removeChild(child)
        node.parentNode.insertBefore(child, node)
    node.parentNode.removeChild(node)

def Element_replaceWithTagName(node, tagName):
    newNode = node.ownerDocument.createElement(tagName)
    node.parentNode.insertBefore(newNode, node)
    childNodes = node.childNodes[:]
    for child in childNodes:
        node.removeChild(child)
        newNode.appendChild(child)
    node.parentNode.removeChild(node)
    return newNode

class _DomWrapper(object):
    def __init__(self, dom):
        self._dom = dom

    @property
    def dom(self):
        return self._dom

class DocumentError(Exception):
    pass

def writeHtml(writer, nodeList):
    from html5lib.treewalkers import getTreeWalker
    #from html5lib.serializer.htmlserializer import HTMLSerializer
    from html5lib.serializer.xhtmlserializer import XHTMLSerializer

    walker = getTreeWalker('dom')
    serializer = XHTMLSerializer()
    for node in nodeList:
        for item in serializer.serialize(walker(node)):
            writer.write(item)

# makes the 'body' of the document into XHTML
def _serializeBody(doc):
    buffer = StringIO()
    writer = codecs.getwriter('utf-8')(buffer)
    body = doc.getElementsByTagName('body')[0]
    writeHtml(writer, body.childNodes)
    return buffer.getvalue()

def _isLink(node):
    return node.nodeType == XmlNode.ELEMENT_NODE and node.tagName == 'a' and node.getAttribute('href') != ''

class Simplifier(object):
    """ Makes cleaned up HTML from the document.
    
    It does the following:

      * <word> becomes a special <span> with a data-entry attribute containing
        a hash of "language:pos:headword#sense_id" and a class of "anno"

      * If any <word>'s are nested inside other <word>'s or <a>'s, they get a
        class of "anno-text" and an incremental id like "anno-text-#".  Another
        <span> with a class of "anno-anchor" and an attribute data-anno listing
        the id will be placed after the first <span>.  If this is the last child
        then the second <span> will instead be placed after the parent element,
        or if the parent is also nested, the first parent which isn't.

      * <sent> tags are simply removed.

      * <a> get target="_blank" and class="external"
    """

    def __init__(self, doc, lang):
        self.doc = doc
        self.lang = lang

    @classmethod
    def hash(cls, language, pos, headword):
        import hashlib
        return hashlib.sha1((unicode(language)+':'+pos+':'+headword).encode('utf-8')).hexdigest()

    def hashNode(self, node):
        if not node.hasAttribute('pos'):
            return None

        if node.hasAttribute('headword'):
            headword = node.getAttribute('headword')
        else:
            headword = Element_text(node)

        return Simplifier.hash(self.lang, node.getAttribute('pos'), headword)

    def _isNested(self, elem):
        # first, we search upward
        node = elem
        while node.parentNode is not None and node.parentNode.nodeType == XmlNode.ELEMENT_NODE:
            if _isLink(node.parentNode):
                return True
            node = node.parentNode

        # next, we search downward
        for node in elem.getElementsByTagName('span'):
            if node.getAttribute('class') in ('anno','anno-text'):
                return True

        return False

    def simplify(self):
        def hasClass(node, clsName):
            if not node.hasAttribute('class'):
                return False
            return clsName in node.getAttribute('class').split(' ')

        def removeClass(node, clsName):
            if not node.hasAttribute('class'):
                return
            l = node.getAttribute('class').split(' ')
            del l[l.index(clsName)]
            node.setAttribute('class', ' '.join(l))

        # first pass: we simply convert the <word>'s to <span>'s
        for elem in self.doc.getElementsByTagName('word'):
            # we have to do this before Element_replaceWithTagName() because it will
            # remove all of elem's children!
            dataEntry = self.hashNode(elem)

            newElem = Element_replaceWithTagName(elem, 'span')
            newElem.setAttribute('class', 'anno')
            # if we have a valid entry hash, then we should put it on the span
            if dataEntry is not None:
                if elem.hasAttribute('sense'):
                    dataEntry = dataEntry + '#' + elem.getAttribute('sense')
                newElem.setAttribute('data-entry', dataEntry)

        # second pass: we deal with our word <span>'s nested inside <a> or other word <span>'s
        spans = self.doc.getElementsByTagName('span')
        spans.reverse()
        annoTextId = 0
        for elem in spans:
            if elem.getAttribute('class') != 'anno' or not self._isNested(elem):
                continue

            # setup as an .anno-text
            elem.setAttribute('id', 'anno-text-'+str(annoTextId))
            elem.setAttribute('class', 'anno-text')

            # create the anchor
            anchorElem = self.doc.createElement('span')
            anchorElem.setAttribute('data-anno', 'anno-text-'+str(annoTextId))
            
            # transfer the data-entry from the elem to anchorElem
            if elem.hasAttribute('data-entry'):
                anchorElem.setAttribute('data-entry', elem.getAttribute('data-entry'))
                elem.removeAttribute('data-entry')

            # place the anchor and set its content/class
            anchorIndex = 1
            placeAfter = elem
            # count up along the end edge
            while placeAfter.nextSibling is None and placeAfter.parentNode is not None and placeAfter.nodeType == XmlNode.ELEMENT_NODE and (_isLink(placeAfter.parentNode) or (placeAfter.parentNode.tagName == 'span' and placeAfter.parentNode.getAttribute('class') in ('anno','anno-text'))):
                placeAfter = placeAfter.parentNode
            # count forward over previously placed anchors
            while placeAfter.nextSibling is not None and placeAfter.nextSibling.nodeType == XmlNode.ELEMENT_NODE and placeAfter.nextSibling.tagName == 'span' and hasClass(placeAfter.nextSibling, 'anno-anchor'):
                placeAfter = placeAfter.nextSibling
                if anchorIndex == 1:
                    # it isn't the only anymore!
                    removeClass(placeAfter, 'anno-anchor-only');
                anchorIndex += 1
            # place the anchor
            Node_insertAfter(placeAfter.parentNode, anchorElem, placeAfter)
            anchorElem.appendChild(self.doc.createTextNode(str(anchorIndex)))
            # set the class name
            anchorClass = 'anno-anchor anno-anchor-'+str(anchorIndex)
            if anchorIndex == 1:
                anchorClass += ' anno-anchor-only';
            anchorElem.setAttribute('class', anchorClass)

            annoTextId += 1

        # third pass: remove all the <sent> tags
        for elem in self.doc.getElementsByTagName('sent'):
            Element_replaceWithChildren(elem)

        # fourth pass: mark all the anchors as external
        for elem in self.doc.getElementsByTagName('a'):
            if elem.hasAttribute('href'):
                elem.setAttribute('target', '_blank')
                elem.setAttribute('class', 'external')

class Document(_DomWrapper):
    def __init__(self, dom, lang):
        if dom.nodeType != XmlNode.DOCUMENT_NODE:
            raise DocumentError('Document must be based around a Document node')
        _DomWrapper.__init__(self, dom)
        self.lang = lang

    def segmentize(self):
        from LingwoNLP.segment import segmentDocument
        segmentDocument(self._dom, self.lang)

    def __str__(self):
        return self.html()

    def html(self):
        return _serializeBody(self._dom)

    def purehtml(self):
        doc = self._dom.cloneNode(True)
        Simplifier(doc, self.lang).simplify()
        return _serializeBody(doc)

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

def parse(fd, lang):
    return Document(html5lib.parse(fd, treebuilder='dom', encoding='utf-8'), lang)

def parseString(s, lang):
    # if the string is unicode, then we need to encode it as 'utf-8'
    # because html5lib chokes on it.
    if isinstance(s, unicode):
        s = s.encode('utf-8')
    return parse(StringIO(s), lang)


