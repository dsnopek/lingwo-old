
import html5lib
from xml.dom import Node
import nltk

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

class ElementString(object):
    def __init__(self):
        self.reset()

    def reset(self):
        self._string = ''
        self._lookup = []

    def is_empty(self):
        test = self._string.strip()
        return test == ''

    def add(self, elem):
        self._string = self._string + elem.nodeValue
        self._lookup.append((len(self._string), elem))

    def __str__(self):
        return self._string

    def _find(self, index):
        res = None
        i = 0
        for (pos, elem) in self._lookup:
            if index < pos:
                res = (pos, elem)
                break
            i += 1
        if res is None:
            # we return the last element on the last character
            return len(self._lookup)-1, (pos, elem), len(elem.nodeValue)-1

        return i, res, (index-pos+len(elem.nodeValue))

    def find(self, index):
        i, (pos, elem), localIndex = self._find(index)
        return (elem, localIndex)

    def find_element(self, index):
        return self._find(index)[1][1]

    _SPLIT_START = 1
    _SPLIT_END = 0
    
    def _splitEndPoint(self, index, which):
        lookupIndex, (pos, elem), localIndex = self._find(index)
        if which == ElementString._SPLIT_END and localIndex == 0:
            # we really want the previous element because we are before the edge
            lookupIndex, (pos, elem), localIndex = self._find(index-1)
        elif which == ElementString._SPLIT_START and localIndex == len(elem.nodeValue)-1:
            # we really want the next element because we are past the edge
            lookupIndex, (pos, elem), localIndex = self._find(index+1)

        # we move up the tree if we are on the very edge of a word annotation
        def walkUpParent(elem):
            while elem.parentNode.tagName == 'word':
                if which == ElementString._SPLIT_START and elem == elem.parentNode.firstChild:
                    elem = elem.parentNode
                elif which == ElementString._SPLIT_END and elem == elem.parentNode.lastChild:
                    elem = elem.parentNode
                else:
                    break
            return elem

        if which == ElementString._SPLIT_START:
            if localIndex == 0:
                return walkUpParent(elem)
        elif which == ElementString._SPLIT_END:
            if localIndex == len(elem.nodeValue) - 1:
                return walkUpParent(elem)
        #print "-> split", which
        #print "localIndex:", localIndex, "textLen:", len(elem.nodeValue)
        #print elem

        # split and insert into our lookup table
        sibling = Text_split(elem, localIndex)
        self._lookup.insert(lookupIndex+1, (pos, sibling))
        self._lookup[lookupIndex] = (pos-len(sibling.nodeValue), elem)
        
        # return the requested
        parts = [elem, sibling]
        return parts[which]

    def make_sentence(self, startIndex, endIndex):
        startElem = self._splitEndPoint(startIndex, ElementString._SPLIT_START)
        endElem = self._splitEndPoint(endIndex, ElementString._SPLIT_END)
        #print startElem, endElem
        if startElem.parentNode != endElem.parentNode:
            #print self._lookup
            raise "(for now) the sentence can only exist where the start and end point have the same parent"

        doc = startElem.ownerDocument
        sentenceElem = doc.createElement('s')
        parent = startElem.parentNode
        parent.insertBefore(sentenceElem, startElem)
        child = startElem
        while child is not None:
            nextChild = child.nextSibling

            parent.removeChild(child)
            sentenceElem.appendChild(child)

            if child == endElem:
                #print "endElem found!"
                break
            child = nextChild

class SentenceSegmenter(object):
    ELEMENTS_BLOCK = ['div','p']
    
    def __init__(self, tokenize=nltk.sent_tokenize):
        self._tokenize = tokenize

    def _doInner(self, parent):
        child = parent.firstChild
        while child:
            if child.nodeType == Node.ELEMENT_NODE:
                if child.tagName in SentenceSegmenter.ELEMENTS_BLOCK:
                    # if we encounter a block element, we have to segment what we have so
                    # far and then start over
                    self._doSegment()
                    self._doOuter(child)
                else:
                    self._doInner(child)
            elif child.nodeType in (Node.TEXT_NODE, Node.CDATA_SECTION_NODE):
                self._elemStr.add(child)
            child = child.nextSibling

    def _doOuter(self, parent):
        self._doInner(parent)
        self._doSegment()    

    def _doSegment(self):
        if not self._elemStr.is_empty():
            raw_text = str(self._elemStr)
            sents = self._tokenize(raw_text)
            for sent in sents:
                startIndex = raw_text.find(sent)
                endIndex = startIndex + len(sent)

                #print startIndex, endIndex, sent
                self._elemStr.make_sentence(startIndex, endIndex)

        self._elemStr.reset()

    def run(self, elem):
        self._elemStr = ElementString()
        self._doOuter(elem)

def main():
    fd = open('text1.txt', 'rt')
    doc = html5lib.parse(fd, treebuilder="dom")
    #buildOuter(doc.getElementsByTagName('body')[0])
    #segmentSentences(s)
    segmenter = SentenceSegmenter()
    segmenter.run(doc.getElementsByTagName('body')[0])
    print doc.toxml()

if __name__ == '__main__': main()

