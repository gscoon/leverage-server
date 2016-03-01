var mysql = require('mysql');

var dbClass = function(){
	var conn;
	
	startConnection();
	
	function startConnection(){
		conn = mysql.createConnection(config.db);
		
		conn.on('error', function(err) {
			console.log('db error', err);
			// Connection to the MySQL server is usually lost due to either 
			//server restart, or a connnection idle timeout
			if(err.code === 'PROTOCOL_CONNECTION_LOST')
				  startConnection();                         
		})
	}
	
	this.getWebshot = function(id, cb){
		var q = "SELECT * FROM webshot WHERE spot_id = ?";
		var params = [id];
        runQuery(q, params, cb);
	}
	
	this.setWebshot = function(obj, cb){
		var ts = app.moment().format("YYYY-MM-DD HH:mm:ss");
		var q = "INSERT INTO webshot (spot_id, details, timestamp) VALUES (?, ?, ?)";
		var params = [obj.id, JSON.stringify(obj), ts];
        runQuery(q, params, cb);
	}


    this.getUserTags = function(t, callback){
        var limit = ('limit' in t)?t.limit:10;
        var q = "SELECT t.*, u.user_image, u.name as user_name FROM tag t JOIN puser u ON u.user_id = t.user_id WHERE t.user_id = ? ORDER BY t.timestamp DESC LIMIT ?";
        var params = [t.uid, t.limit];
        runQuery(q, params, callback);
    }

    this.saveTag = function(t, callback){
        var ts = app.moment().format("YYYY-MM-DD HH:mm:ss");
        var q = "INSERT INTO tag (tag_id, file_id, user_id, chain_id, url, page_title, share_status, inner_text, thoughts, zoom, placement, family, timestamp) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?) RETURNING *";
        var params = [t.id, t.fid, t.uid, t.cid, t.url, t.pageTitle, t.share, t.pulseText, t.thoughts, t.zoom, t.pulsePos, t.family, ts];
        runQuery(q, params, callback);
    }
	
	this.saveSpot = function(s, callback){
		var ts = app.moment().format("YYYY-MM-DD HH:mm:ss");
		var q = "INSERT INTO spot (spot_id, spot_json, user_id, timestamp) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE spot_json = ?";
		var spot = JSON.stringify(s.spot);
		var params = [s.id, spot, s.uid, ts, spot];
		runQuery(q, params, callback);
	}
	
	this.getSpot = function(id, callback){
		var q = "SELECT * FROM spot WHERE spot_id = ?";
		var params = [id];
		runQuery(q, params, callback);
	}
	
	this.addUser = function(u, callback){
		var ts = app.moment().format("YYYY-MM-DD HH:mm:ss");
		var q = "INSERT INTO user (name, details, facebook_id, timestamp) VALUES (?, ? ,? ,?) ON DUPLICATE KEY UPDATE details = ?, timestamp = ?";
		var d = JSON.stringify(u.details);
		var params = [u.name, d, u.fbid, ts, d, ts];
		runQuery(q, params, callback);
	}
	
	this.getUserByID = function(uid, callback){
		var q = "SELECT * FROM user WHERE user_id = ?";
		var params = [uid];
		runQuery(q, params, callback);
	}


    function runQuery(q, params, callback){
        conn.query(q, params, callback);
    }


}

module.exports = new dbClass();
