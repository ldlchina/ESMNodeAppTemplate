var addRoute = function(options){
    if(!options.expressApp)
        return this;
        
    var expressApp = options.expressApp;
   
    /**********************************************************************/
    // Add the route implementation here
    /**********************************************************************/
    
    expressApp.get('/', function(req, res, next){
        console.log('get ==> /');
		
		res.redirect('/files');
    });
    
	expressApp.get('/files', function(req, res, next){
        console.log('get ==> /files');
		
		// send out your frontend page here
		res.send('respond from  /files');
    });
	
	expressApp.get('/files/:fileid', function(req, res, next){
        console.log('get ==> /files/:fileid');
		
		// send out your frontend page here
		res.send('respond from  /files/:fileid');
    });
	
    return this;
};


/**********************************************************************/
// Exports
/**********************************************************************/

module.exports = addRoute;