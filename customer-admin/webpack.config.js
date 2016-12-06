/**
 * webpack.config.js
 * @description webpack 配置文件
 */

var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        'app': path.resolve(__dirname, 'src/js/app.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: 'build.js'
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue'
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            }
        ]
    },
    vue: {
        autoprefixer: {
            browser: ['last 2 versions']
        }
    },
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    },
    plugins: [
        new webpack.optimize.DedupePlugin()
    ]
}
