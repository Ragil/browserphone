var express = require('express');
var https = require('https');
var app = express();
var fs = require('fs');


/************************************************************
 *
 * Express routes for:
 *   - app.js
 *   - index.html
 *
 ************************************************************/

// Serve application file depending on environment
app.get('/phone/app.js', function(req, res) {
  res.sendFile(__dirname + '/build/local/app.js');
});

// Serve index page
app.get('*', function(req, res) {
  res.sendFile(__dirname + '/build/local/index.html');
});


/*************************************************************
 *
 * Webpack Dev Server
 *
 * See: http://webpack.github.io/docs/webpack-dev-server.html
 *
 *************************************************************/

if (!process.env.PRODUCTION) {
  var webpack = require('webpack');
  var WebpackDevServer = require('webpack-dev-server');
  var config = require('./webpack.local.config');
}


/******************
 *
 * Express server
 *
 *****************/

var hskey = fs.readFileSync('fakekeys/key.pem');
var hscert = fs.readFileSync('fakekeys/cert.pem')

var options = {
    key: hskey,
    cert: hscert
};

var port = process.env.PORT || 8090;
var server = https.createServer(options, app).listen(port);
console.log('listening on port ' + port)
