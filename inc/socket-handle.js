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
            var conn = {extID: null, waitingFuncs: [], searchAttempt: 0};

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
            socket.on('get_feed', socketListener.bind(getFeed));

            function handleExtension(data){
                conn.extID = data.extID;
                sockets[conn.extID] = socket;
                users[conn.extID] = {};

                app.db.searchForExtensionByID(conn.extID, function(err, results){
                    var ret = {success:false, user:null};
                    if(results.length == 0)
                        return socket.emit('user', ret);

                    ret.success = true;
                    ret.user = results[0];
                    ret.user.images = returnUserImages(ret.user.user_image);

                    users[conn.extID] = ret.user;
                    app.db.getUserChains(ret.user.user_id, function(err, chains){
                        // change the array index from 0,1,... to the chain id
                        ret.user.chains = setArrayIndex(chains, 'chain_id');
                        socket.emit('user', ret);
                    });
                    console.log('connection variables set up');
                    if(conn.waitingFuncs.length > 0){
                        conn.waitingFuncs.forEach(function(f, i){
                            if(f != null){
                                f();
                                conn.waitingFuncs[i] = null;
                            }
                        });
                    }
                });
            }

            function socketListener(data){
                var func = this;

                if(conn.extID == null){ //conn.searchAttempt <= 5
                    // restablish variables since server was restarted or whatever
                    console.log('reconnection, extID: ', data.extID);
                    conn.searchAttempt++;
                    conn.waitingFuncs.push(socketListener.bind(func, data));
                    return handleExtension(data);
                }
                console.log('socket listener', 'extID: ', data.extID);

                var me = {ext: conn.extID, u: users[conn.extID], s: sockets[conn.extID]}

                func(data, me);
            }

        });
    }

    function sendPulseMenu(reqObj, conn){
        console.log('sendPulseMenu');
        // set jade file path
        var menuPath = path.resolve(app.base, 'views/tag_menu.jade');

        // set user image
        var userImages = returnUserImages(conn.u.user_image);

        // get user tags
        var tags = app.db.getUserChains(conn.u.user_id, function(err, results){
            chainObj = sortChainOptions(results);
            var menuHTML = jade.renderFile(menuPath, {chainTop: chainObj.top, chainList: chainObj.list});
            conn.s.emit('menu', {succces: (err == null), menu: menuHTML});
        });
    }

    function getFeed(reqObj, conn){
        var feedPath = path.resolve(app.base, 'views/feed_content.jade');
        // set user image
        var userImages = returnUserImages(conn.u.user_image);
        app.db.getUserTags({uid: conn.u.user_id, limit: 15}, function(err, tags){
            // format the url
            var r = /:\/\/(.[^/]+)/;
            tags.forEach(function(tag, i){
                var fURL = tag.url.match(r)[1];
                if(fURL.indexOf('www.')== 0) fURL = fURL.substr(4);
                tag.formattedURL = fURL;
            })

            var feedHTML = jade.renderFile(feedPath, {tags: tags});
            conn.s.emit('callback', {success: true, action: 'feed', feed: feedHTML, callbackID: reqObj.callbackID});
        });
    }

    function saveTag(reqObj, conn){
        reqObj.id = returnRandID(15); // tag ID
        reqObj.fid = returnRandID(15); // file ID
        reqObj.uid = conn.u.user_id;
        reqObj.cid = conn.u.default_chain_id;

        app.db.saveTag(reqObj, function(err, result){
            console.log('addTagEntry', err);
            conn.s.emit('callback', {
                success: (err == null),
                callbackID: reqObj.callbackID,
                action: 'saved_tag',
                id: reqObj.id,
                fid: reqObj.fid,
                result: result.rows
            });
        });
    }

    function getPageTags(reqObj, conn){
        console.log('getPageTags');
        app.db.getPageTags(conn.u.user_id, reqObj.url, function(err, results){
            console.log(err);
            conn.s.emit('callback', {
                success: (err == null),
                callbackID: reqObj.callbackID,
                action: 'page_tags',
                results: results
            });
        });
    }

    // discussion contente
    function getTagContent(reqObj, conn){
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
            conn.s.emit('callback', retObj)
        });
    }

    // discussion comment
    function saveTagComment(req, conn){
        var ret = {success:false, callbackID: req.callbackID, action: 'save_tag_comment'};
        req.id = ret.id = returnRandID(15); // tag ID
        req.user_id = conn.u.user_id; // reset user id
        app.db.saveTagComment(req, function(err, result){
            console.log('saveTagComment', result);
            ret.success = (err == null);
            conn.s.emit('callback', ret);
        });
    }

    function undoTag(reqObj, conn){
        reqObj.uid = conn.u.user_id;
        app.db.deleteTag(reqObj, function(err, result){
            console.log('undoTag', err);
            conn.s.emit('callback', {
                success: (err == null),
                callbackID: reqObj.callbackID,
                id: reqObj.id
            });
        })
    }

    function deleteTag(req, conn){
        req.success = false;
        req.uid = conn.u.user_id;
        req.action = 'delete_discussion_tag';
        app.db.deleteTag(req, function(err, result){
            req.success = (err == null);
            console.log('deleteTag', err, req);
            conn.s.emit('callback', req);
        });
    }

    function saveTagText(reqObj, conn){
        app.db.saveTagText(reqObj, function(err, result){
            console.log('saveTagText', err, reqObj);
            conn.s.emit('callback', {success:(err == null), callbackID: reqObj.callbackID, action: 'saved_tag_text'});
        });
    }

    function saveTagChain(reqObj, conn){
        app.db.updateTagChain(reqObj.tagID, reqObj.chainID, function(err, result){
            console.log('saveTagChain', err);
            conn.s.emit('callback', {success:(err == null), callbackID: reqObj.callbackID, action: 'saved_tag_chain'});

            // sned a new chain
            sendPulseMenu(null, conn);
        });
    }

    function saveNewChain(data, conn){
        var isDefault = false;
        var retObj = {callbackID: data.callbackID, action: 'saved_chain', success:true};

        app.db.saveNewChain(data.chainName, isDefault, function(err, result){
            console.log('save chain error', err);
            if(err) return emitError(conn.s, retObj, "DB error 1");

            // add user chain ...
            var chain = result.rows[0].chain_id;
            app.db.saveUserChain(conn.u.user_id, chain.chain_id, function(err2, result2){
                if(err2) return emitError(conn.s, retObj, "DB error 2");
                retObj.chain = chain;
                conn.s.emit('callback', retObj);
            });
        });
    }

    function deleteChain(data, conn){
        console.log('delete chain', data);
        var retObj = {action: 'deleted_chain', callbackID: data.callbackID, success:true, chainID: data.chainID};
        if(data.chainID == conn.u.default_chain_id)
            return emitError(conn.s, retObj, 'Default chain can\'t be deleted');

        app.db.deleteChain(data.chainID, function(err, result){
            console.log(err);
            if(err) return emitError(conn.s, retObj, "DB error");
            conn.s.emit('callback', retObj);
        });
    }

    function saveTagImage(data, conn){
        console.log('saveTagImage', data.imageType);

        // make sure it's one of these allowed types
        var allowed = ['target', 'generic', 'meme', 'favicon'];
        if(allowed.indexOf(data.imageType) == -1)
            return console.log('bad image type');

        // figure out the correct extension
        var ext = 'png';
        var imageTypeRegularExpression = /\/(.*?)$/;
        var matches = data.dataURL.match(imageTypeRegularExpression);
        if (matches.length == 3) ext = matches[1];

        // file name and path...
        var fileName = returnRandID(12) + '.' + ext;
        var savePath = path.resolve(__dirname, '../files', data.imageType, fileName);
        var imageBuffer = decodeBase64Image(data.dataURL);

        // save the file
        fs.writeFile(savePath, imageBuffer.data, function(err) {
            // if file saved successfully
            if(!err){
                // update database entry with file name
                var saveObj = {table: 'tag', setField: 'image_' + data.imageType, setValue: fileName, whereField: 'tag_id', whereValue: data.tagID};

                app.db.updateSingleFieled(saveObj, function(err, result){
                    data.success = true;
                    data.fileName = fileName;
                    data.action = 'save_image';
                });

            }

            console.log('image_saved', err, app.moment().format("YYYY-MM-DD HH:mm:ss"));
        });
    }

    function emitError(s, o, m){
        o.success = false;
        o.message = m;
        conn.s.emit('callback', o);
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
