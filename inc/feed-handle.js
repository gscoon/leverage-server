var async = require('async');
var jade = require('jade');
var path = require('path');
var fs = require('fs');
var mime = require("mime");
var util = require("util");

module.exports = function(ea){
    return new feedClass(ea);
}

function feedClass(expressApp){
    this.displayFeed = function(req, res, next){
        app.db.getUserTags({uid: 1, limit: 15}, function(err, tags){
            // format the url
            var r = /:\/\/(.[^/]+)/;
            tags.forEach(function(tag, i){
                var fURL = tag.url.match(r)[1];
                if(fURL.indexOf('www.')== 0) fURL = fURL.substr(4);
                tag.formattedURL = fURL;
            })
            res.render('feed', {tags: tags, title: 'Dre Day'});
        });
    }

    this.handleFileImages = function(req, res, next){
        var filePath = path.resolve(__dirname, '../files', req.params.fileType, req.params.fileName);
        fs.exists(filePath, function(exists) {
            if(exists)
                res.sendFile(filePath);
            else
                res.send('Page not found, playa', 404);
        });
    }
}
