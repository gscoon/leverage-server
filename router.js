var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var expressSession  = require("express-session");
var methodOverride = require("method-override");
var passport = require('passport');

module.exports = function(express, expressapp, io){

    expressapp.set('port', app.port);

    expressapp.use(express.static('public'));
    expressapp.use(cookieParser());
    expressapp.use(bodyParser.urlencoded({ extended: false }));

    var MongoStore = require('connect-mongo')(expressSession );

    expressapp.use(expressSession ({
            secret: 'keyboard cat',
            resave: true,
            saveUninitialized: true,
            store: new MongoStore({ url: app.connString })
    }));

    expressapp.use(passport.initialize());
    expressapp.use(passport.session());

    passport.serializeUser(function(user, done) {
        console.log('serializeUser');
        done(null, user._id);
    });

    passport.deserializeUser(function(uid, done) {
        console.log('deserializeUser');
        app.mongo.getUserByID(uid, function(err, user){
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

    var goog = require('./inc/google-auth.js');

    goog.setStrategy(passport);
    expressapp.get('/auth/google', passport.authenticate('google', {scope: 'https://mail.google.com/ https://www.googleapis.com/auth/userinfo.profile'}));
    //['https://mail.google.com/, https://www.google.com/m8/feeds, https://www.googleapis.com/auth/userinfo.email, https://www.googleapis.com/auth/userinfo.profile']

    expressapp.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), goog.authFinish);

    expressapp.get('/gmail', goog.getEmails.bind(goog));

    expressapp.get('/session_test', function(req, res, next){
        res.send(req.session);
        next();
    });

    var fb = require('./inc/facebook-auth.js');
    fb.setStrategy(passport);
    expressapp.get('/auth/fb', passport.authenticate('facebook'));
    expressapp.get('/auth/fb/callback', passport.authenticate('facebook'), fb.authFinalCallback);


    // handle sockets
    // io.of('/poll/get_actions').on('connection', poll.actionsConnection.bind(poll));
    // io.of('/poll/new_message_entries').on('connection', poll.newMessageConnction.bind(poll));
    //other routes..

}
