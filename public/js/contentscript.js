'use strict';

window.onload = function(){
    lev.start();
}

var lev = new function(){

    var ctrKeyPressed = false;
    var z = {
        pulse: 999999999,
        menu: 99999999999997,
        menuX: 99999999999999,
        select: 99999999999998
    };

    var menu = null;
    var pulse = null;

    this.start = function(){
        console.log('content script started');
        if ($('#tag_menu').length == 0)
            $('body').append('<div id="tag_menu"></div>');
        menu = $('#tag_menu');

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
        })

        $('#x').css('zIndex', z.menuX).on('click', closePulse);
    }

    function setAnnotate(){

        $(window).on('click', function(e){
            if(!ctrKeyPressed)
                return;

            if(pulse != null)
                closePulse();

            pulse = {
                target: $(e.target),
                class: randomStr(5)
            }

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
            showLevMenu(e.pageX, e.pageY, function(){
                setTimeout(function(){
                        //captureElement(target);
                    }, 2000);
            });

            //captureElement(target);
            //  {color: "#993175", size: 120, speed: 2000, interval: 400, left: 0,  top: 0,  zIndex: -1 }
        });
    }

    function closePulse(){
        $('.' + pulse.class).hide().css('visible','hidden');
        pulse.target.jPulse( "disable" );
        menu.fadeOut(300);
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

    function showLevMenu(w, h, callback){
        // handle custom select
        var customSelect = menu.find('.custom_select');
        customSelect.css('zIndex', z.select);

        customSelect.find('.active_item').unbind().on('click', function(e){
            $(this).parent().find('.custom_select_list').fadeToggle(300);
        });

        $('#tag_share_button').unbind().on('click', function(){
            $('#tag_menu_who').show();
            $('#tag_menu_content').hide();
        });

        customSelect.find('.custom_select_list').hide();
        customSelect.find('.custom_select_list .custom_select_item').on('click',
            function(e){
                handleCustomSelect($(this));
            }
        );

        // figure out where place menu
        var slope = 1 - menu.width() / $(window).width();

        menu.hide().css({'top': h + 85, 'left': slope * w, 'zIndex': z.menu}).fadeIn(300, function(){});

        $('#lev_comment_box').val('What do you think...')
            .select()
            .focus()
            .on('click', function(){$(this).select()});

        $('html, body').animate({
            scrollTop: h - 100
        }, 500, callback);
    }

    function handleCustomSelect(option){
        var customSelect = option.parent().parent();
        console.log();
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
                $('#lev_comment_box').select();
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
