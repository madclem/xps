/* eslint comma-dangle: 0 */

"use strict"

const webpack           = require('webpack');
const path              = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const prod              = process.env.NODE_ENV === 'production';
const isDevelopment     = process.env.NODE_ENV === 'development';
const ip                = require('ip');
const serverIp          = ip.address();

let _path = path.resolve(__dirname, "../bin/" );

function getOutput() {
  // return path.resolve(__dirname, "/" )
  if(prod) {
    let _path = path.resolve(__dirname, "../bin/" );
    return _path;
  } else {
    return "/";
  }
}

module.exports = {
  hotPort: 8080,
  entry: {
    app : ["./app/scripts/app.js"]
  },
  output: {
    path: "/",
    filename: 'game.js'
  },
  devServer: {
      host: "0.0.0.0"
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          plugins: ['transform-runtime', 'add-module-exports'],
          presets: ['es2015', 'stage-1']
        }
      },
      { test: /\.(glsl|frag|vert)$/, loader: 'raw', exclude: /node_modules/ },
      { test: /\.(glsl|frag|vert)$/, loader: 'glslify', exclude: /node_modules/ }
    ]
  },
  resolve: {
    root:__dirname + "/js",
    fallback: path.join(__dirname, "node_modules"),
    alias: {
      'mcgl': 'mcgl',
      'gl-matrix': 'gl-matrix'
    }
  },
  plugins : [
      new webpack.HotModuleReplacementPlugin()
  ]
};
