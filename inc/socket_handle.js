var async = require('async');

module.exports = new function(){
    var io = null;
    var sockets = {};
    var ioUser = {};

    this.start = function(_io){
        io = _io;

        io.on('connection', function (socket) {
            var extID = null;

            socket.on('extID', handleExtension);
            socket.on('get_content', getContent);

            function handleExtension(data){
                extID = data;
                sockets[extID] = socket;
                ioUser[extID] = {};

                app.mongo.searchForExtensionByID(extID, function(err, results){
                    console.log('searchForExtensionByID');
                    socket.emit('user', results);
                });
            }

            function getContent(data){
                var u = ioUser[extID];

                app.api.fb.pullContent(u, function(err, results){
                    socket.emit('content', {err: err, results: results});
                });
            }

        });

    }

    this.sendAuthUpdate = function(extID, results){
        var socket = sockets[extID];
        ioUser[extID] = results;
        socket.emit('auth_status', results);
    }

}
