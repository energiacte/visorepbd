'use strict';

const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');

const production = process.env.NODE_ENV === 'production';

const PATHS = {
  app: path.resolve(path.join(__dirname, 'app')),
  build: path.resolve(path.join(__dirname, 'build')),
  bowerdir: 'bower_components',
  bower: path.resolve(path.join(__dirname, 'bower_components')),
  nodedir: 'node_modules',
  node: path.resolve(path.join(__dirname, 'node_modules')),
  styles: path.resolve(path.join(__dirname, 'app', 'css')),
  components: path.resolve(path.join(__dirname, 'app', 'components')),
  actions: path.resolve(path.join(__dirname, 'app', 'actions')),
  reducers: path.resolve(path.join(__dirname, 'app', 'reducers')),
  store: path.resolve(path.join(__dirname, 'app', 'store'))
};

var plugins = [
  new webpack.HotModuleReplacementPlugin(),
  new ExtractTextPlugin('bundle-[hash].css', {allChunks: true}),
  new HtmlWebpackPlugin({
    title: "DB-HE NZEB: implementación de la ISO 52000-1 en el CTE DB-HE",
    //favicon: 'favicon.ico',
    filename: 'index.html'
  }),
  new webpack.NoErrorsPlugin(),
  new webpack.optimize.CommonsChunkPlugin({
    name: "vendor",
    filename: "vendor-[hash].js",
    minChunks: Infinity // only vendor chunks here
  }),
  new webpack.ProvidePlugin({ // Detect free vars in modules and do automatic import
    jQuery: 'jquery',
    jquery: 'jquery',
    $: 'jquery',
    'windows.jQuery': 'jquery',
    _: 'lodash',
    lodash: 'lodash',
    React: 'react',
    ReactDOM: 'react-dom'
  })
];

if (production) { // Production plugins go here
  plugins = plugins.concat([
    // Cleanup the builds/ folder before compiling final assets
    new CleanPlugin('build'),
    // Looks for similar chunks and files and merge them
    new webpack.optimize.DedupePlugin(),
    // Optimize chunks and modules by how much they are used
    new webpack.optimize.OccurenceOrderPlugin(),
    // Prevent Webpack from creating too small chunks
    new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 51200 }), // ~50kb
    // Minify all the Javascript code of the final bundle
    new webpack.optimize.UglifyJsPlugin({ minimize: true,
                                          compress: { warnings: false } }),
    new webpack.optimize.AggressiveMergingPlugin(),
    // Define variables, useful to distinguish production and devel
    new webpack.DefinePlugin({
      __SERVER__:      !production,
      __DEVELOPMENT__: !production,
      __DEVTOOLS__:    !production,
      'process.env': { // This has effect on the react lib size
        'NODE_ENV': JSON.stringify('production'),
        'BABEL_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    })
  ]);
}

var config = {
  debug: !production,
  cache: true,
  devtool: production ? 'cheap-module-source-map': 'cheap-module-eval-source-map',
  entry: {
    app: [PATHS.app, 'bootstrap-loader'],
    vendor: ['d3', 'dimple', 'jquery', 'lodash', 'numeral', 'react', 'react-dom', 'react-redux', 'react-router', 'redux']
  },
  devServer: {
    contentBase: PATHS.build,
    // Enable history API fallback so HTML5 History API based routing works.
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    // Display only errors to reduce the amount of output.
    stats: 'errors-only'
  },
  output: {
    path: PATHS.build,
    filename: '[name]-[hash].js'
    //publicPath: '/build/' // This is used to generate URLs to e.g. images
  },
  resolve: {
    root: [PATHS.app, PATHS.bower, PATHS.node],
    modulesDirectories: [PATHS.bowerdir, PATHS.nodedir],
    extensions: ['', '.js', '.jsx', '.json'],
    alias: { // Para usar alias en imports
      'styles': PATHS.styles,
      'components': PATHS.components,
      'actions': PATHS.actions,
      'reducers': PATHS.reducers,
      'store': PATHS.store,
      'node': PATHS.node
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
        loader: 'url?limit=8192!img'
      },
      // required for bootstrap icons
      { test: /\.woff2?$/, loader: 'url?limit=5000&mimetype=application/font-woff' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: 'url?limit=5000&minetype=application/octet-stream' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: 'file' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: 'url?limit=5000&minetype=image/svg+xml' },
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
