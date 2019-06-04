const socket = io();
const tweets = document.querySelector('#tweetd');
const idiot = /\b(idiot)\b/ig;
const mention = /(@[\w\_]{1,15})/g;

socket.on('streamer', function(tweet) {
  let nodes = tweets.childNodes
  if (nodes.length >= 4){
    tweets.removeChild(nodes[0]);
  }
  let p = document.createElement('p');
  p.textContent = tweet;
  p.innerHTML = (p.innerHTML
                  .replace(idiot, '<strong>$1</strong>')
                  .replace(mention, '<em>$1</em>'));
  tweets.appendChild(p);
});