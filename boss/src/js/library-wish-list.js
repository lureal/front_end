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
    title: '心愿单'
});

// 渲染购买状态
select2.init({
    url: '/admin/book/buy_status_option.do',
    title: '购买状态',
    cb: function(data) {
        var tpl = $('#buy-state-tpl').html();
        $('#buy-state').html(_.template(tpl)(data));
        $('#buy-state').select2({
            placeholder: '购买状态'
        }).select2('val', '');
    }
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/book/wishListManage.do',
        param: {
            page: sessionStorage.getItem('wishlTargetPage') !== null ? sessionStorage.getItem('wishlTargetPage') : 1,
            name: localStorage.getItem('userName'),
            nameId: localStorage.getItem('userId')
        },
        title: '心愿单'
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
            url: '/admin/book/wishListManage.do',
            param: param,
            title: '心愿单'
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
            sessionStorage.setItem('wishlTargetPage', targetPage);
        }
    });
});

// 搜索按钮
$('body').on('click', '#search', function(data) {

    // 获取藏书地点
    var collectionPlace = select2.getVal({
        id: '#collection-place'
    });

    // 获取购买状态
    var bookStatusId = select2.getVal({
        id: '#buy-state'
    });
    console.log(bookStatusId)
    localStorage.setItem('bookPlace', collectionPlace);

    // 获取书名、作者名
    var author = $('#author').val();
    ajax.get({
        url: '/admin/book/wishListManage.do',
        param:{
            bookPlaceId: collectionPlace,
            keyword: author,
            bookStatusId: bookStatusId !== null ? bookStatusId : '',
            page: sessionStorage.getItem('wishlTargetPage') !== null ? sessionStorage.getItem('wishlTargetPage') : 1
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                bookPlaceId: collectionPlace,
                keyword: author,
                bookStatusId: bookStatusId !== null ? bookStatusId : '',
                page: 1
            }));

            // 渲染模板
            var tpl = $('#wish-list-tpl').html();
            $('#wish-list').html(_.template(tpl)(data));
        }
    });
});

$('#export').click(function() {

    // 藏书Id
    var bookPlaceId = select2.getVal({
        id: '#collection-place'
    });

    // 图书状态Id
    var bookStatusId = select2.getVal({
        id: '#buy-state'
    });
    var keyword = $('#author').val();

    location.href = '/admin/book/export_wish_list.do?bookPlaceId=' + (bookPlaceId === null ? '' : bookPlaceId) +
        '&bookStatusId=' + bookStatusId + '&keyword=' + keyword;
});