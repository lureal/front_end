/*!
 * 菜单详情
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
    title: '菜单详情'
});

// 获取服务器数据
ajax.get({
    url: '/admin/menu/detail.do',
    param: {
        id: urler.normal().id
    },
    cb: function(data) {
        var tpl = $('#detail-tpl').html();
        $('#detail').html(_.template(tpl)(data));

        // 初始化上级菜单
        select2.init({
            url: '/admin/menu/menu_option.do',
            title: '添加菜单',
            cb: function(_data) {
                var tpl = $('#type-tpl').html();
                $('#parentId').html(_.template(tpl)(_data));
                $('#parentId').select2({
                    placeholder: '选择上级菜单'
                }).select2('val', data.data.menu.parentId);
            }
        });
    }
})

// 更新菜单
$('body').on('click', '#submit', function() {
    $("#submit").attr("disabled", true);
    var id = $(this).attr('data-id');
    var name = $('#name').val();
    var link = $('#link').val();
    var icon = $('#icon').val();
    var parentId = select2.getVal({
        id: '#parentId'
    });
    var order = $('#order').val();

    if(name === '') {
        modal.nobtn({
            ctx: 'body',
            title: '菜单详情',
            ctn: '必须输入名称字段'
        });
        return;
    }

    ajax.get({
        url: '/admin/menu/update.do',
        param: {
            id: id,
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
                    title: '菜单详情',
                    ctn: '菜单更新成功',
                    event: function() {
                        location.href = '/#proj_name#/html/system/menu-list.html';
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
