$(start);

function start(){
	handlePreview();
}

var imagePre = 'http://image.chickenpox.io/';

function handlePreview(){		
	console.log(spot)
	// append thoughts and details
    var written = $('#op_text').html(spot.thoughts);
	$('#op_text').html(spot.thoughts);
	$('#op_poster_img').attr('src', imagePre + 'user/' + spot.uid + 'large.png');
    $('#op_poster').html('Gerren Scoon');
    $('#post_url a').html(spot.url).attr('href', spot.url);
	
	// favicon
	var favURL = ('favicon' in spot.images)?imagePre + 'favicon/' + spot.id + '.' + spot.images.favicon.ext:blankFavicon;
    $('#post_favicon').attr('src', favURL);
	
	var tsTag = 'data-timestamp';
	$('#op_timestamp').attr(tsTag, spot.timestamp);
	updateTimeSince(tsTag);
	
	
	
	//set final image
	var finalImg = $('<img id="' + spot.id + '" />');
    finalImg.attr('src', imagePre + 'target/' + spot.id + '.png');
	var pv = $('#preview_container');
    pv.append(finalImg);
    pv.css('width', spot.targetWidth);
	
	var pad = 10;
	
	// append highlight bar
    var psb = $('<div class="pulse_set_bar" id="psc_' + spot.id + '"></div>');
    pv.append(psb);
    psb.css('top', spot.pulseOptions.top - .5 * psb.height() + pad);
	spot.pulseOptions.top += spot.pulseOptions.size*.5 - pad; // 10 for padding
	spot.pulseOptions.left += spot.pulseOptions.size*.5 - pad; // 10 for padding
	// finally, show the pulsating circle
    pv.find('img').jPulse(spot.pulseOptions);
}

var blankFavicon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQEAYAAABPYyMiAAAABmJLR0T///////8JWPfcAAAACXBIWXMAAABIAAAASABGyWs+AAABWUlEQVRIx72UPY6DMBCFB2vPgELjm7hIfLiII1EhJO4QSipSW0Y0GCYFO4CNbTbZ1Y6E7Qdi/M3zTwLfUZZlWZaI8MuY53meZwAppZQySX78IwEYM47jiGiMMUsf0nZf13Vd14ht27Zti1gURVEU5wUxGiAiIgLQs2992n0o0jRN0xRACCGEADgDWQHIOhckrO0+FJxzznkY5Mt1YBntq/JrN7TWWmuAqqqqqvJUyhhj7Ph+BXAdoO0T0m5IebtdrwBd13XP5/H749E0TfMGwNGZOABFlmXZ5fIBwDRN0zTZBtMah7QbMTDK/5ED9iSf3RWU/xRgv+mWdfdrX/Wxa+cUwBhjjPGt8d94QPmDAO65fvcUnF26of9WAKWUUur8/Me2YMwZyh8EoItkm2ireWltfZw+7sGWPwAwDMMwDLblSRLWviWIIVD+IEDf933fA9zveZ7n8G/xAixIBOiEWtbwAAAAAElFTkSuQmCC";