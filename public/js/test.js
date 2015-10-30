$(function(){
    var img = new Image();
    img.setAttribute('crossOrigin', 'anonymous');
    img.onload = function(){
        console.log('aight aight');
        var canvas = document.createElement('CANVAS'),
        ctx = canvas.getContext('2d');
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        var dataURL = canvas.toDataURL('png');
        console.log(dataURL);
        canvas = null;
    };

    img.onerror = function(){
        console.log('na bruh');
    }
    img.src = '//cdn.sstatic.net/stackoverflow/img/favicon.ico?v=4f32ecc8f43d';
})
