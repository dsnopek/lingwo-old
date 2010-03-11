#!/bin/sh

## Single Phase ##

#../runjs.sh en-importer.js --source /home/dsnopek/dl/enwiktionary-latest-pages-articles.xml.bz2 --service http://localhost:8082/services/xmlrpc --service-domain localhost --service-key 028edd447fce610ef46dd685ae186d7f --service-username "Normal User" --service-password "test" --limit 10

## Dual Phase ##

../runjs.sh en-importer.js --source /home/dsnopek/dl/enwiktionary-latest-pages-articles.xml.bz2 --output-staging staging.db --limit 10

../runjs.sh en-importer.js --input-staging staging.db --service http://localhost:8082/services/xmlrpc --service-domain localhost --service-key 028edd447fce610ef46dd685ae186d7f --service-username "Normal User" --service-password "test" --limit 10

