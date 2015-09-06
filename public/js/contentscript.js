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
        comment: '',
        url: null
    };

    this.start = function(){
        console.log('content script started');

        setTagMenu();
        setPageHandlers();
        setEventHandlers();
        setAnnotate();

        // $(window).on('click', function(e){
        //     var target = $(e.target);
        //     chrome.runtime.sendMessage({action: "capture", target: target}, function(response) {
        //         console.log('response', response);
        //     });
        // });
    }

    function setTagMenu(){
        pulse.menu = $('#tag_menu');
        if (pulse.menu.length == 0)
            $.get(processURL + 'tag_menu', function(data){
                $('body').append(data);
                pulse.menu = $('#tag_menu');
                $('#x').on('click', closePulse).css('zIndex', z.menuX);
            });
        pulse.url = window.location.href;
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

    function setAnnotate(){

        $(window).on('click', function(e){
            if(!ctrKeyPressed)
                return;

            if(pulse.target != null)
                closePulse();

            pulse.target = $(e.target);
            pulse.class = randomStr(5);

            var dims = returnDimensions(pulse.target);
            var rel = {x: (e.pageX - dims.ol), y:(e.pageY - dims.ot)}

            var spacingLeft = (dims.ol - dims.opl);
            var spacingTop = (dims.ot - dims.opt);

            var options = {
                interval: 300,
                size:80,
                zIndex: z.pulse,
                left: -1 * (dims.w/2) + spacingLeft + rel.x,
                top: -1 * (dims.h/2) + rel.y,
                class: pulse.class
            };

            if(pulse.target.prop("tagName")  == 'HTML')
                pulse.target = $('body');

            pulse.target.jPulse(options);
            displayTagMenu(e.pageX, e.pageY, function(){
                setTimeout(function(){
                        //captureElement(target);
                    }, 2000);
            });

            //captureElement(target);
            //  {color: "#993175", size: 120, speed: 2000, interval: 400, left: 0,  top: 0,  zIndex: -1 }
        });
    }

    function createPulsePreview(){
        console.log('createPulsePreview')
        var txt = $.trim(pulse.target.text());
        var mainImgSrc = $('meta[property="og:image"]').attr('content');
        var previewContainer = $('#tag_menu_preview_img');
        var imageObj = new Image();
        var canvas = document.createElement('CANVAS');

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
            $(canvas).attr('class', 'tag_snippit_img');
            var context = canvas.getContext("2d");
                context.save();

                // add image to context

                // img
                // x coordinate where to start clipping (optoinal)
                // y coordinate where to start clippin (optional)
                // Optional. The width of the clipped image
                // Optional. The height of the clipped image
                // The x coordinate where to place the image on the canvas
                // The y coordinate where to place the image on the canvas
                // Optional. The width of the sub-rectangle of the source image to draw into the destination context. If not specified, the entire rectangle from the coordinates specified by sx and sy to the bottom-right corner of the image is used.
                // Optional. The height of the sub-rectangle of the source image to draw into the destination context.

                context.drawImage(this, 0, 0, squareLength, squareLength, 0, 0, iconLength, iconLength);


                // // add dark overlay
                // context.fillStyle = "rgba(0, 0, 0, 0.50)";
                // context.fillRect(0, 0, canvasDims.w, canvasDims.h);
                //
                // // restore to the default which was saved immediatlely
                // context.restore();
                //
                // // add text on top of image
                // context.font = fontSize + "px Open Sans";
                // context.shadowColor = "black";
                // context.shadowBlur = 7;
                // context.fillStyle = "#ffffff";
                // context.textBaseline = "hanging";

                // insert text and make it wrap
                //wrapText(context, pulse.comment, canvasDims.w * .05, canvasDims.h * .1, canvasDims.w * .9, fontSize * 1.25);

            // add canvas to document
            previewContainer.append('<div class="tag_thoughts">' + pulse.comment + '</div>');



            previewContainer.append('<div class="tag_snippit"><div class="tag_snippit_text">'+txt+'</div></div>');
            $('.tag_snippit').append(canvas);
            $('.tag_snippit').append('<a class="tag_snippit_link">' + pulse.url + '</a>');

            //var canvasFooter = $('<div class="tag_menu_footer"><div class="tag_menu_footer_text">' + txt + '</div><div class="tag_menu_footer_a"><a href="">' + pulse.url + '</a></div></div>');
            //previewContainer.append(canvasFooter);
            canvasFooter.find('.tag_menu_footer_text').ellipsis();
            canvasFooter.css('top', (canvasDims.h - 1) + 'px');

            //canvas.height = previewContainer.innerHeight();
        };
        imageObj.src = mainImgSrc;

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

    function closePulse(){
        $('.' + pulse.class).hide().css('visible','hidden');
        pulse.target.jPulse( "disable" );
        pulse.menu.fadeOut(300);
        console.log('close attempt');
    }

	function randomStr(len){
	    var text = "";
	    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	    for( var i=0; i < len; i++ )
	        text += possible.charAt(Math.floor(Math.random() * possible.length));

	    return text;
	}

    function returnDimensions(c){
        var op = c.parent().offset();
        if(typeof op === 'undefined')
            op = {left:0, top:0};

        return {
            w: c.innerWidth(),
            h: c.innerHeight(),
            ol: c.offset().left,
            ot: c.offset().top,
            opl: op.left,
            opt: op.top
        };
    }

    function displayTagMenu(w, h, callback){
        // handle custom select
        var customSelect = pulse.menu.find('.custom_select');
        customSelect.css('zIndex', z.select);

        customSelect.find('.active_item').unbind().on('click', function(e){
            $(this).parent().find('.custom_select_list').fadeToggle(300);
        });

        $('#tag_share_button').unbind().on('click', showWhoMenu);


        customSelect.find('.custom_select_list').hide();
        customSelect.find('.custom_select_list .custom_select_item').on('click',
            function(e){
                handleCustomSelect($(this));
            }
        );

        // figure out where place menu
        var slope = 1 - pulse.menu.width() / $(window).width();

        $('#tag_menu_content').show();
        $('#tag_menu_who, #tag_menu_preview').hide();

        pulse.menu.hide().css({'top': h + 40, 'left': slope * w, 'zIndex': z.menu}).fadeIn(300, showContentMenu);

        $('html, body').animate({
            scrollTop: h - 100
        }, 500, callback);
    }

    function showWhoMenu(){
        $('#tag_back_button').unbind().on('click', showContentMenu.bind(null, true));
        $('#tag_save_preview').unbind().on('click', showPreviewMenu);

        $('#tag_menu_who').fadeIn(300);
        $('#tag_menu_content, #tag_menu_preview').hide();
        $('#people_search_input')
            .attr('placeholder', 'Enter names or email addresses')
            .focus();
    }

    function showContentMenu(fade){
        $('#tag_menu_who').hide();
        $('#tag_menu_content').fadeIn((fade)?300:0);
        $('#lev_comment_box')
            .attr('placeholder', 'Type what you\'re thinking...')
            .on('change', function(){
                pulse.comment = this.value;
            })
            .focus()

    }

    function showPreviewMenu(){
        //tag_menu_preview
        $('#tag_menu_who, #tag_menu_content').hide();
        $('#tag_menu_preview').fadeIn(300);
        $('#preview_back_button').unbind().on('click', showWhoMenu);

        switch(pulse.target.prop("tagName")){
            case 'P':
            case 'SPAN':
            case 'A':
            case 'H1':
            case 'H2':
            case 'H3':
            case 'H4':
                createPulsePreview();
                break;
        }

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

}
