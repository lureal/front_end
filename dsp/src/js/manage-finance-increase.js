/*!
 * 向客户转入资金
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var sidebar = require('./modules/sidebar.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var time = require('./modules/time.js');
var urler = require('./modules/urler.js');
var header = require('./modules/header.js');

// 初始化菜单
sidebar.manage({
    title: '向客户转入资金',
    active: 'finance'
});

 // 初始化顶部栏
 header.manage({
     title: '向客户转入资金'
 });

// 填充数据
$('#name').val(decodeURIComponent(urler.normal().name));
$('#id').val(decodeURIComponent(urler.normal().id));

// 提交数据
$('#submit').click(function() {
    var money = Number($('#money').val());

    // 数据判定
    if(money <= 0) {
        modal.nobtn({
            ctx: 'body',
            title: '向客户转入资金',
            ctn: '请输入正确的金额'
        });
        return;
    }

    // 提交数据
    ajax.get({
        url: '/manage/finance/increaseBalance.do',
        param: {
            customId: urler.normal().id,
            amount: parseInt(parseFloat(Number(money) * 100).toPrecision(12))
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '向客户转入资金',
                    ctn: '转入成功',
                    event: function() {
                        location.href = '/#proj_name#/html/manage/finance/list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '向客户转入资金',
                    ctn: '转入失败'
                });
            }
        }
    });
});
