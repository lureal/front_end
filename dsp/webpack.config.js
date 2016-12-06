/**
 * webpack.config.js
 * @description webpack 配置文件
 */

var path = require('path');

module.exports = {
    entry: {
        'common': path.resolve(__dirname, 'src/js/common.js'),
        'user': path.resolve(__dirname,'src/js/user.js'),

        'manage-auth-list': path.resolve(__dirname, 'src/js/manage-auth-list.js'),
        'manage-overview': path.resolve(__dirname, 'src/js/manage-overview.js'),
        'manage-auth-cusdetail': path.resolve(__dirname, 'src/js/manage-auth-cusdetail.js'),
        'manage-auth-allocustomer': path.resolve(__dirname, 'src/js/manage-auth-allocustomer.js'),
        'manage-delivery-effect': path.resolve(__dirname, 'src/js/manage-delivery-effect.js'),
        'manage-auth-createrole': path.resolve(__dirname, 'src/js/manage-auth-createrole.js'),
        'manage-customer-list': path.resolve(__dirname, 'src/js/manage-customer-list.js'),
        'manage-customer-add': path.resolve(__dirname, 'src/js/manage-customer-add.js'),
        'manage-customer-censorship': path.resolve(__dirname, 'src/js/manage-customer-censorship.js'),
        'manage-customer-detail': path.resolve(__dirname, 'src/js/manage-customer-detail.js'),
        'manage-finance-list': path.resolve(__dirname, 'src/js/manage-finance-list.js'),
        'manage-finance-recharge': path.resolve(__dirname, 'src/js/manage-finance-recharge.js'),
        'manage-finance-increase': path.resolve(__dirname, 'src/js/manage-finance-increase.js'),
        'manage-finance-decrease': path.resolve(__dirname, 'src/js/manage-finance-decrease.js'),

        'delivery-overview': path.resolve(__dirname, 'src/js/delivery-overview.js'),
        'delivery-ad-list': path.resolve(__dirname, 'src/js/delivery-ad-list.js'),
        'delivery-ad-step1': path.resolve(__dirname, 'src/js/delivery-ad-step1.js'),
        'delivery-ad-step2': path.resolve(__dirname, 'src/js/delivery-ad-step2.js'),
        'delivery-ad-step3': path.resolve(__dirname, 'src/js/delivery-ad-step3.js'),
        'delivery-ad-step4': path.resolve(__dirname, 'src/js/delivery-ad-step4.js'),
        'delivery-ad-detail': path.resolve(__dirname, 'src/js/delivery-ad-detail.js'),
		'delivery-log': path.resolve(__dirname, 'src/js/delivery-log.js'),
        'delivery-finance-list': path.resolve(__dirname, 'src/js/delivery-finance-list.js'),
        'delivery-statis-list': path.resolve(__dirname, 'src/js/delivery-statis-list.js'),
        'delivery-ad-group-list': path.resolve(__dirname, 'src/js/delivery-ad-group-list.js'),

        'boss-system': path.resolve(__dirname, 'src/js/boss-system.js'),
        'boss-bill': path.resolve(__dirname, 'src/js/boss-bill.js'),
        'boss-platform': path.resolve(__dirname, 'src/js/boss-platform.js'),
        'boss-settlement': path.resolve(__dirname, 'src/js/boss-settlement.js'),
        'boss-warn': path.resolve(__dirname, 'src/js/boss-warn.js'),

    },
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        publicPath: path.resolve(__dirname, 'dist/js'),
        filename: '[name].js'
    }
}
