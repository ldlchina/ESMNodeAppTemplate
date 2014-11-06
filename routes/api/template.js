var addRoute = function(options){
    if(!options.expressApp)
        return this;
        
    var expressApp = options.expressApp;
   
    /**********************************************************************/
    // Add the route implementation here
    /**********************************************************************/
    
    expressApp.get('/api/1.0/template', function(req, res, next){
        console.log('get ==> /api/1.0/template');
		
		res.send('respond from  /api/1.0/template');
    });
    
    return this;
};


/**********************************************************************/
// Exports
/**********************************************************************/

module.exports = addRoute;