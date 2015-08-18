if (!String.prototype.format) {
    String.prototype.format = function() {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function(match, number) {
          return typeof args[number] != 'undefined'
            ? args[number]
            : match
          ;
        });
    };
}

Object.prototype.extend = function(obj) {
    for (var i in obj) {
        if (obj.hasOwnProperty(i))
            this[i] = obj[i];
    }
};
