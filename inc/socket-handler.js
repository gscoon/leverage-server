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
			
			// actually in use
			socket.on('extension_check', handleExtension);
			socket.on('update_extension_user', socketListener.bind(updateExtensionUser));
			socket.on('get_page_tags', socketListener.bind(getPageTags));

			// after connection established, the extension sends a checked
			// the check is supposed to get extension-user details
			function handleExtension(data){
				conn.extID = data.extID;
				sockets[conn.extID] = socket;
				users[conn.extID] = {};

				app.db.getUserByExtension(conn.extID, function(err, results){
					var ret = {success:false, user:null, domain: app.domain};
					
					// if there was a db error
					if(err) return socket.emit('user', ret);

					ret.success = true;

					// if extension is not stored with this ID 
					if(results.length == 0){
						return app.db.addNewExtension(conn.extID, function(err2, results2){
							socket.emit('extension_check', ret);
						});
					}
					
					// a user is associated with the plugin. send it bg.js
					ret.user = results[0];

					// if a user ID is pulled
					if(ret.user.user_id)
						app.user.enrichUser(ret.user);
					socket.emit('extension_check', ret);

					// store user data in memory...
					users[conn.extID] = ret.user;

					console.log('Socket connection, ext: ' + conn.extID);

				});
			}

			function socketListener(data){
				var func = this;

				console.log('socket listener', 'extID: ', data.extID);

				var me = {ext: conn.extID, u: users[conn.extID], s: sockets[conn.extID]}
				func(data, me);
			}

		});
	}

	this.socketExists = function(eid){
		return (eid in sockets);
	}

	var sendMessage = this.sendMessage = function(extID, message, data){
		if(!(extID in sockets))
			return;

		var s = sockets[extID];
		s.emit(message, data);
	}

	// not being used because database call is done directly from user script
	var updateExtensionUser = this.updateExtensionUser = function(req, conn){
		var uid = req.user_id;
		app.db.updateExtensionUser(conn.ext, uid, function(err, response){
			console.log('user update response', response);
			//conn.s.emit('callback', {
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


	function emitError(s, o, m){
		o.success = false;
		o.message = m;
		conn.s.emit('callback', o);
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

	function setArrayIndex(arr, index){
		var newArray = {};
		arr.forEach(function(a){
			newArray[a[index]] = a;
		});
		return newArray;
	}

}
