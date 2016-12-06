/*!
 * 渠道商明细
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');

auth.toolbar1({
    title: '渠道商明细(总表)'
})

// 初始化搜索条中的日期控件
datePicker.init('#datepaker');

// 拓展进度
select2.init({
    url: '/admin/channel/expand_progress_option.do',
    title: '拓展进度',
    cb: function(data) {
        var tpl = $('#expand-process-tpl').html();
        $('#expand-process').html(_.template(tpl)(data));
        $('#expand-process').select2({
            placeholder: '拓展进度'
        }).select2('val', '');
    }
});


// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/channel/channelManage.do',
        param: {
            page: sessionStorage.getItem('totalTargetPage') !== null ? sessionStorage.getItem('totalTargetPage') : 1
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
        var tpl = $('#channel-detail-total-tpl').html();
        $('#channel-detail-total').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/channel/channelManage.do',
            param: param,
            title: '渠道商明细'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#channel-detail-total-tpl').html();
            $('#channel-detail-total').html(_.template(tpl)(data));

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var targetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('totalTargetPage', targetPage);
        }
    });
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
            var tpl = $('#channel-detail-total-tpl').html();
            $('#channel-detail-total').html(_.template(tpl)(data));

        },
        modal: modal,
        title: '渠道商明细'
    });

});

// 导出按钮
$('#export').click(function() {

    var keyword = $('#channel-name').val();
    var expandProgressId = select2.getVal({
        id: '#expand-process'
    });
    var date = datePicker.getVal('#datepaker');

    location.href = '/admin/channel/export_channel_manage.do?keyword=' + (keyword === null ? '' : keyword) + '&startdate=' +
     date.start +
    '&enddate=' + date.end +
    '&expandProgressId=' + (expandProgressId === null ? '' : expandProgressId);
});
