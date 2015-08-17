var plaid = require('plaid');
var async = require('async');

var processClass = function(){


    var plaidClient = new plaid.Client(app.config.plaid.clientID, app.config.plaid.secret, plaid.environments.tartan);

    this.handleGet = function(req, res, next){

    }

    this.handlePost = function(req, res, next){
        var self = this;

        console.log('POST request');

        if(req.query.which !== 'undefined')
            var which = req.query.which;
        else if(typeof req.body.which !== 'undefined')
            var which = req.body.which;
        else
            return res.end('Bad query');

        switch(which){
            case 'new_user':
                self.addNewUser(req, res, next);
                break;
            case 'test':
                console.log(req.body);
                return res.end('got yo token')
                break;
        }

    }

    this.addNewUser = function(areq, ares, anext){
        console.log(areq.body.token);

        if(typeof areq.body.token === "undefined") return res.end('Missing vars');

        var publicToken = areq.body.token;
        var ret = {};
        var accessToken = null;

        async.waterfall([
            // 1. exchange token
            function(callback){
                plaidClient.exchangeToken(publicToken, callback);
            },
            // 2. get authenticated user
            function(res, callback){
                accessToken = res.access_token;
                // this one does not include transcations
                plaidClient.getAuthUser(accessToken, callback);
            },
            // 3. return accounts
            function(res, callback){
                // An array of accounts for this user, containing account names,
                // balances, and account and routing numbers.

                // Return account data
                ret.one = res;

                // this one includes transcations
                plaidClient.getConnectUser(accessToken, {gte: '30 days ago'}, callback);
            },
            // 4. get transactions
            function(res, callback){
                ret.two = res;
                ares.json(ret);
                callback(null, true);
            }
        ], function(err, results){
            console.log(err, results);
        });
    }

}


module.exports = new processClass();
