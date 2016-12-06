/*!
 * 部门下所有成员
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
    title: '部门下所有成员'
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/depart/list_user.do',
        param: {
            id: urler.normal().id,
            page: 1
        },
        title: '部门下所有成员'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            id: urler.normal().id,
            page: 1
        }));

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#user').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/depart/list_user.do',
            param: param,
            title: '部门下所有成员'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#user').html(_.template(tpl)(data));
        }
    });
});
