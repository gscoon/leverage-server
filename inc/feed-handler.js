var path = require('path');
var fs = require('fs');
var mime = require("mime");
var util = require("util");

module.exports = new feedClass();

function feedClass(){
	
    this.displayFeed = function(req, res){
		if(!req.poxUser.isLoggedIn)
			return res.send('Not logged in.');
		
		var user = req.poxUser;
        app.db.getUserTags({uid: req.poxUser.id, limit: 15}, function(err, rows){
            // used to format the url ie. just show the domain part
            var r = /:\/\/(.[^/]+)/;
            rows.forEach(function(row, i){
				// used to format the url ie. just show the domain part
                var fURL = row.url.match(r)[1];
                if(fURL.indexOf('www.')== 0) fURL = fURL.substr(4);
                row.formattedURL = fURL;
				
				// get spot details into object
				row.spot = JSON.parse(row.spot_json);
				row.shareURL = urljoin(app.domain.share, row.spot.id);
				
				// user image handling
				if(row.user_images){
					row.user_images = JSON.parse(row.user_images);
					row.smallUserImage = app.user.getImage(row.user_images.small.fileName);
				}
					
				for(t in row.spot.images)
					row.spot.images[t].src = returnImageURL(t, row.spot_id, row.spot.images[t].ext)
            })
            res.render('feed', {rows: rows, title: 'My Feed - ' + user.name});
        });
    }
	
	function returnImageURL(type, id, ext){
		return app.domain.image + '/{0}/{1}.{2}'.format(type, id, ext);
	}
	
	this.test = function(req, res){
		res.send(req.sessionID);
	}
	
}
