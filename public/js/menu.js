// SHOW TAG MENU

$(function(){
	console.log(window.pox, window.chickenPox);
	
	if(window.pox)
		return addFunctions(window.pox);
	
	if(!window.chickenPox)
		window.chickenPox = {};
	
	addFunctions(window.chickenPox);
});

function addFunctions(cp){
	
	var pulse = cp.pulse = {
		menu: null,
		isMenuActive: false,
		target: null,
		class: null,
		pos: {},
		thoughts: '',
		innerText: '',
		url: null, // this could change after load
		host: window.location.hostname,
		id: null,
		meme: false,
		isMemeSaved: false,
		tagSaved: false,
		pointer: null,
		images: {},
		takeScreenshot: true,
		pageTitle: $.trim(document.title.split(/[\|\-]/g)[0])
	};
	
	cp.z = {pulse: 999999999, menu: 99999999999997, menuX: 99999999999999, select: 99999999999998};
	
	cp.keys = {ctrl: 17, v: 86, c:67, f: 70, esc: 27, enter: 13};
	
	//console.log('cp', cp);
	
    cp.showTagMenu = function(webshotCallback, priorStateCallback){
        console.log('showTagMenu')
		
		pulse.menu = $('#pox--tag_menu');
		pulse.pointer = $('#pox--pulse_pointer');
		pulse.url = window.location.href;
		
		pulse.hideButton = $('#pox--tag_menu_controls_hide');
		pulse.hideButton.on('click', function(){
			closePulse(priorStateCallback);
		}).html('Cancel');
		
        var x = pulse.pos.abs.x;
        var y = pulse.pos.abs.y;

        pulse.pointer.find('#pp_icon').attr('class', 'pox--pp_text');

        // set image
        if(cp.user && cp.user.smallImage)
            $('#pox--pulse_user_image').css('background-image', 'url(' + pox.domain.userImage + pox.user.images.small.fileName + ')');

        // need this to get accurate width below
        $('#pox--tag_menu_content').show();
        var mw = pulse.menu.width();

        // figure out where place menu
        var menuPos = pulse.menuPos = {top: y - 48/2, zIndex: cp.z.menu};

        // if pulse is on the right side of the screen
        if(pulse.pos.window.w / 2 < x){
            pulse.pointer.attr('class', 'pox--pulse_pointer_right');
            menuPos.left = x - mw - 80;
        }
        else{
            pulse.pointer.attr('class', 'pox--pulse_pointer_left');
            menuPos.left = x + 80;
        }

        //get pre and post animation positions
		pulse.pos.shift = {pre: pulse.target[0].getBoundingClientRect().top}

        // position the tag in the center of the windowHeight
        $('body').animate({
            scrollTop: y - pulse.pos.window.h / 2
        }, 500, function(){
			pulse.pos.shift.post = pulse.target[0].getBoundingClientRect().top;
			pulse.pos.shift.diff = pulse.pos.shift.post - pulse.pos.shift.pre;

			if(typeof webshotCallback == 'function')
				webshotCallback(showMessageMenu);
        });
    }
	
	// continuation from function above
    var showMessageMenu = cp.showMessageMenu = function(){
        hideAllMenuContainers();

        $('#pox--tag_menu_content').show();
        $('#pox--pp_icon').attr('class', 'pox--pp_text');

        $('#pox--pulse_comment_textarea, #pox--pulse_comment_input')
            .hide().unbind()
            .on('keyup', function(e){
                if(e.keyCode == cp.keys.enter)
                    saveTagText.call(this);
            })

        $('#pox--pulse_comment_input')
            .show().val('').attr('placeholder', 'Type what you\'re thinking...')
            .on('input', function(){
                // expand to text area
                if(this.value.length > 32){
                    $(this).hide();
                    $('#pox--pulse_comment_textarea')
                        .show()
                        .val(this.value)
                        .animate({'height':60}, 300)
                        .focus();
                }
            })
            .focus();
    }
	
	// save tag text
    function saveTagText(){
        hideAllMenuContainers();
        cp.pulse.thoughts = $(this).val();
		// show loader menu
        $('#pox--tag_menu_load_page, #pox--tm_loader').show(); 
		pulse.hideButton.html('Hide');
		cp.finishSpot();
    }
	
	// hide menu after response from server
	var handleMenuCompletion = cp.handleMenuCompletion = function(res){
		if(res.status)
            setTimeout(function(){
                $('#pox--tm_loader').hide();
                $('#pox--tm_loader_message').show().html('Your page will load shortly...');
                setTimeout(pulse.menu.hide, 1000)
            }, 1000);
	}
	
	
	
	function returnExtension(filename){
		return filename.split('.').pop();
	}

    function hideAllMenuContainers(){
        $('#pox--tag_menu_content, #pox--tag_menu_chain, #pox--tag_menu_preview, #pox--tag_menu_who, #pox--tag_menu_load_page, #pox--chain_menu_expanded, #pox--tag_menu_notification_saved, #pox--tm_loader_message, #pox--chain_menu_expanded_new').hide();
    }


    function showSaveMenu(){
        hideAllMenuContainers();
        $('#pox--tag_menu_save').fadeIn(300);
        $('#pox--pp_icon').attr('class', 'pox--pp_chain');
    }

    function saveTagChain(cID){
        hideAllMenuContainers();
        $('#pox--tag_menu_load_page, #pox--tm_loader').show(); // show loader menu

        if(typeof cID !== 'number')
            cID = $(this).find('input').val();

        var data = {chainID: cID, tagID: pulse.id, action:"socket", which: 'save_tag_chain'};
        cp.main.chromePort.postMessage(data);
        pulse.saved.chain_id = cID;
        pulse.saved.chain_name = cp.user.chains[cID].name;
        console.log('chain name', cp.user.chains[cID], cp.user.chains[cID].name)
    }

    function handleSavedTagChain(res){
        setTimeout(function(){
            $('#pox--tm_loader').hide();
            $('#pox--tm_loader_message').show().html('Tag saved.');
            setTimeout(function(){
                pulse.menu.fadeOut(200, function(){
                    // gerren
                    pulse.saved.thoughts = pulse.thoughts;
                    console.log('pulse.saved', pulse.saved);
                    cp.setExistingTag([pulse.saved]);

                    $('.' + pulse.class).hide().css('visible','hidden');
                    pulse.target.jPulse("disable");
                    analyzeDOM();
                });
            }, 2000);
        }, 1000);
    }


    function handlePageTags(response){
        cp.setExistingTag(response.results);
    }

    // undo tag
    function undoPulse(){
        var data = {
            action:"socket",
            which:'undo_tag',
            id: pulse.id,
        };
        // send save message to bg script
        closePulse();
        cp.main.chromePort.postMessage(data);
    }

    function handleUndoTag(m){
        console.log('handleUndoTag', m);
    }

    var closePulse = cp.closePulse = function(done){
        $('.' + pulse.class).hide().css('visible','hidden');
        pulse.target.jPulse( "disable" );
        pulse.menu.fadeOut(200);
        pulse.isMenuActive = false;
		if(typeof done == 'function')
			done();
    }

    

    cp.returnDimensions = function(c, e){
        var x = e.pageX;
        var y = e.pageY;

        var par = c.parent();
        if(par.css('position') != 'absolute')
            par.css('position', 'relative');

        var op = par.offset();
        if(typeof op === 'undefined')
            op = {left:0, top:0};

        var retObj = {};

        var dims = {
            w: c.innerWidth(),  // target inner width
            h: c.innerHeight(), // target inner height
            ol: c.offset().left, // target left relative to doocument
            ot: c.offset().top, // target top relative to doocument
            opl: op.left,
            opt: op.top
        }

        retObj.abs = {x: x, y: y};
        retObj.rel = {x: (x - dims.ol), y:(y - dims.ot)};
        retObj.spacing = {left: dims.ol - dims.opl, top: dims.ot - dims.opt};
        retObj.opt = {left: retObj.rel.x + retObj.spacing.left, top: retObj.rel.y + retObj.spacing.top};
        retObj.window = {
            w: $(window).width(),
            h: $(window).height(),
            vScroll: $(document).height() > $(window).height(),
            hScroll: $(document).width() > $(window).width(),
			scrollTop: $(window).scrollTop(),
			scrollLeft: $(window).scrollLeft()
        };

        retObj.view = {x: e.clientX, y: e.clientY};

        retObj.dims = dims;

        return retObj;
    }

    function getMyBackgroundColor(t){
        var current = t;
        var go = true;
        var blank = "rgba(0, 0, 0, 0)";
        while (go){
            var bg = current.css('background-color');

            if(bg != blank) return bg;

            if(current.prop("tagName").toLowerCase() == 'body')
                go = false;
            else
                current = current.parent();
        }

        return "rgb(255,255,255)"; // return white
    }

    function convertImgToBase64URL(url, outputFormat, callback){
        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function(){
            var canvas = document.createElement('CANVAS'),
            ctx = canvas.getContext('2d');
            canvas.height = this.height;
            canvas.width = this.width;
            ctx.drawImage(this, 0, 0);
            var dataURL = canvas.toDataURL(outputFormat);
            onSuccess(dataURL);
            canvas = null;
        };

        img.onerror = callback.bind(null, false);

        img.src = url;
    }
	
	function convertImgToDataURL(img){
		 var canvas = document.createElement('CANVAS'),
		ctx = canvas.getContext('2d');
		canvas.height = img.height;
		canvas.width = img.width;
		ctx.drawImage(img, 0, 0);
		return canvas.toDataURL();
	}


    function handlePageImageResponse(r){
        console.log('handlePageImageResponse', r.type, r.dataURL == true);
        if(r.dataURL)
            savePageImage(r.type, r.dataURL);
    }

    function savePageImage(whichImage, dataURL){
        var req = {
            action: "socket",
            which: "save_image",
            imageType: whichImage,
            dataURL: dataURL,
            tagID: pulse.saved.tag_id,
            fileID: pulse.saved.file_id
        }
        cp.main.chromePort.postMessage(req);
    }

    function extend(a, b){
        for(var key in b)
            if(b.hasOwnProperty(key))
                a[key] = b[key];
        return a;
    }

    function genRandomStr(len){
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	    for( var i=0; i < len; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

	    return text;
	}

    var setFamilyTree = cp.setFamilyTree = function(){
        var go = true;
        var current = pulse.target;
        var fam = [];
        var c = 0;
        while(go){
            var classVal = $.trim(current.attr('class'));
            if(classVal !== undefined) classVal = classVal.split(/ +/); // look for one or more spaces
            var gen = {
                tagName: current.prop("tagName").toLowerCase(),
                class: classVal, //array
                id: current.attr('id'),
                index: 0
            };
            if(gen.tagName == 'body' || gen.tagName == 'html' || c > 200)
                go = false;
            else {
                gen.index = current.parent().find(gen.tagName).index(current);
                current = current.parent();
            }

            fam.push(gen);
            c++;
        }
        pulse.family = fam;
    }

    function handleCheckup(r){
        // update the check last port with the value from the bg script
        // this is send periodically from the bg script
        cp.main.lastPortCheck = r.time;
        //console.log('checkup', r);
    }

    function startCtrlTimer(){
        ctrlKey.isPressed = true;
        var currentID = genRandomStr(3);
        ctrlKey.pressID = currentID;
        setTimeout(function(){
            if(currentID == ctrlKey.pressID){
                resetCtrlKey();
                console.log('times up on that key, bro');
            }
        }, 5000)
    }

    function resetCtrlKey(){
        ctrlKey.isPressed = false;
        ctrlKey.pressID = null;
        $('a.pox--disabled').removeClass('pox--disabled');
    }

    
    this.doCSSTricks = function(ele, type){
        if(type == 'menu')
            ele.find('*').css({'line-height': 'normal'});
        else if(type == 'circle')
            ele.css({'padding': '0px', 'margin':'0px'});
    }

    this.updateTimeSince = function() {
        var dTag = 'data-pulse-ts';


        $('[' + dTag + ']').each(function(i, span){
            var date = $(span).attr(dTag);

            if (typeof date !== 'object')
                date = new Date(date);

            var seconds = Math.floor((new Date() - date) / 1000);
            var intervalType;

            var interval = Math.floor(seconds / 31536000);
            if (interval >= 1) {
                intervalType = 'year';
            } else {
                interval = Math.floor(seconds / 2592000);
                if (interval >= 1) {
                    intervalType = 'month';
                } else {
                    interval = Math.floor(seconds / 86400);
                    if (interval >= 1) {
                        intervalType = 'day';
                    } else {
                        interval = Math.floor(seconds / 3600);
                        if (interval >= 1) {
                            intervalType = "hour";
                        } else {
                            interval = Math.floor(seconds / 60);
                            if (interval >= 1) {
                                intervalType = "minute";
                            } else {
                                interval = seconds;
                                intervalType = "second";
                            }
                        }
                    }
                }
            }

            if (interval > 1 || interval === 0) {
                intervalType += 's';
            }

            var curr = interval + ' ' + intervalType + ' ago';
            $(span).html(curr);
        });
    }

    function nada(){}
}