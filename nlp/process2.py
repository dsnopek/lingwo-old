
import html5lib, re
import cPickle as pickle
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

from nltk.tokenize.punkt import PunktLanguageVars
class MyPunktLanguageVars(PunktLanguageVars):
   sent_end_chars = ('.', '?', '!', '"', '\'')

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
            # we return the last element past the last character
            return len(self._lookup)-1, (pos, elem), len(elem.nodeValue)

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
            # we really want the previous element because we are past the edge
            lookupIndex, (pos, elem), localIndex = self._find(index-1)
#        elif which == ElementString._SPLIT_START and localIndex == len(elem.nodeValue)-1:
#            # we really want the next element because we are before the edge
#            lookupIndex, (pos, elem), localIndex = self._find(index+1)

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
            if localIndex == len(elem.nodeValue):
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

    def wrap_in_element(self, elemName, startIndex, endIndex):
        startElem = self._splitEndPoint(startIndex, ElementString._SPLIT_START)
        endElem = self._splitEndPoint(endIndex, ElementString._SPLIT_END)
        if startElem.parentNode != endElem.parentNode:
            print startElem, endElem
            print self._lookup
            raise "(for now) the sentence can only exist where the start and end point have the same parent"

        doc = startElem.ownerDocument
        sentenceElem = doc.createElement(elemName)
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

class Segmenter(object):
    # These elements don't strictly have to be "block" elements, they simply are elements
    # which sentences and words cannot cross, ie:
    #
    #   <p>This paragraph cannot be a sentence</p> with this text.
    #
    BLOCK_ELEMENTS = ['div','p','li','td','th','dt','dd','blockquote','center','h1','h2','h3','h4','h5','h6','address','del','ins','pre']

    # These are elements so problematic, that we simply ignore them if they happen to wander
    # into our innocent HTML document.
    SKIP_ELEMENTS = ['input','button','label','legend','option','textarea','iframe']
    
    def __init__(self, elemName, tokenize):
        self._elemName = elemName
        self._tokenize = tokenize

    def _doInner(self, parent):
        child = parent.firstChild
        while child:
            if child.nodeType == Node.ELEMENT_NODE:
                if child.tagName in Segmenter.BLOCK_ELEMENTS:
                    # if we encounter a block element, we have to segment what we have so
                    # far and then start over
                    self._doSegment()
                    self._doOuter(child)
                elif child.tagName == self._elemName or child.tagName in Segmenter.SKIP_ELEMENTS:
                    # if we encounter one of the same type of segments we are building, then
                    # we segment what we have so far and skip it.
                    self._doSegment()
                    pass
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
            segments = self._tokenize(raw_text)
            #print raw_text, segments
            endIndex = 0
            for seg in segments:
                if not re.search(r'\w', seg):
                    # if this segment has no "word" characters in it, we don't
                    # really want it
                    endIndex += len(seg)
                    continue
                #print seg
                startIndex = raw_text.find(seg, endIndex)
                endIndex = startIndex + len(seg)
                #print startIndex, endIndex

                #print startIndex, endIndex, sent
                self._elemStr.wrap_in_element(self._elemName, startIndex, endIndex)

        self._elemStr.reset()

    def run(self, elem):
        self._elemStr = ElementString()
        self._doOuter(elem)

# Copied from NLTK, so that we could modify it
from nltk.tokenize.api import TokenizerI
class MyTreebankWordTokenizer(TokenizerI):
    """
    A word tokenizer that tokenizes sentences using the conventions
    used by the Penn Treebank.  Contractions, such as "can't", are
    split in to two tokens.  E.g.:

      - can't S{->} ca n't
      - he'll S{->} he 'll
      - weren't S{-} were n't

    This tokenizer assumes that the text has already been segmented into
    sentences.  Any periods -- apart from those at the end of a string --
    are assumed to be part of the word they are attached to (e.g. for
    abbreviations, etc), and are not separately tokenized. 
    """
    # List of contractions adapted from Robert MacIntyre's tokenizer.
    CONTRACTIONS2 = [re.compile(r"(?i)(.)('ll|'re|'ve|n't|'s|'m|'d)\b"),
                     re.compile(r"(?i)\b(can)(not)\b"),
                     re.compile(r"(?i)\b(D)('ye)\b"),
                     re.compile(r"(?i)\b(Gim)(me)\b"),
                     re.compile(r"(?i)\b(Gon)(na)\b"),
                     re.compile(r"(?i)\b(Got)(ta)\b"),
                     re.compile(r"(?i)\b(Lem)(me)\b"),
                     re.compile(r"(?i)\b(Mor)('n)\b"),
                     re.compile(r"(?i)\b(T)(is)\b"),
                     re.compile(r"(?i)\b(T)(was)\b"),
                     re.compile(r"(?i)\b(Wan)(na)\b")]
    CONTRACTIONS3 = [re.compile(r"(?i)\b(Whad)(dd)(ya)\b"),
                     re.compile(r"(?i)\b(Wha)(t)(cha)\b")]
    
    def tokenize(self, text):
        # DRS: Hack so that "can't" comes out as "can 't" instead of the default
        text = re.sub(r"(?i)\b(can)('t)\b", r'\1 \2', text)

        for regexp in self.CONTRACTIONS2:
            text = regexp.sub(r'\1 \2', text)
        for regexp in self.CONTRACTIONS3:
            text = regexp.sub(r'\1 \2 \3', text)

        # Separate most punctuation
        text = re.sub(r"([^\w\.\'\-\/,&])", r' \1 ', text)

        # Separate commas if they're followed by space.
        # (E.g., don't separate 2,500)
        text = re.sub(r"(,\s)", r' \1', text)

        # Separate single quotes if they're followed by a space.
        text = re.sub(r"('\s)", r' \1', text)

        # Separate periods that come before newline or end of string.
        #text = re.sub('\. *(\n|$)', ' . ', text)
        # DRS: We add the possibility that the period can come inside of quotes
        text = re.sub('\. *(\n|"|$)', r' . \1', text)

        return text.split()

# A replacement for nltk.sent_tokenize() because we want to pass
# realign_boundaries=True to .tokenize()
def _sent_tokenize(text):
    punkt_tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')
    return punkt_tokenizer.tokenize(text, realign_boundaries=True)

class SentenceSegmenter(Segmenter):
    def __init__(self, tokenize=_sent_tokenize):
        Segmenter.__init__(self, 's', tokenize)

# A replacement for nltk.word_tokenize() that uses our modified MyTreebankWordTokenizer()
def _word_tokenize(text):
    treebank_tokenizer = MyTreebankWordTokenizer()
    return treebank_tokenizer.tokenize(text)

class WordSegmenter(Segmenter):
    def __init__(self, tokenize=_word_tokenize):
        Segmenter.__init__(self, 'word', tokenize)

def parse(fd):
    return html5lib.parse(fd, treebuilder='dom')

def parseString(s):
    from StringIO import StringIO
    return parse(StringIO(s))

def segmentDocument(doc, sent_segmenter=None, word_segmenter=None):
    # segment the sentences
    if sent_segmenter is None:
        sent_segmenter = SentenceSegmenter()
    sent_segmenter.run(doc.getElementsByTagName('body')[0])

    # segment the words
    if word_segmenter is None:
        word_segmenter = WordSegmenter()
    for sent in doc.getElementsByTagName('s'):
        word_segmenter.run(sent)

def main():
    # using our custom trained PunktTokenizer
    #punkt_tokenizer = pickle.load(open('punkt.pickle','rt'))
    #sent_tokenize = lambda x: punkt_tokenizer.tokenize(x, True)

    doc = parse(open('text1-clean.txt', 'rt'))
    #segmentDocument(doc, SentenceSegmenter(sent_tokenize))
    segmentDocument(doc)
    print doc.toxml()

if __name__ == '__main__': main()

