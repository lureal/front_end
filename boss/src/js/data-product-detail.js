/*!
 * 产品详情
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var urler = require('./modules/urler.js');

// 初始化导航
auth.noToolbar({
    title: '产品详情'
});

// 获取产品详情
ajax.get({
    url: '/admin/product/detail.do',
    param: {
        id: urler.normal().id
    },
    cb: function(data) {
        var tpl = $('#detail-tpl').html();
        $('#detail').html(_.template(tpl)(data));
    },
    modal: modal,
    title: '产品详情'
});

// 更新产品
$('body').on('click', '#submit', function() {
    $("#submit").attr("disabled", true);

    // 获取数据
    var id = $(this).attr('data-id');
    var name = $('#name').val();
    var memo = $('#memo').val();

    // 数据合法性判定
    if(name === '') {
        modal.nobtn({
            ctx: 'body',
            title: '产品详情',
            ctn: '请输入产品名称'
        });
        return;
    }

    // 发起请求
    ajax.post({
        url: '/admin/product/update.do',
        param: {
            id: id,
            name: name,
            memo: memo
        },
        cb: function(data) {
            $("#submit").attr("disabled", false);
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '产品详情',
                    ctn: '修改产品成功',
                    event: function() {
                        location.href = '/#proj_name#/html/data/product-list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '产品详情',
                    ctn: data.message
                });
            }
        }
    })

});
