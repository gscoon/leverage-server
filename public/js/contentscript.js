'use strict';

window.onload = function(){
    lev.start();
}

var lev = new function(){
    var server = 'http://localhost:1111/';
    var processURL = server + 'process?which=';

    var ctrKeyPressed = false;
    var z = {
        pulse: 999999999,
        menu: 99999999999997,
        menuX: 99999999999999,
        select: 99999999999998
    };

    var pulse = {
        menu: null,
        target: null,
        class: null,
        pos: {},
        comment: '',
        innerText: '',
        url: window.location.href,
        id: null,
        genericImgSrc: null,
        meme: false,
        isMemeSaved: false,
        tagSaved: false
    };

    this.start = function(){
        console.log('content script started');

        setTagMenu();
        setPageHandlers();
        setEventHandlers();
        setPulseClick();

        var generic = $('meta[property="og:image"]');
        if(generic.length > 0)
            pulse.genericImgSrc = generic.attr('content');

        //console.log($('h1, h2, h3, h4, p').text());
    }

    function setTagMenu(){
        pulse.menu = $('#tag_menu');
        if (pulse.menu.length == 0)
            $.get(processURL + 'tag_menu', function(data){
                $('body').append(data);
                pulse.menu = $('#tag_menu');
                $('#x').on('click', closePulse).css('zIndex', z.menuX);
            });
    }

     //
    function setPageHandlers() {
         switch(window.location.hostname){
             case 'www.facebook.com':
             case 'facebook.com':
                handleFacebook();
                break;
            case 'www.instagram.com':
            case 'instagram.com':
                handleInstagram();
                break;
         }

     }

    function setEventHandlers(){
        $(window).on('keydown', function(e){
            if(e.keyCode == 17){
                if(ctrKeyPressed) return false;

                console.log('control key pressed');
                ctrKeyPressed = true;

                $('a').addClass('disabled');
            }
        })

        $(window).on('keyup', function(e){
            if(e.keyCode == 17){
                console.log('control key released');
                ctrKeyPressed = false;

                $('a.disabled').removeClass('disabled');
            }
        })

        $('img').on('click', function(e){
           convertImgToBase64URL($(this).attr('src'), 'image/png', function(dataURL){
               console.log('converted: ', dataURL);
           });
           console.log($(this).attr('src'));
       });

    }

    // create annotation / pulse
    function setPulseClick(){

        $(window).on('click', function(e){
            console.log('setPulseClick');
            if(!ctrKeyPressed)
                return;

            if(pulse.target != null)
                closePulse();

            pulse.target = $(e.target);
            pulse.class = randomStr(5);
            pulse.innerText = $.trim(pulse.target.text());

            var dims = returnDimensions(pulse.target);

            pulse.pos.abs = {x: e.pageX, y: e.pageY}
            pulse.pos.rel = {x: (e.pageX - dims.ol), y:(e.pageY - dims.ot)};

            var spacingLeft = (dims.ol - dims.opl);
            var spacingTop = (dims.ot - dims.opt);

            var options = {
                interval: 300,
                size:80,
                zIndex: z.pulse,
                left: -1 * (dims.w/2) + spacingLeft + pulse.pos.rel.x,
                top: -1 * (dims.h/2) + pulse.pos.rel.y,
                class: pulse.class
            };

            if(pulse.target.prop("tagName")  == 'HTML')
                pulse.target = $('body');

            pulse.target.jPulse(options);



            showTagMenu(e.pageX, e.pageY, function(){
                saveTag(); // save!!!!!!
                setTimeout(function(){
                        //captureElement(target);
                    }, 2000);
            });

            //captureElement(target);
            //  {color: "#993175", size: 120, speed: 2000, interval: 400, left: 0,  top: 0,  zIndex: -1 }
        });
    }


    function saveTag(){
        console.log('saveTag');
        var saved = $('#tag_menu_notification_saved');
        saved.hide();

        pulse.tagSaved = false;
        var data = {
            url: pulse.url,
            width: $(window).width(),
            height: $(window).height(),
            share: '',
            pulseText: pulse.innerText,
            thoughts: pulse.comment,
            zoom: '',
            pulsePos: JSON.stringify(pulse.pos)
        };

        $.post(processURL + 'save_tag', {data:JSON.stringify(data)}).done(function(res){
            console.log('res', res);
            if(res != ''){
                if(res.success){
                    pulse.tagSaved = true;
                    pulse.id = res.id;
                    setTimeout(function(){
                        saved.fadeIn(300);
                    }, 1000);
                    setTimeout(function(){
                        saved.fadeOut(300);
                    }, 4000)

                    saveTagImages();
                }
            }
        });
    }


    function undoSaveTag(){

    }

    function closePulse(){
        $('.' + pulse.class).hide().css('visible','hidden');
        pulse.target.jPulse( "disable" );
        pulse.menu.fadeOut(300);
        console.log('close attempt');
    }

    // SHOW TAG MENU
    function showTagMenu(w, h, callback){
        // handle custom select
        var customSelect = pulse.menu.find('.custom_select');
        customSelect.css('zIndex', z.select);

        customSelect.find('.active_item').unbind().on('click', function(e){
            $(this).parent().find('.custom_select_list').fadeToggle(300);
        });

        // $('#tag_share_button').unbind().on('click', showWhoMenu);
        $('#tag_private_button').unbind().on('click', showPreviewMenu);

        // navigation stuff
        $('#tmn_add_message').unbind().on('click', showMessageMenu);
        $('#tmn_share').unbind().on('click', showWhoMenu);
        $('.tag_hide_button').unbind().on('click', closePulse);

        customSelect.find('.custom_select_list').hide();
        customSelect.find('.custom_select_list .custom_select_item').unbind().on('click',
            function(e){
                handleCustomSelect($(this));
            }
        );

        // save tag message
        $('#tag_save_message_button').unbind().on('click', function(){
            saveTagText();
        })

        // figure out where place menu
        var slope = 1 - pulse.menu.width() / $(window).width();

        $('#tag_menu_content').show();
        $('#tag_menu_who, #tag_menu_preview').hide();

        pulse.menu.hide().css({'top': h + 40, 'left': slope * w, 'zIndex': z.menu}).fadeIn(300, showMessageMenu);

        $('body').animate({
            scrollTop: h - 100
        }, 500, callback);
    }

    function showMessageMenu(fade){
        console.log('showMessageMenu');
        updateTagNav('tmn_add_message');
        $('#tag_menu_who').hide();
        $('#tag_menu_content').fadeIn((fade)?300:0);

        $('#lev_comment_input')
            .val('')
            .attr('placeholder', 'Type what you\'re thinking...')
            .unbind()
            .on('input', function(){
                pulse.comment = this.value;

                // expand to text area
                if(this.value.length > 40){
                    $(this).hide();
                    $('#lev_comment_textarea')
                        .show()
                        .val(this.value)
                        .animate({'height':60}, 300)
                        .focus();
                }
            })
            .on('keyup', function(e){
                if(e.keyCode == '13')
                    saveTagText();
            })
            .focus()
    }

    function saveTagText(){
        var data = {
            thoughts: pulse.comment,
            id: pulse.id
        };
        $('#tag_menu_content').hide();

        $('#tag_menu_load_page, #tm_loader').show(); // show loader menu
        $.post(processURL + 'save_tag_text', {data:JSON.stringify(data)}).done(function(res){
            console.log('save message', res);
            if(res.success)
                setTimeout(function(){
                    $('#tm_loader').hide();
                    $('#tm_loader_message').html('Your message has been saved.');
                    setTimeout(showWhoMenu, 2000)
                }, 1000);
        });
    }

    function showWhoMenu(){
        updateTagNav('tmn_share');
        $('#tag_back_button').unbind().on('click', showMessageMenu.bind(null, true));
        $('#tag_save_preview').unbind().on('click', showPreviewMenu);

        $('#tag_menu_who').fadeIn(300);
        $('#tag_menu_content, #tag_menu_preview, #tag_menu_load_page').hide();
        $('#people_search_input')
            .attr('placeholder', 'Enter names or email addresses')
            .focus();
    }

    function showPreviewMenu(){
        //tag_menu_preview
        $('#tag_menu_who, #tag_menu_content').hide();
        $('#tag_menu_preview').fadeIn(300);
        $('#preview_back_button').unbind().on('click', showWhoMenu);

        pulse.meme = pulse.isMemeSaved = false;

        pulse.tagType = pulse.target.prop("tagName").toLowerCase();

        switch(pulse.tagType){
            case 'p':
            case 'span':
            case 'a':
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'img':
                createPulsePreview();
                break;
        }
    }

    function updateTagNav(whichID){
        var activeClass = 'tag_menu_title';
        $('.' + activeClass).removeClass(activeClass);
        $('#' + whichID).attr('class', activeClass);
    }

    function createPulsePreview(){
        console.log('createPulsePreview');

        // add canvas to document
        $('.tag_item_user_name').html('gscoon:');
        $('.tag_item_user_img').attr('src', 'images/users/1.jpg');

        $('.tag_item_snippit_link').html(pulse.url);

        if(pulse.tagType == 'img'){
            createImageMeme(pulse.target.attr('src'));
        }
        else if(pulse.genericImgSrc != null){
            $('.tag_item_thoughts').html(pulse.comment);
            createImageIcon(pulse.genericImgSrc);
            if(pulse.innerText != null && pulse.innerText != '')
                $('.tag_item_snippit_text').html(pulse.innerText).ellipsis();
        }

    }

    function createImageIcon(src){
        var previewContainer = $('#tag_menu_preview_container');
        var imageObj = new Image();
        var canvas = previewContainer.find('.tag_item_snippit_img')[0];
        imageObj.onload = function(){
            var imageRatio = this.width/this.height;

            if(this.width>this.height){
                var squareLength = this.height;
                var newPos = {l:(this.width - this.height)/2, t:0};
            }
            else{
                var squareLength = this.width;
                var newPos = {l:0, t:(this.height - this.width)/2};
            }

            var menuWidth = parseInt(pulse.menu.css('width'));

            var canvasDims = {w: squareLength * imageRatio, h: squareLength * (1/imageRatio)};

            var fontSize = 18;
            var iconLength = 100;

            canvas.width =  iconLength;
            canvas.height = iconLength;

            var context = canvas.getContext("2d");
            context.save();

            context.drawImage(this, 0, 0, squareLength, squareLength, 0, 0, iconLength, iconLength);
        };
        imageObj.src = src;
    }

    function createImageMeme(src){
        console.log('createImageMeme');
        var previewContainer = $('#tag_menu_preview_container');
        var imageObj = new Image();
        imageObj.setAttribute('crossOrigin', 'anonymous');
        var canvas = previewContainer.find('.tag_item_snippit_img')[0];

        imageObj.onload = function(){

            var imageRatio = this.width / this.height;
            var canvasDims = {w:previewContainer.innerWidth(), h:previewContainer.innerWidth() / imageRatio};
            console.log({canvasDims:canvasDims});
            canvas.width =  canvasDims.w;
            canvas.height = canvasDims.h;

            var context = canvas.getContext("2d");
            context.save();
            context.drawImage(this, 0, 0, this.width, this.height, 0, 0, canvasDims.w, canvasDims.h);

            // transparent overlay
            //context.fillStyle = "rgba(0, 0, 0, 0.70)";
            //context.fillRect(0, 0, canvasDims.w, canvasDims.h);

            // restore to the default which was saved immediatlely
            context.restore();

            var fontSize = 18;
            context.font = fontSize + "px Open Sans";
            context.shadowColor="black";
            context.shadowBlur=7;
            context.fillStyle  = "#ffffff";
            // context.textBaseline="top";
            context.textBaseline="hanging";

            wrapText(context, pulse.comment, canvasDims.w * .05, canvasDims.h * .1, canvasDims.w * .9, fontSize * 1.25);

            pulse.meme = canvas.toDataURL();

            // gerren, this should make sure the tag is saved first saved...
            saveTagImageProcess({
                str: pulse.meme,
                ext: 'png',
                type: 'meme',
                fileID: pulse.id
            });
        }

        imageObj.src = src;
    }

    function wrapText(context, text, x, y, maxWidth, lineHeight) {
        var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else
                line = testLine;

        }
        context.fillText(line, x, y);
    }


    function saveTagImages(){
        console.log('saveTagImages');
        // 1. save target
        if(pulse.tagType != 'img'){
            html2canvas(pulse.target, {
                background: '#ffffff',
                onrendered: function(canvas) {
                    saveTagImageProcess({
                        str: canvas.toDataURL(),
                        ext: 'png',
                        type: 'target',
                        fileID: pulse.id
                    });
                }
            });

        }


        // 2. save generic image
        if(pulse.genericImgSrc != null){
            var img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');

            img.onload = function(){
                canvas.width = this.width;
                canvas.height = this.height;
                ctx.drawImage(this, 0, 0);
                saveTagImageProcess({
                    str: canvas.toDataURL(),
                    ext: 'png',
                    type: 'generic',
                    fileID: pulse.id
                });
            }
            img.src = pulse.genericImgSrc
        }

    }

    function saveTagImageProcess(saveObj){
        $.post(processURL + 'save_image', {data: JSON.stringify(saveObj)});
    }

    function handleCustomSelect(option){
        var customSelect = option.parent().parent();

        var optionText = option.find('.custom_select_val').text();
        if(optionText!=''){
            var actionItemText = customSelect.find('.active_item_text');
            var commentInput = $('#lev_comment_box');
            var commentPreset = $('#lev_comment_preset');
            var optionObj = JSON.parse(optionText);
            if(optionObj.type == 'action'){
                actionItemText.html('Custom Message:');
                commentInput.show(200);
                commentPreset.hide();
            }
            else if(optionObj.type == 'text'){
                commentInput.hide();
                commentPreset.hide().text(optionObj.val).show(200);
                actionItemText.html('Preset Message:');
            }
            //lev_comment_preset
        }

        option.parent().hide();

    }

    function captureElement(target){
        html2canvas(target[0], {
            onrendered: function(canvas) {
                //$('#lev_menu').html(canvas);
            // canvas is the final rendered <canvas> element
            }
        });
    }

    function returnDimensions(c){
        var op = c.parent().offset();
        if(typeof op === 'undefined')
            op = {left:0, top:0};

        return {
            w: c.innerWidth(),  // target inner width
            h: c.innerHeight(), // target inner height
            ol: c.offset().left, // target left relative to doocument
            ot: c.offset().top, // target top relative to doocument
            opl: op.left,
            opt: op.top
        };
    }

    function convertImgToBase64URL(url, outputFormat, callback){
        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function(){
            var canvas = document.createElement('CANVAS'),
            ctx = canvas.getContext('2d'), dataURL;
            canvas.height = this.height;
            canvas.width = this.width;
            ctx.drawImage(this, 0, 0);
            dataURL = canvas.toDataURL(outputFormat);
            callback(dataURL);
            canvas = null;
        };
        img.src = url;
    }

    function handleFacebook(){
         console.log('handleFacebook');
    }

    function handleInstagram(){
         console.log('handleInstagram');
    }

    function extend(a, b){
        for(var key in b)
            if(b.hasOwnProperty(key))
                a[key] = b[key];
        return a;
    }

    function randomStr(len){
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	    for( var i=0; i < len; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

	    return text;
	}


}
