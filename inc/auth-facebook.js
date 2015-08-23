var fbgraph = require('fbgraph');

module.exports = new function(){

    this.scope = ['user_posts', 'user_photos', 'user_friends'];
    //'publish_actions'
    this.stat = 'fb';

    this.setStrategy = function(passport, api, sess){
        var self = this;

        var FacebookStrategy = require('passport-facebook').Strategy;

        var extensionID = '';


        if(typeof sess.extID !== 'undefined')
            extensionID = sess.extID;

        passport.use(new FacebookStrategy({
                clientID: config.facebook.appId,
                clientSecret: config.facebook.secret,
                callbackURL: "/auth/fb/callback?extID=" + extensionID
            },
            function(accessToken, refreshToken, profile, done){
                api.handleToken(accessToken, refreshToken, profile, done, extensionID);
            })

        );
    }

    this.authFinalCallback = function(req, res, next){
        console.log('final facebook');
        res.send('fb done');
        next();
    }

    this.setExtension = function(req, res, next){
        console.log('save extension to session');
        var extID = req.query.extID;
        if(!extID) res.send('missed extension');

        req.session.extID = extID;
        res.redirect('fb');
        //passport.authenticate('facebook',{scope: pass.fb.scope})
    }

    this.pullContent = function(){
        var fbgraph = require('fbgraph');
        graph.setAccessToken(access_token);
    }

}
