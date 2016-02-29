'use strict';

const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const NpmInstallPlugin = require('npm-install-webpack-plugin');

//const BowerWebpackPlugin = require("bower-webpack-plugin");

var production = process.env.NODE_ENV === 'production';

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
  bower: path.join(__dirname, 'bower_components'),
  node: path.join(__dirname, 'node_modules'),
  styles: path.join(__dirname, 'app', 'css'),
  components: path.join(__dirname, 'app', 'components')
};

var plugins = [
  //    new BowerWebpackPlugin(),
  new webpack.HotModuleReplacementPlugin(),
  new ExtractTextPlugin('bundle.css', {allChunks: true}),
  new HtmlWebpackPlugin({
    title: "Pruebas para implementación de la ISO 52000-1 en CTE DB-HE",
    //favicon: 'favicon.ico',
    filename: 'index.html'
  }),
  new webpack.NoErrorsPlugin(),
  new webpack.ProvidePlugin({
    // Detect names as free vars in modules
    // and automatically import the corresponding library
    jQuery: 'jquery',
    jquery: 'jquery',
    $: 'jquery',
    'windows.jQuery': 'jquery',
    _: 'lodash',
    React: 'react',
    ReactDOM: 'react-dom'//,
    //Bootstrap: 'react-bootstrap'
  }),
  new NpmInstallPlugin({
    // detect needed modules and install instead of using npm install --save module
    save: true // --save
  })
];

if (production) {
  plugins = plugins.concat([ // Production plugins go here
    // Cleanup the builds/ folder before
    // compiling our final assets
    new CleanPlugin('build'),
    // This plugin looks for similar chunks and files
    // and merges them for better caching by the user
    new webpack.optimize.DedupePlugin(),
    // This plugins optimizes chunks and modules by
    // how much they are used in your app
    new webpack.optimize.OccurenceOrderPlugin(),
    // This plugin prevents Webpack from creating chunks
    // that would be too small to be worth loading separately
    new webpack.optimize.MinChunkSizePlugin({
      minChunkSize: 51200 // ~50kb
    }),
    // This plugin minifies all the Javascript code of the final bundle
    new webpack.optimize.UglifyJsPlugin({minimize: true}),
    new webpack.optimize.AggressiveMergingPlugin(),
    // This plugins defines various variables that we can set to false
    // in production to avoid code related to them from being compiled
    // in our final bundle
    new webpack.DefinePlugin({
      __SERVER__:      !production,
      __DEVELOPMENT__: !production,
      __DEVTOOLS__:    !production,
      // This has effect on the react lib size
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'BABEL_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    })
  ]);
}

// ver https://docs.omniref.com/js/npm/bootstrap-sass-loader/0.0.5
var config = {
  debug: !production,
  cache: true,
  devtool: production ? false : 'cheap-module-source-map',
  entry: {
    app: [PATHS.app, 'bootstrap-loader']
  },
  devServer: {
    contentBase: PATHS.build,
    // Enable history API fallback so HTML5 History API based
    // routing works. This is a good default that will come
    // in handy in more complicated setups.
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    // Display only errors to reduce the amount of output.
    stats: 'errors-only'
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
    //publicPath: '/build/' // This is used to generate URLs to e.g. images
  },
  resolve: { // you can now import 'file' instead of import 'file.json'
    modulesDirectories: [
      PATHS.app,
      PATHS.bower,
      PATHS.node
    ],
    extensions: ['', '.js', '.jsx', '.json'],
    alias: { // Para usar alias en imports
      'styles': PATHS.styles,
      'components': PATHS.components
    }
  },
  module: {
    noParse: [],
    loaders: [
      { // JS, JSX: BABEL
        test: /\.jsx?$/,
        include: PATHS.app,
        loader: 'babel',
        query: {cacheDirectory: true,
                presets: ['es2015', 'stage-0', 'react']}
      },
      { // CSS
        test: /\.css$/,
        include: PATHS.app,
        loader: ExtractTextPlugin.extract('style', 'css!postcss')
      },
      { // SASS
        test: /\.scss$/,
        include: PATHS.app,
        loader: ExtractTextPlugin.extract('style', 'css!postcss!sass?outputStyle=expanded')
      },
      { // LESS
        test: /\.less$/,
        include: PATHS.app,
        loaders: ExtractTextPlugin.extract('style', ['css', 'postcss', 'less'])
      },
      { // IMG  inline base64 URLs for <=8k images, direct URLs for the rest
        test: /\.(png|jpe?g|gif)$/i,
        include: PATHS.app,
        //exclude: [/node_modules/, /bower_components/],
        loader: 'url?limit=8192!img'
      },
      // required for bootstrap icons
      { test: /\.woff2?$/, loader: 'url?limit=5000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: 'url?limit=5000&minetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: 'file' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: 'url?limit=5000&minetype=image/svg+xml' },
      // { test: /bootstrap\/js\//, // EDIT THE REGEX TO MATCH YOUR BOOTSTRAP PATH
      //   loader: 'imports?jQuery=jquery,$=jquery,this=>window' },
      // Bootstrap 3
      { test: /bootstrap-sass\/assets\/javascripts\//, loader: 'imports?jQuery=jquery' },
      // Bootstrap 4
      { test: /bootstrap\/build\/js\/umd\//, loader: 'imports?jQuery=jquery' }
    ]
  },
  plugins: plugins,
  postcss: [ autoprefixer({ browsers: ['last 3 versions'] }) ]
};

module.exports = config;
