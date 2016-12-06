/*!
 * 修改菜单权限
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
    title: '修改菜单权限'
});

// 填充绑定在 url 中的数据
$('#name').val(decodeURIComponent(urler.normal().name));
$('#code').val(decodeURIComponent(urler.normal().code));
$('#url').val(decodeURIComponent(urler.normal().url));

// 提交
$('#submit').click(function() {
    $("#submit").attr("disabled", true);
    var name = $('#name').val();
    var code = $('#code').val();
    var url = $('#url').val();
    var id = urler.normal().id;
    var menuId = urler.normal().menuId;

    ajax.get({
        url: '/admin/menu/update_action.do',
        param: {
            id: id,
            name: name,
            code: code,
            url: url,
            menuId: menuId
        },
        cb: function(data) {
            $("#submit").attr("disabled", false);
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '菜单详情',
                    ctn: '修改菜单权限成功',
                    event: function() {
                        location.href = '/#proj_name#/html/system/menu-action-list.html?id=' + urler.normal().menuId + '&parentId=' + urler.normal().parentId +
                        '&menuName=' + urler.normal().menuName;
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '菜单详情',
                    ctn: data.message
                });
            }
        }
    })
});
