'use strict';

const path = require('path');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');

const production = process.env.NODE_ENV === 'production';
// Permitirmos usar la variable de entorno EPBDURLPREFIX para añadir prefijo
// a las direcciones estáticas y la url del servicio que llamamos con ajax
const epbdurlprefix = process.env.EPBDURLPREFIX || '';

const PATHS = {
  app: path.resolve(path.join(__dirname, 'app')),
  build: path.resolve(path.join(__dirname, 'build')),
  nodedir: 'node_modules',
  node: path.resolve(path.join(__dirname, 'node_modules')),
  styles: path.resolve(path.join(__dirname, 'app', 'css')),
  images: path.resolve(path.join(__dirname, 'app', 'img')),
  components: path.resolve(path.join(__dirname, 'app', 'components')),
  actions: path.resolve(path.join(__dirname, 'app', 'actions')),
  reducers: path.resolve(path.join(__dirname, 'app', 'reducers')),
  store: path.resolve(path.join(__dirname, 'app', 'store'))
};

var plugins = [
  new webpack.DefinePlugin({
    __EPBDURLPREFIX__: JSON.stringify(epbdurlprefix)
  }),
  new webpack.HotModuleReplacementPlugin(),
  new ExtractTextPlugin('bundle-[hash].css', { allChunks: true }),
  new HtmlWebpackPlugin({
    // https://github.com/jaketrent/html-webpack-template
    template: 'app/index.template.html',
    title: "VisorEPBD: implementación de la ISO 52000-1 para el CTE DB-HE",
    inject: false,
    //favicon: 'favicon.ico',
    filename: './index.html', // relativo al output path
    minify: { removeComments: true, collapseWhitespace: true }
  }),
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.optimize.CommonsChunkPlugin({
    names: ['vendor'],
    filename: '[name].js',
    minChunks: Infinity // only vendor chunks here
  }),
  new webpack.optimize.ModuleConcatenationPlugin()
];

if (production) { // Production plugins go here
  plugins = plugins.concat([
    // Cleanup the builds/ folder before compiling final assets
    new CleanPlugin(PATHS.build),
    // Prevent Webpack from creating too small chunks
    new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 51200 }), // ~50kb
    // Minify all the Javascript code of the final bundle
    new webpack.optimize.UglifyJsPlugin({ minimize: true,
                                          sourceMap: true,
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
  cache: true,
  devtool: production ? 'cheap-module-source-map': 'cheap-module-eval-source-map',
  entry: {
    app: [
      'babel-polyfill',
      PATHS.app
    ],
    vendor: ['d3', 'dimple', 'react', 'react-dom', 'react-redux', 'react-router', 'redux']
  },
  output: {
    path: PATHS.build,
    filename: '[name]-[hash].js',
    // publicPath: "http://localhost:8080/", // Development server
    // publicPath: "http://example.com/", // Production
    publicPath: production ? epbdurlprefix : '' // This is used to generate URLs to e.g. images,css
  },
  resolve: {
    modules: [PATHS.app, PATHS.node, PATHS.nodedir],
    extensions: ['.js', '.jsx', '.json'],
    alias: { // Para usar alias en imports
      'styles': PATHS.styles,
      'components': PATHS.components,
      'img': PATHS.images,
      'actions': PATHS.actions,
      'reducers': PATHS.reducers,
      'store': PATHS.store,
      'node': PATHS.node
    }
  },
  module: {
    rules: [
      { // JS, JSX: BABEL
        test: /\.jsx?$/,
        include: PATHS.app,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: [['es2015', { modules: false }], 'stage-0', 'react']
        }
      },
      { // CSS
        test: /\.css$/,
        include: [PATHS.app, PATHS.node],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader' },
            { loader: 'postcss-loader',
              options: {
                plugins: function () { return [autoprefixer('last 2 versions', 'ie 10')] }
              }
            }
          ]
        })
      },
      { // SASS
        test: /\.scss$/,
        include: PATHS.app,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader' },
            { loader: 'postcss-loader',
              options: {
                plugins: function () { return [autoprefixer('last 2 versions', 'ie 10')] }
              }
            },
            { loader: 'sass-loader', options: { outputStyle: 'expanded' } }
          ]
        })
      },
      { // IMG  direct URLs for the rest
        test: /\.(png|jpe?g|gif)$/i,
        include: PATHS.app,
        loader: ['img-loader', 'file-loader?name=img/[name]-[hash].[ext]']
      },
      { // .ico files
        test: /\.ico$/i,
        include: PATHS.app,
        loader: ['img-loader', 'file-loader?name=[name].[ext]']
      },
      // required for bootstrap icons
      { test: /\.woff2?$/,                     loader: 'file-loader?name=fonts/[name]-[hash].[ext]' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: 'file-loader?name=fonts/[name]-[hash].[ext]' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: 'file-loader?name=fonts/[name]-[hash].[ext]' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: 'file-loader?name=img/[name]-[hash].[ext]' },
      // Bootstrap 3
      { test: /bootstrap-sass\/assets\/javascripts\//, loader: 'imports?jQuery=jquery' },
      // Bootstrap 4
      { test: /bootstrap\/build\/js\/umd\//, loader: 'imports?jQuery=jquery' }
    ]
  },
  plugins: plugins
};

module.exports = config;
