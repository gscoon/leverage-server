var mysql = require('mysql');
var moment = require('moment');

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
	
	this.saveSpot = function(s, callback){
		var ts = moment().format("YYYY-MM-DD HH:mm:ss");
		var q = "INSERT INTO spot (spot_id, webshot_id, url, spot_json, user_id, timestamp) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE spot_json = ?";
		var spot = JSON.stringify(s.spot);
		var params = [s.id, s.spot.webshotID, s.spot.url, spot, s.uid, ts, spot];
		runQuery(q, params, callback);
	}
	
	this.updateSpotDetails = function(id, s, callback){
		var q = "UPDATE spot SET spot_json = ? WHERE spot_id = ?";
		s = JSON.stringify(s);
		var params = [s, id];
		runQuery(q, params, callback);
	}
	
	this.getSpot = function(id, callback){
		var q = "SELECT s.*, u.details as 'user_details', u.name as 'user_name' FROM spot s JOIN user u ON u.user_id = s.user_id WHERE spot_id = ?";
		var params = [id];
		runQuery(q, params, callback);
	}
	
	// called after screenshot is saved from web
	this.getWebshot = function(id, cb){
		var q = "SELECT * FROM webshot WHERE spot_id = ?";
		var params = [id];
		runQuery(q, params, cb);
	}
	
	this.setWebshot = function(obj, cb){
		var ts = moment().format("YYYY-MM-DD HH:mm:ss");
		var q = "INSERT INTO webshot (spot_id, details, timestamp) VALUES (?, ?, ?)";
		var params = [obj.id, JSON.stringify(obj), ts];
		runQuery(q, params, cb);
	}


	this.getUserTags = function(t, callback){
		var limit = ('limit' in t)?t.limit:10;
		var q = "SELECT s.*, u.user_images, u.name as user_name, u.user_images FROM spot s JOIN user u ON u.user_id = s.user_id WHERE s.user_id = ? ORDER BY s.timestamp DESC LIMIT ?";
		var params = [t.uid, t.limit];
		runQuery(q, params, callback);
	}

	this.getPageTags = function(uid, url, callback){
		var q = "SELECT * FROM spot WHERE user_id = ? AND url = ?";
		var params = [uid, url];
		runQuery(q, params, callback);
	}


	
	this.addUser = function(u, callback){
		var ts = moment().format("YYYY-MM-DD HH:mm:ss");
		var q = "INSERT INTO user (name, details, facebook_id, create_timestamp, last_login_timestamp) VALUES (?, ? ,? ,?, ?) ON DUPLICATE KEY UPDATE details = ?, last_login_timestamp = ?";
		var d = JSON.stringify(u.details);
		var params = [u.name, d, u.fbid, ts, ts, d, ts];
		runQuery(q, params, callback);
	}
	
	this.getUserByID = function(uid, callback){
		var q = "SELECT * FROM user WHERE user_id = ?";
		var params = [uid];
		runQuery(q, params, callback);
	}
	
	this.updateUserField = function(uid, field, d, callback){
		var q = "UPDATE user SET {0} = ? WHERE user_id = ?".format(field);
		if(typeof d == 'object')
			d = JSON.stringify(d);
		var params = [d, uid];
		runQuery(q, params, callback);
	}

	// extension stuff
	this.getUserByExtension = function(eid, callback){
		var q = "SELECT e.*, u.* FROM user_extension e LEFT JOIN user u ON e.user_id = u.user_id WHERE e.extension_id = ?";
		var params = [eid];
		runQuery(q, params, callback);
	}

	this.addNewExtension = function(eid, callback){
		var ts = moment().format("YYYY-MM-DD HH:mm:ss");
		var q = "INSERT INTO user_extension (extension_id, create_timestamp) VALUES (?, ?)";
		var params = [eid, ts];
		runQuery(q, params, callback);
	}

	this.updateExtensionUser = function(eid, uid, callback){
		var q = "UPDATE user_extension SET user_id = ? WHERE extension_id = ?";
		var params = [uid, eid];
		runQuery(q, params, callback);
	}


	function runQuery(q, params, callback){
		conn.query(q, params, callback);
	}


}

module.exports = new dbClass();
