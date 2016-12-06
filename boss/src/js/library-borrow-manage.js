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

auth.toolbar1({
    title: '借书管理'
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/book/borrowManage.do',
        param: {
            page: sessionStorage.getItem('bmTargetPage') !== null ? sessionStorage.getItem('bmTargetPage') : 1
        },
        title: '借书管理'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        // 渲染模板
        var tpl = $('#borrow-manage-list-tpl').html();
        $('#borrow-manage-list').html(_.template(tpl)(data));

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
            url: '/admin/book/borrowManage.do',
            param: param,
            title: '借书管理'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#borrow-manage-list-tpl').html();
            $('#borrow-manage-list').html(_.template(tpl)(data));

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var targetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('bmTargetPage', targetPage);

        }
    });
});

// 搜索按钮
$('body').on('click', '#search', function(data) {

    // 获取藏书地点
    var collectionPlace = select2.getVal({
        id: '#collection-place'
    });

    localStorage.setItem('bookPlace', collectionPlace);

    // 获取书名、作者名
    var author = $('#author').val();
    ajax.get({
        url: '/admin/book/borrowManage.do',
        param:{
            bookPlaceId: collectionPlace,
            keyword: author,
            page: sessionStorage.getItem('bmTargetPage') !== null ? sessionStorage.getItem('bmTargetPage') : 1
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                bookPlaceId: collectionPlace,
                keyword: author,
                page: 1
            }));

            // 渲染模板
            var tpl = $('#borrow-manage-list-tpl').html();
            $('#borrow-manage-list').html(_.template(tpl)(data));
        }
    });
});

// 借阅
$('body').on('click', '#borrow', function(data) {

    // 获取藏书地点
    var collectionPlace = select2.getVal({
        id: '#collection-place'
    });
    var id = $(this).attr('data-id');
    var borrowId = $(this).attr('data-borrowId');
    ajax.get({
        param:{
            bookPlaceId: collectionPlace,
            name: localStorage.getItem('userName'),
            nameId: localStorage.getItem('userId'),
            id: id,
            borrowId: borrowId
        },
        url: '/admin/book/borrowOut.do',
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '借书成功',
                    title: '借书',
                    event: function() {
                        location.reload();
                    }
                })
            } else {
                modal.nobtn({
                    ctx: 'body',
                    ctn: '借书失败',
                    title: '借书'
                });
            }
        }
    });
});