'use strict';

var path = require('path');
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanPlugin = require('clean-webpack-plugin');
//var BowerWebpackPlugin = require("bower-webpack-plugin");

var production = process.env.NODE_ENV === 'production';

// var bower_dir = __dirname + '/bower_components';
// var node_dir = __dirname + '/node_modules';
// var lib_dir = __dirname + '/public/js/libs';

var plugins = [
//    new BowerWebpackPlugin(),
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
    })
];

if (production) {
    plugins = plugins.concat([ // Production plugins go here
        // Cleanup the builds/ folder before
        // compiling our final assets
        new CleanPlugin('dist'),
        // This plugin looks for similar chunks and files
        // and merges them for better caching by the user
        new webpack.optimize.DedupePlugin(),
        // This plugins optimizes chunks and modules by
        // how much they are used in your app
        new webpack.optimize.OccurenceOrderPlugin(),
        // This plugin prevents Webpack from creating chunks
        // that would be too small to be worth loading separately
        new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 51200, // ~50kb
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
  progress: true,
  devtool: production ? false : 'cheap-module-source-map',
  entry: {
    app: ['./public/js/app.js', 'bootstrap-loader']
  },
  devServer: {
    contentBase: './public',
    hot: true
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist/' // This is used to generate URLs to e.g. images
  },
  resolve: { // you can now import 'file' instead of import 'file.json'
    modulesDirectories: [
      'public',
      'bower_components',
      'node_modules'
    ],
    extensions: ['', '.js', '.jsx', '.json'],
    alias: { // Para usar alias en imports
      'styles': __dirname + '/public/css',
      'components': __dirname + '/public/js/components'
    }
  },
  module: {
    noParse: [],
    loaders: [
      { // JS, JSX: BABEL
        test: /\.jsx?$/,
        exclude: [/node_modules/, /bower_components/],
        loader: 'babel',
        query: {cacheDirectory: true,
                presets: ['es2015', 'stage-0', 'react']}
      },
      { // CSS
        test: /\.css$/,
        //include: /public/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss')
      },
      { // SASS
        test: /\.scss$/,
        //include: /public/,
        loader: ExtractTextPlugin.extract('style', 'css!postcss!sass?outputStyle=expanded')
      },
      { // LESS
        test: /\.less$/,
        loaders: ExtractTextPlugin.extract('style', ['css', 'postcss', 'less'])
      },
      { // IMG  inline base64 URLs for <=8k images, direct URLs for the rest
        test: /\.(png|jpe?g|gif)$/i,
        exclude: [/node_modules/, /bower_components/],
        loader: 'url?limit=8192!img'
      },
      // {
      //   test: /bootstrap\/js\//, // EDIT THE REGEX TO MATCH YOUR BOOTSTRAP PATH
      //   loader: 'imports?jQuery=jquery,$=jquery,this=>window'
      // },
      // required for bootstrap icons
      { test: /\.woff2?$/, loader: 'url?limit=5000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: 'url?limit=5000&minetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: 'file' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: 'url?limit=5000&minetype=image/svg+xml' },
      // Bootstrap 3
      { test: /bootstrap-sass\/assets\/javascripts\//, loader: 'imports?jQuery=jquery' },
      // Bootstrap 4
      { test: /bootstrap\/dist\/js\/umd\//, loader: 'imports?jQuery=jquery' }
    ]
  },
  plugins: plugins,
  postcss: [ autoprefixer({ browsers: ['last 3 versions'] }) ]
};

module.exports = config;
