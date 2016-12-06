/*!
 * 添加权限分配
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var urler = require('./modules/urler.js');

// 初始化导航
auth.noToolbar({
    title: '权限分配'
});

// 加载角色列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/authority/list_all_role.do',
        param: {
            page: 1
        },
        title: '角色管理'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        // 渲染模板
        var tpl = $('#role-list-tpl').html();
        $('#role').html(_.template(tpl)(data));
    }
});

// 加载人员列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/authority/list_all_user.do',
        title: '角色管理'
    },
    $btn: null,
    callback: function(data) {
        // 渲染模板
        var tpl = $('#person-list-tpl').html();
        $('#person').html(_.template(tpl)(data));
    }
});
