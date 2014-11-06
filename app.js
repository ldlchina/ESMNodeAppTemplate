var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var serverApp =  require('./lib/serverApplication.js');

var app = express();

app.use(favicon(__dirname + '/frontend/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'frontend')));

require('./routes/router.js')({'expressApp': app, 'serverApp':serverApp});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
		res.status(err.status || 500).send({
			message: err.message,
			error: err
		});
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500).send({
        message: err.message,
        error: {}
    });
});


module.exports = app;