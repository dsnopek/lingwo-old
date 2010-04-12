#!/usr/bin/env python

def main():
    import sys
    fn = sys.argv[1]
    text = file(fn, 'rt').read()
    text = text.replace('\x85', '...')
    text = text.replace('\x92', "'")
    text = text.replace('\x93', '"')
    text = text.replace('\x94', '"')
    file(fn, 'wt').write(text)

if __name__ == '__main__': main()

