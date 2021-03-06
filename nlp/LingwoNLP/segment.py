
import re
import cPickle as pickle
from xml.dom import Node
import sys, os.path, nltk
from LingwoNLP.document import parse, parseString, Text_split

from nltk.tokenize.punkt import PunktLanguageVars, PunktWordTokenizer
class MyPunktLanguageVars(PunktLanguageVars):
    sent_end_chars = ('.', '?', '!', '"', '\'')

    # DRS: we added \. and removed \'
    # TODO: does this break sentences segmentation with English?
    _re_non_word_chars   = r"(?:[?!)\";}\]\*:@\.\({\[])"
    """Characters that cannot appear within words"""

class SegmentException(Exception):
    pass

class ElementString(object):
    FAVOR_INNER = 0
    FAVOR_OUTER = 1 << 0

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
        return str(self._string)

    def __unicode__(self):
        return unicode(self._string)

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
            localIndex = len(elem.nodeValue)

        if which == ElementString._SPLIT_START and localIndex == 0:
            return elem
        elif which == ElementString._SPLIT_END and localIndex == len(elem.nodeValue):
            return elem

        # split and insert into our lookup table
        sibling = Text_split(elem, localIndex)
        self._lookup.insert(lookupIndex+1, (pos, sibling))
        self._lookup[lookupIndex] = (pos-len(sibling.nodeValue), elem)
        
        # return the requested
        parts = [elem, sibling]
        return parts[which]

    # Takes the two end-point indexes and returns two nodes, which mark (and include)
    # all the content in between the two indexes.  It may have to split text nodes
    # in order to have two exact nodes.
    #
    # By default, it will favor returning nodes that are inside the parent.  For example,
    # meaning returning the text node in "<span>text</span>" when (startIndex, endIndex)
    # is (0, 4).  But if the FAVOR_OUTER flag is passed, it will return the span element
    # instead.
    def _getEndPointNodes(self, startIndex, endIndex, flags=0):
        startElem = self._splitEndPoint(startIndex, ElementString._SPLIT_START)
        endElem = self._splitEndPoint(endIndex, ElementString._SPLIT_END)

        def isFrontEdge(elem):
            return elem == elem.parentNode.firstChild

        def isBackEdge(elem):
            return elem == elem.parentNode.lastChild

        def isParentWalkable(elem):
            return elem.parentNode.tagName in Segmenter.INLINE_ELEMENTS

        # Designed to work with the endElem (hence it only checks if it is the
        # "back edge" when deciding if we can move up the tree)
        def findAncestorWithParent(parentNode, elem):
            while elem.parentNode != None:
                if elem.parentNode == parentNode:
                    return elem
                if isParentWalkable(elem) and isBackEdge(elem):
                    elem = elem.parentNode
                else:
                    # we can go up the tree any further, so give up
                    return None
                    
        # try to walk up the tree, to find nodes where the startElem and endElem share
        # a parent.
        if startElem.parentNode != endElem.parentNode:
            while startElem.parentNode != None:
                endElemAncestor = findAncestorWithParent(startElem.parentNode, endElem)
                if endElemAncestor is not None:
                    endElem = endElemAncestor
                    break

                if isParentWalkable(startElem) and isFrontEdge(startElem):
                    startElem = startElem.parentNode
                else:
                    break

            # all that looping and we still couldn't find a way that they will have the same parent
            if startElem.parentNode != endElem.parentNode:
                raise SegmentException("couldn't find a way to connect the start element to the end element")

        if flags & ElementString.FAVOR_OUTER:
            # we walk up the tree as far as we can go
            while startElem.parentNode == endElem.parentNode and isParentWalkable(startElem) and isFrontEdge(startElem) and isBackEdge(endElem):
                startElem = startElem.parentNode
                endElem = endElem.parentNode

        return (startElem, endElem)

    def wrap_in_element(self, elemName, startIndex, endIndex, flags=0):
        (startElem, endElem) = self._getEndPointNodes(startIndex, endIndex, flags)

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

    # This is a list of all elements we recognize as "inline" (it isn't a complete list from
    # the HTML5 spec, but probably should be).  The main function of this list is that we
    # walk up span elements and include them inside sentences.
    INLINE_ELEMENTS = ['a','b','i','u','strong','em','span','word']

    # These are elements so problematic, that we simply ignore them if they happen to wander
    # into our innocent HTML document.
    SKIP_ELEMENTS = ['input','button','label','legend','option','textarea','iframe']

    # Child classes (ie. SentenceSegmenter) can change the flags that will be used to
    # call ElementString.wrap_in_element()
    WRAP_FLAGS = ElementString.FAVOR_INNER
    
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
            raw_text = unicode(self._elemStr)
            segments = self._tokenize(raw_text)
            #print repr(raw_text), segments
            endIndex = 0
            for seg in segments:
                if not re.search(r'\w', seg):
                    # if this segment has no "word" characters in it, we don't
                    # really want it
                    endIndex += len(seg)
                    continue

                # remove leading/trailing white space from the sentences segment
                seg = seg.strip()

                #print seg
                startIndex = raw_text.find(seg, endIndex)
                endIndex = startIndex + len(seg)
                #print startIndex, endIndex, seg

                #print startIndex, endIndex, sent
                try:
                    self._elemStr.wrap_in_element(self._elemName, startIndex, endIndex, self.WRAP_FLAGS)
                except SegmentException, e:
                    print >> sys.stderr, self.__class__.__name__ + ': Unable to create segment "'+repr(seg)+'": '+str(e)

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

def _load_punkt(lang):
    if lang == 'en':
        return nltk.data.load('tokenizers/punkt/english.pickle')
    else:
        return pickle.load(open(os.path.join(os.path.dirname(__file__), 'punkt-'+lang+'.pickle'), 'r'))

# A replacement for nltk.sent_tokenize() because we want to pass
# realign_boundaries=True to .tokenize()
def _sent_tokenize(text, lang):
    punkt_tokenizer = _load_punkt(lang)
    return punkt_tokenizer.tokenize(text, realign_boundaries=True)

class SentenceSegmenter(Segmenter):
    WRAP_FLAGS = ElementString.FAVOR_OUTER

    def __init__(self, tokenize=_sent_tokenize, lang='en'):
        # if the user is passing the default default tokenize, then
        # we make sure it is called with the 'lang' argument
        if tokenize is _sent_tokenize:
            def lang_tokenize(text):
                return _sent_tokenize(text, lang)
            tokenize = lang_tokenize

        Segmenter.__init__(self, 'sent', tokenize)

# A replacement for nltk.word_tokenize() that uses our modified MyTreebankWordTokenizer()
def _word_tokenize(text, lang):
    if lang == 'en':
        treebank_tokenizer = MyTreebankWordTokenizer()
        return treebank_tokenizer.tokenize(text)
    else:
        # TODO: does this really make sense?  PunktWordTokenizer really
        # just calls into MyPunktLanguageVars anyway...
        punkt_tokenizer = PunktWordTokenizer(MyPunktLanguageVars())
        return punkt_tokenizer.tokenize(text)

class WordSegmenter(Segmenter):
    def __init__(self, tokenize=_word_tokenize, lang='en'):
        if tokenize is _word_tokenize:
            def lang_tokenize(text):
                return _word_tokenize(text, lang)
            tokenize = lang_tokenize
        Segmenter.__init__(self, 'word', tokenize)

def segmentDocument(doc, lang, sent_segmenter=None, word_segmenter=None):
    # segment the sentences
    if sent_segmenter is None:
        sent_segmenter = SentenceSegmenter(lang=lang)
    sent_segmenter.run(doc.getElementsByTagName('body')[0])

    # segment the words
    if word_segmenter is None:
        word_segmenter = WordSegmenter(lang=lang)
    for sent in doc.getElementsByTagName('sent'):
        word_segmenter.run(sent)

def main():
    # using our custom trained PunktTokenizer
    #punkt_tokenizer = pickle.load(open('punkt.pickle','rt'))
    #sent_tokenize = lambda x: punkt_tokenizer.tokenize(x, True)

    doc = parse(open('text1-clean.txt', 'rt')).dom
    #segmentDocument(doc, SentenceSegmenter(sent_tokenize))
    segmentDocument(doc)
    print doc.toxml()

if __name__ == '__main__': main()

