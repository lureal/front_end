/*!
 * 公司账户充值
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var sidebar = require('./modules/sidebar.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var time = require('./modules/time.js');
var header = require('./modules/header.js');

// 初始化菜单
sidebar.manage({
    title: '公司账户充值',
    active: 'finance'
});

 // 初始化顶部栏
 header.manage({
     title: '公司账户充值'
 });

// 确定充值
$('#submit').click(function() {

    // 获取充值金额
    var money = Number($('#money').val());

    // 数据校验
    if(money <= 0) {
        modal.nobtn({
            ctx: 'body',
            title: '公司账户充值',
            ctn: '请输入正确的充值金额'
        });
        return;
    }

    // 提交数据
    ajax.get({
        url: '/manage/finance/increaseSelfBalance.do',
        param: {
            amount: parseInt(parseFloat(money * 100).toPrecision(12))
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '公司账户充值',
                    ctn: '充值成功',
                    event: function() {
                        location.href = '/#proj_name#/html/manage/finance/list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '公司账户充值',
                    ctn: data.message
                });
            }
        },
        modal: modal,
        title: '公司账户充值'
    });
});
