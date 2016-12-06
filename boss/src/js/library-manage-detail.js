/*!
 * 图书管理，书籍详情
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var time = require('./modules/time.js');
var urler = require('./modules/urler.js');

auth.toolbar1({
    title: '书籍详情'
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/book/bookDetail.do',
        param: {
            page: 1,
            id: urler.normal().id
        },
        title: '书籍详情'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        // 渲染藏书地点选择
        select2.init({
            url: '/admin/book/book_place_option.do',
            title: '藏书地点',
            cb: function(_data) {
                var tpl = $('#collection-place-tpl').html();
                $('#collection-place').html(_.template(tpl)(_data));
                $('#collection-place').select2({
                    placeholder: '选择藏书地点'
                }).select2('val', data.data.bookPlace);
            }
        });

        // 渲染模板
        var tpl = $('#detail-table-tpl').html();
        $('#detail-table').html(_.template(tpl)(data));
        $('#name').val(data.data.bookName);
        $('#author').val(data.data.author);
        $('#number').val(data.data.bookNum);
        $('#memo').val(data.data.memo);
        $('#book-pic').attr('src', data.data.img);
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/book/bookDetail.do',
            param: param,
            title: '书籍详情'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#record-list-tpl').html();
            $('#record-list').html(_.template(tpl)(data));
        }
    });
});



