
importPackage(java.io);

var file = '/home/dsnopek/dl/enwiktionary-latest-pages-articles.xml.bz2';
var IN_BUF_SZ = 1024 * 1024;

function openBZip2Stream(fn) {
    var infile = new BufferedInputStream(new FileInputStream(fn), IN_BUF_SZ);

    var first = infile.read();
    var second = infile.read();
    // 66 = B, 90 = Z
    if (first != 66 || second != 90) {
        throw new IOException("Didn't find BZ file signature in .bz2 file");
    }

    return new org.apache.tools.bzip2.CBZip2InputStream(infile);
}

function readPage(stream) {
    var buffer = "", line, inPage = false;

    while (true) {
        line = stream.readLine();

        if (line == '  <page>') {
            if (!inPage) {
                inPage = true;
            }
            else {
                // sanity check
                throw new IOException("Found a <page> within a <page>");
            }
        }
        if (inPage) {
            buffer += (line + "\n");
        }
        if (line == '  </page>') {
            if (!inPage) {
                // sanity check
                throw new IOException("Found </page> before <page>");
            }
            break;
        }
    }

    // trim!
    buffer = buffer.replace(/^\s+/, '');
    buffer = buffer.replace(/\s+$/, '');

    return buffer;
}

var stream = new BufferedReader(new InputStreamReader(openBZip2Stream(file)));
for (var i = 0; i < 10; i++) {
    var pageXML = new XML(readPage(stream));
    print (pageXML.title);
}

