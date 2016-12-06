/*!
 * 产品管理
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');

auth.toolbar1({
    title: '产品管理'
})

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/product/list.do',
        param: {
            page: sessionStorage.getItem('plTargetPage') !== null ? sessionStorage.getItem('plTargetPage') : 1
        },
        title: '产品管理'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#product').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/product/list.do',
            param: param,
            title: '产品管理'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#product').html(_.template(tpl)(data));

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var targetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('plTargetPage', targetPage);
        }
    });
});

// 搜索按钮
$('#search').click(function() {

    // 获取搜索值
    var name = $('#product-name').val();

    // 执行搜索
    ajax.get({
        url: '/admin/product/list.do',
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
            $('#product').html(_.template(tpl)(data));

        },
        modal: modal,
        title: '产品管理'
    });

});

// 删除产品
$('body').on('click', '.delete', function() {
    var id = $(this).attr('data-id');

    modal.twobtn({
        ctx: 'body',
        ctn: '是否删除产品？',
        title: '产品管理',
        btnOneText: '取消',
        btnOneClass: 'btn-default',
        eventOne: function() {
            $('#modal-twobtn').modal('hide');
        },
        eventTwo: function() {
            $('#modal-twobtn').modal('hide');
            ajax.post({
                url: '/admin/product/delete.do',
                param: {
                    id: id
                },
                cb: function(data) {
                    if(data.data === true) {
                        modal.onebtn({
                            ctx: 'body',
                            title: '产品管理',
                            ctn: '删除产品成功',
                            event: function() {
                                location.reload();
                            }
                        });
                    } else {
                        modal.nobtn({
                            ctx: 'body',
                            title: '产品管理',
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
    location.href = '/admin/product/export.do';
});

// 下载按钮
$('#download').click(function() {
    location.href = '/admin/product/download.do';
});
