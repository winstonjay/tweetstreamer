
/* load dotenv and our configuration varibles */
require('dotenv').config({ silent: true })

/* Third party requirement */
const express = require('express')
const http = require('http')
const Twit = require('twit')
const sanitizeHtml = require('sanitize-html')

/* local requirments */
var filterTweets = require("./utils.js")


/* init server / express */
const app = express()
const server = http.createServer(app)
const io = require('socket.io').listen(server)


app.use(function(req, res, next) {
  res.setHeader(
    "Content-Security-Policy", 
    "connect-src 'self' https://ajax.googleapis.com/ wss://" + process.env.HostName
  );
  return next();
});

/* set static path that we wanna serve from 
eg: serve from 'public' but render as '/static/ */
app.use('/static', express.static('public'))


/* process.env.PORT for heroku */
server.listen(process.env.PORT || 8080);
console.log('starting server')


/* normal express routing */
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// Handle 404 - Keep this as a last route
app.use(function(req, res, next) {
    res.status(400);
    res.sendFile(__dirname + '/404.html');
});


/* Twit set up with credentials */
var Tweet = new Twit({
  consumer_key:         process.env.Consumer_Key,
  consumer_secret:      process.env.Consumer_Secret,
  access_token:         process.env.Access_Token,
  access_token_secret:  process.env.Access_Token_Secret,
});

/* last tweet monitoring so we don't get massive repeats 
 some how this kept happening even after blocking retweets */
var lastTweet = "";

io.sockets.on('connection', function (socket) { /* this probs needs sorting */

  /* init our twitter streamer */
  var stream = Tweet.stream('statuses/filter', { track: 'idiot', language: 'en' });

  /* listen to tweets as they come */
  stream.on('tweet', function (tweet) {

    setTimeout(function () { 
    /* this timeout function seems to do nothing, 
    need to find another way to try and limit the 
    flow of tweets */
      text = filterTweets(tweet.text);
      /* tweet would return false if its a retweet */
      if (text != false) { 
        if (text != lastTweet) {
          lastTweet = text;
          text = sanitizeHtml(text);
          // console.log(text); /* when debugging/local uncomment */
          /* send the tweets to the page */
          io.sockets.volatile.emit('streamer', text);
        }
      } 
    }, 500);
  });

  socket.on('disconnect', function () {
    console.log('disconnect')
  });
});