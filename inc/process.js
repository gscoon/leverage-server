var fs = require('fs');
var path = require('path');

module.exports = function(ea){
    return new processClass(ea);
}

function processClass(expressApp){

    this.handleRequest = function (req, res, next){

        if(typeof req.query.which === 'undefined') return res.end('Bad query');

        var httpObj = {
            req: req,
            res: res,
            next: next
        }

        switch(req.query.which){
            case 'tag_menu':
                returnTagMenu(httpObj);
                break;
            case 'save_tag':
                saveTag(httpObj);
                break;
            case 'save_image':
                saveImage(httpObj);
                break;
            case 'save_tag_text':
                saveTagText(httpObj);
                break;
            case 'save_tag_chain':
                res.send('work in progress');
                break;
        }

    }

    function returnTagMenu(httpObj){
        httpObj.res.render('tag_menu');
    }

    function saveTag(httpObj){
        var id = returnRandID(15);
        if(typeof httpObj.req.body.data === 'undefined') return httpObj.res.end('Missing vars');

        var tagObj = JSON.parse(httpObj.req.body.data);
        app.db.addTagEntry(id, tagObj, function(err, results){
            console.log(err, results);
            httpObj.res.send({success:(err == null), id:id});
        });
    }

    function saveTagText(httpObj){
        if(typeof httpObj.req.body.data === 'undefined') return httpObj.res.end('Missing vars');

        var tagObj = JSON.parse(httpObj.req.body.data);
        app.db.saveTagText(tagObj, function(err, results){
            console.log(err, results);
            httpObj.res.send({success:(err == null)});
        });
    }

    function saveImage(httpObj){
        if(typeof httpObj.req.body.data === 'undefined') return httpObj.res.end('Missing vars');

        var imgObj = JSON.parse(httpObj.req.body.data);

        if(imgObj.type != 'target' && imgObj.type != 'generic' && imgObj.type != 'meme')
            return console.log('bad type');

        var savePath = path.resolve(__dirname,'../files/{0}/{1}.{2}'.format(imgObj.type, imgObj.fileID, imgObj.ext));
        var imageBuffer = decodeBase64Image(imgObj.str);

        fs.writeFile(savePath, imageBuffer.data, function(err) {
            console.log('image_saved', err, app.moment().format("YYYY-MM-DD HH:mm:ss"));
            httpObj.res.send('image saved | ' + imgObj.type);
        });
    }

    function decodeBase64Image(dataString) {
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
        response = {};

        if(matches.length !== 3)
            return new Error('Invalid input string');


        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');

        return response;
    }

    function returnRandID(len){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < len; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }


}
