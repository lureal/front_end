/*!
 * 财务信息
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var sidebar = require('./modules/sidebar.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var urler = require('./modules/urler.js');
var time = require('./modules/time.js');
var header = require('./modules/header.js');
var cache = require('./modules/cache.js');
var timer = require('./modules/time-picker.js');

//初始化菜单
sidebar.delivery({
    title: '财务信息',
    active: 'finance'
});

// 初始化顶部栏
header.delivery({
    title: '财务信息'
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/deal/finance/list.do',
        param: {
            page: 1,
            export: false,
            customId: urler.normal().cid
        },
        title: '财务信息'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1,
            export: false,
            customId: urler.normal().cid
        }));

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#finance').html(_.template(tpl)(data));

        // 初始化广告组中的日期选择框
        datePicker.init('#datepicker');
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/deal/finance/list.do',
            param: param,
            title: '财务信息',
            customId: urler.normal().cid
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#finance').html(_.template(tpl)(data));

            // 初始化广告组中的日期选择框
            datePicker.init('#datepicker');
        }
    });
});

// 搜索
$('#search').click(function() {

    // 获取日期
    var date = datePicker.getVal('#datepicker');

    // 执行搜索
    ajax.get({
        url: '/deal/finance/list.do',
        param: {
            startDate: date.start,
            endDate: date.end,
            page: 1,
            export: false,
            customId: urler.normal().cid
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                startDate: date.start,
                endDate: date.end,
                page: 1,
                export: false,
                customId: urler.normal().cid
            }));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#finance').html(_.template(tpl)(data));
        },
        modal: modal,
        title: '财务信息'
    });

});

// 导出
$('#export').click(function() {

    // 获取日期
    var date = datePicker.getVal('#datepicker');

    // 浏览器打开页面的方式下载附件
    location.href = '/deal/finance/list.do?startDate=' + date.start +
        '&endDate=' + date.end +
        '&export=true' +
        '&customId=' + urler.normal().cid;
});
