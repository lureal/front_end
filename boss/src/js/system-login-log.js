/*!
 * 罗列全部登录日志
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var time = require('./modules/time.js');

// 初始化导航
auth.toolbar1({
    title: '登录日志'
});

// 初始化搜索条中的日期控件
datePicker.init('#datapicker');

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/log/list_login.do',
        param: {
            page: 1
        },
        title: '登录日志'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        for(var i = 0; i < data.data.logList.length; i++) {
            var val = data.data.logList[i];
            val.posttime_str = time.unixToTime(val.posttime);
        }

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#change').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/log/list_login.do',
            param: param,
            title: '登录日志'
        },
        $btn: $this,
        callback: function(data) {

            for(var i = 0; i < data.data.logList.length; i++) {
                var val = data.data.logList[i];
                val.posttime_str = time.unixToTime(val.posttime);
            }

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#change').html(_.template(tpl)(data));
        }
    });
});

// 搜索按钮
$('#search').click(function() {

    // 获取日期
    var date = datePicker.getVal('#datapicker');

    // 执行搜索
    ajax.get({
        url: '/admin/log/list_login.do',
        param: {
            startdate: date.start,
            enddate: date.end,
            page: 1
        },
        cb: function(data) {

            for(var i = 0; i < data.data.logList.length; i++) {
                var val = data.data.logList[i];
                val.posttime_str = time.unixToTime(val.posttime);
            }

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                startdate: date.start,
                enddate: date.end,
                page: 1
            }));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#change').html(_.template(tpl)(data));

        },
        modal: modal,
        title: '登录日志'
    });
});

// 导出按钮
$('#export').click(function() {

    // 获取日期
    var date = datePicker.getVal('#datapicker');
    location.href = '/admin/log/export_login.do?startdate=' + date.start + '&enddate=' + date.end;
});
