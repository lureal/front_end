/*!
 * 环评建议
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var time = require('./modules/time.js');

auth.toolbar1({
    title: '环评建议'
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/grade/list_suggest.do',
        title: '环评建议'
    },
    $btn: null,
    callback: function(data) {

        // 渲染模板
        var tpl = $('#suggest-table-tpl').html();
        $('#suggest-table').html(_.template(tpl)(data));

        //给第一个li元素，添加默认选中的样式
        $('#suggest-table').find('ul li').eq(0).addClass('active');
        $('#suggest-table').find('.tab-pane').eq(0).addClass('active');
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/grade/list_suggest.do',
            param: param,
            title: '环评建议'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#suggest-table-tpl').html();
            $('#suggest-table').html(_.template(tpl)(data));

            //给第一个li元素，添加默认选中的样式
            $('#suggest-table').find('ul li').eq(0).addClass('active');
            $('#suggest-table').find('.tab-pane').eq(0).addClass('active');
        }
    });
});

//初始化季度日期,用户列表选择
select2.init({
    url: '/admin/grade/quarter_option.do',
    title: '季度选择',
    cb: function(data) {
        var tpl = $('#score-date-tpl').html();
        $('#score-date').html(_.template(tpl)(data));
        $('#score-date').select2({
            placeholder: '季度选择'
        }).select2('val', '');
    }
});

//查询
$('#search').on('click', function() {
    var dateDate = $('#score-date').val();
    ajax.get({
        url: '/admin/grade/list_suggest.do',
        param: {
            dateDate: dateDate
        },
        cb: function(data) {
            var tpl = $('#suggest-table-tpl').html();
            $('#suggest-table').html(_.template(tpl)(data));

            //给第一个li元素，添加默认选中的样式
            $('#suggest-table').find('ul li').eq(0).addClass('active');
            $('#suggest-table').find('.tab-pane').eq(0).addClass('active');
        }
    });
});
