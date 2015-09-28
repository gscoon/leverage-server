var async = require('async');
var jade = require('jade');
var path = require('path');

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
            socket.on('get_pulse_menu', getPulseMenu);
            socket.on('save_new_chain', saveNewChain);

            function handleExtension(data){
                extID = data;
                sockets[extID] = socket;
                ioUser[extID] = {};


                ioUser[extID].id = 1; // GERREN, DELETE THIS

                app.db.searchForExtensionByID(extID, function(err, results){
                    console.log('searchForExtensionByID');
                    ioUser[extID] = results;
                    socket.emit('user', results);
                });
            }

            function getContent(data){
                var u = ioUser[extID];

                app.api.fb.pullContent(u, function(err, results){
                    socket.emit('content', {err: err, results: results});
                });
            }

            function getPulseMenu(data){
                //ioUser[extID] = results;
                var menuPath = path.resolve(app.base, 'views/tag_menu.jade');
                console.log('menu path', menuPath);
                var menuHTML = jade.renderFile(menuPath, {user:{imgSmall:''}});
                socket.emit('menu', {err: null, menu: menuHTML});
            }

            function saveNewChain(data){
                var extID = data.extID;
                var uid = ioUser[extID].id;
                var s = sockets[extID];

                app.db.saveNewChain(data.chainName, function(err, result){
                    console.log(result.rows);
                    // add user chain ...
                    var chainID = result.rows[0].id;
                    app.db.saveUserChain(uid, chainID, function(){
                        s.emit('saved_chain', true);
                    });

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
