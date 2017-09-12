'use strict';

const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin'); 
const CleanPlugin = require('clean-webpack-plugin');

const production = process.env.NODE_ENV === 'production';
// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = production ? process.env.GENERATE_SOURCEMAP !== 'false' : true;


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
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true
    }
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
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      sourceMap: shouldUseSourceMap,
      compress: { warnings: false }
    }),
    // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file so that tools can pick it up without
    // having to parse `index.html`.
    new ManifestPlugin({ fileName: 'asset-manifest.json' }),
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
  //devtool: production ? 'cheap-module-source-map': 'cheap-module-eval-source-map',
  devtool: production ? (shouldUseSourceMap ? 'cheap-module-source-map' : false) : 'cheap-module-eval-source-map',
  entry: {
    app: [
      'babel-polyfill',
      PATHS.app
    ],
    vendor: ['d3', 'dimple', 'react', 'react-dom', 'react-redux', 'react-router', 'redux']
  },
  output: {
    path: PATHS.build,
    pathinfo: true, // /* filename */ comments to generated requires in otuput
    filename: '[name]-[hash:8].js',
    // publicPath: "http://localhost:8080/", // Development server
    // publicPath: "http://example.com/", // Production
    publicPath: production ? epbdurlprefix : '' // This is used to generate URLs to e.g. images,css
  },
  resolve: {
    modules: [PATHS.app, PATHS.node, PATHS.nodedir],
    extensions: ['.web.js', '.js', '.web.jsx', '.jsx', '.json'],
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
    strictExportPresence: true,
    rules: [
      // First, run the linter.
      // It's important to do this before Babel processes the JS.
      {
        test: /\.(js|jsx)$/,
        include: PATHS.app,
        enforce: 'pre',
        use: [
          {
            options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve('eslint'),
            },
            loader: require.resolve('eslint-loader'),
          },
        ],
      },
      { // JS, JSX: BABEL
        test: /\.jsx?$/,
        include: PATHS.app,
        loader: 'babel-loader',
        options: {
          cacheDirectory: production ? false : true,
          compact: production ? true : false,
          presets: [['es2015', { modules: false }], 'stage-0', 'react', 'flow']
        }
      },
      { // CSS
        test: /\.css$/,
        include: [PATHS.app, PATHS.node],
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader',
              options: {
                importLoaders: 1,
                minimize: production ? true: false,
                sourceMap: production ? shouldUseSourceMap : false
              }
            },
            { loader: 'postcss-loader',
              options: {
                plugins: () => [
                  autoprefixer({
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9', // React doesn't support IE8 anyway
                    ]
                  })
                ]
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
                plugins: () => [
                  autoprefixer({
                    browsers: [
                      '>1%',
                      'last 4 versions',
                      'Firefox ESR',
                      'not ie < 9', // React doesn't support IE8 anyway
                    ]
                  })
                ]
              }
            },
            { loader: 'sass-loader', options: { outputStyle: 'expanded' } }
          ]
        })
      },
      { // IMG  direct URLs for the rest
        test: [/\.bmp$/i, /\.gif$/i, /\.jpe?g$/i, /\.png$/i],
        include: PATHS.app,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'img/[name]-[hash:8].[ext]'
            }
          },
          'img-loader'
        ]
      },
      { // .ico files
        test: /\.ico$/i,
        include: PATHS.app,
        loader: ['file-loader?name=[name].[ext]', 'img-loader']
      },
      // required for bootstrap icons
      { test: /\.woff2?$/,
        loader: 'file-loader?name=fonts/[name]-[hash:8].[ext]' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader?name=fonts/[name]-[hash:8].[ext]' },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader?name=fonts/[name]-[hash:8].[ext]' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader?name=img/[name]-[hash:8].[ext]' },
      // Bootstrap 3
      { test: /bootstrap-sass\/assets\/javascripts\//,
        loader: 'imports?jQuery=jquery' },
      // Bootstrap 4
      { test: /bootstrap\/build\/js\/umd\//,
        loader: 'imports?jQuery=jquery' }
    ]
  },
  plugins: plugins,
  performance: { hints: production ? "warning" : false }
};

module.exports = config;
