const webpack = require("webpack");
const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  devServer: {
    hot: true,
    publicPath: "/",
  },
  devtool: "source-map",
  mode: "development",
  resolve: {
    extensions: [".js", ".ts", ".tsx"]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
});