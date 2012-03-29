var socket = io.connect(document.location.href);

// on connection to server, ask for user's name with an anonymous callback
socket.on('connect', function() {
	console.log("client connected");
});

socket.on('updatechat', function (data) {
	$("#chatList").append(getList(data));
});

// listener, whenever the server emits 'updateusers', this updates the username list
socket.on('updateusers', function(data) {
    $('#users').empty();
    $.each(data, function(key, value) {
        $('#users').append('<div>' + key + '</div>');
    });
});
socket.on('disconnect', function () {
	console.log("disconnected");
});

function sendchat() {
    var message = $('#chatField').val();
    $('#chatField').val('');
    // tell server to execute 'sendchat' and send along one parameter
    socket.emit('sendchat', message);
}
function getList(data) {
	data = data.replace(/</g, '&lt;').replace(/>/g, '&gt;');
	return "<li class='form-search'>" + data +  '</li>';
}

// on load of page
$(function() {
	function sendChat() {
        var message = $('#chatField').val();
        $('#chatField').val('');
		$('#chatField').focus();
        // tell server to execute 'sendchat' and send along one parameter
        socket.emit('sendchat', message);
    }
    // when the client clicks SEND
    $('#chatFieldsend').click(function() {
        sendChat();
    });

    // when the client hits ENTER on their keyboard
    $('#chatField').keypress(function(e) {
        if (e.which == 13) {
            sendChat();
        }
    });
	$('#chatField').focus();
});