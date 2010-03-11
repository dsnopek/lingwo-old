#!/bin/sh

RUNJS_PATH=$(cd $(dirname "$0"); pwd)

JAVA_LIBS="."
for i in $RUNJS_PATH/java-lib/*.jar; do
	JAVA_LIBS="$JAVA_LIBS:$i"
done

# bootstrap uses this to locate the lingwo_dictionary directory
export RUNJS_PATH

java -cp $JAVA_LIBS org.mozilla.javascript.tools.shell.Main $RUNJS_PATH/bootstrap.js "$@"

