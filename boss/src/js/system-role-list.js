/*!
 * 罗列全部角色管理
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');

// 初始化导航
auth.toolbar1({
    title: '角色管理'
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/role/list.do',
        param: {
            page: sessionStorage.getItem('roleListTargetPage') !== null ? sessionStorage.getItem('roleListTargetPage') : 1
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
        var tpl = $('#list-tpl').html();
        $('#role').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/role/list.do',
            param: param,
            title: '角色管理'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#role').html(_.template(tpl)(data));

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var targetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('roleListTargetPage', targetPage);
        }
    });
});

// 搜索按钮
$('#search').click(function() {

    // 获取产品名称
    var name = $('#product-name').val();


    // 判断数据是否符合要求
    // 当前没有选择日期
    var isName = name !== '';

    if(!isName) {
        modal.nobtn({
            ctx: 'body',
            title: '角色管理',
            ctn: '请输入产品名称'
        });
        return;
    }

    // 执行搜索
    ajax.get({
        url: '/admin/role/list.do',
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
            $('#role').html(_.template(tpl)(data));

        },
        modal: modal,
        title: '角色管理'
    });

});

// 删除角色
$('body').on('click', '.delete', function() {
    var id = $(this).attr('data-id');
    modal.twobtn({
        ctx: 'body',
        ctn: '是否删除角色？',
        title: '角色管理',
        btnOneText: '取消',
        btnOneClass: 'btn-default',
        eventOne: function() {
            $('#modal-twobtn').modal('hide');
        },
        eventTwo: function() {
            $('#modal-twobtn').modal('hide');

            ajax.post({
                url: '/admin/role/delete.do',
                param: {
                    id: id
                },
                cb: function(data) {
                    if(data.data === true) {
                        modal.onebtn({
                            ctx: 'body',
                            title: '角色管理',
                            ctn: '删除角色成功',
                            event: function() {
                                location.reload();
                            }
                        });
                    } else {
                        modal.nobtn({
                            ctx: 'body',
                            title: '角色管理',
                            ctn: data.message
                        });
                    }
                }
            });
        }
    });

});
