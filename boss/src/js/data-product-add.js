/*!
 * 添加产品
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');

// 初始化导航
auth.noToolbar({
    title: '添加产品'
});

// 添加产品
$('#submit').click(function() {
    $("#submit").attr("disabled", true);

    // 获取数据
    var name = $('#name').val();
    var memo = $('#memo').val();

    // 数据判定
    if(name === '') {
        modal.nobtn({
            ctx: 'body',
            title: '添加产品',
            ctn: '请确保输入产品名称'
        });
        return;
    }

    // 提交数据
    ajax.post({
        url: '/admin/product/add.do',
        param: {
            name: name,
            memo: memo
        },
        cb: function(data) {
            $("#submit").attr("disabled", false);
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '产品管理',
                    ctn: '添加产品成功',
                    event: function() {
                        location.href = '/#proj_name#/html/data/product-list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '产品管理',
                    ctn: data.message
                });
            }
        }
    });
});
