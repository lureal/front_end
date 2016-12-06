/*!
 * 借书管理
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var time = require('./modules/time.js');
var cache = require('./modules/cache.js');

auth.toolbar1({
    title: '借书记录'
});

select2.init({
    url: '/admin/book/borrow_status_option.do',
    title: '借阅状态',
    cb: function(data) {
        var tpl = $('#borrow-place-tpl').html();
        $('#borrow-place').html(_.template(tpl)(data));
        $('#borrow-place').select2({
            placeholder: '借阅状态'
        }).select2('val', '');
    }
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/book/borrowRecordManage.do',
        param: {
            page: sessionStorage.getItem('borrowRecTargetPage') !== null ? sessionStorage.getItem('borrowRecTargetPage') : 1
        },
        title: '借书记录'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        // 渲染模板
        var tpl = $('#record-list-tpl').html();
        $('#record-list').html(_.template(tpl)(data));

        // 地点查询
        $('body').on('change', '#collection-place', function() {
            $('#search').click();
        });

        // 渲染藏书地点
        if(localStorage.getItem('bookPlace') !== null) {
            select2.init({
                url: '/admin/book/book_place_option.do',
                title: '藏书地点',
                cb: function(data) {
                    var tpl = $('#collection-place-tpl').html();
                    $('#collection-place').html(_.template(tpl)(data));
                    $('#collection-place').select2({
                        placeholder: '藏书地点'
                    }).select2('val', localStorage.getItem('bookPlace'));
                }
            });
        } else {
            select2.init({
                url: '/admin/book/book_place_option.do',
                title: '藏书地点',
                cb: function(data) {
                    var tpl = $('#collection-place-tpl').html();
                    $('#collection-place').html(_.template(tpl)(data));
                    $('#collection-place').select2({
                        placeholder: '藏书地点'
                    }).select2('val', '');
                }
            });
        }
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/book/borrowRecordManage.do',
            param: param,
            title: '借书记录'
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
            sessionStorage.setItem('borrowRecTargetPage', targetPage);
        }
    });
});

// 搜索
$('#search').on('click', function(data) {

    // 藏书Id
    var bookPlaceId = select2.getVal({
        id: '#collection-place'
    });

    localStorage.setItem('bookPlace', bookPlaceId);

    // 图书状态Id
    var bookStatusId = select2.getVal({
        id: '#borrow-place'
    });

    var keyword = $('#author').val();
    ajax.get({
        url: '/admin/book/borrowRecordManage.do',
        param: {
            bookPlaceId: bookPlaceId,
            bookStatusId: bookStatusId,
            page: sessionStorage.getItem('borrowRecTargetPage') !== null ? sessionStorage.getItem('borrowRecTargetPage') : 1,
            keyword: keyword
        },
        cb: function(data) {

            // 渲染模板
            var tpl = $('#record-list-tpl').html();
            $('#record-list').html(_.template(tpl)(data));
        }
    })

});

// 导出按钮
$('#export').click(function() {

    // 藏书Id
    var bookPlaceId = select2.getVal({
        id: '#collection-place'
    });

    // 图书状态Id
    var bookStatusId = select2.getVal({
        id: '#borrow-place'
    });
    var keyword = $('#author').val();

    location.href = '/admin/book/export_borrow_record.do?bookPlaceId=' + bookPlaceId +
        '&bookStatusId=' + (bookStatusId === null ? '': bookStatusId ) + '&keyword=' + keyword;
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

// 归还
$('body').on('click', '#revoke', function() {
    var borrowId = $(this).attr('data-borrowId');
    var id = $(this).attr('data-id');
    ajax.get({
        url: '/admin/book/returnBook.do',
        param: {
            id: id,
            borrowId: borrowId
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '归还成功',
                    title: '我的借书记录',
                    event: function() {
                        location.reload();
                    }
                })
            } else {
                modal.nobtn({
                    ctx: 'body',
                    ctn: '归还失败',
                    title: '我的借书记录'
                });
            }
        }
    })

});