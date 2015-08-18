var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient
var assert = require('assert');

var connString = 'mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.name;

console.log(connString);

MongoClient.connect(connString, function(err, db) {
    app.db = db;
    var collection = db.collection('user');
    collection.find({}).toArray(function(err, docs) {
        console.log("Found the following records");
        console.dir(docs)

    });
      // Find some documents

});

//mongoose.connect(connString);

// console.log('something');
// app.db = mongoose.connection;
// console.log('what');
// app.db.on('error', console.error.bind(console, 'connection error:'));
// console.log('huh');
//
// app.db.once('open', function() {
//     console.log('db connected and open');
//   // Create your schemas and models here.
// });
