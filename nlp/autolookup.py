
from LingwoNLP.document import parse

def main():
    doc = parse(open('text1-clean.txt', 'rt'))
    doc.segmentize()

    for stream in doc.sents:
        for token in stream.tokens:
            print token

if __name__ == '__main__': main()

