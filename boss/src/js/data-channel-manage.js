/*!
 * 渠道商管理
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');

auth.toolbar1({
    title: '渠道商管理'
})

// 初始化搜索条中的日期控件
datePicker.init('#datepaker');

// 互为二代
select2.init({
    url: '/admin/channel/expand_progress_option.do',
    title: '互为二代',
    cb: function(data) {
        var tpl = $('#expand-process-tpl').html();
        $('#expand-process').html(_.template(tpl)(data));
        $('#expand-process').select2({
            placeholder: '互为二代'
        }).select2('val', '');
    }
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/channel/channelManage.do',
        param: {
            page: sessionStorage.getItem('cmTargetPage') !== null ? sessionStorage.getItem('cmTargetPage') : 1
        },
        title: '渠道商管理'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        // 渲染模板
        var tpl = $('#channel-manage-tpl').html();
        $('#channel-manage').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/channel/channelManage.do',
            param: param,
            title: '渠道商管理'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#channel-manage-tpl').html();
            $('#channel-manage').html(_.template(tpl)(data));

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var targetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('cmTargetPage', targetPage);
        }
    });
});

// 下载按钮
$('#download').click(function() {
    location.href = '/admin/channel/download_channel_manage.do';
});

// 搜索按钮
$('#search').click(function() {

    // 获取日期
    var date = datePicker.getVal('#datepaker');

    // 渠道商名称、ID
    var keyword  = $('#channel-name').val();

    // 拓展进度
    var expandProgressId = select2.getVal({
        id: '#expand-process'
    });

    // 执行搜索
    ajax.get({
        url: '/admin/channel/channelManage.do',
        param: {
            startdate: date.start,
            enddate: date.end,
            keyword: keyword,
            expandProgressId: expandProgressId === 'clear' ? '' : expandProgressId,
            page: 1
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                startdate: date.start,
                enddate: date.end,
                keyword: keyword,
                expandProgressId: expandProgressId === 'clear' ? '' : expandProgressId,
                page: 1
            }));

            // 渲染模板
            var tpl = $('#channel-manage-tpl').html();
            $('#channel-manage').html(_.template(tpl)(data));

        },
        modal: modal,
        title: '渠道商管理'
    });
});

// 删除
$('body').on('click', '#delete', function() {
    var id = $(this).attr('data-id');

     modal.twobtn({
        ctx: 'body',
        ctn: '是否删除渠道商？',
        title: '渠道商管理',
        btnOneText: '取消',
        btnOneClass: 'btn-default',
        eventOne: function() {
            $('#modal-twobtn').modal('hide');
        },
        eventTwo: function() {
            $('#modal-twobtn').modal('hide');

            ajax.post({
                url: '/admin/channel/delete.do',
                param: {
                    id: id,
                    page: 1
                },
                cb: function(data) {
                    if(data.data === true) {
                        modal.onebtn({
                            ctx: 'body',
                            title: '渠道商管理',
                            ctn: '删除渠道商成功',
                            event: function() {
                                location.reload();
                            }
                        });
                    } else {
                        modal.nobtn({
                            ctx: 'body',
                            title: '渠道商管理',
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

    // 获取日期
    var date = datePicker.getVal('#datepaker');

    // 获取渠道商ID、名称
    var keyword  = $('#channel-name').val();

    // 获取拓展进度
    var expandProgressId = select2.getVal({
        id: '#expand-process'
    });

    location.href = '/admin/channel/export_channel_manage.do?expandProgressId='+ (expandProgressId === null ? '' : expandProgressId) +
        '&startdate=' + date.start + '&enddate=' + date.end+ '&keyword=' + keyword;

});
