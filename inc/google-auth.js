module.exports = new function(){
    this.setStrategy = function(passport){
        var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

        passport.use(new GoogleStrategy({
                clientID: config.google.clientID,
                clientSecret: config.google.clientSecret,
                callbackURL: app.siteURL + "auth/google/callback"
            },
            function(accessToken, refreshToken, profile, done) {
                console.log('GoogleStrategy callback');
                //console.log(profile);
                var user = null;
                var selectorObj = {google:{id:profile.id}};
                var tokenObj = { accessToken: accessToken, refreshToken: refreshToken};
                var u = {name:'', tokens: tokenObj, google: profile};

                app.mongo.upsertAppUser(selectorObj, tokenObj, u, function(err, results){
                    if(results != null) user = results.value;
                    done(err, user);
                    console.log(err, results);
                });
            }
        ));
    }

    this.authFinish = function(req, res, next) {
        console.log('authFinish');
        res.send('done?');
    }

    this.getEmails = function(req, res, next){

    }

}
