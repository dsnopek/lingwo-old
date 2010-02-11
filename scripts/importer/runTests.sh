#!/bin/sh

for tfile in tests/*; do
	echo $tfile
	../runjs.sh $tfile
done

