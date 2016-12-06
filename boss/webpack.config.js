/**
 * webpack.config.js
 * @description webpack 配置文件
 */

var path = require('path');

module.exports = {
    entry: {
        'common': path.resolve(__dirname, 'src/js/common.js'),
        'report-cust-list': path.resolve(__dirname, 'src/js/report-cust-list.js'),
        'report-my-cust-list': path.resolve(__dirname, 'src/js/report-my-cust-list.js'),
        'report-change-log': path.resolve(__dirname, 'src/js/report-change-log.js'),
        'report-summary': path.resolve(__dirname, 'src/js/report-summary.js'),
        'report-static': path.resolve(__dirname, 'src/js/report-static.js'),
        'report-static-chart': path.resolve(__dirname, 'src/js/report-static-chart.js'),
        'report-channel-detail-total': path.resolve(__dirname, 'src/js/report-channel-detail-total.js'),
        'report-my-channel-detail': path.resolve(__dirname, 'src/js/report-my-channel-detail.js'),
        'report-contribute-customer': path.resolve(__dirname, 'src/js/report-contribute-customer.js'),

        'data-product-list': path.resolve(__dirname, 'src/js/data-product-list.js'),
        'data-product-add': path.resolve(__dirname, 'src/js/data-product-add.js'),
        'data-product-detail': path.resolve(__dirname, 'src/js/data-product-detail.js'),
        'data-product-import': path.resolve(__dirname, 'src/js/data-product-import.js'),
        'data-basedata-list': path.resolve(__dirname, 'src/js/data-basedata-list.js'),
        'data-basedata-add': path.resolve(__dirname, 'src/js/data-basedata-add.js'),
        'data-basedata-detail': path.resolve(__dirname, 'src/js/data-basedata-detail.js'),
        'data-basedata-import': path.resolve(__dirname, 'src/js/data-basedata-import.js'),
        'data-customer-list': path.resolve(__dirname, 'src/js/data-customer-list.js'),
        'data-customer-import': path.resolve(__dirname, 'src/js/data-customer-import.js'),
        'data-customer-add': path.resolve(__dirname, 'src/js/data-customer-add.js'),
        'data-customer-detail': path.resolve(__dirname, 'src/js/data-customer-detail.js'),
        'data-recharge-list': path.resolve(__dirname, 'src/js/data-recharge-list.js'),
        'data-recharge-import': path.resolve(__dirname, 'src/js/data-recharge-import.js'),
        'data-recharge-add': path.resolve(__dirname, 'src/js/data-recharge-add.js'),
        'data-recharge-detail': path.resolve(__dirname, 'src/js/data-recharge-detail.js'),
        'data-consume-list': path.resolve(__dirname, 'src/js/data-consume-list.js'),
        'data-consume-import': path.resolve(__dirname, 'src/js/data-consume-import.js'),
        'data-channel-manage-detail': path.resolve(__dirname, 'src/js/data-channel-manage-detail.js'),
        'data-channel-import': path.resolve(__dirname, 'src/js/data-channel-import.js'),

        'system-role-list': path.resolve(__dirname, 'src/js/system-role-list.js'),
        'system-role-add': path.resolve(__dirname, 'src/js/system-role-add.js'),
        'system-role-assign': path.resolve(__dirname, 'src/js/system-role-assign.js'),
        'system-role-detail': path.resolve(__dirname, 'src/js/system-role-detail.js'),
        'system-role-list-user': path.resolve(__dirname, 'src/js/system-role-list-user.js'),
        'system-role-list-right': path.resolve(__dirname, 'src/js/system-role-list-right.js'),
        'system-depart-list': path.resolve(__dirname, 'src/js/system-depart-list.js'),
        'system-depart-list-user': path.resolve(__dirname, 'src/js/system-depart-list-user.js'),
        'system-user-list': path.resolve(__dirname, 'src/js/system-user-list.js'),
        'system-user-assign-role': path.resolve(__dirname, 'src/js/system-user-assign-role.js'),
        'system-user-assign-right': path.resolve(__dirname, 'src/js/system-user-assign-right.js'),
        'system-user-add': path.resolve(__dirname, 'src/js/system-user-add.js'),
        'system-user-detail': path.resolve(__dirname, 'src/js/system-user-detail.js'),
        'system-menu-list': path.resolve(__dirname, 'src/js/system-menu-list.js'),
        'system-menu-add': path.resolve(__dirname, 'src/js/system-menu-add.js'),
        'system-menu-detail': path.resolve(__dirname, 'src/js/system-menu-detail.js'),
        'system-menu-action-list': path.resolve(__dirname, 'src/js/system-menu-action-list.js'),
        'system-menu-action-add': path.resolve(__dirname, 'src/js/system-menu-action-add.js'),
        'system-menu-action-detail': path.resolve(__dirname, 'src/js/system-menu-action-detail.js'),
        'system-auth-list': path.resolve(__dirname, 'src/js/system-auth-list.js'),
        'system-auth-role-tree': path.resolve(__dirname, 'src/js/system-auth-role-tree.js'),
        'system-auth-person-tree': path.resolve(__dirname, 'src/js/system-auth-person-tree.js'),
        'system-login-log': path.resolve(__dirname, 'src/js/system-login-log.js'),
        'system-opera-log': path.resolve(__dirname, 'src/js/system-opera-log.js'),
        'system-mail-list': path.resolve(__dirname, 'src/js/system-mail-list.js'),
        'system-depart-list-add': path.resolve(__dirname, 'src/js/system-depart-list-add'),

        'asset-exist-asset': path.resolve(__dirname, 'src/js/asset-exist-asset.js'),
        'asset-my-record': path.resolve(__dirname, 'src/js/asset-my-record.js'),
        'asset-use-record': path.resolve(__dirname, 'src/js/asset-use-record.js'),
        'asset-add-asset': path.resolve(__dirname, 'src/js/asset-add-asset.js'),
        'asset-asset-detail': path.resolve(__dirname, 'src/js/asset-asset-detail.js'),
        'asset-add-use-record': path.resolve(__dirname, 'src/js/asset-add-use-record.js'),
        'asset-use-record-detail': path.resolve(__dirname, 'src/js/asset-use-record-detail.js'),
        'asset-office-computer': path.resolve(__dirname, 'src/js/asset-office-computer.js'),
        'asset-office-furniture': path.resolve(__dirname, 'src/js/asset-office-furniture.js'),
        'asset-office-computer-add': path.resolve(__dirname, 'src/js/asset-office-computer-add.js'),
        'asset-office-furniture-add': path.resolve(__dirname, 'src/js/asset-office-furniture-add.js'),
        'asset-office-computer-detail': path.resolve(__dirname, 'src/js/asset-office-computer-detail.js'),
        'asset-office-computer-import': path.resolve(__dirname, 'src/js/asset-office-computer-import.js'),
        'asset-office-furniture-import': path.resolve(__dirname, 'src/js/asset-office-furniture-import.js'),

        'attendance-manage': path.resolve(__dirname, 'src/js/attendance-manage.js'),
        'attendance-my-record': path.resolve(__dirname, 'src/js/attendance-my-record.js'),
        'attendance-edit': path.resolve(__dirname, 'src/js/attendance-edit.js'),

        'grade-manage': path.resolve(__dirname, 'src/js/grade-manage.js'),
        'grade-my-score': path.resolve(__dirname, 'src/js/grade-my-score.js'),
        'grade-score-list': path.resolve(__dirname, 'src/js/grade-score-list.js'),
        'grade-depart-score': path.resolve(__dirname, 'src/js/grade-depart-score.js'),
        'grade-staff-score': path.resolve(__dirname, 'src/js/grade-staff-score.js'),
        'grade-suggest-list': path.resolve(__dirname, 'src/js/grade-suggest-list.js'),

        'user-login': path.resolve(__dirname, 'src/js/user-login.js'),

        'library-borrow-list-detail': path.resolve(__dirname, 'src/js/library-borrow-list-detail.js'),
        'library-borrow-list': path.resolve(__dirname, 'src/js/library-borrow-list.js'),
        'library-borrow-manage': path.resolve(__dirname, 'src/js/library-borrow-manage.js'),
        'library-borrow-record': path.resolve(__dirname, 'src/js/library-borrow-record.js'),
        'library-manage-detail': path.resolve(__dirname, 'src/js/library-manage-detail.js'),
        'library-manage': path.resolve(__dirname, 'src/js/library-manage.js'),
        'library-wish-list': path.resolve(__dirname, 'src/js/library-wish-list.js'),
        'library-manage-add': path.resolve(__dirname, 'src/js/library-manage-add.js'),
        'library-wish-list-add': path.resolve(__dirname, 'src/js/library-wish-list-add'),
        'library-my-borrow-record': path.resolve(__dirname, 'src/js/library-my-borrow-record'),
        'library-my-wish-list': path.resolve(__dirname, 'src/js/library-my-wish-list.js'),
        'library-manage-wishlist-detail': path.resolve(__dirname, 'src/js/library-manage-wishlist-detail.js'),
        'library-manage-purchase': path.resolve(__dirname, 'src/js/library-manage-purchase.js'),

        'meeting-book-meeting': path.resolve(__dirname, 'src/js/meeting-book-meeting.js'),

        'data-channel-manage': path.resolve(__dirname, 'src/js/data-channel-manage.js'),
        'data-channel-manage-add': path.resolve(__dirname, 'src/js/data-channel-manage-add.js'),
        // 'channel-customer-detail.js': path.resolve(__dirname, 'src/js/channel-customer-detail.js'),

        'portal': path.resolve(__dirname, 'src/js/portal.js'),
        'suggest': path.resolve(__dirname, 'src/js/suggest.js'),
        'list': path.resolve(__dirname, 'src/js/list.js'),
        'notice-list': path.resolve(__dirname, 'src/js/notice-list.js'),
        'notice-add': path.resolve(__dirname, 'src/js/notice-add.js'),
        'notice': path.resolve(__dirname, 'src/js/notice.js'),
        'notice-preview': path.resolve(__dirname, 'src/js/notice-preview.js'),
        'notice-detail': path.resolve(__dirname, 'src/js/notice-detail.js'),
        'record': path.resolve(__dirname, 'src/js/record.js'),
        'notice-list-preview': path.resolve(__dirname, 'src/js/notice-list-preview.js'),
        'user-change-pwd': path.resolve(__dirname, 'src/js/user-change-pwd.js'),
        'user-reset-pwd': path.resolve(__dirname, 'src/js/user-reset-pwd.js')
    },
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        publicPath: path.resolve(__dirname, 'dist/js'),
        filename: '[name].js'
    }
}