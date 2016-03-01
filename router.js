var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var expressSession  = require("express-session");
var SessionStore = require('express-mysql-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var logger = require('morgan');
var subdomain = require('express-subdomain');


module.exports = function(express, expressapp){
	var auth = require('./inc/auth.js');
	// handle facebook strategy
	passport.use(new FacebookStrategy({
		clientID: config.facebook.appID,
		clientSecret: config.facebook.secret,
		callbackURL: app.domain.default + '/callback'
	}, auth.handleToken));
	
	
    expressapp.set('port', app.port);
    expressapp.set('view engine', 'jade');
    expressapp.use(logger('dev'));
    expressapp.use(express.static('public'));
    expressapp.use(cookieParser());
    expressapp.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
	expressapp.use(passport.initialize());
    expressapp.use(passport.session());   
	
	expressapp.use(expressSession({
        secret: 'pox-cookie',
        store: new SessionStore(config.db),
        resave: true,
        saveUninitialized: true,
        cookie: { 
			maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
			domain: "." + app.domain.base
		}
    }));	

	
	
	
	
	// store some aspect of the user (id) in the session table
	// after the user logs in
    passport.serializeUser(auth.serialize);
	
	// when a page is called, it finds the userid.
	// you have to use that to get the full user
    passport.deserializeUser(auth.deserialize);
	
	// figure out user situation
	expressapp.use(auth.userCheck);
	
	var mainRouter = express.Router();
	var shareRouter = express.Router();
	var imageRouter = express.Router();
	var loginRouter = express.Router();
	
	mainRouter.get('/', function(req, res){
		res.render('home', {user: req.poxUser, fbAppID: config.facebook.appID});
	})
	
	var share = require('./inc/share-handler.js');
	shareRouter.get('/:id([0-9a-zA-Z]{1,10}$)', share.displayView);
	
	// authentication
	loginRouter.get('/facebook', passport.authenticate('facebook', auth.fbAuthOpts));
	loginRouter.get('/callback', passport.authenticate('facebook'), auth.authCallback);
	
	// handle image requests
	var imageCatch = '/:type([a-zA-Z]{1,20})/:id([a-zA-Z0-9]{1,25})\.:ext([a-zA-Z]{3,4})';
	imageRouter.get(imageCatch, share.displayImage);
	mainRouter.get('/images'+imageCatch, share.displayImage)
	
	// handle process requests
	mainRouter.all('/share-process', share.processRequest);
	mainRouter.get('/webshot/:id([0-9a-zA-Z]{5,15})', share.showWebshot);
	mainRouter.get('/tag-menu', function(req, res){
		res.render('tag_menu');
	});
	
	expressapp.use(subdomain('share', shareRouter)); // share subdomain
	expressapp.use(subdomain('image', imageRouter)); // image subdomain
	expressapp.use(subdomain('login', loginRouter)); // image subdomain
	expressapp.use(subdomain('www', mainRouter));
	
	//redirect to www if no subdomain
	expressapp.get('*', function(req, res) {
		if(req.headers.host == app.domain.base)
			return res.redirect('http://' + app.domain.sub + '.' + app.domain.base, 301);
		res.statusCode = 404;
		return res.end('bad URL');
	});
	
	// --------------------
    

    // expressapp.get('/disc', function(req, res, next){
        // res.render('discussion', { title: 'Dre Day'});
    // });

    // expressapp.get('/test', function(req, res, next){
        // res.render('test', { title: 'Dre Day'});
    // });

    // var feedHandle = require('./inc/feed-handler.js')(expressapp);
    // expressapp.get('/feed', feedHandle.displayFeed);
    // expressapp.get('/files/:fileType/:fileName([a-zA-Z0-9\/\.]+)', feedHandle.handleFileImages);
}
