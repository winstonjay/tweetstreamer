# Tweet Streamer
Web application that live monitors tweets that contain the term `'idiot'` through the sites streaming API. App uses a websocket server with a Node.js backend.
![Site demo](/public/demo.jpg)

## Use
You will need Twitter API authentication tokens and a [Twitter developer account](https://developer.twitter.com/); you'll also need to create a `.env` and define your tokens here as shown in the `.env.example` file.

`npm install` to install all required node modules.

`npm start` to run; default port is `8080`.