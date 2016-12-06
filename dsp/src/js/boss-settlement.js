/*!
 * 结算管理
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
    title: '结算管理',
    active: 'money'
});

// 初始化顶部栏
header.boss({
    title: '结算管理'
});

//初始化日期控件
datePicker.init('#search-datepicker');

lister({
    ajax: ajax,
     ajaxParam: {
        url: '/admin/settleAccount/get.do',
        param: {
            platformId: 1,
            page: 1,
            export: false
        },
        title: '结算管理'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            platformId: 1,
            page: 1,
            export: false
        }));
        var tableTpl = $('#settlement-table-tpl').html();
        $('#settlement-table').html(_.template(tableTpl)(data));

        //渲染data数据
        var dataTpl = $('#settlement-data-tpl').html();
        $('#settlement-data').html(_.template(dataTpl)(data));
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/settleAccount/get.do',
            param: param,
            title: '结算管理'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            //渲染页面数据
            var tableTpl = $('#settlement-table-tpl').html();
            $('#settlement-table').html(_.template(tableTpl)(data));

            //渲染data数据
            var dataTpl = $('#settlement-data-tpl').html();
            $('#settlement-data').html(_.template(dataTpl)(data));
        }
    });
});

//查询
$('#search').on('click', function() {

    //获取日期
    var date = datePicker.getVal('#search-datepicker');
    ajax.get({
        url: '/admin/settleAccount/get.do',
        param: {
            platformId: 1,
            startDate: date.start,
            endDate: date.end,
            page: 1,
            export: false
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                platformId: 1,
                startDate: date.start,
                endDate: date.end,
                page: 1,
                export: false
            }));

            //渲染页面数据
            var tableTpl = $('#settlement-table-tpl').html();
            $('#settlement-table').html(_.template(tableTpl)(data));
            var dataTpl = $('#settlement-data-tpl').html();
            $('#settlement-data').html(_.template(dataTpl)(data));
        },
        modal: modal,
        title: '结算管理'
    });
});

//导出
$('#export').on('click', function() {

    //获取日期
    var date = datePicker.getVal('#search-datepicker');

    //平台id
    var platformId = localStorage.getItem('weiboId');

    // 浏览器打开页面的方式下载附件
    location.href = '/admin/settleAccount/get.do?startDate=' + date.start +
        '&endDate=' + date.end +
        '&export=' + true + '&platformId=' + 1;
});
