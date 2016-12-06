/*!
 * 贡献客户
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
    title: '渠道商明细(总表)'
});

// 获取参数
var channelBusinessId = urler.normal().channelBusinessId;

// 初始化搜索条中的日期控件
datePicker.init('#datepaker');

// 发送请求，获取饼状图相关数据
ajax.get({
    url: '/admin/report/contribute_customer_static.do',
    param: {
        channelBusinessId: urler.normal().channelBusinessId
    },
    cb: function(data) {

        // 渲染产品图表
        $('#product-chart').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text:''
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name: '占比',
                colorByPoint: true,
                data: data.data.statList
            }]
        });

        $('.customer-contributer').html(decodeURI(urler.normal().channelBusiness) + '  ' + decodeURI(urler.normal().channelManager));

        // 渲染行业图表
        $('#industry-chart').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text:''
            },
            // tooltip: {
            //     pointFormat: param.tooltip
            // },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name: '占比',
                colorByPoint: true,
                data: data.data.productList
            }]
        });
    }
});

// 加载table列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/report/contributeCustomer.do',
        param: {
            page: 1,
            channelBusinessId: urler.normal().channelBusinessId
        },
        title: '贡献客户'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1,
            channelBusinessId: urler.normal().channelBusinessId
        }));

        // 渲染模板
        var tpl = $('#table-list-tpl').html();
        $('#table-list').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/report/contributeCustomer.do',
            param: param,
            title: '贡献客户'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#table-list-tpl').html();
            $('#table-list').html(_.template(tpl)(data));
        }
    });
});

// 搜索按钮
$('#search').click(function() {

    // 获取日期
    var date = datePicker.getVal('#datepaker');

    // 获取产品线
    var name = $('#channel-name').val();

    // 执行搜索
    ajax.get({
        url: '/admin/report/contributeCustomer.do',
        param: {
            startdate: date.start,
            channelBusinessId: urler.normal().channelBusinessId,  // 暂时，方便测试
            enddate: date.end,
            name: name,
            page: 1
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                startdate: date.start,
                enddate: date.end,
                channelBusinessId: urler.normal().channelBusinessId,  // 暂时，方便测试
                name: name,
                page: 1
            }));

            // 渲染模板
            var tpl = $('#table-list-tpl').html();
            $('#table-list').html(_.template(tpl)(data));
        },
        modal: modal,
        title: '贡献客户'
    });
});

// 导出按钮
$('#export').click(function() {
    var name = $('#channel-name').val();
    var date = datePicker.getVal('#datepaker');
    location.href = '/admin/report/export_contribute_customer.do?id=' + (urler.normal().channelBusinessId )+'&startdate=' +
     date.start +
    '&enddate=' + date.end +
    '&name=' + name;
});


