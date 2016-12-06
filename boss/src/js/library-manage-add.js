/*!
 * 图书管理,添加图书
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
$('#submit').on('click', function(data) {
    $("#submit").attr("disabled", true);
   
    // 书名
    var bookName = $('#name').val();

    // 作者
    var author = $('#author').val();

    // 数量
    var bookNum = $('#number').val();

    // 备注
    var memo = $('#memo').val();

    // 可借时长
    var defaultDate = $('#days').val();

    // 购买链接
    var link = $('#buy-link').val();

    var img = $('#pic-link').val();

    // 藏书地
    var bookPlaceId = select2.getVal({
        id: '#collection-place'
    }); 

    localStorage.setItem('bookPlace', bookPlaceId);

    // 校验数据
    if(bookName === '' || author === '' || 
       link === '' || bookPlaceId === undefined || img === '' ) {
           modal.nobtn({
               ctx: 'body',
               title: '新增图书',
               ctn: '请确保输入全部内容'
           })
           return;
       }

    ajax.get({
        url: '/admin/book/adminAddBook.do',
        param: {
            bookName: bookName,
            author: author,
            defaultDate: defaultDate,
            memo: memo,
            link: link,
            bookNum: bookNum,
            bookPlaceId: bookPlaceId,
            img: img
        },
        cb: function(data) {
            $("#submit").attr("disabled", false);
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '添加成功',
                    title: '添加图书',
                    event: function() {
                        location.href = "/#proj_name#/library/manage?bookPlaceId="+ bookPlaceId;
                    }
                })
            } else {
                modal.nobtn({
                    ctx: 'body',
                    ctn: '添加失败',
                    title: '添加图书'
                });
            }
        }
    })
});
