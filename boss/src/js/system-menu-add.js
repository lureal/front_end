/*!
 * 添加菜单
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
    title: '添加菜单'
});

// 初始化上级菜单
select2.init({
    url: '/admin/menu/menu_option.do',
    title: '添加菜单',
    cb: function(data) {
        var tpl = $('#type-tpl').html();
        $('#parentId').html(_.template(tpl)(data));
        $('#parentId').select2({
            placeholder: '选择上级菜单'
        }).select2('val', '');
    }
});

// 添加菜单
$('#submit').click(function() {
    $("#submit").attr("disabled", true);
    var name = $('#name').val();
    var link = $('#link').val();
    var icon = $('#icon').val();
    var parentId = select2.getVal({
        id: '#parentId'
    });
    var order = $('#order').val();
    if(name === '' ) {
        modal.nobtn({
            ctx: 'body',
            title: '添加菜单',
            ctn: '必须输入名称字段'
        });
        return;
    }
    ajax.get({
        url: '/admin/menu/add.do',
        param: {
            name: name,
            url: link,
            icon: icon,
            parentId: parentId,
            seq: order
        },
        cb: function(data) {
            $("#submit").attr("disabled", false);
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '添加菜单',
                    ctn: '添加菜单成功',
                    event: function() {
                        location.href = '/#proj_name#/html/system/menu-list.html';
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
