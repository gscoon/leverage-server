var fs = require('fs');
var path = require('path');
var util = require("util");
var mime = require("mime");

module.exports = new shareClass();

// class used to handle share (facebook) views
function shareClass(){
	
	var allowedImages = ['screenshot', 'target', 'generic', 'meme', 'favicon', 'logo'];
	
	// handle share view request
	this.displayView = function(req, res){
		// database call by ID
		app.db.getSpot(req.params.id, function(err,results){
			// if there is not a database match
			if(results.length != 1)
				return res.status(404).send({status: false, m: "Not found"});
			
			var row = results[0];
			var spot = JSON.parse(row.spot_json);
			spot.timestamp = row.timestamp;
			spot.uid = row.user_id;
			
			// get the images that were saved...
			for(t in spot.images)
				spot.images[t].src = returnImageURL(t, spot.id, spot.images[t].ext)
			
			// passed to jade view
			var renderObj = {
				href: 'http://share.chickenpox.io/' + req.params.id,
				title: spot.pageTitle,
				spot: spot
			}
			res.render('share', renderObj);
		})
	}
	
	function returnImageURL(type, id, ext){
		var u = 'http://share.chickenpox.io/images/{0}/{1}.{2}'.format(type, id, ext);
		console.log(u);
		return u;
	}
		
	this.processRequest = function (req, res, next){

        if(typeof req.query.which === 'undefined') return res.end('Bad query');

        var httpObj = {req: req, res: res, next: next}

        switch(req.query.which){
			case 'preview':
                handlePreview(httpObj);
                break;
        }
    }
	
	function handlePreview(h){
		console.log('handlePreview');
		
		if(!('spot' in h.req.body))
			return h.res.send({status: false, m: 'missing var'});
		
		var spot = JSON.parse(h.req.body.spot);
		
		// create an ID
		spot.id = returnRandID(10);
		
		// remove the image data from spot object
		var images = JSON.parse(JSON.stringify(spot.images));
		spot.images = {};
		
		// indicate which images are available
		for(t in images){
			var ext = images[t].split(',')[0].split(':')[1].split(';')[0].split('/')[1];
			spot.images[t] = {ext: ext};
		}
		
		var saveObj = {
			id: spot.id,
			spot: spot,
			uid: 1 // gerren fix this
		}
		
		app.db.saveSpot(saveObj, function(err, results){
			if(err)
				return console.log('save error', err);
			
			// save each image
			for(t in images)
				storeImage({type: t, id: spot.id, ext: spot.images[t].ext, str: images[t]})
		
			var resObj = {
				status: true,
				id: spot.id,
				poxURL: 'http://share.chickenpox.io/' + spot.id
			}
			h.res.send(resObj);
		});
		
	}
	
	
	function getSpotImages(t, id, ext){
		var filePath = path.resolve(__dirname,'../files/{0}/{1}.{2}'.format(t, id, ext));
		return imageToBase64(filePath);
	}
	
	function imageToBase64(src){
        var data = fs.readFileSync(src).toString("base64");
        return util.format("data:%s;base64,%s", mime.lookup(src), data);
    }
	
	function decodeBase64Image(dataString) {
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

        if(matches.length !== 3)
            return new Error('Invalid input string');


        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');

        return response;
    }
	
	this.displayImage = function(req, res){
		var p = req.params;
		var filePath = path.resolve(__dirname,'../files/{0}/{1}.{2}'.format(p.type, p.id, p.ext));
		res.sendFile(filePath)
	}
	
	 function storeImage(imgObj){
		
        if(allowedImages.indexOf(imgObj.type) == -1)
            return console.log('bad image type');

        var savePath = path.resolve(__dirname,'../files/{0}/{1}.{2}'.format(imgObj.type, imgObj.id, imgObj.ext));
        var imageBuffer = decodeBase64Image(imgObj.str);

        fs.writeFile(savePath, imageBuffer.data, function(err) {
            //console.log('image_saved', err, app.moment().format("YYYY-MM-DD HH:mm:ss"));
        });
    }
	
	function returnRandID(len){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < len; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
	
}