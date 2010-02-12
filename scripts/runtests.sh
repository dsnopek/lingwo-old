#!/bin/sh

RUNJS_PATH=$(cd $(dirname "$0"); pwd)

for tfile in `find -name \*.test.js`; do
	echo " ** FOUND TEST: $tfile **"
	$RUNJS_PATH/runjs.sh $tfile
done

