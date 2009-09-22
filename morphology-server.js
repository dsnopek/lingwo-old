
/*
 * TODO: I want to test loading javascript files in a restricted environment, so that I can
 * run untrusted code.
 *
 * The end goal is some kind of server to run morphology definitions, which can be used on the
 * server-side, either for API requests or when the browser doesn't have javascript available.
 */

function dir(o) {
    for (var name in o) {
        print(name);
    }
}

var js = org.mozilla.javascript;
var cx = js.Context.enter();

try {
    var scope = cx.initStandardObjects();
    var res = cx.evaluateString(scope, "Math.cos(Math.PI)", "<filename>", 1, null);
    print (js.Context.toString(res));
}
finally {
    cx.exit();
}

