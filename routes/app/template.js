var addRoute = function(options){
    if(!options.expressApp)
        return this;
        
    var expressApp = options.expressApp;
   
    /**********************************************************************/
    // Add the route implementation here
    /**********************************************************************/
    
    expressApp.get('/template', function(req, res, next){
        console.log('get ==> /template');
		
		res.send('respond from  /template');
    });
    
    return this;
};


/**********************************************************************/
// Exports
/**********************************************************************/

module.exports = addRoute;