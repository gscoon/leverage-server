var mysql = require('mysql');
var pg = require('pg');

var dbClass = function(){

    this.addTagEntry = function(fileID, t, callback){
        var ts = app.moment().format("YYYY-MM-DD HH:mm:ss");
        var q = "INSERT INTO tag (url, file_id, window_width, window_height, share_status, pulse_text, thoughts, zoom, pulsePos, timestamp) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)";
        var params = [t.url, fileID, t.width, t.height, t.share, t.pulseText, t.thoughts, t.zoom, t.pulsePos, ts];
        pqQuery(q, params, callback);
    }

    this.saveTagText = function(t, callback){
        var q = 'UPDATE tag SET pulse_text = $1 WHERE file_id = $2';
        var params = [t.thoughts, t.id];
        pqQuery(q, params, callback);
    }


    function pqQuery(q, params, callback){
        pg.connect(config.pgDB.connStr, function(err, client, done) {
            console.log('Postgres Obj Created', err);
            client.query(q, params, function(err, result){
                done();
                callback(err, result);
            });
        });
    }

}

module.exports = new dbClass();
