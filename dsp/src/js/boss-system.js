/*!
 * 系统配置
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
var header = require('./modules/header.js');

// 初始化菜单
sidebar.boss({
    title: '系统配置',
    active: 'system'
});

// 初始化顶部栏
header.boss({
    title: '系统配置'
});

//发送请求，获取系统配置参数
ajax.get({
    url: '/admin/systemConfig/get.do',
    cb: function(data) {
        
        //获取数据，渲染页面
        $('#service-charge').val(data.data.serviceCharge);
    }
});

//提交更改系统配置参数
$('#commit').on('click', function() {
    var serviceCharge = $('#service-charge').val();

    //数据校验
    if(serviceCharge < 0 || serviceCharge === '') {
        modal.nobtn({
            ctx: 'body',
            ctn: '请选择服务费不能小于0的参数',
            title: '系统配置'
        });
    }
    ajax.get({
        url: '/admin/systemConfig/submit.do',
        param: {
            serviceCharge: parseInt(serviceCharge)
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '更改系统配置成功',
                    title: '系统配置',
                    event: function(){
                        location.reload();
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    ctn: '更改系统配置失败',
                    title: '系统配置'
                });
            }
        }
    })
});