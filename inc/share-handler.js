var fs = require('fs');
var path = require('path');
var util = require("util");
var mime = require("mime"); // used to determine image type
var Canvas = require('canvas');
var fabric = require('fabric').fabric; // built on top of canvas
var Horseman = require('node-horseman'); // headless browser screenshots
var request = require('request'); 

module.exports = new shareClass();

// class used to handle share (facebook) views
function shareClass(){
	
	var db = app.db;
	
	var allowedImages = ['screenshot', 'target', 'generic', 'meme', 'favicon', 'logo', 'fb', 'webshot'];
	var imageExtension = ['png', 'jpg', 'gif', 'jpeg'];
	
	// handle share view request
	this.displayView = function(req, res){
		// database call by ID
		db.getSpot(req.params.id, function(err,results){
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
			console.log('page title', spot.pageTitle);
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
                finishWebPreview(httpObj);
                break;
			case 'web-shot':
                handleNewWebShot(httpObj);
                break;	
        }
    }
	
	function handleNewWebShot(h){
		if(!('url' in h.req.body))
			return h.res.send({status: false, m: 'missing var'});
		
		//store image with this random ID
		var id = returnRandID(10);
		var url = h.req.body.url;
		var width = h.req.body.w;
		var height = h.req.body.h;
		// var ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.116 Safari/537.36';
		var path1 = './files/';
		var path2 = '{0}/{1}.{2}'.format('webshot', id, 'png');
		
		var obj = {
			url: url,
			width: width,
			height: height,
			height: height,
			path: path2,
			id: id,
			status: false,
			isLoaded: false
		}
		
		var horseman = new Horseman();
		horseman
			.userAgent(h.req.headers['user-agent'])
			.viewport(width, height)
			.on('error', function(m){
				// console.log('error status', m);
				// obj.status = false;
				// obj.message = m;
				// h.res.send(obj);	
			})
			.on('loadFinished', function(s){
				console.log('load status', s);
				obj.isLoaded = true;
			})
			.open(url)
			.html() // get html
			.then(function(html){
				obj.html = html;
			})
			.evaluate(function(){
				// if background color isnt set, make it white.
				// chrome vs ie
				var trans = ['rgba(0, 0, 0, 0)','transparent'];
				var bColor = $('body').css('background-color');
				var hColor = $('html').css('background-color');
				if(trans.indexOf(bColor) != -1 && trans.indexOf(hColor) != -1)
					$('html, body').css('background-color', '#ffffff');
			})
			.screenshot(path1 + path2) // do screenshot
			.do(function(done){
				if(!obj.isLoaded)
					return;
				console.log('title', obj.pageTitle);
				obj.status = true;
				db.setWebshot(obj, function(){});
				h.res.send(obj);
				done();
			})
			.close();	
	}
	
	this.showWebshot = function(req, res){
		var id = req.params.id;
		db.getWebshot(id, function(err, results){
			if(err || results.length == 0)
				return res.send({status: false})
			
			var row = results[0];
			res.send(JSON.parse(row.details));
		});			
	}
	
	// once user selects spot on web preview
	/*
			- get webshot information from database
			- using horseman
				- determine what user would have clicked on given position
				- get other images like logo, favicon
			- save to spot table
			- save all images
			- send http response
	*/
	function finishWebPreview(h){
		if(!('spot' in h.req.body))
			return h.res.send({status: false, m: 'missing var'});
		
		var spot = JSON.parse(h.req.body.spot);
		spot.isWebPreview = true; // used to distinguish calcs later
		
		db.getWebshot(spot.id, function(err, results){
			if(err || results.length == 0)
				return h.res.send({status: false, m: 'db error'});
			
			
			var row = results[0];
			
			var shotDetails = JSON.parse(row.details);
			spot.url = shotDetails.url;
			
			var p = spot.placement;
			var evalObj = {
				spot: spot,
				x: p.abs.x - p.window.scrollLeft,
				y: p.abs.y - (p.window.scrollTop + p.shift.diff)
			}
			
			// headless browser to create
			var horseman = new Horseman();
			horseman
				.userAgent(h.req.headers['user-agent'])
				.viewport(shotDetails.width, 2000)
				.on('consoleMessage', function(msg, lineNumber, sourceId){
					console.log(lineNumber, msg);
				})
				.open(shotDetails.url)
				.scrollTo(p.window.scrollTop + p.shift.diff, p.window.scrollLeft)
				.title() //get title
				.then(function(t){
					spot.pageTitle = t;
				})
				.evaluate(analyzeDOM, evalObj) // get location properties
				.then(function(cProp){
					//console.log('crop', cProp);
					spot.cProp = cProp;
					// target is the rectangle that will be carved out
					setTargetDetails(spot);
					// console.log(p);
				})
				.evaluate(handlePageImages)
				.then(function(images){
					spot.imageURLs = images;
				})
				.do(function(done){ // when everything is set...
					// store each image
					spot.images = {};
					for(t in spot.imageURLs){
						var url = spot.imageURLs[t];
						var ext = returnExtension(url);
						if(imageExtension.indexOf(ext) == -1)
							ext = 'png';
						spot.images[t] = {ext:ext, url: url};
					}
					
					var saveObj = {id: spot.id, spot: spot,uid: 1} // gerren fix this
						
					// save to database, then save images
					app.db.saveSpot(saveObj, function(err, results){
						if(err)
							return console.log('save error', err);
						
						// store image using url instead of str
						for(t in spot.images)
							storeImage({type: t, ext: spot.images[t].ext, id: spot.id, url: spot.images[t].url});
						
						// first get shot image in buffer
						var shotPath = path.resolve(__dirname,'../files', shotDetails.path);
						fs.readFile(shotPath, function(err, shotBuffer){
							// save target image and facebook image
							setTargetImage(spot, shotBuffer, function(){
								h.res.send({status: true, id: spot.id, poxURL: 'http://share.chickenpox.io/' + spot.id});
							});
						});
					});
					done();
						
				})
				.close();	
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
		
		var targetDim = spot.cProp.targetDim;
		var coords = spot.placement.view;
		//coords.top = spot.placement.view.y + spot.placement.shift.diff,
		
		// web preview starts clipping at top of doc. extension clips at top of window
		if('isWebPreview' in spot && spot.isWebPreview){
			targetDim = spot.cProp.targetDimOffset;
			coords = spot.placement.abs;
		}
		
		var pSize = 40;
		spot.pulseOptions = {
			interval: 400,
			speed: 800,
			size: pSize,
			zIndex: 1000,
			left: coords.x, // not the view, but the abs
			top: coords.y, // not the view, but the abs, also no need for shift
			color: '#780808'
		};
		
		var targetHeight = spot.cProp.finalH;
		var targetWidth = spot.cProp.finalW;

		// 10 pixel padding
		var pad = 10;
		
		
		
		var startY = targetDim.top + spot.cProp.start.top - pad;
		if(startY < 0) startY = 0;

		var startX = targetDim.left + spot.cProp.start.left - pad;
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
	function setTargetImage(spot, screenshotSrc, callback){
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
		setFacebookImage(spot, targetDataURL, callback);
	}
	
	function setFacebookImage(spot, targetSrc, done){
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
		if(typeof done == 'function')
			done();
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
		
		// if dataurl is provided
		if('str' in imgObj){
			var imageBuffer = decodeBase64Image(imgObj.str);
			fs.writeFile(savePath, imageBuffer.data, function(err) {
				console.log('image_saved', imgObj.type, err, app.moment().format("YYYY-MM-DD HH:mm:ss"));
			});
		}
		else if('url' in imgObj){// if url is provided
			var destination = fs.createWriteStream(savePath)
			request
				.get(imgObj.url)
				.on('error', function(error){
					console.log('pipe error', error);
				})
				.pipe(destination);
		}        
    }
	
	function returnRandID(len){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < len; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
	
	
	// get details about the webshotted page target
	function analyzeDOM(evalObj){
		var pulse = evalObj.spot;
		pulse.target = $(document.elementFromPoint(evalObj.x, evalObj.y));
		pulse.cProp = {
			target: pulse.target,
			minW: 500,
			minH: 350,
			maxW: 1200, // leave room for text
			maxH: 720,
			defaultW: 600,
			defaultH: 400,
			firstW: null, // first width match
			firstH: null, // first height match
			finalW: null,
			finalH: null,
			exactFit: true,
			start:{
				left: 0,
				top: 0
			},
			timing: {}, // performance testing
			remote: {}  //images
		};
		
		
		//return {length: pulse.target.length, eo: evalObj, d: $(document).height(), st: $(window).scrollTop(), h: $(window).height(), text: pulse.target.text()};
		
		console.log('Pox - 1');
		var cProp = pulse.cProp;
		cProp.timing['start'] = +new Date() / 1000;  // log start timestamp
		determineCaptureDimensions();
		console.log('Pox - 2');
		cProp.timing['dets'] = +new Date() / 1000 - cProp.timing['start'];  // log start timestamp
		handleCaptureCrop();
		console.log('Pox - 3');
		cProp.timing['crop'] = +new Date() / 1000 - cProp.timing['start'];  // log start timestamp
		//handleCaptureRemoteImages();
		
		delete cProp.target;
		return cProp; // return from eval;

		function determineCaptureDimensions(){
			var cProp = pulse.cProp;
			cProp.cees = [];
			while(true){
				// set current capture target properties
				var c = {w: cProp.target.outerWidth(), h: cProp.target.outerHeight(), tagName: cProp.target.prop("tagName").toLowerCase()};
				 
				cProp.cees.push(c);
				
				// if this is the first target to reach the dimension criteria
				if(cProp.firstW == null && c.w >= cProp.minW) cProp.firstW = c.w;
				if(cProp.firstH == null && c.h >= cProp.minH) cProp.firstH = c.h;

				// if both the width and height criteria have been met
				if((cProp.firstW != null && cProp.firstH != null) || c.tagName == 'body'){
					// figure out final width
					if(c.w <= cProp.maxW) // if cProp.target width is less than max
						cProp.finalW = c.w;
					else if(cProp.firstW != null && cProp.firstW <= cProp.maxW){ // if the first found width is set and less than the max
						cProp.finalW = cProp.firstW;
						cProp.exactFit = false;
					}
					else {
						cProp.finalW = cProp.defaultW
						cProp.exactFit = false;
					}

					// figure out final Height
					if(c.h <= cProp.maxH)
						cProp.finalH = c.h;
					else if(cProp.firstH != null && cProp.firstH <= cProp.maxH){
						cProp.finalH = cProp.firstH;
						cProp.exactFit = false;
					}
					else {
						cProp.finalH = cProp.defaultH
						cProp.exactFit = false;
					}

					// get targets position relative to window
					cProp.targetDim = {
						top: cProp.target[0].getBoundingClientRect().top,
						bottom: cProp.target[0].getBoundingClientRect().bottom,
						left: cProp.target[0].getBoundingClientRect().left,
						right: cProp.target[0].getBoundingClientRect().right,
					}
					
					cProp.targetDimOffset = cProp.target.offset();
					break;
				}

				cProp.target = cProp.target.parent();
			}

			console.log('determineCaptureDimensions:', cProp);
		}

		function handleCaptureCrop(){

			var cProp = pulse.cProp;

			if(!cProp.exactFit){
				var calcedTop = pulse.pos.abs.y - cProp.targetDimOffset.top - cProp.finalH/2;
				var calcedLeft = pulse.pos.abs.x - cProp.targetDimOffset.left - cProp.finalW/2;

				// if it pushes against bottom
				if((cProp.target.height() - calcedTop) < cProp.finalH)
					cProp.start.top = cProp.target.height() - cProp.finalH;
				else if(calcedTop < 0) // if it pushes against top
					cProp.start.top = 0;
				else
					cProp.start.top = calcedTop;

				// if it pushes against the sides
				if((cProp.target.width() - calcedLeft) < cProp.finalW)
					cProp.start.left = cProp.target.width() - cProp.finalW;
				else if(calcedLeft < 0) // if it pushes against top
					cProp.start.left = 0;
				else
					cProp.start.left = calcedLeft;

			}

			console.log('handleCaptureCrop', cProp);
		}
	} // end of analyzedom
	
	function handlePageImages(){
		var response = {};
		
        // favicons first
        var favMeta = $('link[rel="icon"]');
        var favURL = (favMeta.length)?returnAbsoluteURL(favMeta.attr('href')):returnAbsoluteURL('/favicon.ico');
		response.favicon = favURL;
		
        // generic image?
        var generic = $('meta[property="og:image"]');
        if(generic.length > 0){
            var genericURL = returnAbsoluteURL(generic.attr('content'));
			response.generic = genericURL;
        }
		
		
		var logoURL = "https://logo.clearbit.com/" + window.location.hostname;
		response.logo = logoURL;
		return response;
		
		function returnAbsoluteURL(url){
			var h = 'http';

			if(url.split('//').length == 1) // if it's a relative url
				url = window.location.protocol + '//' + window.location.hostname + url;
			else if(url.substring(0, h.length) !== h)
				url = window.location.protocol + url;

			return url;
		}
    }
	
	function returnExtension(filename){
		return filename.split('.').pop();
	}
	
	
}