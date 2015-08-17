var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var methodOverride = require("method-override");



module.exports = function(express, expressapp, io){
    expressapp.set('port', app.port);
    expressapp.use(express.static('public'));

    expressapp.use(cookieParser());
    expressapp.use(methodOverride());
    // handle post requests
    expressapp.use(bodyParser.urlencoded({ extended: false }));

    expressapp.use(session({
            secret: 'keyboard cat',
            resave: true,
            saveUninitialized: true
    }));

    expressapp.get('/', function(req, res, next){
        res.sendFile(path.join(__dirname + '/views/signup.html'));
    });

    var plaidProcess = require('./inc/plaid-process.js');

    expressapp.get('/plaid_process', plaidProcess.handleGet.bind(plaidProcess));
    expressapp.post('/plaid_process', plaidProcess.handlePost.bind(plaidProcess));

    expressapp.get('/auth', app.auth.doAuth.bind(app.auth));

    expressapp.get('/auth/callback', app.auth.authCallback.bind(app.auth));

    // handle sockets
    // io.of('/poll/get_actions').on('connection', poll.actionsConnection.bind(poll));
    // io.of('/poll/new_message_entries').on('connection', poll.newMessageConnction.bind(poll));
    //other routes..

}
