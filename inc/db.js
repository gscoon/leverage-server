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
        var q = 'UPDATE tag SET thoughts = $1 WHERE file_id = $2';
        var params = [t.thoughts, t.id];
        pqQuery(q, params, callback);
    }

    this.getUserByID = function(id, callback){
        var q = "SELECT * FROM p_user WHERE user_id = $1"
        var params = [id];
        pqQuery(q, params, callback);
    }

    this.searchForExtensionByID = function(id, callback){
        var q = "SELECT u.user_id, u.name, u.image_mini FROM puser u JOIN puser_extension ext ON ext.user_id = u.user_id WHERE ext.extension_id = $1"
        var params = [id];
        pqQuery(q, params, callback);
    }

    this.saveNewChain = function(chainName, callback){
        var ts = app.moment().format("YYYY-MM-DD HH:mm:ss");
        var q = "INSERT INTO chain (name, timestamp) VALUES ($1, $2)  RETURNING chain_id";
        var params = [chainName, ts];
        pqQuery(q, params, callback);
    }

    this.saveUserChain = function(u, c, callback){
        var ts = app.moment().format("YYYY-MM-DD HH:mm:ss");
        var q = "INSERT INTO puser_chain (user_id, chain_id, timestamp) VALUES ($1, $2, $3) ";
        var params = [u, c, ts];
        pqQuery(q, params, callback);
    }

    function pqQuery(q, params, callback){
        pg.connect(config.pgDB.connStr, function(err, client, done) {
            console.log('Postgres Obj Created', 'error', err);
            client.query(q, params, function(err, result){
                done();
                // if this is a select, only return the rows
                if(result && result.command == 'SELECT')
                    result = result.rows;
                callback(err, result);
            });
        });
    }

}

module.exports = new dbClass();
