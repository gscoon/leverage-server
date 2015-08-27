module.exports = function(ea){
    return new processClass(ea);
}

function processClass(expressApp){

    this.handleRequest = function (req, res, next){
        res.render('tag_menu');

        res.write('gotcha bitch');
    }

}
