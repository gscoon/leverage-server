var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var expressSession  = require("express-session");
var methodOverride = require("method-override");
var passport = require('passport');
var logger = require('morgan');
var pg = require('pg');

module.exports = function(express, expressapp){

    var process = require('./inc/process.js')(expressapp);

    expressapp.set('port', app.port);
    expressapp.set('view engine', 'jade');
    expressapp.use(logger('dev'));
    expressapp.use(express.static('public'));
    expressapp.use(cookieParser());
    expressapp.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));

    //var MongoStore = require('connect-mongo')(expressSession );
    pgSession = require('connect-pg-simple')(expressSession);

    expressapp.use(expressSession({
        secret: 'keyboard cat',
        store: new pgSession({
            conString : config.pgDB.connStr,
            pg : pg
        }),
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

    expressapp.get('/', function(req, res, next){
        res.sendFile(path.join(__dirname + '/views/signup.html'));
    });

    var plaidProcess = require('./inc/plaid-process.js');
    expressapp.get('/plaid_process', plaidProcess.handleGet.bind(plaidProcess));
    expressapp.post('/plaid_process', plaidProcess.handlePost.bind(plaidProcess));

    expressapp.get('/auth/google', passport.authenticate('google', {scope: app.api.goog.scope}));
    //['https://mail.google.com/, https://www.google.com/m8/feeds, https://www.googleapis.com/auth/userinfo.email, https://www.googleapis.com/auth/userinfo.profile']

    expressapp.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), app.api.goog.authFinish);

    expressapp.get('/gmail', app.api.goog.getEmails.bind(app.api.goog));

    expressapp.get('/session_test', function(req, res, next){
        res.send(req.session);
        next();
    });

    expressapp.get('/auth/pre-fb', app.api.fb.setExtension.bind(app.api.fb));
    expressapp.get('/auth/fb', passport.authenticate('facebook',{scope: app.api.fb.scope}));
    expressapp.get('/auth/fb/callback', passport.authenticate('facebook'), app.api.fb.authFinalCallback);

    // testing testing 1 2 3
    expressapp.all('/process', process.handleRequest.bind(process));

    expressapp.get('/dre', function(req, res, next){
        res.render('dre', { title: 'Dre Day'});
    });

}
