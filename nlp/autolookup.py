
from LingwoNLP.document import parse
from LingwoNLP.remote import ServerInterface

def main():
#    doc = parse(open('text1-clean.txt', 'rt'))
#    doc.segmentize()
#
#    for stream in doc.sents:
#        for token in stream.tokens:
#            print token
    
    remote = ServerInterface()
    remote.login()
    print remote.call('lingwo_dictionary.search_entries', 'dogs')

if __name__ == '__main__': main()

