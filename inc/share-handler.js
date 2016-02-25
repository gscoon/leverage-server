var fs = require('fs');
var path = require('path');
var util = require("util");
var mime = require("mime"); // used to determine image type
var Canvas = require('canvas');
var fabric = require('fabric').fabric; // built on top of canvas
var webshot = require('webshot'); // headless browser screenshots

module.exports = new shareClass();

// class used to handle share (facebook) views
function shareClass(){
	
	var allowedImages = ['screenshot', 'target', 'generic', 'meme', 'favicon', 'logo', 'fb', 'webscreenshot'];
	
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
				spot: spot,
				fbImage: 'http://image.chickenpox.io/fb/' + req.params.id + '.png'
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
			case 'extension-preview':
                handleNewExtensionPreview(httpObj);
                break;
			case 'web-preview':
                handleNewWebPreview(httpObj);
                break;
        }
    }
	
	function handleNewWebPreview(h){
		if(!('url' in h.req.body))
			return h.res.send({status: false, m: 'missing var'});
		
		var url = h.req.body.url;
		var width = h.req.body.w;
		var height = h.req.body.h;
		
		var options = {
			userAgent: 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36',
			screenSize: {width: width, height: height},
			shotSize: {width: 'window', height: 'all'}
		}
		
		//store image with this random ID
		var id = returnRandID(10);
		var path1 = 'files/';
		var path2 = '{0}/{1}.{2}'.format('webscreenshot', id, 'png');
		
		webshot(url, path1 + path2, options, function(err) {
			console.log('its saved', err);
		  // screenshot now saved to google.png
			return h.res.send({status: true, m: 'great success', path: path2});
		});
	}
	
	function handleNewExtensionPreview(h){
		console.log('handleNewPreview');
		
		if(!('spot' in h.req.body))
			return h.res.send({status: false, m: 'missing var'});
		
		var spot = JSON.parse(h.req.body.spot);
		setTargetDetails(spot);
		
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
			
			setTargetImage(spot, images['screenshot']);
			
			var resObj = {
				status: true,
				id: spot.id,
				poxURL: 'http://share.chickenpox.io/' + spot.id
			}
			h.res.send(resObj);
		});
		
	}
	
	// sets all necessary variables for crop and pulse placement
	function setTargetDetails(spot){
		
		var pSize = 40;
		spot.pulseOptions = {
			interval: 400,
			speed: 800,
			size: pSize,
			zIndex: 1000,
			left: spot.placement.view.x,
			top: spot.placement.view.y + (spot.placement.shift.post - spot.placement.shift.pre),
			color: '#780808'
		};
		
		var targetHeight = spot.cProp.finalH;
		var targetWidth = spot.cProp.finalW;

		// 10 pixel padding
		var pad = 10;
		var startY = spot.cProp.targetDim.top + spot.cProp.start.top - pad;
		if(startY < 0) startY = 0;

		var startX = spot.cProp.targetDim.left + spot.cProp.start.left - pad;
		if(startX < 0) startX = 0;
		
		// adjust pulse location based on crop left and top
		spot.pulseOptions.left -= startX;
		spot.pulseOptions.top -= startY;
		
		spot.startX = startX;
		spot.startY = startY;
		
		// set target width based on the calculations done in content script and padding...
		spot.targetWidth = spot.cProp.finalW + 2*pad;
		spot.targetHeight = spot.cProp.finalH + 2*pad;
	}
	
	var Image = Canvas.Image;
	
	// handle cropping and all that
	function setTargetImage(spot, screenshotSrc){
		// create canvas
		var canvas = new Canvas(spot.targetWidth, spot.targetHeight)
		
		var img = new Image;
		img.src = screenshotSrc;
		
		// crop image
		var context = canvas.getContext('2d');
		context.drawImage(img, spot.startX, spot.startY, spot.targetWidth, spot.targetHeight, 0, 0, spot.targetWidth, spot.targetHeight);
		
		var targetDataURL = canvas.toDataURL();
		var ext = 'png';
		spot.images.target = {ext: ext};
		storeImage({type: 'target', ext: ext, id: spot.id, str: targetDataURL});
		setFacebookImage(spot, targetDataURL);
	}
	
	function setFacebookImage(spot, targetSrc){
		var bannerWidth = 250;
		var canvasWidth = spot.targetWidth + bannerWidth;
		var canvas = new fabric.createCanvasForNode(canvasWidth, spot.targetHeight);
		
		// 1. white rectangle on right side as background for text
		canvas.setBackgroundColor('white');
		
		// 2. add screenshot
		fabric.Image.fromURL(targetSrc, function(img){
			img.left = 0;
			img.top = 0;
			canvas.add(img);
		});
		
		// 3. add text
		var nuchaFont = new canvas.Font('Neucha', path.resolve(__dirname,'../files/fonts/Neucha.ttf'));
		canvas.contextTop.addFont(nuchaFont);
		
		var fontSize = 35;
		var lettersPerLine = Math.round(30/fontSize * 20);
		var str = stringDivider(spot.thoughts, lettersPerLine, "\n");
		var lineCount = str.split("\n").length;
		var lineHeight = 1.2;
		var totalTextHeight = lineHeight * fontSize * lineCount;
		var textTop = spot.pulseOptions.top - totalTextHeight * .5;
		if(textTop < 0) textTop = 0;
		
		var text = new fabric.Text(str, {
			left: spot.targetWidth + 10,
			top: textTop,
			fontFamily: 'Neucha',
			fontSize: fontSize,
			lineHeight: lineHeight,
			fill: "#b21d1d",
			textAlign: "left"
		});
		canvas.add(text);
		
		// 4. add overlay red rectangle
		var rrHeight = 30;
		var redRect = new fabric.Rect({
		  left: 0,
		  top: spot.pulseOptions.top - rrHeight*.5,
		  width: spot.targetWidth,
		  height: rrHeight,
		  fill: "#89252f",
		  opacity: .2
		});
		//canvas.add(redRect);
		
		// 5. cirlcle or pox mark
		var cRadius = 30;
		var circle = new fabric.Circle({
			radius: cRadius,
			fill: '#89252f',
			left: spot.pulseOptions.left - cRadius,
			top: spot.pulseOptions.top - cRadius,
			opacity: .4
		});
		
		canvas.add(circle);
		
		// 6. save to file system
		var fbDataURL = canvas.toDataURL();
		storeImage({type: 'fb', ext: 'png', id: spot.id, str: fbDataURL});
	}
	
	
	this.test = function(req, res){
		console.log('test');
	}

	function stringDivider(str, width, spaceReplacer) {
		if (str.length>width) {
			var p=width
			for (;p>0 && str[p]!=' ';p--) {
			}
			if (p>0) {
				var left = str.substring(0, p);
				var right = str.substring(p+1);
				return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
			}
		}
		return str;
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