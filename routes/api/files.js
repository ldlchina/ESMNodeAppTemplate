var addRoute = function(options){
    if(!options.expressApp)
        return this;
        
    var expressApp = options.expressApp;
	var serverApp = options.serverApp;
	var fileMgr = serverApp.fileManager;
   
    /**********************************************************************/
    // Add the route implementation here
    /**********************************************************************/
    
    // get all files
    expressApp.get('/api/1.0/files', function(req, res, next){
        console.log('get ==> /api/1.0/files');
		
		fileMgr.getAllFiles(function(err, files){
			if(err){
				next(err);
			}
			else{
				res.status(200).send(files);
			}
		});
    });
	
	// create a new file
    expressApp.post('/api/1.0/files', function(req, res, next){
        console.log('post ==> /api/1.0/files');
		
		fileMgr.createFile(req, function(err, file){
			if(err){
				next(err);
			}
			else{
				res.status(200).send(file);
			}
		});
    });
	
	// query a file
    expressApp.get('/api/1.0/files/:fileid', function(req, res, next){
        console.log('get ==> /api/1.0/files/:fileid');
		
		var id = req.params.fileid;
		if(!id || id == ''){
			return;
		}
		
		fileMgr.queryFileById(id, function(err, file){
			if(err){
				next(err);
			}
			else{
				res.status(200).send(file);
			}
		});
    });
	
	// delete a file
    expressApp.delete('/api/1.0/files/:fileid', function(req, res, next){
        console.log('delete ==> /api/1.0/files/:fileid');
		
		var id = req.params.fileid;
		if(!id || id == ''){
			next(new Error('InvalidFileId'));
			return;
		}
		
		fileMgr.deleteFileById(id, function(err, fileid){
			if(err){
				next(err);
			}
			else{
				res.send(200);
			}
		});
    });
	
	// update a file
    expressApp.put('/api/1.0/files/:fileid', function(req, res, next){
        console.log('put ==> /api/1.0/files/:fileid');
		
		var id = req.params.fileid;
		if(!id || id == ''){
			next(new Error('InvalidFileId'));
			return;
		}
		
		if(!req.body){
			return;
		}
		
		var options = req.body;
		fileMgr.updateFileById(id, options, function(err, num){
			if(err){
				next(err);
			}
			else{
				res.status(200).send({"num":num});
			}
		});
    });
    
    return this;
};


/**********************************************************************/
// Exports
/**********************************************************************/

module.exports = addRoute;