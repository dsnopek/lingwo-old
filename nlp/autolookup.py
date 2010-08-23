#!/usr/bin/env python

from LingwoNLP.document import parseString
from LingwoNLP.remote import ServerInterface

def main():
    import sys

    if len(sys.argv) != 2:
        print >> sys.stderr, "Should take the nid of the text on the command line!"
        sys.exit(1)

    remote = ServerInterface()
    remote.login()

    content_item = remote.call('node.get', int(sys.argv[1]))
    if content_item['type'] != 'content':
        print >> sys.stderr, "Node must be a content node!"
        sys.exit(1)

    doc = parseString(content_item['body'])
    doc.segmentize()

    # TODO: this isn't what we want to do in the end, but it will work now for testing
    def qlookup(word):
        res = remote.call('lingwo_dictionary.search_entries', word, {'language':'en'})
        if len(res) > 0:
            return res[0]
        return None

    for stream in doc.sents:
        for token in stream.tokens:
            # skip tokens which are already marked with 'pos' (its the only thing that tells
            # us they hae been processed -- we should be able to do better!)
            if token.dom.hasAttribute('pos'):
                continue

            word = str(token)

            # try first the word, then a lower case version of the word
            res = qlookup(word)
            if res is None:
                res = qlookup(word.lower())

            if res is not None:
                if word != res['headword']:
                    token.dom.setAttribute('headword', res['headword'])
                token.dom.setAttribute('pos', res['pos'])
                if res.has_key('form_name'):
                    token.dom.setAttribute('form', res['form_name'])

    content_item['body'] = str(doc)
    remote.call('node.save', content_item)

if __name__ == '__main__': main()

