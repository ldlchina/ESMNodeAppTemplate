var db_util = require('./mongodbutil.js');

/**
 * @constructor
 * @param {Object} options
 *    	host - the IP or name of the host
 *    	port - the port
 *    	name - the database name
 */
DatabaseAccessor = function (options) { 
	this.host = options.host; 
	this.port = options.port;     
	this.dbname = options.name;
	this.collections = options.collections;
	
	var db_param = {
		'db_host': this.host,
		'db_port': this.port,
		'db_name': this.dbname
	};	
	this.data_base = db_util.opendb(db_param);
	
	this.get_collection = function (name) {
		return this.data_base.collection(name);
	};
};

DatabaseAccessor.prototype.shutdown = function() {
	db_util.shutdowndb(this.data_base);
};


/**
 * Qeury an object from the database
 * @param {String} colName the collection name.
 * @param {Object} queryObject
 * @param {Function} callback
 * @return this for chain
 */
 DatabaseAccessor.prototype.query = function(colName, queryObject, callback) {
	if(callback && typeof callback === 'function'){			
		db_util.query(this.get_collection(this.collections[colName]), queryObject
			, function(err, dbObjects){
				if(err || !dbObjects){
					callback(new Error("Fail to query the object"));
				}
				else{					
					var dbOBject = null;
					if(dbObjects.length > 0)
						dbOBject = dbObjects[0]; // get the first one.					
					
					// Convert the database object into business object. Remove the extra database interested data
					var appObject = convertFromDBObjectToBusinessObject(dbOBject);

					callback(null, appObject);
				}			
			});	
	}
		
	return this;
};


/**
 * Qeury objects from the database
 * @param {String} colName the collection name.
 * @param {Object} queryObject
 * @param {Function} callback
 * @return this for chain
 */
 DatabaseAccessor.prototype.queryItems = function(colName, queryObject, callback) {
	if(callback && typeof callback === 'function'){			
		db_util.query(this.get_collection(this.collections[colName]), queryObject
			, function(err, dbObjects){
				if(err || !dbObjects){
					callback(new Error("Fail to query the object"));
				}
				else{					
					var appObjects = [];

					var appObject = null;
					for (var i = 0; i < dbObjects.length; ++i) {
						// Convert the database object into business object. Remove the extra database interested data
						appObject =  convertFromDBObjectToBusinessObject(dbObjects[i]);	
						appObjects.push(appObject);
					}

					callback(null, appObjects);
				}			
			});	
	}
		
	return this;
};

/**
 * Add an object to the database
 * @param {String} colName the collection name.
 * @param {Object} appObject
 * @param {Function} callback
 * @return this for chain
 */
DatabaseAccessor.prototype.insert =  function(colName, appObject, callback) {
	// Append the extra database interested data.
	var dbObject = convertFromBusinessObjectToDBObject(appObject);
	
	db_util.insert (this.get_collection(this.collections[colName]), dbObject
		, function(err, dbObjects){
			
			if(typeof callback === 'function')
				callback(err, appObject); // Use the business object, other than the database object.
		});	
	
	return this;
};

/**
 * Update an object to the database
 * @param {String} colName the collection name.
 * @param {Object} queryObject
 * @param {Object} appObject
 * @param {Function} callback
 * @return this for chain
 */
DatabaseAccessor.prototype.update = function(colName, queryObject, appObject, callback) {
	db_util.update(this.get_collection(this.collections[colName]), queryObject, appObject, callback);

	return this;	
};

/**
 * Remove an object from the database
 * @param {String} colName the collection name.
 * @param {Object} queryObject
 * @param {Object} appObject
 * @param {Function} callback
 * @return this for chain
 */
DatabaseAccessor.prototype.remove = function(colName, queryObject, callback) {
	db_util.remove(this.get_collection(this.collections[colName]), queryObject, callback);

	return this;	
};

/**
 * Update an object with specified fields
 * @param {String} colName the collection name.
 * @param {Object} queryObject
 * @param {Object} doc
 * @param {Function} callback
 * @return this for chain
 */
DatabaseAccessor.prototype.findAndModify = function(colName, queryObject, doc, callback) {
	db_util.findAndModify(this.get_collection(this.collections[colName]), queryObject, doc, function (err, dbObject) {
		if (err) {
			callback(new Error("Fail to find and modify the object." ));
        }
		else {
			// Convert the database object into business object. Remove the extra database interested data
			var convertedObject = convertFromDBObjectToBusinessObject(dbObject);
			
			if (convertedObject != undefined)
				callback(null, convertedObject);
			else
				callback(new Error("Invalid object."));
		}
	});

	return this;	
};

/** Convert the business object to database object. The passed in object isn't changed.
* The function makes a shallow copy of the passed in business object and appends the extra database interested data.  Only two properties are appended which are '_id' and '_db_footer'.
* The '_id' property is used as the id of the MongoDB and it is indexed. We use the id of the business object as the id of MongoDB.
* All the database interested data, expect _id, are saved in the object '_db_footer'. The purpose we save all the data in the single object is to simplify the work to remove them.
* @param businessObject {Object}, the business object to be saved to database.
* @return {Object} database object 
*/
var convertFromBusinessObjectToDBObject = function(businessObject){

	if(!businessObject)
		return;	
	
	var dbObject = {};
	// Make a shallow copy.
	for (var prop in businessObject) {
	    dbObject[prop] = businessObject[prop];
	}
	
	// Add the extra data
	// 1. We want to control the format of id. It would be a GUID, a shorter integer or any other unique string. We don't want to use the id generated by MongoDB. 
	// 2. The _id is indexed by MongoDB by default. In the query functions, we pass in the object.id but query _id instead of id. We can gain a performance improvement.
	// So we assign the dbOjbect.id to database _id to guarantee they have the same value.
	if(dbObject.id)
		dbObject._id = dbObject.id;
	dbObject._db_footer = {visibility: true}; 
	
	return dbObject;
};

/** Convert the database object to business object. The passed in object isn't changed. It is an inverse operation of the function convertFromBusinessObjectToDBObject.
* It removes the properties appended by function convertFromBusinessObjectToDBObject. 
* @param dbObject {Object}, the database object read from database.
* @return {Object} business object 
*/
var convertFromDBObjectToBusinessObject = function(dbObject){

	if(!dbObject)
		return;
		
	var businessObject = {};
	// Make a shallow copy
	for (var prop in dbObject) {
	    businessObject[prop] = dbObject[prop];
	}
	
	// Remove the database 
	if(businessObject._id)
		delete businessObject._id;

	if(businessObject._db_footer)
		delete businessObject._db_footer;
	
	return businessObject;
};
/**********************************************************************/
// Exports
/**********************************************************************/
var createDBA = function(options){
	return new DatabaseAccessor(options);
};

module.exports = createDBA;
