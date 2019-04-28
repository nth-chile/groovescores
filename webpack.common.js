const path = require("path");
const html = HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = {
  entry: `${path.resolve(__dirname, "src")}/index.tsx`,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader"
      }
    //   {
    //     test: /\.js?/,
    //     exclude: /node_modules/,
    //     use: "babel-loader",
    //   },
    //   {
    //     test: /\.s?css/,
    //     use: [
    //       "style-loader",
    //       "css-loader",
    //       "postcss-loader",
    //       "sass-loader",
    //     ],
    //   },
    //   {
    //     test: /\.(png|jpg)$/,
    //     use: [
    //       {
    //         loader: "file-loader",
    //         options: {
    //           name: "[name].[ext]",
    //           outputPath: "/assets/",
    //           publicPath: "/assets"
    //         },
    //       },
    //     ],
    //     include: path.join(__dirname, "src"),
    //   },
    ],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    publicPath: "/",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      title: "App title"
    })
  ]
};