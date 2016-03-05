$(siteStart);

var pox = {};
var webshotObj = {};

var server = {
	images: 'http://image.chickenpox.io/',
	socket: 'http://chickenpox.io/'
}

// called when facebook api is loaded
function fbStart() {	
	FB.getLoginStatus(function(response) {
		console.log('FB set', response);
		pox.user = {fb: response}
		setPoxUser();
	});
}

// called when page is fully loaded
function siteStart(){
	window.$selectionMenu = $("#pox_selection_menu");
	window.$spotHolder = $('#spot_holder');
	window.$io = $('#image_overlay');

	pox.domain = poxDomain;
	
	// set input box
	setSiteElements();
	
	// hash handler
	handleHashChange();
	$(window).on('hashchange', handleHashChange);
	startSocket();
}

function setPoxUser(){
	$.extend(pox.user, poxUser);
	var loggedInServer = (typeof poxUser == 'object' && poxUser.isLoggedIn);
	$('.login_button').unbind().on('click', handleLogin);

	//console.log('setPoxUser', poxUser);
	if(pox.user.fb.status == 'connected' && !loggedInServer)
		sendServerLogin(function(){});
	else if(!loggedInServer)
		$('#main_login_button').show();
	else 
		showUserSection();

	

}

//log out!
function poxLogOut(){
	FB.logout(function(response) {
		// user is now logged out
		console.log('logout', response);
		
	})
	window.location.href = "http://login.chickenpox.io/logout";
}

function showUserSection(){
	$('#main_login_button').hide();
	$('#user_section').show();
	$('#user_name').html(pox.user.name);

	var imgURL = pox.user.imageLocation + pox.user.images.small.fileName;
	var imgLoadCount = 0;

	setUserImage();
	
	function setUserImage(){
		var img = new Image();
		// successful load
		img.onload = function(){
			$('#user_image').css('background-image', 'url(' + imgURL + ')').hide().fadeIn(300)
		}

		// wait a second, but no more than 5
		img.onerror = function(){
			imgLoadCount++;
			if(imgLoadCount == 5) return;
			setTimeout(setUserImage,1000);
		}

		img.src = imgURL;
	}
}

function handleLogin(){
	FB.login(function(response){
		console.log(response);
		// Logged into your app and Facebook.
		if (response.status === 'connected') {
			pox.user.fb = response;
			sendServerLogin();
			if(webshotObj.pending){
				document.location.hash = 'webshot/' + webshotObj.pending.id;
				$('#force_login_menu, #general_overlay').hide();
				webshotObj.pending = null;
			}
			

		} else if (response.status === 'not_authorized') {
		// The person is logged into Facebook, but not your app.
		} else {
		// The person is not logged into Facebook, so we're not sure if
		// they are logged into this app or not.
		}
	});
}

function sendServerLogin(){
	//window.location.href = "http://login.chickenpox.io/facebook?";
	//return;
	$.ajax({
		url: '/fbDetails',
		type: 'post',
		data: {token: pox.user.fb.authResponse.accessToken, id: pox.user.fb.authResponse.userID},
		success: function(results){
			console.log(results);
			$.extend(pox.user, results.user);
			showUserSection();
		}
	});
}


function setSiteElements(){
	$('#url-input').on('keypress', function(e){
		if(e.keyCode != 13) return;

		if(!pox.user.isLoggedIn)
			$('#force_login_menu, #general_overlay').show();
		
		var input = $(this);
		var obj = {
			url : $.trim(input.val()),
			w: $(window).width(),
			h: $(window).height()
		}
		
		obj.url = addhttp(obj.url);
		
		if(!isURL(obj.url))
			return log('Not a URL');
		
		log('Post sent');
		$('#search_loader').show();
		
		input.prop('disabled', true);
		
		// send ajax request to screenshot page
		var postURL = 'http://www.chickenpox.io/share-process?which=web-shot';
		$.post(postURL, obj, function(r){
			console.log(r);
			$('#search_loader').hide();
			input.prop('disabled', false);
			
			if(r.status){
				webshotObj[r.id] = r;

				// wait for user to be logged in...
				if(pox.user.isLoggedIn)
					document.location.hash = 'webshot/' + r.id;
				else
					webshotObj.pending = r;
			}
				
		})
	}).focus();
	
	// show user menu on hover
	$('#user_section').on("mouseover", function () {
		$('#user_menu').show();
	});
	
	$('#user_section').on("mouseout", function () {
		$('#user_menu').hide();
	});
	
	$('#user_menu_logout').on('click', poxLogOut);
}

function handleHashChange(){
	var hash = location.hash.slice(1);
	var hSplit = hash.split('/');
	if(hSplit.length == 1)
		return hideImageOverlay();
	
	if(hSplit[0] == 'webshot'){
		// cover screen
		$('#general_overlay').show();
		setWebshot(hSplit[1]);
	}
}

function setWebshot(id){
	
	if(id in webshotObj){
		var src = server.images + webshotObj[id].path;
		return setWebshotImg(src);
	}
	
	
	$.get('http://www.chickenpox.io/webshot/' + id, function(r){
		console.log(r);
		var src = server.images + r.path;
		webshotObj[id] = r;
		setWebshotImg(src);
	})
	
	function setWebshotImg(src){
		webshotObj.active = webshotObj[id];
		var img = new Image();
		img.onload = showImageSelection;
		img.src = src;
	}
}


// default pulse options
var pulseOpt = {
	class: 'poxspot',
	size:60,
	speed:2000,
	interval: 300,
	zIndex: 101,
	id: null,
	color:"#900505"
}

var mouse = {
	track: false,
	l: null, //left
	t: null  // top
}

// need to track mouse movements when image is showing
$(document).bind('mousemove', function(e){
	if(!mouse.track)
		return;
	
	var l = mouse.l = e.pageX;
	var t = mouse.t = e.pageY;

	// spot holder shows something while pulse warms up
	$spotHolder.css({left: l - 10, top: t - 10});	
});

function hideImageOverlay(){
	//console.log('hideImageOverlay');
	$('.poxspot, #general_overlay').hide();
	$selectionMenu.hide();
	$spotHolder.hide();
	mouse.track = false;
	$selectionMenu.jPulse("disable", pulseOpt.id);
	
	if('closePulse' in pox)
		pox.closePulse();
}

function showImageSelection(){
	$('#general_overlay').hide();
	$selectionMenu.show().css({display: 'block', visibility: 'visible'});
	
	// action description box
	var descrip = $('#selection_description');
	descrip.show();
	setTimeout(function(){
		descrip.fadeOut();
	}, 3000);
	
	// screenshotted image
	$io.attr('src', this.src);
	$io.css({width:this.width, height: this.height});
	startTrack();
}

function startTrack(){
	// dot that indicates you can press on it
	$spotHolder.show().css({display: 'block', visibility: 'visible'});
	$spotHolder.unbind().on('click', showPoxMenu);
	mouse.track = true;
}

function showPoxMenu(e){
	var pulse = pox.pulse;
	var l = e.pageX;
	var t = e.pageY;
	
	$spotHolder.fadeOut();
	console.log(webshotObj);
	pulse.id = webshotObj.active.id;
	pulseOpt.left = l;
	pulseOpt.top = t;
	
	pulse.target = $io;
	pulse.class = pulseOpt.class;
	
	pulse.pos = pox.returnDimensions(pulse.target, e);
	
	var newID = returnRandID(5);
	
	if(pulseOpt.id){
		pulse.target.jPulse("disable", pulseOpt.id);
		
		pulseOpt.id = newID;
		pulse.target.jPulse(pulseOpt);
	}
	else{
		pulseOpt.id = newID;
		pulse.target.jPulse(pulseOpt);
	}
	
	// show the menu when youre ready (no screenshot necessary)
	// then set up text box
	// then save it to database
	function shotCallback(done){
		// show menu
		pulse.menu.hide().css(pulse.menuPos).fadeIn(300, function(){
			// within done is the save function. ajax
			done();
		});
	}
	
	function priorState(){
		startTrack();
	}
	
	pox.showTagMenu(shotCallback, startTrack);
	
}

// send post to server and show web preview
pox.finishSpot = function(){
	var postURL = 'http://www.chickenpox.io/share-process?which=finish-preview';
	var spot = {
		thoughts: pox.pulse.thoughts,
		placement: pox.pulse.pos,
		pos: pox.pulse.pos,
		webshotID: webshotObj.active.id
	};
	
	$.post(postURL, {spot: JSON.stringify(spot)}, function(r){
		pox.handleMenuCompletion(r);
		if(r.status)
			window.location = r.poxURL;
	});
}
	
pox.handlePageImages = function(callback){
	
}

function isURL(s) {
   var regexp = /^(?:(http|https):\/\/)?(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
   return regexp.test(s);
}

function addhttp(url) {
   if (!/^(f|ht)tps?:\/\//i.test(url))
      url = "http://" + url;

   return url;
}

function returnRandID(len){
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for( var i=0; i < len; i++ )
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

/* ---- Socket ---- */
function startSocket(){

   // return; //gerren remove

    var socket = io(server.socket);
    var isConnected = false;

    socket.on('connect', function(){
        if(isConnected) return false;

        isConnected = true;
        console.log('socket connected');
        //socket.emit('extension_check', {extID: config.extID});

        // listen for user information based on extension id
        // socket.on('menu', handleMenu);
        // socket.on('user', handleUserResults);
        // socket.on('callback', handleSocketCallback);
    });

    // old
    function handleMenu(data){
        console.log('menuData', data)
        config.menuHTML = data.menu;
    }

    function handleUserResults(data){
        console.log('user results: ', data);

        // if user doesnt exist
        if(typeof data != 'object' || !data.success)
            return false;

        // set user variable
        config.user = data.user;

        // get pulse menu
        socket.emit('get_pulse_menu', {extID: config.extID});
    }

    function handleSocketCallback(data){
        console.log('handleSocketCallback', data);
        if(typeof data == 'object' && 'callbackID' in data){
            config.callbackObj[data.callbackID](data);
        }
    }

}  // end of socket name space
