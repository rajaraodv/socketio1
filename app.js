var express = require('express');

var host = process.env.VCAP_APP_HOST || "localhost";
var port = process.env.VCAP_APP_PORT || "3000";

var app = module.exports = express.createServer();

//load express configurations
var expressConfig = require('./lib/express_config');
expressConfig.configure(app);

//load routes (after configurations)
var routes  = require('./lib/routes');
routes(app);

app.listen(port, host);

//load sioLib
var sioLib = require("./lib/socketioLib");


//Pass app and also sessionStore from expressConfig so sio can get hold of session
sioLib(app, expressConfig.sessionStore);