/*!
 * 送审
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var sidebar = require('./modules/sidebar.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var time = require('./modules/time.js');
var upload = require('./modules/upload.js');
var urler = require('./modules/urler.js');
var header = require('./modules/header.js');

// 初始化菜单
sidebar.manage({
    title: '送审',
    active: 'customer'
});

// 初始化顶部栏
header.manage({
    title: '送审'
});

// 获取平台列表
ajax.get({
    url: '/select/listPlatForms.do',
    cb: function(data) {
        var tpl = $('#checkbox-tpl').html();
        $('#list').html(_.template(tpl)(data));
    }
});

// 提交平台
$('#submit').click(function() {

    // 获取勾选的选框
    var platform = [];
    $('#list [type="checkbox"]:checked').each(function() {
        var id = Number($(this).val());
        platform.push(id);
    });

    // 数据校验
    if(platform.length < 1) {
        modal.nobtn({
            ctx: 'body',
            title: '送审',
            ctn: '请选择送审平台'
        });
        return;
    }

    // 提交数据
    ajax.get({
        url: '/manage/custom/verify.do',
        param: {
            customId: urler.normal().id,
            platformId: JSON.stringify(platform).replace(/[\[\]]/g, '')
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '送审',
                    ctn: '送审成功',
                    event: function() {
                        location.href = '/#proj_name#/html/manage/customer/list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '送审',
                    ctn: data.message
                });
            }
        }
    });

});
