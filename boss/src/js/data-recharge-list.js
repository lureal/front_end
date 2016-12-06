/*!
 * 充值管理
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');

// 初始化菜单和权限
auth.toolbar1({
    title: '充值管理'
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/recharge/list.do',
        param: {
            page: sessionStorage.getItem('reclTargetPage') !== null ? sessionStorage.getItem('reclTargetPage') : 1
        },
        title: '充值管理'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#recharge').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/recharge/list.do',
            param: param,
            title: '充值管理'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#recharge').html(_.template(tpl)(data));

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var reclTargetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('reclTargetPage', reclTargetPage);
        }
    });
});

// 搜索按钮
$('#search').click(function() {

    // 获取搜索值
    var name = $('#name').val();

    // 执行搜索
    ajax.get({
        url: '/admin/recharge/list.do',
        param: {
            name: name,
            page: 1
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                name: name,
                page: 1
            }));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#recharge').html(_.template(tpl)(data));

        },
        modal: modal,
        title: '充值管理'
    });

});

// 删除产品
$('body').on('click', '.delete', function() {
    var id = $(this).attr('data-id');
    modal.twobtn({
        ctx: 'body',
        ctn: '是否删除产品？',
        title: '充值管理',
        btnOneText: '取消',
        btnOneClass: 'btn-default',
        eventOne: function() {
            $('#modal-twobtn').modal('hide');
        },
        eventTwo: function() {
            $('#modal-twobtn').modal('hide');
            ajax.post({
                url: '/admin/recharge/delete.do',
                param: {
                    id: id
                },
                cb: function(data) {
                    if(data.data === true) {
                        modal.onebtn({
                            ctx: 'body',
                            title: '充值管理',
                            ctn: '删除充值记录成功',
                            event: function() {
                                location.reload();
                            }
                        });
                    } else {
                        modal.nobtn({
                            ctx: 'body',
                            title: '充值管理',
                            ctn: data.message
                        });
                    }
                }
            });
        }
    });
});

// 导出按钮
$('#export').click(function() {

    // 获取搜索值
    var name = $('#name').val();
    location.href = '/admin/recharge/export.do?name=' + (name === null ? '' : name);
});
