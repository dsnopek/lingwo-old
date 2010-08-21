#!/usr/bin/env python

from xmlrpclib import ServerProxy, Error
try:
    import json
except ImportError:
    import simplejson as json

DOMAIN = 'nlp'
KEY = '79f5235335085d792fb36c4f36c0d875'
USERNAME = 'NLP'
PASSWORD = 'tOhznZi4bE';

# test server
URL = 'http://localhost:35637/services/xmlrpc'

class ServerInterface(object):
    def __init__(self, url=URL, log=None):
        self.server = ServerProxy(url, allow_none=True)
        self.sessid = None
        self._in_connect = False

        if log is None:
            def log(data):
                print data
        self.log = log

    def connect(self):
        try:
            res = self.server.system.connect()
        except Exception, e:
            self.log('ERROR: '+str(e))
            raise e

        self.sessid = res['sessid']
        self._in_connect = True

    def _call_method(self, method, *user_args):
        import time, random, string, hmac, hashlib

        cmd = method._Method__name
        #timestamp = str(int(time.mktime(time.gmtime())));
        # NOTE: Heh, so this takes Warszawa time!  Really should be UTC...
        timestamp = str(int(time.mktime(time.localtime())));
        nonce = ''.join([random.choice(string.ascii_letters) for x in range(10)])
        hash = hmac.new(KEY, ';'.join([timestamp, DOMAIN, nonce, cmd]), hashlib.sha256).hexdigest()

        args = [hash, DOMAIN, timestamp, nonce, self.sessid] + list(user_args)

        return method(*args)

    def login(self, username=USERNAME, password=PASSWORD):
        if self.sessid is not None:
            if self._in_connect:
                # Everything is good, we have passed through the connect stage
                pass
            else:
                # We are still logged in as another user.  This will clear the
                # self.sessid and the next 'if' will connect us.
                try:
                    self.logout()
                except:
                    # ignore errors in logout, just carry on
                    self.sessid = None

        if self.sessid is None:
            # We need to connect before we can login
            self.connect()
            
        res = self._call_method(self.server.user.login, username, password)
        self.sessid = res['sessid']
        self._in_connect = False

    def logout(self):
        res = self._call_method(self.server.user.logout)
        self.sessid = None
        self._in_connect = False
        return res

    def call(self, name, *args):
        p1, p2 = name.split('.')
        m = getattr(getattr(self.server, p1), p2)
        return self._call_method(m, *args)

