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
            socket.on('save_tag', saveTag);
            socket.on('save_tag_text', saveTagText);
            socket.on('save_tag_chain', saveTagChain);

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

                // set jade file path
                var menuPath = path.resolve(app.base, 'views/tag_menu.jade');
                console.log('menu path', menuPath);

                // set user image
                var miniImgSrc = path.resolve(app.base, "files/user", u.image_mini);

                // get user tags
                var tags = app.db.getUserChains(u.user_id, function(err, results){
                    var userObj = {imgSmall: imageToBase64(miniImgSrc)};
                    chainObj = sortChainOptions(results);
                    var menuHTML = jade.renderFile(menuPath, {user: userObj, chainTop: chainObj.top, chainList: chainObj.list});
                    socket.emit('menu', {err: null, menu: menuHTML});
                });

            }


            function saveTag(obj){
                var u = ioUser[extID];
                var s = sockets[extID];

                obj.id = returnRandID(15);
                obj.fid = returnRandID(15);
                app.db.addTagEntry(obj, function(err, results){
                    console.log(err, results);
                    s.emit('callback', {
                        success: (err == null),
                        callbackID: obj.callbackID,
                        action: 'saved_tag',
                        id: obj.id,
                        fid: obj.fid
                    });
                });
            }

            function saveTagText(obj){
                var u = ioUser[extID];
                var s = sockets[extID];

                app.db.saveTagText(obj, function(err, results){
                    console.log(err, results);
                    s.emit('callback', {success:(err == null), callbackID: obj.callbackID, action: 'saved_tag_text'});
                });
            }

            function saveTagChain(obj){
                var u = ioUser[extID];
                var s = sockets[extID];

                app.db.saveTagChain(obj.tagID, obj.chainID, function(err, results){
                    console.log(err, results);
                    s.emit('callback', {success:(err == null), callbackID: obj.callbackID, action: 'saved_tag_chain'});
                });
            }

            function saveNewChain(data){
                var u = ioUser[extID];
                var s = sockets[extID];
                var isDefault = false;

                app.db.saveNewChain(data.chainName, isDefault, function(err, result){
                    console.log('save chain error', err);
                    if(err) return s.emit('saved_chain', {success:false, err:err, callbackID: data.callbackID});

                    // add user chain ...
                    var chainID = result.rows[0].chain_id;
                    app.db.saveUserChain(u.user_id, chainID, function(err2, result2){
                        s.emit('callback', {success:true, chainID: chainID, callbackID: data.callbackID, action: 'saved_chain'});
                    });

                });
            }

            function sortChainOptions(chainArray){
            	var str = JSON.stringify(chainArray);
            	var topOptions = JSON.parse(str);
            	var listOptions = JSON.parse(str);

            	var defaultOption = null;

            	topOptions.sort(function(a,b){
            		if(a.is_default == true) return -1;
            		if(a.ccount == null) return 1;
            		if(a.ccount > b.cccount) return -1
            		else return 1;
            	});

                listOptions.sort(function(a,b){
            		if(a.is_default == true) return -1;
            		if(a.name < b.name) return -1
            		return 1;
            	});

                return {top: topOptions, list: listOptions};
            }

        });

    }

    this.sendAuthUpdate = function(extID, results){
        var socket = sockets[extID];
        ioUser[extID] = results;
        socket.emit('auth_status', results);
    }

    function imageToBase64(src){
        var data = fs.readFileSync(src).toString("base64");
        return util.format("data:%s;base64,%s", mime.lookup(src), data);
    }

    function returnRandID(len){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < len; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

}
