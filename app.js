app = {
    config: require('./config/config.json'),
    async: require('async'),
    moment: require('moment'),
    siteURL: "http://127.0.0.1:1111/",
    port: 1111
}

var express = require('express');
var expressapp = express();
var server = require('http').createServer(expressapp);
var io = require('socket.io')(server);

require('./inc/google-auth.js');

var plaid = require('plaid');
var request = require('request');

var pURL = 'https://tartan.plaid.com/'
var plaid_env = plaid.environments.tartan;

app.db = require('./inc/db');

require('./router')(express, expressapp, io);

var category_id = 22015000;
plaid.getCategory(category_id, plaid_env, function(err, response){
    //console.log(response);
});

plaid.getInstitutions(plaid_env, function(err, response){
    //console.log(response);
});


server.listen(app.port, function(){
    console.log('start listening, port:' + app.port);
});
