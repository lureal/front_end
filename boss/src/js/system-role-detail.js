/*!
 * 角色详情
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
    title: '角色详情'
});

// 获取角色详情
ajax.get({
    url: '/admin/role/detail.do',
    param: {
        id: urler.normal().id
    },
    cb: function(data) {

        // 渲染模板
        var tpl = $('#detail-tpl').html();
        $('#detail').html(_.template(tpl)(data));
    }
});

// 更新角色
$('body').on('click', '#submit', function() {
    $("#submit").attr("disabled", true);

    // 获取数据
    var name = $('#name').val();
    var memo = $('#memo').val();

    // 数据判定
    if(name === '' || memo === '') {
        modal.nobtn({
            ctx: 'body',
            title: '角色详情',
            ctn: '请确保输入角色名称和备注'
        });
        return;
    }

    // 提交数据
    ajax.post({
        url: '/admin/role/update.do',
        param: {
            id: urler.normal().id,
            name: name,
            memo: memo
        },
        cb: function(data) {
            $("#submit").attr("disabled", false);
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '角色详情',
                    ctn: '更新角色成功',
                    event: function() {
                        location.href = '/#proj_name#/html/system/role-list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '角色详情',
                    ctn: data.message
                });
            }
        }
    });
});
