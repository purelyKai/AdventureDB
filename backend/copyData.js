const fs = require("fs-extra");
const path = require("path");

// Copy data.json to the dist folder
fs.copySync(
  path.join(__dirname, "src/data.json"),
  path.join(__dirname, "dist/data.json")
);
