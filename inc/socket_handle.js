var async = require('async');
var jade = require('jade');
var path = require('path');
var fs = require('fs');
var mime = require("mime");
var util = require("util");

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
                extID = data.extID;
                sockets[extID] = socket;
                ioUser[extID] = {};

                app.db.searchForExtensionByID(extID, function(err, results){
                    var u = results[0];
                    console.log('searchForExtensionByID', u);
                    ioUser[extID] = u;
                    socket.emit('user', u);
                });
            }

            function getContent(data){
                var u = ioUser[extID];
                app.api.fb.pullContent(u, function(err, results){
                    socket.emit('content', {err: err, results: results});
                });
            }

            function getPulseMenu(data){
                var u = ioUser[extID] ;
                var menuPath = path.resolve(app.base, 'views/tag_menu.jade');
                console.log('menu path', menuPath);
                var miniImgSrc = path.resolve(app.base, "files/user", u.image_mini);
                var menuHTML = jade.renderFile(menuPath, {user:{imgSmall: imageToBase64(miniImgSrc)}});
                socket.emit('menu', {err: null, menu: menuHTML});
            }

            function saveNewChain(data){
                var extID = data.extID;
                var uid = ioUser[extID].id;
                var s = sockets[extID];

                app.db.saveNewChain(data.chainName, function(err, result){
                    console.log('save chain error', err);
                    if(err)
                        return s.emit('saved_chain', {success:false, err:err, callbackID: data.callbackID});
                    // add user chain ...
                    var chainID = result.rows[0].chain_id;
                    app.db.saveUserChain(uid, chainID, function(){
                        s.emit('callback', {success:true, chainID: chainID, callbackID: data.callbackID, action: 'saved_chain'});
                    });

                });
            }

            function imageToBase64(src){
                var data = fs.readFileSync(src).toString("base64");
                return util.format("data:%s;base64,%s", mime.lookup(src), data);
            }

        });

    }

    this.sendAuthUpdate = function(extID, results){
        var socket = sockets[extID];
        ioUser[extID] = results;
        socket.emit('auth_status', results);
    }

}
