
import re
import xml.etree.ElementTree as ET
from StringIO import StringIO
import nltk
from nltk.tag.hmm import *

# adapted from NLTK nltk.util.clean_html()
def clean_html(html):
    # First we remove inline JavaScript/CSS:
    cleaned = re.sub(r"(?is)<(script|style).*?>.*?(</\1>)", "", html.strip())
    # Then we remove html comments. This has to be done before removing regular
    # tags since comments can contain '>' characters.
    cleaned = re.sub(r"(?s)<!--(.*?)-->[\n]?", "", cleaned)
    # Next we can remove the remaining tags:
    # DRS: except for the <word> tags!
    cleaned = re.sub(r"(?s)</(?!word).*?>", " ", cleaned)
    cleaned = re.sub(r"(?s)<(?!/)(?!word).*?>", " ", cleaned)
    # Finally, we deal with whitespace
    cleaned = re.sub(r"&nbsp;", " ", cleaned)
    cleaned = re.sub(r"  ", " ", cleaned)
    cleaned = re.sub(r"  ", " ", cleaned)
    return cleaned.strip()

def clean_text(html):
    cleaned = re.sub(r"(?s)</?word.*?>", "", html)
    return cleaned

def tokenize(tree):
    l = []
    for elem in tree.getiterator():
        if elem.tag == 'word':
            l.append((elem.text, elem.get('pos', '')))

            # put the trailing data on as unannotated if there is any
            if elem.tail is not None:
                tail = elem.tail.strip()
                if len(tail) > 0:
                    for tok in nltk.wordpunct_tokenize(tail):
                        if tok != '':
                            l.append((tok, ''))
    return l

def segment_sentances(tagged_text):
    sents = []
    sent = []
    for tagged in tagged_text:
        sent.append(tagged)
        if tagged[0] in ('.', '?', '!'):
            sents.append(sent)
            sent = []
    return sents

automatic_tags = {
    'the': 'article',
    'a':   'article',
    'an':  'article',
}

class Text(object):
    pass

def load_text(fn):
    fd = open(fn, 'rt')
    raw_text = clean_html(fd.read())

    text = Text()
    text.tagged_words = tokenize(ET.parse(StringIO('<text>'+raw_text+'</text>')))
    text.tagged_sents = segment_sentances(text.tagged_words)
    text.sents = [[word for (word, tag) in sent] for sent in text.tagged_sents]
    text.words = [word for (word, tag) in text.tagged_words]

    return text

def make_corpus(*texts):
    sents = []
    for t in texts:
        sents = sents + t.tagged_sents
    return sents

def main():
    training_data = make_corpus(
        load_text('text1.txt'),
        load_text('text2.txt'),
    )
    test_data = load_text('text3.txt')

    #print words

    #print nltk.FreqDist(tags)
    #print nltk.FreqDist(tags).max()

    default_tagger = nltk.DefaultTagger('noun')

    #baseline_tagger = nltk.UnigramTagger(model=automatic_tags, backoff=default_tagger)

    unigram_tagger = nltk.UnigramTagger(training_data, backoff=default_tagger)
    bigram_tagger = nltk.BigramTagger(training_data, backoff=unigram_tagger)
    #print unigram_tagger._context_to_tag

    hmm = HiddenMarkovModelTrainer().train(training_data)

    def run_tagger(t):
        test = t.tag(test_data.words)
        print test
        print t.evaluate(test_data.tagged_sents)
        #print nltk.ConfusionMatrix(test_data.tagged_words, test)

    run_tagger(hmm)

if __name__ == '__main__': main()

