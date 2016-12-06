/*!
 * 新增心愿单
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
    title: '新增心愿单'
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
    var picUrl = $('#pic-link').val();
    if(picUrl === '') {
        modal.nobtn({
            ctx: 'body',
            title: '新增心愿单',
            ctn: '请先输入图书链接'
        })
           return;
    }
    $('#book-pic').attr('src', picUrl);
});

// 提交
$('#commit').on('click', function(data) {
    $("#commit").attr("disabled", true);

    // 书名
    var bookName = $('#book-name').val();

    // 作者
    var author = $('#author').val();

    // 备注
    var memo = $('#remark').val();

    // 购买链接
    var link = $('#buy-link').val();

    // 图片链接
    var picLink = $('#pic-link').val();

    // 藏书地
    var bookPlaceId = select2.getVal({
        id: '#collection-place'
    });

    // 校验数据
    if(bookName === '' || author === ''  ||
       link === '' || bookPlaceId === null || picLink === '') {
           modal.nobtn({
               ctx: 'body',
               title: '新增心愿单',
               ctn: '请确保输入全部内容'
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
            memo: memo,
            link: link,
            bookPlaceId: bookPlaceId,
            img: picLink
        },
        cb: function(data) {
            $("#commit").attr("disabled", false);
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


