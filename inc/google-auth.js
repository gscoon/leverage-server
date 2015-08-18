var googleapis = require('googleapis');
var async = require('async');
var OAuth2 = googleapis.auth.OAuth2;

var googleAuthClass = function(){

    var oauth2Client = new OAuth2(config.google.clientID, config.google.clientSecret, app.siteURL + "auth/callback");
    var gmail = null;

    // generate a url that asks permissions for Google+ and Google Calendar scopes
    var scopes = [
        'https://mail.google.com/',
        'https://www.googleapis.com/auth/calendar'
    ];

    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
        scope: scopes // If you only need one scope you can pass it as string
    });


    this.doAuth = function(req, res, next){
        console.log("http://"+ req.hostname + ":" + req.port);
        res.redirect(url);
        //app.passport.authenticate('google', { scope: 'https://www.googleapis.com/auth/plus.login' });
    }

    this.authCallback = function(req, res, next){
        var code = req.query.code;
        oauth2Client.getToken(code, function(err, tokens) {
            console.log(tokens);
            // Now tokens contains an access_token and an optional refresh_token. Save them.
            if(!err) {
                oauth2Client.setCredentials(tokens);
                req.session.tokens = tokens;
            }
            res.send('got em');
        });
    }

    this.getEmails = function(req, res, next){
        oauth2Client.setCredentials(req.session.tokens);
        gmail = googleapis.gmail({ auth: oauth2Client, version: 'v1' });
        var emails = gmail.users.messages.list({
            includeSpamTrash: false,
            maxResults: 5,
            userId: 'me',
            q: ""
        }, function (err, results) {
            console.log(err, results);

            async.map(results.messages, getEmailByID,
                function(mErr, mResults){
                    res.send(mResults);
                }
            );
        });
    }

    function getEmailByID (m, callback){
        var id = m.id;
        var params = {
            id: id,
            userId: 'me'
        }
        console.log(params);
        gmail.users.messages.get(params, callback)
    }

    function forceTokenRefresh (callback){
        oauth2Client.refreshAccessToken(function(err, tokens){
            callback(tokens);
        });
    }

}

module.exports = new googleAuthClass();
