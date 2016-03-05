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
							console.log('user update', err);
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
		console.log('user check', uid);
		app.db.getUserByID(uid, function(err, results){
			// if error
			if(err != null && results.length == 0)
				return next();
			
			req.poxUser = results[0];
			req.poxUser.id = req.poxUser.user_id;
			req.poxUser.details = JSON.parse(req.poxUser.details);
			if(req.poxUser.user_images){
				req.poxUser.user_images = req.poxUser.images = JSON.parse(req.poxUser.user_images);
				req.poxUser.smallImage = app.user.getImage(req.poxUser.user_images.small.fileName);
			}
				
			req.poxUser.isLoggedIn = true;
			req.poxUser.imageLocation = app.domain.image + '/user/';

			next();
		});
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
	
		fbRequest(u.details.id, "?fields=email,name,picture", u.details.accessToken, function(err, response){
			console.log(response);
			u.name = response.name;
			u.email = response.email;
			extend(u.details, response);
			
			newUserWork(u, function(){
				// gerren simulate passport work...
				req.session.passport.user = u.id;
				res.send({status: true, user: u})
			});
		});
		
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
	
	// callback page handler
	this.authCallback = function(req, res){
		res.redirect(app.domain.default);
		//res.send({status: true, user: req.poxUser});
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
		res.redirect(app.domain.default);
	}
	
	this.getImage = function(fileName){
		return urljoin(app.domain.image, 'user', fileName);
	}
		
	
}
