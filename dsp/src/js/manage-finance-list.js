/*!
 * 财务管理
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var sidebar = require('./modules/sidebar.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var time = require('./modules/time.js');
var header = require('./modules/header.js');

// 初始化菜单
sidebar.manage({
    title: '财务管理',
    active: 'finance'
});

// 初始化顶部栏
header.manage({
    title: '财务管理'
});

// 获取公司账户余额
ajax.get({
    url: '/manage/finance/getSelfBalance.do',
    cb: function(data) {
        $('#balance').html(data.data.balance/100);
    }
});

// 加载列表（财务信息）
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/manage/finance/listCustoms.do',
        param: {
            page: 1,
            export: false
        },
        title: '财务管理'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1,
            export: false
        }));

        for(var i = 0; i < data.data.records.length; i++) {
            var val = data.data.records[i];
            val.posttime_str = time.unixToTime(val.posttime);
        }

        // 渲染模板
        var tpl = $('#info-list-tpl').html();
        $('#info-list').html(_.template(tpl)(data));
    }
});

// 分页（财务信息）
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/manage/finance/listCustoms.do',
            param: param,
            title: '财务管理'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            for(var i = 0; i < data.data.records.length; i++) {
                var val = data.data.records[i];
                val.posttime_str = time.unixToTime(val.posttime);
            }

            // 渲染模板
            var tpl = $('#info-list-tpl').html();
            $('#info-list').html(_.template(tpl)(data));
        }
    });
}, $('#info'));

// 搜索（财务信息）
$('body').on('click', '#info-search', function() {

    // 获取客户名称或客户 ID
    var customer = $('#info-customer').val();

    // 执行搜索
    ajax.get({
        url: '/manage/finance/listCustoms.do',
        param: {
            keyword: customer,
            page: 1,
            export: false
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                keyword: customer,
                page: 1,
                export: false
            }));

            for(var i = 0; i < data.data.records.length; i++) {
                var val = data.data.records[i];
                val.posttime_str = time.unixToTime(val.posttime);
            }

            // 渲染模板
            var tpl = $('#info-list-tpl').html();
            $('#info-list').html(_.template(tpl)(data));

        },
        modal: modal,
        title: '财务管理'
    });
});

// 加载分页（财务记录）
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/manage/finance/list.do',
        param: {
            page: 1,
            export: false
        },
        title: '财务管理'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1,
            export: false
        }));

        for(var i = 0; i < data.data.records.length; i++) {
            var val = data.data.records[i];
            val.posttime_str = time.unixToTime(val.posttime);
        }

        // 渲染模板
        var tpl = $('#record-list-tpl').html();
        $('#record-list').html(_.template(tpl)(data));

        // 初始化财务记录日期提示框
        datePicker.init('#datepicker');
    }
});

// 分页（财务记录）
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/manage/finance/list.do',
            param: param,
            title: '财务管理'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            for(var i = 0; i < data.data.records.length; i++) {
                var val = data.data.records[i];
                val.posttime_str = time.unixToTime(val.posttime);
            }

            // 渲染模板
            var tpl = $('#record-list-tpl').html();
            $('#record-list').html(_.template(tpl)(data));

            // 初始化财务记录日期提示框
            datePicker.init('#datepicker');
        }
    });
}, $('#record'));

// 搜索（财务记录）
$('body').on('click', '#record-search', function() {

    // 获取日期
    var date = datePicker.getVal('#datepicker');

    // 执行搜索
    ajax.get({
        url: '/manage/finance/list.do',
        param: {
            startDate: date.start,
            endDate: date.end,
            page: 1,
            export: false
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                startDate: date.start,
                endDate: date.end,
                page: 1,
                export: false
            }));

            for(var i = 0; i < data.data.records.length; i++) {
                var val = data.data.records[i];
                val.posttime_str = time.unixToTime(val.posttime);
            }

            // 渲染模板
            var tpl = $('#record-list-tpl').html();
            $('#record-list').html(_.template(tpl)(data));

            // 初始化财务记录日期提示框
            datePicker.init('#datepicker');

        },
        modal: modal,
        title: '财务管理'
    });
});

// 导出（财务记录）
$('body').on('click', '#record-export', function() {

    // 获取日期
    var date = datePicker.getVal('#datepicker');

    location.href = '/manage/finance/list.do?export=true' +
        '&startDate=' + date.start +
        '&endDate=' + date.end;

});
