/*!
 * webpack.config.js
 * @description webpack 配置文件
 */

const path = require('path');

module.exports = {
    entry: {
        'common': path.resolve(__dirname, 'src/js/common.js'),
        'overview': path.resolve(__dirname, 'src/js/overview.js'),

        'ad-bill': path.resolve(__dirname, 'src/js/ad-bill.js'),
        'ad-detail': path.resolve(__dirname, 'src/js/ad-detail.js'),
        'ad-dimension-platform': path.resolve(__dirname, 'src/js/ad-dimension-platform.js'),
        'ad-dimension-subject': path.resolve(__dirname, 'src/js/ad-dimension-subject.js'),
        'ad-group': path.resolve(__dirname, 'src/js/ad-group.js'),
        'ad-weibo-baseinfo': path.resolve(__dirname, 'src/js/ad-weibo-baseinfo.js'),
        'ad-weibo-complete': path.resolve(__dirname, 'src/js/ad-weibo-complete.js'),
        'ad-weibo-orientation': path.resolve(__dirname, 'src/js/ad-weibo-orientation.js'),
        'ad-weibo-promotioninfo': path.resolve(__dirname, 'src/js/ad-weibo-promotioninfo.js'),
        'ad-weibo-timetomarket': path.resolve(__dirname, 'src/js/ad-weibo-timetomarket.js'),
        'data-overview': path.resolve(__dirname, 'src/js/data-overview.js'),
        'data-info-overview': path.resolve(__dirname, 'src/js/data-info-overview.js'),
        'data-people': path.resolve(__dirname, 'src/js/data-people.js'),
        'aptitude-edit': path.resolve(__dirname, 'src/js/aptitude-edit.js'),
        'aptitude-detail': path.resolve(__dirname, 'src/js/aptitude-detail.js'),
        'settle-resetpwd': path.resolve(__dirname, 'src/js/settle-resetpwd.js'),
        'service-weibo-first': path.resolve(__dirname, 'src/js/service-weibo-first.js'),
        'service-weibo-second': path.resolve(__dirname, 'src/js/service-weibo-second.js'),
        'service-weibo-third': path.resolve(__dirname, 'src/js/service-weibo-third.js'),
        'service-weibo-aptitude': path.resolve(__dirname, 'src/js/service-weibo-aptitude.js'),
        'finance': path.resolve(__dirname, 'src/js/finance.js'),
        'finance-invoice': path.resolve(__dirname, 'src/js/finance-invoice.js'),
        'finance-get-invoice': path.resolve(__dirname, 'src/js/finance-get-invoice.js'),
        'notice': path.resolve(__dirname, 'src/js/notice.js')
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_module/
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        publicPath: path.resolve(__dirname, 'dist/js'),
        filename: '[name].js'
    },
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    }
};
