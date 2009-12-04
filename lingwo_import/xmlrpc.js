
//
// Check out this code and port it!!
//
//   http://drupal.org/node/632844
//

var config = new org.apache.xmlrpc.client.XmlRpcClientConfigImpl();
config.setServerURL(new java.net.URL("http://127.0.0.1:8082/services/xmlrpc"));
var client = new org.apache.xmlrpc.client.XmlRpcClient();
client.setConfig(config);

var params = java.lang.reflect.Array.newInstance(java.lang.Object, 1);
params[0] = new java.lang.String('zumma');

try {
//var result = client.execute('lingwo_import.update_entry', params);
var result = client.execute('search.nodes', params);
}
catch (e) {
    /*
    for(var n in e) {
        print(n);
    }
    */
    print(e.message);
}
print(result);

