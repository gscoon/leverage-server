var plaid = require('plaid');
var express = require('express');
var expressapp = express();
var server = require('http').createServer(expressapp);
var io = require('socket.io')(server);
require('./../inc/global');

config = require('./../config/config.json');

app = {
    async: require('async'),
    moment: require('moment'),
    port: config.port,
    siteURL: "http://127.0.0.1:" + config.port + '/',
    siteURL2: "http://localhost:" + config.port + '/',
    connString: 'mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.name,
    mongo: require('./../inc/mongo'),
    plaid_env: plaid.environments.tartan,
    mongoConnected: function(){
        app.mongo.getUserByID('55d4f39a1d4abcedc82f0319', function(err, docs){
             console.log(err, docs);
        });
    }
}
