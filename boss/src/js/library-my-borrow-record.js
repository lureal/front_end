/*!
 * 图书借书记录
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
    title: '我的借书记录'
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/book/borrowRecords.do',
        param: {
            page: sessionStorage.getItem('myrTargetPage') !== null ? sessionStorage.getItem('myrTargetPage') : 1
        },
        title: '我的借书记录'
    },
    $btn: null,
    callback: function(data) {
        console.log(data)
        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        // 渲染模板
        var tpl = $('#record-list-tpl').html();
        $('#record-list').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/book/borrowRecords.do',
            param: param,
            title: '我的借书记录'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#record-list-tpl').html();
            $('#record-list').html(_.template(tpl)(data));

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var targetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('myrTargetPage', targetPage);
        }
    });
});

// 续借
$('body').on('click', '#renew', function() {
    var borrowId = $(this).attr('data-borrowId');
    ajax.get({
        url: '/admin/book/renew.do',
        param: {
            borrowId: borrowId
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '续借成功',
                    title: '我的借书记录',
                    event: function() {
                        location.reload();
                    }
                })
            } else {
                modal.nobtn({
                    ctx: 'body',
                    ctn: '续借成功',
                    title: '我的借书记录'
                });
            }
        }
    })

});

// 撤回
$('body').on('click', '#revoke', function() {
    var borrowId = $(this).attr('data-borrowId');
    var id = $(this).attr('data-id');
    ajax.get({
        url: '/admin/book/revoke.do',
        param: {
            id: id,
            borrowId: borrowId
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '撤回成功',
                    title: '我的借书记录',
                    event: function() {
                        location.reload();
                    }
                })
            } else {
                modal.nobtn({
                    ctx: 'body',
                    ctn: '撤回成功',
                    title: '我的借书记录'
                });
            }
        }
    })

});
