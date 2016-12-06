/*!
 * 罗列全部操作日志
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
    title: '操作日志'
});

// 初始化日期控件
datePicker.init('#datapicker');

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/log/list_operate.do',
        param: {
            page: sessionStorage.getItem('operaLogTargetPage') !== null ? sessionStorage.getItem('operaLogTargetPage') : 1
        },
        title: '操作日志'
    },
    $btn: null,
    callback: function(data) {

        for(var i = 0; i < data.data.logList.length; i++) {
            var val = data.data.logList[i];
            val.posttime_str = time.unixToTime(val.posttime);
        }

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

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
            url: '/admin/log/list_operate.do',
            param: param,
            title: '操作日志'
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

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var targetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('operaLogTargetPage', targetPage);

        }
    });
});

// 搜索按钮
$('#search').click(function() {

    // 获取日期
    var date = datePicker.getVal('#datapicker');

    // 执行搜索
    ajax.get({
        url: '/admin/log/list_operate.do',
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
        title: '操作日志'
    });

});


// 导出按钮
$('#export').click(function() {

    // 获取日期
    var date = datePicker.getVal('#datapicker');
    location.href = '/admin/log/export_operate.do?startdate=' + date.start + '&enddate=' + date.end;
});
