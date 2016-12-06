/*!
 * 添加菜单权限
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
    title: '添加菜单权限'
});

// 提交
$('#submit').click(function() {
    $("#submit").attr("disabled", true);
    var name = $('#name').val();
    var code = $('#code').val();
    var url = $('#url').val();
    var id = urler.normal().id;

    ajax.get({
        url: '/admin/menu/add_action.do',
        param: {
            menuId: id,
            name: name,
            url: url,
            code: code
        },
        cb: function(data) {
            $("#submit").attr("disabled", false);
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '添加菜单',
                    ctn: '添加菜单权限成功',
                    event: function() {
                        location.href = '/#proj_name#/html/system/menu-action-list.html?id=' + urler.normal().id + '&parentId=' + urler.normal().parentId +
                        '&menuName=' + urler.normal().menuName;
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '菜单管理',
                    ctn: data.message
                });
            }
        }
    })
});
