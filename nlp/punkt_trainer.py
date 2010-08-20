
from nltk.tokenize.punkt import PunktTrainer, PunktSentenceTokenizer
from process2 import MyPunktLanguageVars
import cPickle as pickle

def train_on_corpus(trainer, corpus):
    for fileid in corpus.fileids():
        print "Training on:", fileid
        trainer.train(corpus.raw(fileid))

def main():
    lang_vars = MyPunktLanguageVars()
    trainer = PunktTrainer(lang_vars=lang_vars)

    # train our PunktTrainer using project gutenberg
    from nltk.corpus import gutenberg, reuters, brown
    for corpus in [gutenberg, reuters, brown]:
        train_on_corpus(trainer, corpus)
    trainer.finalize_training(verbose=True)

    tokenizer = PunktSentenceTokenizer(trainer.get_params(), lang_vars=lang_vars)
    pickle.dump(tokenizer, open('punkt.pickle','wt'))

if __name__ == '__main__': main()


