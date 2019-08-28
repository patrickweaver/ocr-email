const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  context: path.join(__dirname, './'),
  entry: './src/app.js',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        include: path.join(__dirname, 'app'),
      },
    ],
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};