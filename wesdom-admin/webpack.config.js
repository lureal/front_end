/**
 * webpack.config.js
 * @description webpack 配置文件
 */

var path = require('path');

module.exports = {
    entry: {
        'common': path.resolve(__dirname, 'src/js/common.js'),
        'insight-list': path.resolve(__dirname, 'src/js/insight-list.js'),
        'insight-add': path.resolve(__dirname, 'src/js/insight-add.js'),
        'insight-detail': path.resolve(__dirname, 'src/js/insight-detail.js'),
        'author-list': path.resolve(__dirname, 'src/js/author-list.js'),
        'author-add': path.resolve(__dirname, 'src/js/author-add.js'),
        'author-detail': path.resolve(__dirname, 'src/js/author-detail.js'),
        'partner-list': path.resolve(__dirname, 'src/js/partner-list.js'),
        'partner-add': path.resolve(__dirname, 'src/js/partner-add.js'),
        'partner-detail': path.resolve(__dirname, 'src/js/partner-detail.js'),
        'case-list': path.resolve(__dirname, 'src/js/case-list.js'),
        'case-add': path.resolve(__dirname, 'src/js/case-add.js'),
        'case-detail': path.resolve(__dirname, 'src/js/case-detail.js'),
        'resource-list': path.resolve(__dirname, 'src/js/resource-list.js'),
        'resource-add': path.resolve(__dirname, 'src/js/resource-add.js'),
        'resource-detail': path.resolve(__dirname, 'src/js/resource-detail.js'),
        'customer-list': path.resolve(__dirname, 'src/js/customer-list.js'),
        'customer-add': path.resolve(__dirname, 'src/js/customer-add.js'),
        'customer-detail': path.resolve(__dirname, 'src/js/customer-detail.js'),
        'job-list': path.resolve(__dirname, 'src/js/job-list.js'),
        'job-add': path.resolve(__dirname, 'src/js/job-add.js'),
        'job-detail': path.resolve(__dirname, 'src/js/job-detail.js'),
        'page-info': path.resolve(__dirname, 'src/js/page-info.js'),
        'login': path.resolve(__dirname, 'src/js/login.js'),
        'banner': path.resolve(__dirname, 'src/js/banner.js'),
        'introduce-list': path.resolve(__dirname, 'src/js/introduce-list.js'),
        'introduce-add': path.resolve(__dirname, 'src/js/introduce-add.js'),
        'introduce-addpic': path.resolve(__dirname, 'src/js/introduce-addpic.js'),
        'introduce-addtitle': path.resolve(__dirname, 'src/js/introduce-addtitle.js'),
        'introduce-detail': path.resolve(__dirname, 'src/js/introduce-detail'),
        'introduce-detailpic': path.resolve(__dirname, 'src/js/introduce-detailpic')
    },
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        publicPath: path.resolve(__dirname, 'dist/js'),
        filename: '[name].js'
    }
}
