#!/bin/sh

RUNJS_PATH=$(cd $(dirname "$0"); pwd)

JAVA_LIBS=$RUNJS_PATH/lib/js.jar:lib/xbean.jar:$RUNJS_PATH/lib/bzip2.jar:lib/sqlitejdbc-v056.jar:$RUNJS_PATH/lib/xmlrpc-client-3.1.2.jar:$RUNJS_PATH/lib/xmlrpc-common-3.1.2.jar:$RUNJS_PATH/lib/ws-commons-util-1.0.2.jar

# bootstrap uses this to locate the lingwo_dictionary directory
export RUNJS_PATH

java -cp $JAVA_LIBS org.mozilla.javascript.tools.shell.Main $RUNJS_PATH/bootstrap.js $@

