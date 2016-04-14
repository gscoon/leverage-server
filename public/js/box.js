(function(){
    //defaults
    var dim = {
        targetLeft:500,
        targetTop: 300,
        left:400,
        top:200,
        height:400,
        width:400,
        buffer:50,
        z: 9999,
        type: 'absolute'
    }

    var cp = window.chickenPox || window.pox;

    cp.poxTable = {
        id: 'pox-table',
        div: null,
        isVisible: false
    }

    var setAlready = false;
    var docWidth = $(document).width();
    var docHeight = $(document).height();

    // put boxes on the page
    var setBox = cp.showResizeBox = function(d){
        console.log('setBox');
        // use given box
        if(typeof d == 'object')
            dim = $.extend(dim, d);

        // update crop
        if(setAlready){
            cp.updateCrop(dim);
        }
        else{
            insertDivs();
            draggableEvents();
        }

        setAlready = true;

        cp.poxTable.div = $('#' + cp.poxTable.id);
        cp.poxTable.div.show();

        cp.poxTable.div.css({
            zIndex: dim.z,
            visibility: 'visible'
        }).show();

        showPoxBox();

        $('#pox-table').css({
            minHeight: docHeight
        });

        $('.pox-table-row1, #pox-table-tr1').css({
            height: dim.top,
            maxHeight: dim.top
        })
        .attr('height', dim.top);

        $('.pox-table-col1').css({
            width: dim.left
        });

        $('#pox-table-lastcell').css({
            width: docWidth - dim.left - dim.width,
            height: docHeight - dim.top - dim.height
        });

        $('#pox-table-tr1, .pox-table-col1, .pox-table-row1').show();
        if(dim.top == 0)
            $('#pox-table-tr1, .pox-table-row1').hide();

        if(dim.left == 0)
            $('.pox-table-col1').hide();

        $('#pox-box-inner').css({
            width: dim.width,
            height: dim.height
        });

        return dim;
    }

    var hidePoxBox = cp.hidePoxBox = function(){
        cp.poxTable.div.hide();
        cp.poxTable.div.css({visibility:'hidden'});
        cp.poxTable.isVisible = false;
    }

    var showPoxBox = cp.showPoxBox = function(){
        cp.poxTable.div.show();
        cp.poxTable.div.css({
            visibility:'visible',
            zIndex: dim.z
        });

        cp.poxTable.isVisible = true;
    }

    // used to store
    var dragon = false;

    function insertDivs(){
        var html = '<table id="pox-table" cellspacing="0" cellpadding="0"><tr id="pox-table-tr1"> <td id="pox-t1" class="pox-table-col1 pox-table-row1"></td><td class="pox-table-row1"></td><td class="pox-table-row1"></td></tr><tr> <td class="pox-table-col1"></td><td id="pox-box-inner"> <div class="pox-draggable" id="pox-draggable-left" data-direction="left"></div><div class="pox-draggable" id="pox-draggable-right" data-direction="right"></div><div class="pox-draggable" id="pox-draggable-top" data-direction="top"></div><div class="pox-draggable" id="pox-draggable-bottom" data-direction="bottom"></div><div class="pox-draggable_corner" id="pox-draggable_corner_tl" data-direction="tl"></div><div class="pox-draggable_corner" id="pox-draggable_corner_tr" data-direction="tr"></div><div class="pox-draggable_corner" id="pox-draggable_corner_bl" data-direction="bl"></div><div class="pox-draggable_corner" id="pox-draggable_corner_br" data-direction="br"></div></td><td></td></tr><tr> <td class="pox-table-col1"></td><td></td><td id="pox-table-lastcell"></td></tr></table>';

        //<div id="target-spot"></div>
        $('body').append(html);
    }

    function draggableEvents(){
        $('.pox-draggable, .pox-draggable_corner').unbind().on('mousedown', function(e){
            var direction = $(this).data('direction');
            //$('.pox-draggable').css({visibility:'hidden'});
            dragon = {
                direction: direction,
                startX: e.pageX,
                startY: e.pageY,
                startW: dim.width,
                startH: dim.height,
                startLeft: dim.left,
                startTop: dim.top
            };
        });
    }

    function unlockDrag(){
        //$('.pox-draggable').css({visibility:'visible'});
        dragon = false;
    }

    $(window).on('resize', function(){
        if(!cp.poxTable.isVisible)
            return; 

        docWidth = $(document).width();
        docHeight = $(document).height();
        setBox();
    })

    // detect mouse movements when dragging
    $(document).on('mouseup', function (e) {
        if(dragon)
            return unlockDrag();
    });

    $(document).on('mousemove', function (e) {
        if(!dragon) return;

        var x = e.pageX;
        var y = e.pageY;

        switch(dragon.direction){
            case 'left':
                left();
                break;
            case 'right':
                right();
                break;
            case 'top':
                top();
                break;
            case 'bottom':
                bottom();
                break;
            case 'tl':
                top();
                left();
                break;
            case 'tr':
                top();
                right();
                break;
            case 'bl':
                bottom();
                left();
                break;
            case 'br':
                bottom();
                right();
        }

        function left(){
            if(x > dim.targetLeft - dim.buffer)
                return;
            dim.left = dragon.startLeft - (dragon.startX - x);
            dim.width = dragon.startW + (dragon.startX - x);
        }

        function right(){
            if(x < dim.targetLeft + dim.buffer)
                return;
            dim.width = dragon.startW - (dragon.startX - x);
        }

        function top(){
            if(y > dim.targetTop - dim.buffer)
                return;
            dim.top = dragon.startTop - (dragon.startY - y);
            dim.height = dragon.startH + (dragon.startY - y);
        }

        function bottom(){
            if(y < dim.targetTop + dim.buffer)
                return;
            dim.height = dragon.startH - (dragon.startY - y);
        }
        console.log(dragon);
        setBox();
    });
})();
