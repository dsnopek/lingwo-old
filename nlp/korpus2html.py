#!/usr/bin/env python

from LingwoNLP.document import parseString
from LingwoNLP.remote import ServerInterface

def main():
    import sys, getopt

    opts, args = getopt.getopt(sys.argv[1:], 'l:', [])

    lang = None
    for o, a in opts:
        if o == '-l':
            lang = a

    if len(args) != 1:
        print >> sys.stderr, "Should take the nid of the text on the command line!"
        sys.exit(1)
    nid = args[0]

    text = None
    if nid == '-':
        text = sys.stdin.read()
    else:
        remote = ServerInterface()
        remote.login()
        node = remote.call('node.get', int(nid))
        if node['type'] != 'content':
            print >> sys.stderr, "Node must be a content node!"
            sys.exit(1)
        if lang is None:
            lang = node['language']
        text = node['body']

    if lang is None:
        print >> sys.stderr, "Must pass -l language on the command line!"
        sys.exit(1)

    doc = parseString(text)
    print doc.purehtml(lang)

if __name__ == '__main__': main()

