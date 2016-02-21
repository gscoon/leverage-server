$(start);

function start(){
	handlePreview();
}

var imagePre = 'http://image.chickenpox.io/';

function handlePreview(){	
	// set up options for pulsate
	
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
	
	// append thoughts and details
    var written = $('#op_text').html(spot.thoughts);
	$('#op_text').html(spot.thoughts);
	$('#op_poster_img').attr('src', imagePre + 'user/' + spot.uid + 'large.png');
    $('#op_poster').html('Gerren Scoon');
    $('#post_url a').html(spot.url).attr('href', spot.url);
    $('#post_favicon').attr('src', spot.images['favicon'].src);
	var tsTag = 'data-timestamp';
	$('#op_timestamp').attr(tsTag, spot.timestamp);
	updateTimeSince(tsTag);
	
	console.log(spot)
	
    var img = new Image();
    img.onload = handleImageCrop;
    img.src = spot.images.screenshot.src;
}

function handleImageCrop(){
	// set target width based on the calculations done in content script...
    var targetHeight = spot.cProp.finalH;
    var targetWidth = spot.cProp.finalW;

    // 10 pixel padding
    var startY = spot.cProp.targetDim.top + spot.cProp.start.top - 10;
    if(startY < 0) startY = 0;

    var startX = spot.cProp.targetDim.left + spot.cProp.start.left;
    if(startX < 0) startX = 0;
	
	// create canvas
    var canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
	
	// crop image
    var context = canvas.getContext('2d');
    context.drawImage(this, startX, startY, targetWidth, targetHeight, 0, 0, targetWidth, targetHeight);
	
	// use dataURL to create final image
    var finalImg = $('<img id="' + spot.id + '" />');
    finalImg.attr('src', canvas.toDataURL());

    var pv = $('#preview_container');
    pv.append(finalImg);
    pv.css('width', targetWidth);

	// adjust pulse location based on crop left and top
    spot.pulseOptions.left -= startX;
    spot.pulseOptions.top -= startY;
	
	var pad = 10;
	
	// append highlight bar
    var psb = $('<div class="pulse_set_bar" id="psc_' + spot.tag_id + '"></div>');
    pv.append(psb);
    psb.css('top', spot.pulseOptions.top - .5 * psb.height() + pad);
	spot.pulseOptions.top += spot.pulseOptions.size*.5 - pad; // 10 for padding
	spot.pulseOptions.left += spot.pulseOptions.size*.5 - pad; // 10 for padding
	// finally, show the pulsating circle
    pv.find('img').jPulse(spot.pulseOptions);
}