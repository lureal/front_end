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
var urler = require('./modules/urler.js');

auth.toolbar1({
    title: '我的心愿单'
});

ajax.get({
    url: '/admin/book/wishListDetail.do',
    param: {
       id: urler.normal().id,
       page: 1
    },
    cb: function(data) {

        // 藏书地
        select2.init({
            url: '/admin/book/book_place_option.do',
            title: '藏书地点',
            cb: function(_data) {
                var tpl = $('#collection-place-tpl').html();
                $('#collection-place').html(_.template(tpl)(_data));
                $('#collection-place').select2({
                    placeholder: '藏书地点'
                }).select2('val', data.data.books.bookPlace);
            }
        });

        // 渲染申请人,请求里没有,看是否把字段去掉
        $('#applicant').val(data.data.books.name);

        // 渲染申请时间
        $('#time').val(data.data.books.addDate);

        // 渲染书名
        $('#name').val(data.data.books.bookName);

        // 渲染作者
        $('#author').val(data.data.books.author);

        // 渲染购买链接
        $('#link').val(data.data.books.link);

        // 渲染备注
        $('#memo').val(data.data.books.memo);

        // 渲染图书
        $('#book-pic').attr('src', data.data.books.img);

    }
})

// 购买
$('#purchase').on('click', function(data) {
    $("#purchase").attr("disabled", true);
    var name = $('#applicant').val();
    var author = $('#author').val();
    var bookName = $('#name').val();
    var addDate = $('#time').val();
    var link = $('#link').val();
    var defaultDate = $('#defaultDate').val();
    var bookNum = $('#bookNum').val();
    var memo = $('#applicant').val();
    var img = $('#applicant').val();
    var bookPlaceId = select2.getVal({
        id: '#collection-place'
    });

    if(bookNum === '' || defaultDate === '' || bookPlaceId === '') {
        modal.nobtn({
            ctx: 'body',
            ctn: '请填写数量、默认时长、图书地点',
            title: '购买图书'
        });
        return ;
    }
    ajax.get({
        url: '/admin/book/buyBook.do',
        param: {
            id: urler.normal().id,
            bookName: bookName,
            name: name,
            addDate: addDate,
            author: author,
            link: link,
            memo: memo,
            bookNum: bookNum,
            defaultDate: defaultDate,
            img: img,
            bookPlaceId: bookPlaceId
        },
        cb: function(data) {
            $("#purchase").attr("disabled", false);
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '购买成功',
                    title: '购买图书',
                    event: function() {
                       location.href = "/#proj_name#/library/manage";
                    }
                })
            } else {
                modal.nobtn({
                    ctx: 'body',
                    ctn: '购买失败',
                    title: '购买图书'
                });
            }
        }
    })
});

// 拒绝
$('#refuse').on('click', function(data) {
    ajax.get({
        url: '/admin/book/refuseBuy.do',
        param :{
            id: urler.normal().id
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '拒绝成功',
                    title: '购买图书',
                    event: function() {
                       location.href = "/#proj_name#/library/wish-list";
                    }
                })
            } else {
                modal.nobtn({
                    ctx: 'body',
                    ctn: '拒绝失败',
                    title: '购买图书'
                });
            }
        }
    })
})
