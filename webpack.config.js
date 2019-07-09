"use strict";

const autoprefixer = require("autoprefixer");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const eslintFormatter = require("react-dev-utils/eslintFormatter");
const TerserJSPlugin = require("terser-webpack-plugin"); // JS minifier (webpack default)
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const CleanPlugin = require("clean-webpack-plugin");

const production = process.env.NODE_ENV === "production";
// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = production
  ? process.env.GENERATE_SOURCEMAP !== "false"
  : true;

// Permitirmos usar la variable de entorno EPBDURLPREFIX para añadir prefijo
// a las direcciones estáticas y la url del servicio que llamamos con ajax
const epbdurlprefix = process.env.EPBDURLPREFIX || "";

const PATHS = {
  app: path.resolve(path.join(__dirname, "app")),
  build: path.resolve(path.join(__dirname, "build")),
  nodedir: "node_modules",
  node: path.resolve(path.join(__dirname, "node_modules")),
  styles: path.resolve(path.join(__dirname, "app", "css")),
  images: path.resolve(path.join(__dirname, "app", "img")),
  components: path.resolve(path.join(__dirname, "app", "components")),
  actions: path.resolve(path.join(__dirname, "app", "actions")),
  reducers: path.resolve(path.join(__dirname, "app", "reducers")),
  store: path.resolve(path.join(__dirname, "app", "store"))
};

var plugins = [
  // This pulls out webpack module IDs that changes every build to help with caching
  new webpack.HashedModuleIdsPlugin(),
  // Inject the build date as an environment variable
  new webpack.DefinePlugin({
    "process.env": {
      BUILD_DATE: JSON.stringify(new Date())
    }
  }),
  new webpack.HotModuleReplacementPlugin(),
  new MiniCssExtractPlugin({
    // Options similar to the same options in webpackOptions.output
    // both options are optional
    filename: production ? "[name].[hash].css" : "[name].css",
    chunkFilename: production ? "[id].[hash].css" : "[id].css"
  }),
  new HtmlWebpackPlugin({
    // https://github.com/jaketrent/html-webpack-template
    template: "app/index.template.html",
    title: "VisorEPBD: implementación de la ISO 52000-1 para el CTE DB-HE",
    inject: "head",
    //favicon: 'favicon.ico',
    filename: "./index.html", // relativo al output path
    minify: {
      collapseWhitespace: true,
      collapseInlineTagWhitespace: true,
      keepClosingSlash: true,
      removeRedundantAttributes: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeRedundantAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true
    }
  })
];

if (production) {
  // Production plugins go here
  plugins = plugins.concat([
    // Cleanup the builds/ folder before compiling final assets
    new CleanPlugin(PATHS.build),
    // Prevent Webpack from creating too small chunks
    new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 51200 }), // ~50kb
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require("cssnano"),
      cssProcessorPluginOptions: {
        preset: ["default", { discardComments: { removeAll: true } }]
      },
      canPrint: true
    }),
    // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file so that tools can pick it up without
    // having to parse `index.html`.
    new ManifestPlugin({ fileName: "asset-manifest.json" }),
    new webpack.optimize.AggressiveMergingPlugin()
  ]);
}

var config = {
  mode: production ? "production" : "development",
  cache: true,
  watch: true,
  devtool: production
    ? shouldUseSourceMap
      ? "cheap-module-source-map"
      : false
    : "source-map",
  entry: {
    app: [PATHS.app],
    vendor: [
      "@babel/polyfill",
      "react",
      "react-dom",
      "react-redux",
      "react-router",
      "redux"
    ]
  },
  optimization: {
    splitChunks: {
      chunks: "all"
    },
    runtimeChunk: true,
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },
  output: {
    path: PATHS.build,
    pathinfo: true, // /* filename */ comments to generated requires in otuput
    filename: "[name].[hash:8].js",
    chunkFilename: "[name].[hash:8].js",
    // publicPath: "http://localhost:8080/", // Development server
    // publicPath: "http://example.com/", // Production
    publicPath: production ? epbdurlprefix : "" // This is used to generate URLs to e.g. images,css
  },
  resolve: {
    modules: [PATHS.app, PATHS.node, PATHS.nodedir],
    extensions: [".web.js", ".js", ".web.jsx", ".jsx", ".json"],
    alias: {
      // Para usar alias en imports
      styles: PATHS.styles,
      components: PATHS.components,
      img: PATHS.images,
      actions: PATHS.actions,
      reducers: PATHS.reducers,
      store: PATHS.store,
      node: PATHS.node
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
        enforce: "pre",
        use: [
          {
            options: {
              formatter: eslintFormatter,
              eslintPath: require.resolve("eslint")
            },
            loader: "eslint-loader"
          }
        ]
      },
      {
        // JS, JSX: BABEL
        test: /\.(js|jsx)?$/,
        include: PATHS.app,
        loader: "babel-loader"
      },
      {
        // CSS
        test: /\.css$/,
        include: [PATHS.app, PATHS.node],
        use: [
          // production ? MiniCssExtractPlugin.loader : 'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              sourceMap: production ? shouldUseSourceMap : false
            }
          },
          {
            loader: "postcss-loader",
            options: {
              config: {
                path: __dirname + "/postcss.config.js"
              }
            }
          }
        ]
      },
      {
        // SASS
        test: /\.scss$/,
        include: PATHS.app,
        use: [
          production ? MiniCssExtractPlugin.loader : "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              sourceMap: production ? shouldUseSourceMap : false
            }
          },
          {
            loader: "postcss-loader",
            options: {
              config: {
                path: __dirname + "/postcss.config.js"
              }
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: production ? shouldUseSourceMap : false,
              outputStyle: "expanded"
            }
          }
        ]
      },
      {
        // IMG  direct URLs for the rest
        test: [/\.bmp$/i, /\.gif$/i, /\.jpe?g$/i, /\.png$/i],
        include: PATHS.app,
        use: [
          // {
          //   loader: 'url-loader',
          //   options: {
          //     limit: 2000,
          //     name: 'img/[name]-[hash:8].[ext]'
          //   }
          // },
          "img-loader"
        ]
      },
      {
        // .ico files
        test: /\.ico$/i,
        include: PATHS.app,
        loader: ["file-loader?name=[name].[ext]", "img-loader"]
      },
      // required for bootstrap icons
      {
        test: /\.(woff|woff2|eot|ttf|otf)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader?name=fonts/[name]-[hash:8].[ext]"
      },

      {
        test: /\.(jpg|gif|png|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader?name=img/[name]-[hash:8].[ext]"
      },
      // Bootstrap 3
      {
        test: /bootstrap-sass\/assets\/javascripts\//,
        loader: "imports-loader?jQuery=jquery"
      },
      // Bootstrap 4
      {
        test: /bootstrap\/build\/js\/umd\//,
        loader: "imports-loader?jQuery=jquery"
      }
    ]
  },
  plugins: plugins,
  performance: { hints: production ? "warning" : false }
};

module.exports = config;
