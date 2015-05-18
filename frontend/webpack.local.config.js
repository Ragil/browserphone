var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var webpack = require('webpack');
var loaders = require('./webpack.loaders');

/**
 * This is the Webpack configuration file for local development. It contains
 * local-specific configuration such as the React Hot Loader, as well as:
 *
 * - The entry point of the application
 * - Where the output file should be
 * - Which loaders to use on what files to properly transpile the source
 *
 * For more information, see: http://webpack.github.io/docs/configuration.html
 */
module.exports = {

  // Efficiently evaluate modules with source maps
  devtool: "eval",

  // Set entry point to ./src/main and include necessary files for hot load
  entry:  [
    "./src/main"
  ],

  // This will not actually create a bundle.js file in ./build. It is used
  // by the dev server for dynamic hot loading.
  output: {
    path: __dirname + "/build/local/",
    filename: "app.js"
  },

  // Necessary plugins for hot load
  plugins: [
    new HtmlWebpackPlugin({
      filename : 'index.html',
      template : './index.html',
      hash : new Date().valueOf()
    })
  ],

  // Transform source code using Babel and React Hot Loader
  module: {
    loaders: loaders
  },

  // Automatically transform files with these extensions
  resolve: {
    root : path.resolve(__dirname, '.'),
    alias : {
      'env' : 'src/common/env_local.js'
    },
    extensions: ['', '.js', '.jsx']
  }
}
