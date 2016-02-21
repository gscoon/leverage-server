// 1. Custom Scripts
// 2. jPulse.js
// 3. moment.js

function log(){
    var currentTime = '%c' + moment().format('YYYY-MM-DD HH:mm:ss');
    var args = returnArgLoop(arguments);
    args.unshift(currentTime, "color: #bbb;");
    console.log.apply(console, args);
}

function returnArgLoop(a){
    var args = [];
    for (var i = 0, j = a.length; i < j; i++)
        args.push(a[i]);
    return args;
}

function isURL(u){
    var re = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/
    return re.test(u);
}

function getURLProperties(u, callback){
    var fullURL = u;

    var re = /^https?\:\/\//
    if(!re.test(fullURL))
        fullURL = 'http://' + fullURL;

    // validate url
    if(!isURL(fullURL))
        return callback({status: false, error: 'Invalid URL'});

    // get host name
    var h = returnHostname(fullURL);
    var index = display = name = null;
    // figure out second level domain name
    var secondLevelDomain = returnSecondLevelDomain(h);
    if(!secondLevelDomain)
        return callback({status: false, error: 'Domain name error'});

    index = display = secondLevelDomain.second;
    name = secondLevelDomain.name;

    // make sure it doesnt already exist
    var isPrivate = (typeof privateURLs == 'object' && index in privateURLs);

    // create save object
    var sendObj = {full: fullURL, display: display, name: name, id:index};

    if(u.noFavicon)
        return callback({status: true, url: sendObj, isPrivate: isPrivate});

    getFavicon(display, function(favicon){
        sendObj.img = favicon;
        return callback({status: true, url: sendObj, isPrivate: isPrivate});
    });
}

function returnHostname(u){
    var l = document.createElement("a");
    l.href = u;
    return l.hostname;
}

function ts(m){
    if(typeof m == 'undefined')
        return new Date().getTime();

    var f = 'YYYY-MM-DD HH:mm:ss';
    if(typeof m == 'boolean')
        return moment().format(f);

    return moment(m).format(f);
}

function getDataURL(url, callback){
    // now get the dataURL using the image source from the previous page
    var img = new Image();
    var canvas = document.createElement('CANVAS');
    var ctx = canvas.getContext('2d');
    if(!/^http/.test(url))
        url = 'http:' + url;

    img.onload = function(){
        canvas.height = this.height;
        canvas.width = this.width;
        ctx.drawImage(this, 0, 0);
        var dataURL = canvas.toDataURL('png');
        callback({status:true, dataURL: dataURL});
        canvas = null;
    }

    img.onerror = function(){
        callback({status:false, dataURL: null});
    }

    img.src = url;
}

// this can probably be done best using the tab object and favIconURL property
function getFavicon(u, callback){
    var faviconURL = 'http://www.google.com/s2/favicons?domain=' + u;

    getDataURL(faviconURL, function(response){
        callback(response.dataURL)
    });

}

function updateTimeSince(dTag){
    if(typeof dTag === 'undefined')
        dTag = 'data-time-since';

    $('[' + dTag + ']').each(function(i, span){
        var ts = $(span).attr(dTag);

        if(typeof ts === 'string' && !isNaN(ts))
            ts = parseInt(ts)

        date = new Date(ts);

        var seconds = Math.floor((new Date() - date) / 1000);
        var intervalType;

        var interval = Math.floor(seconds / 31536000);
        if (interval >= 1) {
            intervalType = 'year';
        } else {
            interval = Math.floor(seconds / 2592000);
            if (interval >= 1) {
                intervalType = 'month';
            } else {
                interval = Math.floor(seconds / 86400);
                if (interval >= 1) {
                    intervalType = 'day';
                } else {
                    interval = Math.floor(seconds / 3600);
                    if (interval >= 1) {
                        intervalType = "hour";
                    } else {
                        interval = Math.floor(seconds / 60);
                        if (interval >= 1) {
                            intervalType = "minute";
                        } else {
                            interval = seconds;
                            intervalType = "second";
                        }
                    }
                }
            }
        }

        if (interval > 1 || interval === 0) {
            intervalType += 's';
        }

        var curr = interval + ' ' + intervalType + ' ago';
        $(span).html(curr);
    });
}


// ------------------------------------------------

function returnSecondLevelDomain(h){
    var d = ['com', 'co.uk', 'net', 'io', 'org', 'porn', 'sex', 'edu', 'gov'];
    var r = '(\.' + d.join('|\.') + ')$';
    var m = h.match(new RegExp(r));
    if(!m) return false; // no match
    var stripped = h.substring(0, m.index);
    var s = stripped.split('.');
    // return the second level domain
    return {name:s[s.length-1], second:s[s.length-1] + m[0]};
}

function randID(len){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < len; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}