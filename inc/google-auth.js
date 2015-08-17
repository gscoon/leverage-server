var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var googleAuthClass = function(){

    var oauth2Client = new OAuth2(app.config.google.clientID, app.config.google.clientSecret, app.siteURL + "auth/callback");

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
        console.log(req.body);

        res.end('got em');
    }

}

app.auth = new googleAuthClass();
