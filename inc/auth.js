var FacebookStrategy = require('passport-facebook').Strategy;  //auth
var passport = require('passport');


var authClass = function(){
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

		app.db.addUser(u, function(err, results){
			console.log('add', err, results);
			if(err != null)
				return done(err);
			
			u.id = results.insertId;
			done(null, u);
		});
		
    }
	
	// store some aspect of the user (id) in the session table
	// after the user logs in
	this.serialize = function(user, done){
		console.log('serialize user', user.id);
		done(null, user.id);
	}
	
	// when a page is called, it finds the userid.
	// you have to use that to get the full user
	this.deserialize = function(uid, done) {
		console.log('deserialize user', uid);
        app.db.getUserByID(uid, function(err, results){
			if(err == null && results.length == 1)
				return done(null, results[0]);
            
			done(true); // there was a problem
        });
    }
	
	// is this person logged in
	this.userCheck = function(req, res, next){
		
		req.poxUser = {isLoggedIn: false}
		if(!('session' in req) || typeof req.session != 'object' || !('passport' in req.session))
			return next();
		
		var uid = req.session.passport.user;
		app.db.getUserByID(uid, function(err, results){
			// if error
			if(err != null && results.length == 0)
				return next();
			
			req.poxUser = results[0];
			req.poxUser.details = JSON.parse(req.poxUser.details);
			req.poxUser.isLoggedIn = true;
			next();
		});
	}
		
	
	// callback page handler
	this.authCallback = function(req, res){
		res.redirect('http://' + app.domain.sub + '.' + app.domain.base + '/test')
	}
	
	this.test = function(req, res){
		if(typeof req.user != 'object' || !req.user.isLoggedIn){
			//req.session = {w:"work"};
			return res.send(['nada',req.session]);
		}
			
		
		var u = req.user;
		console.log(u);
		var d = JSON.parse(u.details);
		var graph = require('fbgraph');
		graph.setAccessToken(d.accessToken);
		console.log(u.facebook_id);
		graph.get(u.facebook_id + "/picture?type=normal", function(err, fbRes) {
		  res.send(fbRes);
		});
	}
	
	
	
}

module.exports = new authClass();
