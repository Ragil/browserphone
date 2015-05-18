module.exports = [
  { test: /bootstrap\/js\//, loader: 'imports?jQuery=jquery' },

  { test: /\.jsx?$/, exclude: /node_modules/, loader: "babel-loader" },
  { test: /\.(gif|png|jpg)$/, loader: 'url-loader?limit=8192' },

  // Needed for the css-loader when [bootstrap-webpack]
  // (https://github.com/bline/bootstrap-webpack) loads bootstrap's css.
  { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff" },
  { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/font-woff2" },
  { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=application/octet-stream" },
  { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
  { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&minetype=image/svg+xml" }
];
