var express = require('express');
var expressapp = express();
var server = require('http').createServer(expressapp);
var io = require('socket.io')(server);
var path = require('path');
require('./inc/global');

config = require('./config/config.json');

app = {
    base: __dirname,
    async: require('async'),
    moment: require('moment'),
    port: config.port,
    siteURL: "http://127.0.0.1:" + config.port + '/',
    siteURL2: "http://localhost:" + config.port + '/',
    mongoConnected: function(){},
    io: require('./inc/socket-handle.js'), // handle sockets,
    api: require('./inc/auth.js')
}

app.db = require('./inc/db.js');

require('./router')(express, expressapp);

app.db.test(0);

server.listen(app.port, function(){
    app.io.start(io);
    console.log('Started listening on port: ' + app.port);
});
