var MongoClient = require('mongodb').MongoClient
var assert = require('assert');

function mongoClass(){
    var db;
    MongoClient.connect(config.db.connStr, function(err, thisDB) {
        console.log('db connected.');
        db = thisDB;
    });

    this.setProperty = function(collection, selector, update, callback){
        var collection = db.collection(collection);
        collection.update(selector, {$set: update}, callback);
    }

    this.getAllUSers = function(){
        var collection = db.collection('user');
        collection.find({}).toArray(function(err, docs) {
            console.log("Found the following records");
            console.dir(docs)
        });
    }
}


module.export = new mongoClass();
