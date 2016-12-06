/*!
 * 角色分配
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
    title: '角色分配'
});

// 请求角色列表渲染界面
ajax.get({
    url: '/admin/user/list_roles.do',
    param: {
        id: urler.normal().id
    },
    cb: function(data) {

        // 渲染模板
        var tpl = $('#roles-tpl').html();
        $('#roles').html(_.template(tpl)(data));
    }
});

// 分配角色
$('#submit').click(function() {
    $("#submit").attr("disabled", true);

    // 获取角色列表 -> checked 状态的 input
    var roleId = [];
    $('.role [type="checkbox"]:checked').each(function() {
        var id = $(this).val();
        roleId.push(id);
    });

    // 判定是否有勾选角色
    if(roleId.length === 0) {
        modal.nobtn({
            ctx: 'body',
            title: '分类角色',
            ctn: '请选择需要分配的角色',
        });
        return;
    }

    // 发起请求，让服务器角色分配
    ajax.get({
        url: '/admin/user/assign_role.do',
        param: {
            id: urler.normal().id,
            json: JSON.stringify(roleId)
        },
        cb: function(data) {
            $("#submit").attr("disabled", false);
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '角色分配',
                    ctn: '角色分配成功',
                    event: function() {
                        location.href = '/#proj_name#/html/system/user-list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '角色分配',
                    ctn: data.message
                });
            }
        }
    })

});
