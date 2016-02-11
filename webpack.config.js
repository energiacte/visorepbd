var path = require('path');
var autoprefixer = require('autoprefixer');

config = {
    entry: getEntrySources([path.resolve(__dirname, 'app/js/entry.js')]),
    resolve: { // you can now require('file') instead of require('file.json')
        extensions: ['', '.js', '.jsx', '.json']
    },
    output: {
        publicPath: 'http://localhost:8080/', // This is used to generate URLs to e.g. images
        //path: path.resolve(__dirname, 'dist'),
        filename: 'dist/bundle.js'
    },
    devtool: 'eval',
    module: {
        preLoaders: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components|bundle\.js$)/,
                loader: "eslint"
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
                include: /app/,
                loader: 'style!css!postcss'
            },
            { // SASS
                test: /\.scss$/,
                include: /app/,
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
    watch: true
};

function getEntrySources(sources) {
    if (process.env.NODE_ENV !== 'production') {
        sources.push('webpack-dev-server/client?http://localhost:8080');
        sources.push('webpack/hot/only-dev-server');
    }

    return sources;
}

module.exports = config
