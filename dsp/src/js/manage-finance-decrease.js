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
     title: '由客户转出资金',
     active: 'finance'
 });

 // 初始化顶部栏
 header.manage({
     title: '由客户转出资金'
 });

 // 填充数据
 $('#name').val(decodeURIComponent(urler.normal().name));
 $('#id').val(decodeURIComponent(urler.normal().id));

// 选择全部金额
$('#getAllMoney').click(function() {

    var $i = $('i', $(this));

    // 显示 loading
    $i.css('display', 'inline-block');

    // 请求数据
    ajax.get({
        url: '/manage/finance/getSelfBalance.do',
        cb: function(data) {
            $i.css('display', 'none');
            $('#money').val(data.data.balance / 100);
        }
    });
});

// 转出金额
$('#submit').click(function() {

    // 获取数据
    var id = urler.normal().id;
    var money = Number($('#money').val());

    // 数据判定
    if(money <= 0 || money > 1000000) {
        modal.nobtn({
            ctx: 'body',
            title: '由客户转出资金',
            ctn: '请输入正确的金额，金额必须在 0 ~ 100 万之间'
        });
        return;
    }

    // 提交数据
    ajax.get({
        url: '/manage/finance/decreaseBalance.do',
        param: {
            customId: id,
            amount: parseInt(parseFloat(Number(money) * 100).toPrecision(12))
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '由客户转出资金',
                    ctn: '转出成功',
                    event: function() {
                        location.href = '/#proj_name#/html/manage/finance/list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '由客户转出资金',
                    ctn: '转出失败'
                });
            }
        }
    });
});
