$(start);

var imageURL = 'http://image.chickenpox.io/';

function start(){
	setElements();
}

function setElements(){
	$('#url-input').on('keypress', function(e){
		if(e.keyCode != 13) return;
		
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
		var postURL = 'http://chickenpox.io/share-process?which=web-preview';
		$.post(postURL, obj, function(r){
			$('#search_loader').hide();
			input.prop('disabled', false);
			
			if(r.status)
				handleWebScreenshot(r.path);
		})
	}).focus();
}

function handleWebScreenshot(path){
	$('body').append('<img src="'+imageURL+ path + '" />');
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