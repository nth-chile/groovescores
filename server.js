const path = require("path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const webpack = require("webpack");

const IS_DEV = process.env.NODE_ENV === "development";

if (IS_DEV) {
  const config = require("./webpack.development.js");
  const compiler = webpack(config);

  app.use(require("webpack-dev-middleware")(
    compiler,
    config.devServer,
  ));

  app.use(require("webpack-hot-middleware")(compiler));
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "dist")));

// Routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

app.listen(process.env.PORT || 3000);
console.log("Listening on port 3000");