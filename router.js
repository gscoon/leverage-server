var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var expressSession  = require("express-session");
var SessionStore = require('express-mysql-session');
var passport = require('passport');
var logger = require('morgan');
var subdomain = require('express-subdomain');

module.exports = function(express, expressapp){
    expressapp.set('port', app.port);
    expressapp.set('view engine', 'jade');
    expressapp.use(logger('dev'));
    expressapp.use(express.static('public'));
    expressapp.use(cookieParser());
    expressapp.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
	

    expressapp.use(expressSession({
        secret: 'pox-cookie',
        store: new SessionStore(config.db),
        resave: true,
        saveUninitialized: true,
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
    }));

    expressapp.use(passport.initialize());
    expressapp.use(passport.session());

    // save session variable to app object
    expressapp.use('/auth+', function (q,r,n) {
        // wait for session to set strategies
        console.log('auth strat middleware');
        app.api.goog.setStrategy(passport);
        app.api.fb.setStrategy.apply(app.api.fb, [passport, q.session])
        n();
    });

    passport.serializeUser(function(user, done) {
        console.log('serializeUser');
        done(null, user._id);
    });

    passport.deserializeUser(function(uid, done) {
        console.log('deserializeUser');
        app.db.getUserByID(uid, function(err, user){
            // console.log(err, user);
             done(null, user);
        });
    });
	
	var shareRouter = express.Router();
	var mainRouter = express.Router();
	var imageRouter = express.Router();
	
	mainRouter.get('/', function(req, res){
		res.render('home');
	})
	
	var share = require('./inc/share-handler.js');
	shareRouter.get('/:id([0-9a-zA-Z]{1,10})', share.displayView)
	
	// handle image requests
	var imageCatch = '/:type([a-zA-Z]{1,20})/:id([a-zA-Z0-9]{1,25})\.:ext([a-zA-Z]{3,4})';
	imageRouter.get(imageCatch, share.displayImage);
	mainRouter.get('/images'+imageCatch, share.displayImage)
	
	// handle process requests
	mainRouter.all('/share-process', share.processRequest);
	mainRouter.get('/test', share.test);
	
	expressapp.use(subdomain('share', shareRouter)); // share subdomain
	expressapp.use(subdomain('image', imageRouter)); // image subdomain
	expressapp.use(mainRouter);
	
	
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
