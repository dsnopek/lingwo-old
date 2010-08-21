
from LingwoNLP.document import parse
from LingwoNLP.remote import ServerInterface

def main():
    remote = ServerInterface()
    remote.login()

    # TODO: this isn't what we want to do in the end, but it will work now for testing
    def qlookup(word):
        res = remote.call('lingwo_dictionary.search_entries', word, {'language':'en'})
        if len(res) > 0:
            return res[0]
        return None

    doc = parse(open('text1-clean.txt', 'rt'))
    doc.segmentize()

    for stream in doc.sents:
        for token in stream.tokens:
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

    print doc.dom.toxml()

if __name__ == '__main__': main()

