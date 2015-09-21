var mysql = require('mysql');

var dbClass = function(){
    console.log('MYSQL obj created');
    this.conn = mysql.createConnection({
        host: config.db.server,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.name,
        dateStrings: 'DATE' // most annoying feature that I had to account for
    });

    this.addTagEntry = function(fileID, t, callback){
        var ts = app.moment().format("YYYY-MM-DD HH:mm:ss");
        var q = "INSERT INTO tag (url, file_id, window_width, window_height, share_status, pulse_text, thoughts, zoom, pulsePos, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        var params = [t.url, fileID, t.width, t.height, t.share, t.pulseText, t.thoughts, t.zoom, t.pulsePos, ts];
        runQuery(q, params, callback);
    }

    this.saveTagText = function(t, callback){
        var q = 'UPDATE tag SET pulse_text = ? WHERE file_id = ?';
        var params = [t.thoughts, t.id];
        runQuery(q, params, callback);
    }

    function runQuery(q, params, callback){
        app.db.conn.query(q, params, callback);
    }

}

module.exports = new dbClass();
