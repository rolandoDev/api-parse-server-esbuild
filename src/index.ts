// Example express application adding the parse-server module to expose Parse
// compatible API routes.

const express =  require("express");
const ParseServer = require("parse-server").ParseServer;
const { version } = require('package.json');
const path = require("path");
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const config = {
  databaseURI: process.env.DATABASE_URI,
  cloud: path.join(__dirname, '/cloud/main.js'),
  appId: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY, //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL, // Don't forget to change to https if needed
  liveQuery: {
    classNames: [], // List of classes to support for query subscriptions
  },
  silent: true,
};

const app = express();

// Serve static assets from the /public folder
// app.use('/public', express.static(path.join(__dirname, '/public')));
const api = new ParseServer(config);
app.use("/api", api);

// Parse Server plays nicely with the rest of your web routes
app.get("/", (_, res) =>{
  res
    .status(200)
    .send(
      `API version: ${version}`
    );
});

const port = process.env.PORT;

  const httpServer = require("http").createServer(app);
  httpServer.listen(port,  ()=> {
    console.log("parse-server-example running on port " + port + ".");
  });
  // This will enable the Live Query real-time server
  ParseServer.createLiveQueryServer(httpServer);
