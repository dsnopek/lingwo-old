#!/bin/bash

REQUIRE=/home/dsnopek/prj/requirejs-0.13.0
BUILDSH=$REQUIRE/build/build.sh
CLOSURE=$REQUIRE/build/lib/closure/compiler.jar
STUBS=../js/require/require-stubs.js

for profile in *.build.js; do
	name=`echo $profile | sed -e s,\.build\.js$,,`

	# build our code
	$BUILDSH $profile

	# combine the stubs and the code to start us up
	echo "(function () {"      > $name.temp.js
	cat $STUBS                >> $name.temp.js
	cat $name.uncompressed.js >> $name.temp.js
	echo "require(['lingwo_dictionary/annotation/Embed'], function (bb) { bb.start(); });" \
	                          >> $name.temp.js
	echo "})();"              >> $name.temp.js
	mv $name.temp.js $name.uncompressed.js

	# run the closure compiler
	java -jar $CLOSURE --js $name.uncompressed.js --js_output_file $name.js
done

