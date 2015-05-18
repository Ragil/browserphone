var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var loaders = require('./webpack.loaders');


/**
 * This is the Webpack configuration file for production.
 */
module.exports = {
  entry: "./src/main",

  output: {
    path: __dirname + "/build/prod/",
    filename: "app.js"
  },

  // Necessary plugins for index.html
  plugins: [
    new HtmlWebpackPlugin({
      filename : 'index.html',
      template : './index.html',
      hash : new Date().valueOf()
    })
  ],

  module: {
    loaders: loaders
  },

  resolve: {
    root : path.resolve(__dirname, '.'),
    alias : {
      'env' : 'src/common/env_prod.js'
    },
    extensions: ['', '.js', '.jsx']
  }
}
