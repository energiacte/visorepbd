var path = require('path');
var autoprefixer = require('autoprefixer');

module.exports = {
    entry: { main: path.resolve(__dirname, 'src/js/main.js')
             //Feed: './feed.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        //publicPath: 'http://mycdn.com/', // This is used to generate URLs to e.g. images
        filename: '[name].js' // Template based on keys in entry above
    },
    devtool: 'eval',
    module: {
        preLoaders: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: "jshint"
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loader: "source-map"
            }

        ],
        loaders: [
            { // CSS
                test: /\.css$/,
                include: /src/,
                loader: 'style!css!postcss'
            },
            { // SASS
                test: /\.scss$/,
                include: /src/,
                loaders: [
                    'style',
                    'css',
                    'postcss',
                    'sass?outputStyle=expanded'
                ]
            },
            { // IMG  inline base64 URLs for <=8k images, direct URLs for the rest
                test: /\.(png|jpe?g|gif|svg)$/i,
                exclude: /(node_modules|bower_components)/,
                loaders: [
                    'url?limit=8192',
                    'img'
                ]
            },
            { // JS, JSX: BABEL
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loaders: [
                    'react-hot',
                    'babel?presets[]=stage-0,presets[]=react,presets[]=es2015'
                ]
            }
        ]
    },
    postcss: [ autoprefixer({ browsers: ['last 3 versions'] }) ],
    resolve: { // you can now require('file') instead of require('file.json')
        extensions: ['', '.js', '.jsx', '.json']
    },
    watch: true
};
