/*!
 * 报警管理
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
    title: '报警管理',
    active: 'warn'
});

// 初始化顶部栏
header.boss({
    title: '报警管理'
});

//定义微博WAX的id的值
var weiboId;

//发送请求，获取平台数据
ajax.get({
    url: '/select/listPlatForms.do',
    cb: function(data) {
        $.each(data.data, function(key,val){
            if(key === '1') {
                weiboId = key;
                return weiboId;
            }
        });

        //发送微博平台数据请求，渲染页面数据
        ajax.get({
            url: '/admin/alarm/get.do',
            param: {
                platformId: parseInt(weiboId)
            },
            cb: function(data) {

                //渲染页面数据
                $('#bidCostTime').val(data.data.bidCostTime);
                $('#winBidCostTime').val(data.data.winBidCostTime);
                $('#stopBidTime').val(data.data.stopBidTime);
                if(data.data.alarm === true) {
                    $('input[name="alarm"]:eq(0)').attr('checked', true);
                } else {
                    $('input[name="alarm"]:eq(1)').attr('checked', true);
                }
            }
        });
    },
});

//提交更改微博平台报警配置请求，渲染页面数据
$('#commit').on('click', function() {
    var bidCostTime = $('#bidCostTime').val();
    var winBidCostTime = $('#winBidCostTime').val();
    var stopBidTime = $('#stopBidTime').val();
    var alarm = $('#alarm input[name = "alarm"]:checked').val();

    //校验数据
    if(bidCostTime <= 0 || winBidCostTime <= 0 || stopBidTime <= 0) {
        modal.nobtn({
            ctx: 'body',
            ctn: '请填写竞价耗时报警阈值，竞赢耗时报警阈值，停止竞价请求时间参数大于0的值',
            title: '报警管理'
        });
        return;
    }
    ajax.get({
        url: '/admin/alarm/submit.do',
        param: {
            platformId: 1,
            bidCostTime: bidCostTime,
            winBidCostTime: winBidCostTime,
            stopBidTime: stopBidTime,
            alarm: alarm
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '更改报警管理成功',
                    title: '报警管理',
                    event: function(){
                        location.reload();
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    ctn: '更改报警管理失败',
                    title: '报警管理'
                });
            }
        }
    });
});

// //发送腾讯ADX平台数据请求，渲染页面数据,暂时没有这个平台数据，先注释
// ajax.get({
//     url: '/admin/alarm/get.do',
//     param: {
//         platformId: parseInt('2')
//     },
//     cb: function(data) {
//         if(data.data !== null) {

//             //渲染页面数据
//             $('#txbidCostTime').val(data.data.bidCostTime);
//             $('#txwinBidCostTime').val(data.data.winBidCostTime);
//             $('#txstopBidTime').val(data.data.stopBidTime);
//             if(data.data.alarm === true) {
//                 $('#txalarm').attr('checked', true);
//             }
//         }
//     }
// });

// //提交更改腾讯ADX平台报警管理请求，渲染页面数据
// $('#tx-commit').on('click', function() {
//     var bidCostTime = $('#txbidCostTime').val();
//     var winBidCostTime = $('#txwinBidCostTime').val();
//     var stopBidTime = $('#txstopBidTime').val();
//     var alarm = $('#txalarm').is(':checked');

//     //校验数据
//     if(bidCostTime <= 0 || winBidCostTime <= 0 || stopBidTime <= 0) {
//         modal.nobtn({
//             ctx: 'body',
//             ctn: '请填写竞价耗时报警阈值，竞赢耗时报警阈值，停止竞价请求时间参数大于0的值',
//             title: '报警管理'
//         });
//         return;
//     }
//     ajax.get({
//         url: '/admin/alarm/submit.do',
//         param: {
//             platformId: parseInt('2'),
//             bidCostTime: txbidCostTime,
//             winBidCostTime: txwinBidCostTime,
//             stopBidTime: txstopBidTime,
//             alarm: txalarm
//         },
//         cb: function(data) {
//             if(data.data === true) {
//                 modal.onebtn({
//                     ctx: 'body',
//                     ctn: '更改报警管理成功',
//                     title: '报警管理',
//                     event: function(){
//                         location.reload();
//                     }
//                 });
//             } else {
//                 modal.onebtn({
//                     ctx: 'body',
//                     ctn: '更改报警管理失败',
//                     title: '报警管理',
//                     event: function() {
//                         location.reload();
//                     }
//                 });
//             }
//         }
//     });
// });
