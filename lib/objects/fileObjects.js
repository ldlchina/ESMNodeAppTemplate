var util = require('../util.js');


var FileObjectFactory = function () {};

FileObjectFactory.apiFileObject = function (options) {
	options = options || {};

	return {
		"type": "file",
		"id": options.id || util.generateGUID(),
		"name": options.name,
		"description": options.description
	};
};


module.exports = FileObjectFactory;