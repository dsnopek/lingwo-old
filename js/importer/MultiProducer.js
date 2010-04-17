
importPackage(java.io);

require.def('lingwo_dictionary/importer/MultiProducer',
    ['lingwo_dictionary/util/declare',
     'lingwo_dictionary/importer/Database',
     'lingwo_dictionary/importer/DatabaseProducer'],
    function (declare, Database, DatabaseProducer) {
        var COMMIT_INTERVAL = 10;

        // UNSAFE!
        function tempfn() {
            var f = File.createTempFile('staging-', '.db'),
                n = f.getName();
            f['delete']();
            return n;
        }

        return declare({
            _constructor: function (args) {
                var modules = args.modules, db = args._staging_db, self = this;
                delete args.modules;

                this.producers = [];
                modules.forEach(function (module) {
                    var producer = new module.Producer(args);
                    producer.name = module.name;
                    self.producers.push(producer);
                });

                this.code = args.code;

                // create our database (using the _staging_db if passed)
                this._staging_db = !!db;
                this._db_fn = db ? null : tempfn();
                this.db = db ? db : new Database(this._db_fn);
            },

            run: function (args) {
                var limit = args.limit, handler = args.handler, self = this, counter, producer;
                delete args.limit;
                delete args.handler;

                function generateHandler(name) {
                    return function (entry) {
                        var oldEntry;

                        if (entry.pos) {
                            // for testing
                            print (name + ': ' + self.code + ' / ' + entry.pos + ' / ' + entry.headword);

                            // pull the entry from the database and put the new data on it
                            oldEntry = self.db.getEntry(self.code, entry.pos, entry.headword);
                            if (oldEntry) {
                                oldEntry.setSource(name, entry.getSource(name));
                                entry = oldEntry;
                            }

                            // store the result
                            self.db.setEntry(entry);

                            // commit every so many entries
                            counter++;
                            if (counter > COMMIT_INTERVAL) {
                                self.db.commit();
                                counter = 0;
                            }
                        }
                    }
                }

                // run each producer, putting the entries into the database
                this.producers.forEach(function (producer) {
                    counter = 0;
                    args['handler'] = generateHandler(producer.name);
                    producer.run(args);
                    self.db.commit();
                });

                // if we are using the staging database, then we are all good, the data is 
                // where it belongs.
                if (this._staging_db) return;

                // run the combined data through the users handler
                producer = new DatabaseProducer(this.db, this.code);
                producer.run({
                    limit: limit,
                    handler: handler
                });

                // get rid of the temporary database
                (new File(this._db_fn))['delete']();
            }
        });
    }
);
