/*!
 * 罗列全部投放管理
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
    title: '投放管理'
});

// 初始化搜索条中的日期控件
datePicker.init('#datapicker');

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/consume/list.do',
        param: {
            page: sessionStorage.getItem('consumeListTargetPage') !== null ? sessionStorage.getItem('consumeListTargetPage') : 1
        },
        title: '投放管理'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#customer').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/consume/list.do',
            param: param,
            title: '投放管理'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#customer').html(_.template(tpl)(data));

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var targetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('consumeListTargetPage', targetPage);
        }
    });
});

// 搜索按钮
$('#search').click(function() {

    // 获取日期
    var date = datePicker.getVal('#datapicker');

    // 获取产品线
    var name = $('#name').val();

    // 执行搜索
    ajax.get({
        url: '/admin/consume/list.do',
        param: {
            startdate: date.start,
            enddate: date.end,
            name: name,
            page: 1
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                startdate: date.start,
                enddate: date.end,
                name: name,
                page: 1
            }));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#customer').html(_.template(tpl)(data));

        },
        modal: modal,
        title: '投放管理'
    });

});


// 导出按钮
$('#export').click(function() {

    // 获取日期
    var date = datePicker.getVal('#datapicker');

    // 获取产品线
    var name = $('#name').val();

    location.href = '/admin/consume/export.do?line=' + (name === null ? '' : name) +
        '&startdate=' + date.start + '&enddate=' + date.end;

});
