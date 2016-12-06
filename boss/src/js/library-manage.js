/*!
 * 图书管理
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
var urler = require('./modules/urler.js');

auth.toolbar1({
    title: '图书管理'
});

console.log(sessionStorage.getItem('lmTargetPage'));

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/book/bookManage.do',
        param: {
            page: sessionStorage.getItem('lmTargetPage') !== null ? sessionStorage.getItem('lmTargetPage') : 1
        },
        title: '图书管理'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        // 渲染模板
        var tpl = $('#manage-list-tpl').html();
        $('#manage-list').html(_.template(tpl)(data));

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
            url: '/admin/book/bookManage.do',
            param: param,
            title: '图书管理'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#manage-list-tpl').html();
            $('#manage-list').html(_.template(tpl)(data));

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var targetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('lmTargetPage', targetPage);
        }
    });
});

// 搜索按钮
$('body').on('click', '#search', function(data) {

    // 获取藏书地点
    var bookPlaceId = select2.getVal({
        id: '#collection-place'
    });

    // 获取书名、作者名
    var author = $('#author').val();

    localStorage.setItem('bookPlace', bookPlaceId);
    ajax.get({
        param:{
            bookPlaceId: bookPlaceId,
            keyword: author,
            page: sessionStorage.getItem('lmTargetPage') !== null ? sessionStorage.getItem('lmTargetPage') : 1
        },
        url: '/admin/book/bookManage.do',
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                bookPlaceId: bookPlaceId,
                keyword: author,
                page: 1
            }));

            // 渲染模板
            var tpl = $('#manage-list-tpl').html();
            $('#manage-list').html(_.template(tpl)(data));
        }
    });
});

// 删除操作
$('body').on('click', '.delete', function(data) {
    var id = $(this).attr('data-id');
    var borrowId = $(this).attr('data-borrowId');
    modal.twobtn({
        ctx: 'body',
        ctn: '确定删除图书？',
        title: '图书管理',
        btnOneText: '取消',
        btnOneClass: 'btn-default',
        eventOne: function() {
            $('#modal-twobtn').modal('hide');
        },
        eventTwo: function() {
            $('#modal-twobtn').modal('hide');
            ajax.get({
                url: '/admin/book/delBook.do',
                param: {
                    id: id,
                    borrowId: borrowId,
                    name: localStorage.getItem('userName'),
                    nameId: localStorage.getItem('userId')
                },
                cb: function(data) {
                    if(data.data === true) {
                        modal.onebtn({
                            ctx: 'body',
                            ctn: '删除成功',
                            title: '图书管理',
                            event: function() {
                                location.reload();
                            }
                        })
                    } else {
                        modal.nobtn({
                            ctx: 'body',
                            ctn: '删除成功',
                            title: '图书管理'
                        });
                    }
                }
            });
        }
    });
});
