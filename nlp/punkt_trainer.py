
from nltk.tokenize.punkt import PunktTrainer, PunktSentenceTokenizer
from LingwoNLP.segment import MyPunktLanguageVars
import cPickle as pickle
import sys, os.path, codecs, getopt

train_funcs = {}

def train_on_corpus(trainer, corpus):
    for fileid in corpus.fileids():
        print "Training on:", fileid
        trainer.train(corpus.raw(fileid))


def train_en(trainer):
    # train our PunktTrainer using project gutenberg
    from nltk.corpus import gutenberg, reuters, brown
    for corpus in [gutenberg, reuters, brown]:
        train_on_corpus(trainer, corpus)
train_funcs['en'] = train_en

def train(trainer, lang):
    path = os.path.join('training', lang)
    for fn in os.listdir(path):
        if not fn.lower().startswith('readme'):
            print "Training on:", fn
            text = codecs.open(os.path.join(path, fn), 'Ur', 'utf-8').read()
            trainer.train(text)

def main():
    opts, args = getopt.getopt(sys.argv[1:], 'l:', [])

    lang = None
    for o, a in opts:
        if o == '-l':
            lang = a

    if lang is None:
        print >> sys.stderr, "Must pass -l language on the command line!"
        sys.exit(1)
    if lang == 'en':
        print >> sys.stderr, "Don't train for -l en!  We are using the pre-trained punkt tokenizer from NLTK."
        sys.exit(1)

    lang_vars = MyPunktLanguageVars()
    trainer = PunktTrainer(lang_vars=lang_vars)
    train(trainer, lang)
    trainer.finalize_training(verbose=True)

    tokenizer = PunktSentenceTokenizer(trainer.get_params(), lang_vars=lang_vars)
    pickle.dump(tokenizer, open('LingwoNLP/punkt-'+lang+'.pickle','wt'))

if __name__ == '__main__': main()


