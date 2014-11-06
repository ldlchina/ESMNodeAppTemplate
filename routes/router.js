var fs = require('fs');

var addRoute = function(options){
	if(!options.expressApp)
		return this;
	
	var expressApp = options.expressApp;
	
	function addFolder(relativeFolder){
		var routesPath = __dirname + '/' + relativeFolder;
		var routeModlues = fs.readdirSync(routesPath);
		
		routeModlues.forEach(function(element, index, array){
			var routeModulePath = routesPath  + '/' + element;
			try{
				var routeModule = require(routeModulePath);
						
				if(typeof routeModule === 'function'){
					routeModule(options);
				}
				else{
					console.error('Route Module "' + routeModulePath + '" does not export a function.');
				}
			}
			catch(err){
				console.error('Exception is caught when load route module "' + routeModulePath + '". ' + JSON.stringify(err));
			}
		});
	}
	
	function addAllSubFolders(){
		var routeModlues = fs.readdirSync(__dirname);
		
		routeModlues.forEach(function(element, index, array){
			var routeModulePath = __dirname + '/' + element;
			var stats = fs.statSync(routeModulePath);
			if(stats.isDirectory()){
				addFolder(element);
			}
		});
	}
	
	addAllSubFolders();
	
	/// catch 404 and forward to error handler
	expressApp.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
	});
	
	return this;
}

/**********************************************************************/
// Exports
/**********************************************************************/

module.exports = addRoute;