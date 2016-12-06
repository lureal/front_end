/*!
 * 部门管理
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');

// 初始化导航
auth.noToolbar({
    title: '部门管理'
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/depart/list.do',
        param: {
            page: sessionStorage.getItem('departListTargetPage') !== null ? sessionStorage.getItem('departListTargetPage') : 1
        },
        title: '部门管理'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#depart').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/depart/list.do',
            param: param,
            title: '部门管理'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#depart').html(_.template(tpl)(data));

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var targetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('departListTargetPage', targetPage);
        }
    });
});

// 导出按钮
$('#export').click(function() {
    location.href = '/admin/depart/export.do';
});

// 同步数据
$('#sync').click(function() {

    var $self = $(this);
    $('i', $self).css('display', 'inline-block');

    // 执行搜索
    ajax.get({
        url: '/admin/depart/sync.do',
        cb: function(data) {
            $('i', $self).css('display', 'none');

            // 同步成功
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '部门管理',
                    ctn: '同步成功',
                    event: function() {
                        location.reload();
                    }
                });

            // 导出失败
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '部门管理',
                    ctn: '同步失败'
                });
            }
        },
        modal: modal,
        title: '部门管理'
    });
});
