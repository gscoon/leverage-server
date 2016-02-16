var pg = require('pg');
var mysql = require('mysql');

var dbClass = function(){

    this.conn = mysql.createConnection(config.db);

    this.test = function(id){
        var q = "SELECT * FROM test WHERE id = ?";
        var params = [id];
        runQuery(q, params, function(a, b){
            console.log(a, b);
        })
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

    this.getTagDetails = function(tid, callback){
        var q = "SELECT t.*, u.name, u.user_image, c.name as chain_name FROM tag t JOIN puser u ON u.user_id = t.user_id JOIN chain c ON c.chain_id = t.chain_id WHERE t.tag_id = ?";
        var params = [tid];
        runQuery(q, params, callback);
    }

    this.deleteTag = function(t, callback){
        var q = 'DELETE FROM tag WHERE tag_id = ? AND user_id = ?';
        var params = [t.id, t.uid];
        runQuery(q, params, callback);
    }

    this.saveTagText = function(t, callback){
        var q = 'UPDATE tag SET thoughts = ? WHERE tag_id = ?';
        var params = [t.thoughts, t.id];
        runQuery(q, params, callback);
    }

    this.updateTagChain = function(tid, cid, callback){
        var q = 'UPDATE tag SET chain_id = ? WHERE tag_id = ?';
        var params = [cid, tid];
        runQuery(q, params, callback);
    }

    this.updateSingleFieled = function(f, callback){
        var q = 'UPDATE ' + f.table + ' SET ' + f.setField + ' = ? WHERE ' + f.whereField + ' = ?';
        var params = [f.setValue, f.whereValue];
        runQuery(q, params, callback);
    }

    this.getSingleField = function(o, callback){
        var q = 'SELECT ' + o.selectField + ' FROM ' + o.table + ' WHERE ' + o.whereField + ' = ?';
        var params = [o.whereValue];
        runQuery(q, params, function(err, results){
            var ret = null;
            if(!err && results.length > 0)
                ret = results[0][o.selectField];

            callback(err, ret);
        });
    }

    this.getUserByID = function(id, callback){
        var q = "SELECT * FROM p_user WHERE user_id = ?";
        var params = [id];
        runQuery(q, params, callback);
    }

    this.getUserChains = function(uid, callback){
        var q = "SELECT c.*, cc.ccount FROM puser_chain pc JOIN chain c ON c.chain_id = pc.chain_id LEFT JOIN (SELECT chain_id, count(chain_id) as ccount FROM tag WHERE user_id = ? GROUP BY chain_id) cc ON cc.chain_id = c.chain_id  WHERE pc.user_id = ?";
        var params = [uid, uid];
        runQuery(q, params, callback);
    }

    this.deleteChain = function(cid, callback){
        var q = "DELETE FROM chain WHERE chain_id = ?";
        var params = [cid];
        runQuery(q, params, callback);
    }

    this.searchForExtensionByID = function(id, callback){
        var q = "SELECT u.user_id, u.name, u.user_image, u.default_chain_id FROM puser u JOIN puser_extension ext ON ext.user_id = u.user_id WHERE ext.extension_id = ?"
        var params = [id];
        runQuery(q, params, callback);
    }

    this.saveNewChain = function(chainName, isDefault, callback){
        var ts = app.moment().format("YYYY-MM-DD HH:mm:ss");
        var q = "INSERT INTO chain (name, is_default, timestamp) VALUES (?,?,?) RETURNING chain_id";
        var params = [chainName, isDefault, ts];
        runQuery(q, params, callback);
    }

    this.saveUserChain = function(u, c, callback){
        var ts = app.moment().format("YYYY-MM-DD HH:mm:ss");
        var q = "INSERT INTO puser_chain (user_id, chain_id, timestamp) VALUES (?,?,?) ";
        var params = [u, c, ts];
        runQuery(q, params, callback);
    }

    this.getPageTags = function(uid, url, callback){
        var q = "SELECT t.*, u.name, u.user_image, c.name as chain_name FROM tag t JOIN puser_chain uc ON uc.chain_id = t.chain_id JOIN puser u ON u.user_id = t.user_id JOIN chain c ON c.chain_id = t.chain_id WHERE uc.user_id = ? AND t.url = ?";
        var params = [uid, url];
        runQuery(q, params, callback);
    }

    this.saveTagComment = function(c, callback){
        var ts = app.moment().format("YYYY-MM-DD HH:mm:ss");
        var q = "INSERT INTO tag_comment (comment_id, tag_id, user_id, body, timestamp) VALUES (?,?,?,?,?)";
        var params = [c.id, c.tag_id, c.user_id, c.body, ts];
        runQuery(q, params, callback);
    }

    this.getTagComments = function(tid, callback){
        var q = "SELECT tc.*, u.name from tag_comment tc JOIN puser u ON u.user_id = tc.user_id WHERE tc.tag_id = ?";
        var params = [tid];
        runQuery(q, params, callback);
    }


    function runQuery(q, params, callback){
        app.db.conn.query(q, params, callback);
    }


}

module.exports = new dbClass();
