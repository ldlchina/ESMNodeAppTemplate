var fileObjectFactory = require('./objects/fileObjects.js');
var util = require('./util.js');
var fs = require("fs");
var formidable = require("formidable");

/**
* @constructor
* @class FileManager
* @param {Object} options
*    	databaseAccessor - the database accessor
*/
var FileManager = function (options) {

	// Memory storage
	var _options = options || {};
	this._databaseAccessor = _options.databaseAccessor;
};

FileManager.prototype.errorList = {
	InvalidFileName:'InvalidFileName',
	InvalidFileId:'InvalidFileId'
};

FileManager.prototype.getAllFiles = function(cb){
	var _self = this;
	
	var queryObject = {};
	
	_self._databaseAccessor.queryItems("FILE", null, function(err, files){
		if(err || !files){
			cb(util.internalErr());
		}
		else{
			var apiObjects = [];
			
			files.forEach(function(item){
				apiObject =  fileObjectFactory.apiFileObject(item);	
				apiObjects.push(apiObject);
			});
			
			cb(null, apiObjects);
		}
	});
}

FileManager.prototype.createFile = function(req, cb){
	if(!req)
		return;
	
	var _self = this;
	
	var form = new formidable.IncomingForm();
  
	form.parse(req, function(err, fields, file) {
		if(err){
			cb(err);
			return;
		}
		
		var _options = {};
		_options.name = file.file.name;
		_options.description = fields.description;

		var newFile = fileObjectFactory.apiFileObject(_options);
		fs.renameSync(file.file.path, "./storage/" + newFile.id + ".png");
		
		_self._databaseAccessor.insert("FILE", newFile, cb);
	});
};

FileManager.prototype.addFile = function(options, cb){
	var _options = options || {};
	var _self = this;
	
	if(_options.name == ''){
		cb(new Error(_self.errorList.InvalidFileName));
		return;
	}
	
	var newFile = fileObjectFactory.apiFileObject(_options);
	_self._databaseAccessor.insert("FILE", newFile, cb);
};

FileManager.prototype.queryFileById = function(id, cb){
	var _self = this;
	
	if(!id || id == ''){
		cb(new Error(_self.errorList.InvalidFileId));
		return;
	}
	
	var queryObject = {};
	queryObject.id = id;
	
	_self._databaseAccessor.query("FILE", queryObject, function(err, file){
		if(err || !file){
			cb(util.internalErr());
		}
		else{
			file = fileObjectFactory.apiFileObject(file);
			cb(null, file);
		}
	});
}

FileManager.prototype.deleteFileById = function(id, cb){
	var _self = this;
	
	if(!id || id == ''){
		cb(new Error(_self.errorList.InvalidFileId));
		return;
	}
	
	var queryObject = {};
	queryObject.id = id;
	
	_self._databaseAccessor.remove("FILE", queryObject, function(err, file){
		if(err || !file){
			cb(util.internalErr());
		}
		else{
			cb(null, null);
		}
	});
}

FileManager.prototype.updateFileById = function(id, options, cb){
	if(!id || id == ''){
		cb(new Error(_self.errorList.InvalidFileId));
		return;
	}
	
	var _self = this;
	
	var queryObject = {};
	queryObject.id = id;
	
	var _options = options || {};
	_options.id = id;
	
	if(_options.name == ''){
		cb(new Error(_self.errorList.InvalidFileName));
		return;
	}
	
	var file = fileObjectFactory.apiFileObject(_options);
	_self._databaseAccessor.update("FILE", queryObject, file, cb);
}

var createFileManager = function(options){
	return new FileManager(options);
};

module.exports = createFileManager;