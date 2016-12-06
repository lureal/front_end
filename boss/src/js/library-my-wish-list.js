/*!
 * 图书借书
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
    title: '我的心愿单'
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/book/wishList.do',
        param: {
            page: sessionStorage.getItem('wishLisTargetPage') !== null ? sessionStorage.getItem('wishLisTargetPage') : 1,
            name: localStorage.getItem('userName'),
            nameId: localStorage.getItem('userId')
        },
        title: '我的心愿单'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        // 渲染模板
        var tpl = $('#wish-list-tpl').html();
        $('#wish-list').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/book/wishList.do',
            param: param,
            title: '我的心愿单'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#wish-list-tpl').html();
            $('#wish-list').html(_.template(tpl)(data));

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var targetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('wishLisTargetPage', targetPage);
        }
    });
});