/**
 * 侧边栏
 */
 
var ajax = require('./ajax');
var modal = require('./modal');

/**
 * 暴露出函数
 * @param [Object] modal {从页面中传递过来的弹窗对象}
 * @param [Object] ajaxParam {Ajax 所需要的参数}
 */
module.exports = function(ajaxParam) {

    var auth = ajaxParam.auth === undefined ? (function() {}) : ajaxParam.auth;

    ajax.get({
        url: '/admin/user/list_menus.do',
        param: {
            url: location.pathname
        },
        cb: function(data) {

            // 获取界面中的侧边栏模板
            var tpl = $('#main-sidebar-tpl').html();
            $('#sidebar-menu').html(_.template(tpl)(data));

            // 页面权限操作回调函数
            auth(data);
        },
        modal: modal,
        title: ajaxParam.title
    });
}
