var sio = require('socket.io');
var parseCookie = require('express/node_modules/connect').utils.parseCookie;

//io holds all sockets
var io;
module.exports = function(app, sessionStore) {
	io = sio.listen(app);
	io.configure(function() {
	    io.set('log level', 1);
	    io.set("transports", ["xhr-polling"]);
	});
	
	io.set('authorization', function (data, accept) {
	    if (data.headers.cookie) {
	        data.cookie = parseCookie(data.headers.cookie);
			//On Cloud Foundry, we should use jsessionid as the session cookie name
			//If that does not exist, try to use other default cookie names
	        data.sessionID = data.cookie['jsessionid'] || data.cookie['connect.sid'] || data.cookie['express.sid'];
	        // (literally) get the session data from the session store
	        sessionStore.get(data.sessionID, function (err, session) {
	            if (err || !session) {
	                // if we cannot grab a session, turn down the connection
	                accept('Error', false);
	            } else {
	                // save the session data and accept the connection
	                data.chatUser = session.user;
	                accept(null, true);
	            }
	        });
	    } else {
	       return accept('No cookie transmitted.', false);
	    }
	});	
		
    io.sockets.on('connection',
    function(socket) {
        // when the client emits 'sendchat', this listens and executes
        socket.on('sendchat',
        function(data) {
			if(socket.handshake && socket.handshake.chatUser) {
				data = socket.handshake.chatUser + ": " + data;
			}
	        //echo back to ALL sockets
            io.sockets.emit('updatechat', data);
        });

		if(socket.handshake && socket.handshake.chatUser) {
			io.sockets.emit('updatechat', "SYSTEM: '" + socket.handshake.chatUser + "' just joined the chat");
		}
		
    });
}