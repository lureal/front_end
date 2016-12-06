/*!
 * 罗列全部角色下用户
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var urler = require('./modules/urler.js')

// 初始化导航
auth.noToolbar({
    title: '角色下用户'
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/role/list_user.do',
        param: {
            id: urler.normal().id,
            page: sessionStorage.getItem('listUserTargetPage') !== null ? sessionStorage.getItem('listUserTargetPage') : 1
        },
        title: '角色下用户'
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
            url: '/admin/role/list_user.do',
            param: param,
            title: '角色下用户'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#user').html(_.template(tpl)(data));

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var targetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('listUserTargetPage', targetPage);
        }
    });
});

// 删除
$('body').on('click', '.delete', function(data) {
    var user = $(this).attr('data-userId');
    ajax.get({
        url: '/admin/role/deleteUserRole.do',
        param: {
            user: user,
            id: urler.normal().id
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '删除成功',
                    title: '角色下用户',
                    event: function() {
                        location.reload();
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    ctn: '删除失败',
                    title: '角色下用户'
                });
                return;
            }
        }
    })
});


