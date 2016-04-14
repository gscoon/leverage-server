var FacebookStrategy = require('passport-facebook').Strategy;  //auth
var passport = require('passport');
var request = require('request');
var fs = require('fs');
var path = require('path');
var async = require('async');
var url = require('url');

module.exports = new userClass();

function userClass(){
	this.fbAuthOpts = {scope:['public_profile', 'user_friends', 'email']};
	//user_posts, user_likes, 'user_birthday', 'user_education_history', 'user_location'

    this.handleToken = function(accessToken, refreshToken, profile, done) {
        var u = {
			fbid: profile.id,
			name: profile.displayName,
			email: profile.email,
			details: profile
		}

		u.details.accessToken = accessToken;
		u.details.refreshToken = refreshToken;
		newUserWork(u, done);
    }

	function newUserWork(u, callback){
		app.db.addUser(u, function(err, results){
			//console.log('add', err, results);
			if(err != null)
				return done(err);

			u.id = results.insertId;
			// save large and small images

			var imageCount = 0;
			var images = ['small', 'large'];
			u.images = {};
			images.forEach(function(s){
				saveFBImage(u.details.id, u.id, s, u.details.accessToken, function(imageObj){
					u.images[s] = imageObj;
					imageCount++;
					if(imageCount == images.length){
						app.db.updateUserField(u.id, 'user_images', u.images, function(err, results){
							//console.log('user update', err);
						});
						callback(null, u);
					}
				});
			})

		});

	}

	// is this person logged in
	this.userCheck = function(req, res, next){

		req.poxUser = {isLoggedIn: false};
		if(!('session' in req) || typeof req.session != 'object' || !('passport' in req.session) || !req.session.passport.user)
			return next();



		var uid = req.session.passport.user;
		log('user check uid:', uid);
		app.db.getUserByID(uid, function(err, results){
			// if error
			if(err != null && results.length == 0)
				return next();

			req.poxUser = results[0];
			enrichUser(req.poxUser);

			if(req.session.extensionID){
				var ext = req.session.extensionID;
				console.log('session ext: ', req.session.extensionID);
				app.io.sendMessage(ext, "user_update", req.poxUser)
				req.session.extensionID = null;
				app.db.updateExtensionUser(ext, req.poxUser.id, function(){})
			}


			next();
		});

	}

	var enrichUser = this.enrichUser = function(u){
		u.id = u.user_id;
		u.details = JSON.parse(u.details);
		if(u.user_images){
			u.user_images = u.images = JSON.parse(u.user_images);
			u.smallImage = app.user.getImage(u.user_images.small.fileName);
		}

		u.isLoggedIn = true;
		u.imageLocation = app.domain.image + '/user/';
	}

	// callback page handler
	this.authCallback = function(req, res){

		res.redirect(app.domain.default);
		//res.send({status: true, user: req.poxUser});
	}

	this.checkStatus = function(req, res){
		console.log('check status', req.query.extID);

		// if extension ID is passed, add it to session
		// its used later to associate user with extension
		var re = /^([a-zA-Z0-9]{5,20})$/
		console.log('match?', req.query.extID, re.test(req.query.extID));
		if(req.query.extID && re.test(req.query.extID)){
			var eid = req.query.extID;
			if(!app.io.socketExists(eid)) return;

			// set session
			req.session.extensionID = eid;
			console.log('user associated', eid, req.poxUser.id);
			app.db.updateExtensionUser(eid, req.poxUser.id, function(){})
		}
		res.send(req.poxUser);
	}

	// called from browser. simulate log in
	this.pullFacebookDetails = function(req, res){
		if(!('id' in req.body) || !('token' in req.body))
			return res({status: false, m: "missing variables"});

		var u = {
			details:{id: req.body.id, accessToken: req.body.token},
			fbid: req.body.id,
			imageLocation: app.domain.image + '/user/'
		}

		fbRequest(u.details.id, "?fields=email,name,picture", u.details.accessToken,
			function(err, response){
				if(!response)
					return console.log('fb request error');

				console.log(response);
				u.name = response.name;
				u.email = response.email;
				extend(u.details, response);

				newUserWork(u, function(){
					// gerren simulate passport work...
					req.session.passport = {
						user: u.id
					}
					res.send({status: true, user: u})
				});
			}
		);

	}

	function saveFBImage(fbID, uID, imageSize, accessToken, callback){
		fbRequest(fbID, "/picture?type=" + imageSize, accessToken, function(err, fbRes){
			if(fbRes.image){
				fbRes.fileName = uID + '-' + imageSize + '.jpg';
				var destination = fs.createWriteStream('./files/user/' + fbRes.fileName);
				request(fbRes.location).pipe(destination);
			}
			callback(fbRes);
		})
	}

	function fbRequest(fbID, path1, token, callback){
		var graph = require('fbgraph');
		graph.setAccessToken(token);
		graph.get(fbID + path1, callback);
	}

	// store some aspect of the user (id) in the session table
	// after the user logs in
	this.serialize = function(user, done){
		//console.log('serialize user', user.id);
		done(null, user.id);
	}

	// when a page is called, it finds the userid.
	// you have to use that to get the full user
	this.deserialize = function(uid, done) {
		//console.log('deserialize user id: ', uid);
        app.db.getUserByID(uid, function(err, results){
			if(err == null && results.length == 1)
				return done(null, results[0]);

			done(true); // there was a problem
        });
    }


	this.logout = function(req, res){
		req.logout();
		req.session.destroy();
		res.redirect(app.domain.default);
	}

	this.getImage = function(fileName){
		return urljoin(app.domain.image, 'user', fileName);
	}


}
