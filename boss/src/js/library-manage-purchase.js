/*!
 * 图书管理,购买图书
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var time = require('./modules/time.js');
var upload = require('./modules/upload.js');

auth.toolbar1({
    title: '添加图书'
});

// 渲染藏书地点
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

// 预览
$('#preview').on('click', function() {
    var picUrl = $('#link').val();
    $('#book-pic').attr('src', picUrl);
});

// 提交
$('#submit').on('click', function(data) {
    $("#submit").attr("disabled", true);

    // 书名
    var bookName = $('#book-name').val();

    // 作者
    var author = $('#author').val();

    // 数量
    var number = $('#number').val();

    // 备注
    var memo = $('#remark').val();

    // 可借时长
    var time = $('#time').val();

    // 藏书地
    var bookPlaceId = select2.getVal({
        id: '#collection-place'
    });

    // 图片
    var pic = $('#book-pic .file-submit').attr('data-url');

    // 校验数据
    if(bookName === '' || author === '' || memo === '' ||
       link === '' || bookPlaceId === undefined ) {
           modal.nobtn({
               ctx: 'body',
               title: '新增心愿单',
               ctn: '请确保录入全部内容'
           })
           return;
       }

    ajax.get({
        url: '/admin/book/addBook.do',
        param: {
            bookName: bookName,
            author: author,
            name: localStorage.getItem('userName'),
            nameId: localStorage.getItem('userId'),
            number : number,
            memo: memo,
            bookPlaceId: bookPlaceId,
            pic: pic
        },
        cb: function(data) {
            $("#submit").attr("disabled", false);
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '添加成功',
                    title: '我的心愿单',
                    event: function() {
                        location.href = "/#proj_name#/library/my-wish-list";
                    }
                })
            } else {
                modal.nobtn({
                    ctx: 'body',
                    ctn: '添加失败',
                    title: '我的心愿单'
                });
            }
        }
    })
});

// 拒绝
$('#refuse').on('click', function(data) {
    var id = urler.normal().id();
    ajax.get({
        url: '',
        param: {
            id: id,
            name: localStorage.getItem('userName'),
            nameId: localStorage.getItem('userId')
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '拒绝购买成功',
                    title: '心愿单详情',
                    event: function() {
                        location.reload();
                    }
                })
            } else {
                modal.nobtn({
                    ctx: 'body',
                    ctn: '拒绝购买失败',
                    title: '心愿单详情'
                });
            }
        }
    })
});
