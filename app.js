var plaid = require('plaid');
var express = require('express');
var expressapp = express();
var server = require('http').createServer(expressapp);
var io = require('socket.io')(server);
require('./inc/global');

config = require('./config/config.json');

app = {
    async: require('async'),
    moment: require('moment'),
    port: config.port,
    siteURL: "http://127.0.0.1:" + config.port + '/',
    siteURL2: "http://localhost:" + config.port + '/',
    connString: 'mongodb://' + config.db.host + ':' + config.db.port + '/' + config.db.name,
    mongo: require('./inc/mongo'),
    plaid_env: plaid.environments.tartan,
    mongoConnected: function(){},
    io: require('./inc/socket_handle.js')// handle sockets
}

require('./router')(express, expressapp);

server.listen(app.port, function(){
    app.io.start(io);
    console.log('Started listening on port: ' + app.port);
});
