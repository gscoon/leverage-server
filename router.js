var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var expressSession  = require("express-session");
var SessionStore = require('express-mysql-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var logger = require('morgan');
var subdomain = require('express-subdomain');
var favicon = require('serve-favicon');

module.exports = function(express, expressapp){
	// handle image requests before sessions, and shit
	var imageRouter = express.Router();
	var share = require('./inc/share-handler.js');
	var imageCatch = '/:type([a-zA-Z]{1,20})/:id([a-zA-Z0-9-]{1,25})\.:ext([a-zA-Z]{3,4})';
	imageRouter.get(imageCatch, share.displayImage);
	expressapp.use(subdomain('image', imageRouter)); // image subdomain

	// handle requests with no subdomain domain name
	expressapp.use(function(req, res, next){
		var devHosts = ['localhost', 'dev'];
		if((devHosts.indexOf(req.hostname) == -1) && (req.subdomains.length == 0)){
			console.log('it is ralph tho')
			return res.redirect(301, req.protocol + '://www.' + req.hostname + req.originalUrl);
		}
		next();
	});

	// also favicons
	expressapp.use(favicon(__dirname + '/public/images/favicons/spot-32.png'));

	// handle facebook strategy
	passport.use(new FacebookStrategy({
		clientID: config.facebook.appID,
		clientSecret: config.facebook.secret,
		callbackURL: app.domain.login + '/callback'
	}, app.user.handleToken));

	var secret = 'pox-cookie';
    expressapp.set('port', app.port);
    expressapp.set('view engine', 'jade');

	expressapp.use(bodyParser.json());
    expressapp.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

	expressapp.use(express.static('public'));
    expressapp.use(logger('dev'));



    expressapp.use(cookieParser());
	expressapp.use(expressSession({
        secret: secret,
        store: new SessionStore(config.db),
        resave: false,
        saveUninitialized: true,
        cookie: {
			maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
			domain: '.' + app.domain.base
		}
    }));

	// used to determine whether this is a new session or not
	expressapp.use(function(req, res, next){
		// if this session is new,
		req.isFirstRequest = !(req.session.isExisting === true);
		req.session.isExisting = true;
		next();
	})

	expressapp.use(passport.initialize());
    expressapp.use(passport.session());

	// store some aspect of the user (id) in the session table
	// after the user logs in
    passport.serializeUser(app.user.serialize);

	// when a page is called, it finds the userid.
	// you have to use that to get the full user
    passport.deserializeUser(app.user.deserialize);

	// figure out user situation
	expressapp.use(app.user.userCheck);


	// It's routing time
	var mainRouter = express.Router();
	var shareRouter = express.Router();
	var loginRouter = express.Router();
	var feedRouter = express.Router();

	mainRouter.get('/', function(req, res){
		res.render('home', {user: req.poxUser, fbAppID: config.facebook.appID, domain: app.domain});
	})

	expressapp.post('/fbDetails', app.user.pullFacebookDetails);

	shareRouter.get('/:id([0-9a-zA-Z]{1,10}$)', share.displayView);

	// authentication
	loginRouter.get('/facebook', passport.authenticate('facebook', app.user.fbAuthOpts));
	mainRouter.get('/login/facebook', passport.authenticate('facebook', app.user.fbAuthOpts));
	loginRouter.get('/callback', passport.authenticate('facebook'), app.user.authCallback);
	loginRouter.get('/status', app.user.checkStatus);
	loginRouter.get('/login_menu', function(req,res){
		res.render('login_menu', {user: req.poxUser, fbAppID: config.facebook.appID, domain: app.domain, showLoginMenu: true})
	});

	loginRouter.get('/logout', app.user.logout);

	// handle process requests
	mainRouter.all('/share-process', share.processRequest);
	mainRouter.get('/webshot/:id([0-9a-zA-Z]{5,15})', share.showWebshot);
	mainRouter.get('/tag-menu', share.returnTagMenu);

	// feed
	var feedHandle = require('./inc/feed-handler.js');
    feedRouter.get('/', feedHandle.displayFeed);
    feedRouter.get('/test', feedHandle.test);

	// handle subdomains
	expressapp.use(subdomain('share', shareRouter)); // share subdomain
	expressapp.use(subdomain('login', loginRouter)); // image subdomain
	expressapp.use(subdomain('www', mainRouter));
	expressapp.use(subdomain('feed', feedRouter));


	// catch everything else
	expressapp.get('*', function(req, res) {
		//redirect to www if no subdomain
		if(req.headers.host == app.domain.base)
			return res.redirect(301, app.domain.default + req.originalUrl);

		// keeeeeeeys
		// if session was created for this request, destroy it
		if(req.isFirstRequest)
			req.session.destroy();
		return res.status(404).send('bad URL');
	});
}
