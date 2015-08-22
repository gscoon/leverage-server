var async = require('async');

module.exports = new function(){
    var io = null;
    var sockets = {};

    this.start = function(_io){
        io = _io;

        io.on('connection', function (socket) {
            var extID = null;

            socket.on('extID', handleExtension);

            function handleExtension(data){
                extID = data;
                sockets[extID] = socket;

                app.mongo.searchForExtensionByID(extID, function(err, results){
                    console.log('searchForExtensionByID', err, results);
                    socket.emit('user', results);
                });

            }

        });

    }

    this.sendAuthUpdate = function(extID, results){
        var socket = sockets[extID];
        socket.emit('auth_status', results);
    }
}
