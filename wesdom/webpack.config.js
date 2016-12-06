/**
 * webpack.config.js
 * @description webpack 配置文件
 */

var path = require('path');

module.exports = {
    entry: {
        'introduct': path.resolve(__dirname, 'src/js/introduct.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        publicPath: path.resolve(__dirname, 'dist/js'),
        filename: '[name].js'
    }
}
