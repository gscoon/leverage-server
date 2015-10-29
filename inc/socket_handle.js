var async = require('async');
var jade = require('jade');
var path = require('path');
var fs = require('fs');
var mime = require("mime");
var util = require("util");

module.exports = new function(){
    var io = null;
    var sockets = {};
    var users = {};

    this.start = function(_io){
        io = _io;

        io.on('connection', function (socket) {
            var extID = null;

            socket.on('extension_check', handleExtension);
            socket.on('get_pulse_menu', socketListener.bind(sendPulseMenu));
            socket.on('save_new_chain', socketListener.bind(saveNewChain));
            socket.on('save_tag', socketListener.bind(saveTag));
            socket.on('undo_tag', socketListener.bind(undoTag));
            socket.on('save_tag_text', socketListener.bind(saveTagText));
            socket.on('save_tag_chain', socketListener.bind(saveTagChain));
            socket.on('delete_chain', socketListener.bind(deleteChain));
            socket.on('get_page_tags', socketListener.bind(getPageTags));
            socket.on('get_tag_content', socketListener.bind(getTagContent));
            socket.on('save_tag_comment', socketListener.bind(saveTagComment));
            socket.on('delete_discussion_tag', socketListener.bind(deleteTag));
            socket.on('save_image', socketListener.bind(saveTagImage));

            function socketListener(data){
                var func = this;
                func(data, extID);
            }

            function handleExtension(data){
                extID = data.extID;
                sockets[extID] = socket;
                users[extID] = {};

                app.db.searchForExtensionByID(extID, function(err, results){
                    var ret = {success:false, user:null};
                    if(results.length == 0)
                        return socket.emit('user', ret);

                    ret.success = true;
                    ret.user = results[0];
                    ret.user.images = returnUserImages(ret.user.user_image);

                    users[extID] = ret.user;
                    app.db.getUserChains(ret.user.user_id, function(err, chains){
                        // change the array index from 0,1,... to the chain id
                        ret.user.chains = setArrayIndex(chains, 'chain_id');
                        socket.emit('user', ret);
                    });
                    console.log('handleExtension');
                });
            }
        });
    }

    function sendPulseMenu(reqObj, extID){
        console.log('sendPulseMenu');
        var u = users[extID];
        var s = sockets[extID];
        // set jade file path
        var menuPath = path.resolve(app.base, 'views/tag_menu.jade');

        // set user image
        var userImages = returnUserImages(u.user_image);

        // get user tags
        var tags = app.db.getUserChains(u.user_id, function(err, results){
            chainObj = sortChainOptions(results);
            var menuHTML = jade.renderFile(menuPath, {chainTop: chainObj.top, chainList: chainObj.list});
            s.emit('menu', {succces: (err == null), menu: menuHTML});
        });

    }

    function saveTag(reqObj, extID){
        var u = users[extID];
        var s = sockets[extID];

        reqObj.id = returnRandID(15); // tag ID
        reqObj.fid = returnRandID(15); // file ID
        reqObj.uid = u.user_id;
        reqObj.cid = u.default_chain_id;

        app.db.saveTag(reqObj, function(err, result){
            console.log('addTagEntry', err);
            s.emit('callback', {
                success: (err == null),
                callbackID: reqObj.callbackID,
                action: 'saved_tag',
                id: reqObj.id,
                fid: reqObj.fid,
                result: result.rows
            });
        });
    }

    function getPageTags(reqObj, extID){
        var u = users[extID];
        var s = sockets[extID];
        console.log('getPageTags');
        app.db.getPageTags(u.user_id, reqObj.url, function(err, results){
            console.log(err);
            s.emit('callback', {
                success: (err == null),
                callbackID: reqObj.callbackID,
                action: 'page_tags',
                results: results
            });
        });
    }

    // discussion contente
    function getTagContent(reqObj, extID){
        var u = users[extID];
        var s = sockets[extID];

        var retObj = {success:false, callbackID: reqObj.callbackID, action: 'tag_content'};

        async.waterfall([
            function(cb){
                // get tag details
                app.db.getTagDetails(reqObj.tagID, cb);
            },
            function(r1, cb){
                if(r1.length != 1) cb(true); // error
                retObj.detail = r1[0];
                // get tag comments
                app.db.getTagComments(reqObj.tagID, cb);
            },
            function(r2, cb){
                retObj.comments = r2;
                cb(null); // finish with no errors
            }
        ], function(err, res){
            retObj.success = (err == null);
            s.emit('callback', retObj)
        });
    }

    // discussion comment
    function saveTagComment(req, extID){
        var u = users[extID];
        var s = sockets[extID];
        var ret = {success:false, callbackID: req.callbackID, action: 'save_tag_comment'};
        req.id = ret.id = returnRandID(15); // tag ID
        req.user_id = u.user_id; // reset user id
        app.db.saveTagComment(req, function(err, result){
            console.log('saveTagComment', result);
            ret.success = (err == null);
            s.emit('callback', ret);
        });
    }

    function undoTag(reqObj, extID){
        var u = users[extID];
        var s = sockets[extID];

        reqObj.uid = u.user_id;
        app.db.deleteTag(reqObj, function(err, result){
            console.log('undoTag', err);
            s.emit('callback', {
                success: (err == null),
                callbackID: reqObj.callbackID,
                id: reqObj.id
            });
        })
    }

    function deleteTag(req, extID){
        var u = users[extID];
        var s = sockets[extID];
        req.success = false;
        req.uid = u.user_id;
        req.action = 'delete_discussion_tag';
        app.db.deleteTag(req, function(err, result){
            req.success = (err == null);
            console.log('deleteTag', err, req);
            s.emit('callback', req);
        });
    }

    function saveTagText(reqObj, extID){
        var u = users[extID];
        var s = sockets[extID];

        app.db.saveTagText(reqObj, function(err, result){
            console.log('saveTagText', err, reqObj);
            s.emit('callback', {success:(err == null), callbackID: reqObj.callbackID, action: 'saved_tag_text'});
        });
    }

    function saveTagChain(reqObj, extID){
        var u = users[extID];
        var s = sockets[extID];

        app.db.updateTagChain(reqObj.tagID, reqObj.chainID, function(err, result){
            console.log('saveTagChain', err);
            s.emit('callback', {success:(err == null), callbackID: reqObj.callbackID, action: 'saved_tag_chain'});

            // sned a new chain
            sendPulseMenu(null, extID);
        });
    }

    function saveNewChain(data, extID){
        var u = users[extID];
        var s = sockets[extID];
        var isDefault = false;
        var retObj = {callbackID: data.callbackID, action: 'saved_chain', success:true};

        app.db.saveNewChain(data.chainName, isDefault, function(err, result){
            console.log('save chain error', err);
            if(err) return emitError(s, retObj, "DB error 1");

            // add user chain ...
            var chain = result.rows[0].chain_id;
            app.db.saveUserChain(u.user_id, chain.chain_id, function(err2, result2){
                if(err2) return emitError(s, retObj, "DB error 2");
                retObj.chain = chain;
                s.emit('callback', retObj);
            });
        });
    }

    function deleteChain(data, extID){
        var u = users[extID];
        var s = sockets[extID];
        console.log('delete chain', data);
        var retObj = {action: 'deleted_chain', callbackID: data.callbackID, success:true, chainID: data.chainID};
        if(data.chainID == u.default_chain_id)
            return emitError(s, retObj, 'Default chain can\'t be deleted');

        app.db.deleteChain(data.chainID, function(err, result){
            console.log(err);
            if(err) return emitError(s, retObj, "DB error");
            s.emit('callback', retObj);
        });
    }

    function saveTagImage(data, extID){
        var u = users[extID];
        var s = sockets[extID];

        if(data.imageType != 'target' && data.imageType != 'generic' && data.imageType != 'meme')
            return console.log('bad image type');

        var fileName = data.fileID + '.' + data.ext;
        var savePath = path.resolve(__dirname, '../files', data.imageType, fileName);
        var imageBuffer = decodeBase64Image(data.dataURL);

        fs.writeFile(savePath, imageBuffer.data, function(err) {
            console.log('image_saved', err, app.moment().format("YYYY-MM-DD HH:mm:ss"));
        });
    }

    function emitError(s, o, m){
        o.success = false;
        o.message = m;
        s.emit('callback', o);
    }

    this.sendAuthUpdate = function(extID, results){
        var socket = sockets[extID];
        users[extID] = results;
        socket.emit('auth_status', results);
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

    function imageToBase64(src){
        var data = fs.readFileSync(src).toString("base64");
        return util.format("data:%s;base64,%s", mime.lookup(src), data);
    }

    function decodeBase64Image(dataString) {
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

        if(matches.length !== 3)
            return new Error('Invalid input string');


        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');

        return response;
    }

    function returnRandID(len){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < len; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function returnUserImages(ui){
        var miniImgSrc = path.resolve(app.base, "files/user/small/", ui.small);
        var largeImgSrc = path.resolve(app.base, "files/user/large/", ui.large);
        return {small: imageToBase64(miniImgSrc), large: imageToBase64(largeImgSrc)};
    }

    function setArrayIndex(arr, index){
        var newArray = {};
        arr.forEach(function(a){
            newArray[a[index]] = a;
        });
        return newArray;
    }

}
