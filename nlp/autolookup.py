#!/usr/bin/env python

from LingwoNLP.document import parseString
from LingwoNLP.remote import ServerInterface

# Quick helper class to prevent us from connecting when its not necessary
class Connector(object):
    def __init__(self):
        self.remote = None
    def get(self):
        if self.remote is None:
            self.remote = ServerInterface()
            self.remote.login()
        return self.remote

def lookup(remote, doc, lang):
    # TODO: this isn't what we want to do in the end, but it will work now for testing
    def qlookup(word):
        res = remote.call('lingwo_dictionary.search_entries', word, {'language':lang})
        if len(res) > 0:
            return res[0]
        return None

    # make sure remote gets created
    for stream in doc.sents:
        for token in stream.tokens:
            # skip tokens which are already marked with 'pos' (its the only thing that tells
            # us they hae been processed -- we should be able to do better!)
            if token.dom.hasAttribute('pos'):
                continue

            word = unicode(token)

            # try first the word, then a lower case version of the word
            res = qlookup(word)
            if res is None:
                res = qlookup(word.lower())

            if res is not None:
                if word != res['headword']:
                    token.dom.setAttribute('headword', res['headword'])
                token.dom.setAttribute('pos', res['pos'])
                if res.has_key('form_name') and res['form_name'] != '_noname_':
                    token.dom.setAttribute('form', res['form_name'])

def main():
    import sys, getopt

    opts, args = getopt.getopt(sys.argv[1:], 'snl:', [])

    do_lookup = True
    do_dryRun = False
    lang = None
    for o, a in opts:
        if o == '-s':
            do_lookup = False
        elif o == '-n':
            do_dryRun = True
        elif o == '-l':
            lang = a


    if len(args) != 1:
        print >> sys.stderr, "Should take the nid of the text on the command line!"
        sys.exit(1)
    nid = args[0]

    conn = Connector()

    if nid == '-':
        content_item = { 'body': sys.stdin.read() }
    else:
        content_item = conn.get().call('node.get', int(nid))
        if content_item['type'] != 'content':
            print >> sys.stderr, "Node must be a content node!"
            sys.exit(1)
        if lang is None:
            lang = content_item['language']

    if lang is None:
        print >> sys.stderr, "Must pass -l language on the command line!"
        sys.exit(1)

    doc = parseString(content_item['body'], lang)
    doc.segmentize()

    if do_lookup:
        lookup(conn.get(), doc, lang)

    content_item['body'] = str(doc)

    if nid == '-' or do_dryRun:
        print content_item['body']
    else:
        conn.get().call('node.save', content_item)

if __name__ == '__main__': main()

