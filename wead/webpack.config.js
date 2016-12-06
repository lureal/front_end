/*!
 * webpack.config.js
 * @description webpack 配置文件
 */

const path = require('path');

module.exports = {
    entry: {
        'common': path.resolve(__dirname, 'src/js/common.js'),
        'service': path.resolve(__dirname, 'src/js/service.js'),
        'service-fensitong-aptitude': path.resolve(__dirname, 'src/js/service-fensitong-aptitude.js'),
        'service-fensitong-first': path.resolve(__dirname, 'src/js/service-fensitong-first.js'),
        'service-fensitong-second': path.resolve(__dirname, 'src/js/service-fensitong-second.js'),
        'service-fensitong-apply': path.resolve(__dirname, 'src/js/service-fensitong-apply.js'),
        'settle-info': path.resolve(__dirname, 'src/js/settle-info.js'),
        'settle-resetpwd': path.resolve(__dirname, 'src/js/settle-resetpwd.js'),
        'notice': path.resolve(__dirname, 'src/js/notice.js'),
        'finance-detail': path.resolve(__dirname, 'src/js/finance-detail.js'),
        'finance-invoice': path.resolve(__dirname, 'src/js/finance-invoice.js'),
        'finance-get-invoice': path.resolve(__dirname, 'src/js/finance-get-invoice.js'),
        'data': path.resolve(__dirname, 'src/js/data.js'),
        'admin-log': path.resolve(__dirname, 'src/js/admin-log.js'),
        'admin-customer': path.resolve(__dirname, 'src/js/admin-customer.js'),
        'admin-fensitong-review': path.resolve(__dirname, 'src/js/admin-fensitong-review.js'),
        'admin-fensitong-aptitude': path.resolve(__dirname, 'src/js/admin-fensitong-aptitude.js'),
        'admin-fensitong-account': path.resolve(__dirname, 'src/js/admin-fensitong-account.js'),
        'admin-fensitong-data': path.resolve(__dirname, 'src/js/admin-fensitong-data.js'),
        'admin-fensitong-capital': path.resolve(__dirname, 'src/js/admin-fensitong-capital.js'),
        'admin-fensitong-invoice': path.resolve(__dirname, 'src/js/admin-fensitong-invoice.js'),
        'admin-message': path.resolve(__dirname, 'src/js/admin-message.js'),
        'login': path.resolve(__dirname, 'src/js/login.js'),
        'active': path.resolve(__dirname, 'src/js/active.js'),
        'resetpwd': path.resolve(__dirname, 'src/js/resetpwd.js'),
        'resetpwd-expire': path.resolve(__dirname, 'src/js/resetpwd-expire.js')
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
