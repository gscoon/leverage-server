var MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');


function mongoClass(){

    var db = null;

    MongoClient.connect(config.db.connStr, function(err, thisDB) {
        console.log('db connected.');
        db = thisDB;
        app.mongoConnected();
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

    this.getUserByID = function(id, callback){
        db.collection('user').find({_id: new ObjectId(id)}).toArray(callback);
    }

    this.getAppUserById = function(app, id, callback){
        var searchObj = {};
        searchObj[app] = {id: id};
        var collection = db.collection('user');
        collection.find(searchObj).toArray(callback);
    }

    this.addAppUser = function(app, tokens, p, callback){
        var insertObj = {name: '', tokens: tokens};
        insertObj[app] = p;
        var collection = db.collection('user');
        collection.insert(insertObj, callback);
    }

    this.upsertAppUser = function(selector, updateObj, insertObj, callback){
        db.collection('user').findAndModify(
            selector,
            false,
            {$set: updateObj, $setOnInsert: insertObj},
            {new: true, upsert: true },
            callback
        );
    }

    this.searchForExtensionByID = function(id, callback){
        db.collection('user').find({extID: id}).toArray(callback);
    }

}


module.exports = new mongoClass();
