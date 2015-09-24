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
        httpObj.res.render('tag_menu', {user:{imgSmall:"data:image/png;base64,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"}});
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
