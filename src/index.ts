// Example express application adding the parse-server module to expose Parse
// compatible API routes.

import { Request, Response } from "express";

const express = require("express");
const ParseServer = require("parse-server").ParseServer;
const { version } = require("package.json");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const ParseDashboard = require("parse-dashboard");
const logger = require('parse-server').logger;
const config = {
  databaseURI: process.env.DATABASE_URI,
  cloud: path.join(__dirname, "/cloud/main.js"),
  appId: process.env.APP_ID,
  masterKey: process.env.MASTER_KEY, //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL, // Don't forget to change to https if needed
  liveQuery: {
    classNames: [] as any, // List of classes to support for query subscriptions
  },
  allowClientClassCreation: false,
};
const dashboard = new ParseDashboard({
  apps: [
    {
      serverURL: process.env.SERVER_URL,
      appId: process.env.APP_ID,
      masterKey: process.env.MASTER_KEY,
      appName: "Dashboard",
    },
  ],
  users: [
    {
      user: process.env.DASHBOARD_USER,
      pass: process.env.DASHBOARD_PASSWORD,
    },
  ],
  useEncryptedPasswords: false,
});
const app = express();

// Serve static assets from the /public folder
// app.use('/public', express.static(path.join(__dirname, '/public')));
const api = new ParseServer(config);
app.use("/api", api);
if (process.env.NODE_ENV === "development") {
  app.use("/dashboard", dashboard);
}
// Parse Server plays nicely with the rest of your web routes
app.get("/", (_: Request, res: Response) => {
  res.status(200).send(`API version: ${version}`);
});

const port = process.env.PORT;
const httpServer = require("http").createServer(app);
httpServer.listen(port, () => {
  logger.info("parse-server-example running on port " + port + ".");
});
// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
