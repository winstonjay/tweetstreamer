require('dotenv').config({ silent: true });

const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const Twit = require('twit')
const io = require('socket.io').listen(server);
const sanitizeHtml = require('sanitize-html');

app.use('/static', express.static('public'))

server.listen(process.env.PORT || 3000);
console.log('starting')


var filterTweets = require("./utils.js");

// routing
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

var watchList = ['idiot'];
var Tweet = new Twit({
  consumer_key:         process.env.Consumer_Key,
  consumer_secret:      process.env.Consumer_Secret,
  access_token:         process.env.Access_Token,
  access_token_secret:  process.env.Access_Token_Secret,
});

var lastTweet = "";
io.sockets.on('connection', function (socket) {
  // console.log('Connected');


  var stream = Tweet.stream('statuses/filter', { track: 'idiot', language: 'en' });

  
  stream.on('tweet', function (tweet) {
    setTimeout(function () {
      text = filterTweets(tweet.text);
      if (text != false) {
        if (text != lastTweet) {
          lastTweet = text;
          text = sanitizeHtml(text);
          console.log(text);
          io.sockets.volatile.emit('streamer', text);
        }
      } 
      // else {
      //   console.log('filter tweet')
      // }
    }, 500);
  });


  socket.on('disconnect', function () {
    // clearTimeout(tweets);
    console.log('disconnect')
  });
});