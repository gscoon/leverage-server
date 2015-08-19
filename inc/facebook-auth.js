module.exports = new function(){

    this.setStrategy = function(passport){

        var FacebookStrategy = require('passport-facebook').Strategy;

        passport.use(new FacebookStrategy({
                clientID: config.facebook.appId,
                clientSecret: config.facebook.secret,
                callbackURL: "/auth/fb/callback"
            },
            function(accessToken, refreshToken, profile, done) {
                // this is called after user returns to auth/[app]/callback
                // also after the code is converted to a token
                // there is a call done to pull user info
                // it now wants you to find or create a user in the database
                console.log('FacebookStrategy callback');

                var user = null;
                var selectorObj = {fb:{id:profile.id}};
                var tokenObj = { accessToken: accessToken, refreshToken: refreshToken};
                var u = {name:'', tokens: tokenObj, fb: profile};

                app.mongo.upsertAppUser(selectorObj, tokenObj, u, function(err, results){
                    if(results != null) user = results.value;
                    done(err, user);
                    console.log(err, results);
                });

            })
        );
    }

    this.authFinalCallback = function(req, res, next){
        console.log('final facebook');
        res.send('fb done');
        next();
    }

    this.findOrCreate

}
