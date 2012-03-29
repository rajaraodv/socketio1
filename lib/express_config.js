var express = require('express');
var ejs = require('ejs');
var MemoryStore = express.session.MemoryStore;

var sessionStore = new MemoryStore();

exports.sessionStore =   sessionStore;

exports.configure = function(app) {
    app.configure(function() {
        app.use(express.cookieParser());
        app.use(express.session({
			store: sessionStore,
            secret: 'your secret here',
            key: 'jsessionid'
        }));
        app.set('views', __dirname + '/../views');
        app.set('view engine', 'ejs');
        app.set('view options', {
            layout: false
        });

        app.use(express.static(__dirname + '/../public'));
        app.use(express.bodyParser());
    });

    app.configure('development',
    function() {
        app.use(express.errorHandler({
            dumpExceptions: true,
            showStack: true
        }));
    });

    app.configure('production',
    function() {
        app.use(express.errorHandler());
    });
}