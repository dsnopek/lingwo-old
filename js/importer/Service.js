
/*
 * For communicating with the lingwo_data service.
 */

require.def('lingwo_dictionary/importer/Service',
    ['lingwo_dictionary/util/declare',
     'lingwo_dictionary/Entry',
    ],
    function (declare, Entry) {
        // escapes characters, yo!
        function xmlSafe(s) {
            var i, l = s.length, out = "", ustr, uval, p;

            for(i = 0; i < l; i++) {
                uval = s.charCodeAt(i);
                if (uval > 255) {
                    ustr = uval.toString(16);
                    p = 4 - ustr.length;
                    while(p > 0) {
                        ustr = '0' + ustr;
                        p--;
                    }
                    ustr = '\\u' + ustr;
                }
                else {
                    ustr = s[i];
                }
                out += ustr;
            }

            return out;
        }

        var nonce_length = 10;
        var nonce_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        function getNonce() {
            var s = '';
            for(var i = 0; i < nonce_length; i++) {
                s += nonce_chars[Math.floor(Math.random() * (nonce_chars.length - 1))];
            }
            return s;
        };

        function getHMAC(key, msg) {
            var csets, keySpec, mac, hash;

            csets = java.nio.charset.Charset.forName('US-ASCII');
            keySpec = new javax.crypto.spec.SecretKeySpec(csets.encode(key).array(), 'HmacSHA256');
            mac = javax.crypto.Mac.getInstance('HmacSHA256');
            mac.init(keySpec);
            hash = mac.doFinal(csets.encode(msg).array());

            var res = "";
            for(var i = 0; i < hash.length; i++) {
                res += java.lang.Integer.toString((hash[i] & 0xff) + 0x100, 16).substring(1);
            }

            return res;
        };

        function newObjectArray() {
            //return java.lang.reflect.Array.newInstance(java.lang.Object, 0);
            return new java.util.Vector();
        };

        return declare({
            _client: null,
            _sessid: "",

            _constructor: function (args) {
                this.domain = args.domain;
                this.url = args.url;
                this.key = args.key;

                // setup our service
                this._initializeService();
            },

            _initializeService: function () {
                var config = new org.apache.xmlrpc.client.XmlRpcClientConfigImpl();
                config.setServerURL(new java.net.URL(this.url));

                this._client = new org.apache.xmlrpc.client.XmlRpcClient();
                this._client.setConfig(config);
            },

            _getDefaultParams: function (cmd) {
                var timestamp = ""+(new Date()).getTime();
                var nonce = getNonce();
                var hash = "" +
                    timestamp + ";" +
                    this.domain + ";" +
                    nonce + ";" + 
                    cmd;
                hash = getHMAC(this.key, hash);

                var params = newObjectArray();
                params.add(hash);
                params.add(this.domain);
                params.add(timestamp);
                params.add(nonce);
                params.add(this._sessid);
                return params;
            },

            connect: function () {
                // get a session id
                var res = this._client.execute('system.connect', newObjectArray());
                if (res) {
                    this._sessid = res.get('sessid');
                    return true;
                }
                return false;
            },

            login: function (username, password) {
                var params = this._getDefaultParams('user.login');
                params.add(username);
                params.add(password);

                var res = this._client.execute('user.login', params);

                this._sessid = res.get('sessid');

                return res;
            },

            update_entry: function (entry) {
                var params = this._getDefaultParams('lingwo_data.update_entry');
                params.add(xmlSafe(entry.serialize()));
                return this._client.execute('lingwo_data.update_entry', params);
            }
        });
    }
);

