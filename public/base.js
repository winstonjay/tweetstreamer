$(document).ready(function(){
    /*connect to the socket server.*/
    var socket = io();
    var messages_recieved = [];
    socket.on('streamer', function(tweet) {

        if (messages_recieved.length >= 7){
            messages_recieved.shift()
        }        
        messages_recieved.push(tweet);

        var message = "";
        for (var i = 1; i < messages_recieved.length; i++) {
            if (messages_recieved[i] != "") {
                message += '<p>' + messages_recieved[i]+ '</p>';
            }
        }
        $('#tweetd').html( sanitizeHtml(message) );
    });
});