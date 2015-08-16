var path = require("path");
var bodyParser = require("body-parser");

module.exports = function(express, expressapp, io){
    // handle post requests
    expressapp.use(bodyParser.urlencoded({ extended: false }));
    expressapp.use(express.static('public'));

    expressapp.get('/', function(req, res, next){
        res.sendFile(path.join(__dirname + '/views/signup.html'));
    });

    // handle sockets
    // io.of('/poll/get_actions').on('connection', poll.actionsConnection.bind(poll));
    // io.of('/poll/new_message_entries').on('connection', poll.newMessageConnction.bind(poll));
    //other routes..
}
