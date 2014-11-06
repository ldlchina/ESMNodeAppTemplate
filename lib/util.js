var dateFormat = require('dateformat'); 
var uuid = require('node-uuid'); 
var crypto = require('crypto');
var nconf = require('nconf');

// Load config settings.
var config = nconf.argv().env().file({ file: __dirname + '../conf.json' });
var serviceConf = config.get(config.get('build'));

var normalizeDateTime = function(dateTime){
	var isoDate = dateFormat(dateTime, "isoUtcDateTime"); // 2012-11-09T13:44:01Z
	return isoDate;
}

var getCurrentDateTime = function(){
	return normalizeDateTime(new Date()); //2012-11-09T13:44:01Z
}

var generateGUID = function(){
	return uuid.v1(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a'
}

var hash = function (content) {
    return crypto.createHash('sha1').update(content).digest('hex');
}

var getClientIp = function (req) {
     var ipAddress;
     // The request may be forwarded from local web server.
     var forwardedIpsStr = req.header('x-forwarded-for');
     if (forwardedIpsStr) {
         // 'x-forwarded-for' header may return multiple IP addresses in
         // the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
         // the first one
         var forwardedIps = forwardedIpsStr.split(',');
         ipAddress = forwardedIps[0];
     }
     if (!ipAddress) {
         // If request was not forwarded
         ipAddress = req.connection.remoteAddress;
     }
     return ipAddress;
 }

var getFileExtension = function(filename){
	if(!filename || typeof(filename) != 'string'){
		return null;
	}

	var index = filename.lastIndexOf('.');
	if(index == -1){
		return null;
	}

	return filename.substr(index+1);
}
 

var internalErr = function(){
	return new Error('InternalError');
}

module.exports.normalizeDateTime = normalizeDateTime;
module.exports.getCurrentDateTime = getCurrentDateTime;
module.exports.generateGUID = generateGUID;
module.exports.hash = hash;
module.exports.getClientIp = getClientIp;
module.exports.getFileExtension = getFileExtension;
module.exports.internalErr = internalErr;