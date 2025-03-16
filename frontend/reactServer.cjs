// reactServer.cjs
// Uses common javascript to serve the react build folder (/dist)
// Source: https://github.com/osu-cs340-ecampus/react-starter-app
// Retrieved from: https://github.com/osu-cs340-ecampus/react-starter-app?tab=readme-ov-file#build-and-deploy
// This file was adapted from Oregon State University's CS340 Ecampus React Starter Guide

const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();

// Use the custom 'REACT_SERVER_PORT' port from .env, with a fallback to 6297
const PORT = process.env.REACT_SERVER_PORT || 6297;

// Serve the static files from the React app located in the build folder '/dist'
// React router will take over frontend routing
app.use(express.static(path.join(__dirname, "dist")));

// Handles any requests that don't match the ones above to return the React app
// A request to '/nonExist' will redirect to the index.html where react router takes over at '/'
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  // Change this text to whatever FLIP server you're on
  console.log(`Server running: http://flip.engr.oregonstate.edu:${PORT}...`);
});
