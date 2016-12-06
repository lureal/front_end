/*!
 * 侧边栏模块
 */

var ajax = require('./ajax');
var modal = require('./modal');
var urler = require('./urler');
var sidebar = {};

/**
 * 管理系统侧边栏
 *
 * ajaxParam.active 标识当前是在哪个菜单，有下面这些值：
 * customer -> 客户管理
 * auth -> 权限管理
 * finance -> 财务管理
 * delivery -> 投放管理
 * overview -> 信息概览
 *
 */
sidebar.manage = function(ajaxParam) {
    ajax.get({
        url: ' /manage/listMenus.do',
        cb: function(data) {

            data.active = ajaxParam.active;

            // 获取界面中的侧边栏模板
            var tpl = $('#manage-sidebar-tpl').html();
            $('#sidebar-menu').html(_.template(tpl)(data));

        },
        modal: modal,
        title: ajaxParam.title
    });
};

/**
 * 投放系统侧边栏
 *
 * ajaxParam.active 标识当前是在哪个菜单，有下面这些值：
 * ad -> 广告管理
 * statis -> 数据统计
 * finance -> 财务管理
 * operate -> 操作日志
 * overview -> 信息概览
 */
sidebar.delivery = function(ajaxParam) {
    var tpl = $('#delivery-sidebar-tpl').html();
    $('#sidebar-menu').html(_.template(tpl)({active: ajaxParam.active}));
    urler.initLink();
};

/**
 * 后台侧边栏
 *
 * ajaxParam.active 标识当前是在哪个菜单，有下面这些值：
 * system -> 系统配置
 * platform -> 平台配置
 * bill -> 订单管理
 * warn -> 报警管理
 * money -> 结算管理
 */
sidebar.boss = function(ajaxParam) {
    var tpl = $('#boss-sidebar-tpl').html();
    $('#sidebar-menu').html(_.template(tpl)({active: ajaxParam.active}));
}


module.exports = sidebar;
