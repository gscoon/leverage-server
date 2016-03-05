var express = require('express');
var expressapp = express();
var server = require('http').createServer(expressapp);
var io = require('socket.io')(server);
var path = require('path');


require('./inc/global');
global.config = require('./config/config.json');
global.async = require('async');
global.extend = require('extend');
global.urljoin = require('url-join');

app = {
    base: __dirname,
    port: config.port,
	io: require('./inc/socket-handler.js'), // handle sockets,
    user: require('./inc/user.js'), // handle users,
	domain: {
		http: 'http://',
		base: 'chickenpox.io',
		sub: 'www'
	}
}

var d = app.domain;
d.default = d.http + d.sub + '.' + d.base;
d.noSub = d.http + d.base;
d.share = d.http + 'share.' + d.base;
d.login = d.http + 'login.' + d.base;
d.image = d.images = d.http + 'image.' + d.base;
d.userImage = d.images + '/user/';
d.feed = d.http + 'feed.' + d.base;

app.db = require('./inc/db.js');

require('./router')(express, expressapp);
server.listen(app.port, function(){
    app.io.start(io);
    console.log('Started listening on port: ' + app.port);
});
