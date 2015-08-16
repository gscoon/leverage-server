var plaid = require('plaid');
var request = require('request');
var pURL = 'https://tartan.plaid.com/'

var app = {
    config: require('./config/config.json')
}

request(pURL + 'categories', function(err, res, body){
    if(res.statusCode == 200){
        var catObj = JSON.parse(body);
        console.log(catObj);
    }
})

//var cats = plaid.getCategory(category_id, plaid_env, callback);
