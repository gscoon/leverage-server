var passportClass = function(){
    this.goog = require('./auth-google.js');
    this.fb = require('./auth-facebook.js');

    this.handleToken = function(accessToken, refreshToken, profile, done, extID) {
        // this is called after user returns to auth/[app]/callback
        // also after the code is converted to a token
        // there is a call done to pull user info
        // it now wants you to find or create a user in the database

        var user = null;
        var selectorObj = {};
        selectorObj[profile.provider + '.id'] = profile.id;
        console.log('selector: ', selectorObj);
        var updateObj = {tokens: {accessToken: accessToken, refreshToken: refreshToken}, extID: extID};
        var u = {name:''};
        u[profile.provider] = profile;

        // send socket update
        app.io.sendAuthUpdate(extID, profile);
        app.mongo.upsertAppUser(selectorObj, updateObj, u, function(err, results){
            if(results != null) user = results.value;

            done(err, user);
            console.log(err, results);
        });

    }


}

module.exports = new passportClass();
