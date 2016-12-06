/*!
 * 产品维度统计图表
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
    title: '产品维度统计图表'
});

// 获取参数
var type = urler.normal().type;
var datestart = urler.normal().datestart;
var dateend = urler.normal().dateend;
var line = urler.normal().line;
var custtype = urler.normal().custtype;

// 获取客户类型
ajax.get({
    url: '/admin/report/cust_filter_type.do',
    cb: function(data) {

        // 客户类型名称
        var custName = data.data[custtype];

        // 渲染图表
        switch(Number(type)) {

            // 行业图表
            case 0:

                // 设置标题
                $('#chart-name').text('行业图表统计');

                // 渲染图表
                render({
                    name: custName,
                    url: '/admin/report/industry_static.do',
                    param: {
                        line: line,
                        startdate: datestart,
                        enddate: dateend,
                        type: custtype
                    },
                    el: '#chart',
                    tooltip: '{series.name}: <b>{point.percentage:.1f}%</b><br>' + custName + ': {point.y}'
                });
                break;

            // 区域图表
            case 1:

                // 设置标题
                $('#chart-name').text('区域图表统计');

                // 渲染图表
                render({
                    name: custName,
                    url: '/admin/report/area_static.do',
                    param: {
                        line: line,
                        startdate: datestart,
                        enddate: dateend,
                        type: custtype
                    },
                    el: '#chart',
                    tooltip: '{series.name}: <b>{point.percentage:.1f}%</b><br>' + custName + ': {point.y}'
                });
                break;

            // 团队图表
            case 2: 

                // 设置标题
               $('#chart-name').text('团队图表统计');

               // 渲染图表
                render({
                    name: custName,
                    url: '/admin/report/team_static.do',
                    param: {
                        line: line,
                        startdate: datestart,
                        enddate: dateend,
                        type: custtype
                    },
                    el: '#chart',
                    tooltip: '{series.name}: <b>{point.percentage:.1f}%</b><br>' + custName + ': {point.y}'
                });
                break;

            // 渠道图表统计
            default:

                // 设置标题
                $('#chart-name').text('渠道图表统计');

                // 渲染图表
                render({
                    name: custName,
                    url: '/admin/report/channel_chart_static.do',
                    param: {
                        line: line,
                        startdate: datestart,
                        enddate: dateend,
                        type: custtype
                    },
                    el: '#chart',
                    tooltip: '{series.name}: <b>{point.percentage:.1f}%</b><br>' + custName + ': {point.y}'
                });

        }

    }
});

/**
 * 发起请求获取图表数据，渲染图表
 * @param {Object} param [传递给请求的参数]
 *
 * param 包含属性：
 * {
 *   name: 图表名称
 *   url: 请求链接
 *   param: 请求参数
 *   el: 等待渲染的元素对象
 *   tooltip: 鼠标浮动到表格上的提示
 * }
 */
function render(param) {
    ajax.get({
        url: param.url,
        param: param.param,
        cb: function(data) {
            var tableData = translateDataToTable(data.data, 10);

            // 渲染表格
            var tpl = $('#list-tpl').html();
            var _tableData = {
                name: param.name,
                data: tableData[0]
            };
            _tableData.data.ajaxParam = encodeURIComponent(JSON.stringify({
                page: 1
            }));
            $('#static').html(_.template(tpl)(_tableData));

            // 分页
            pager(function(_param) {
                var tpl = $('#list-tpl').html();
                var _tableData = {
                    name: param.name,
                    data: tableData[_param.page - 1]
                };
                _tableData.data.ajaxParam = encodeURIComponent(JSON.stringify(_param));
                $('#static').html(_.template(tpl)(_tableData));
            });

            // 渲染图表
            $(param.el).highcharts({
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text:''
                },
                tooltip: {
                    pointFormat: param.tooltip
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
        },
        modal: modal,
        title: '产品维度统计图表'
    });
}

/**
 * 将图表数据转换成带分页的数据，以每页十条数据来划分
 * @param {Object} data [表格数据]
 * @param {Number} paging [以多少数据为一组进行分页]
 */
function translateDataToTable(data, paging) {
    var dist = [];
    var cacheIndex = 0;

    // 计算总页数
    var cachePageCount = parseInt(data.statList.length / paging);
    var pageCount = cachePageCount;
    if(data.statList.length - cachePageCount * paging > 0) {
        pageCount = cachePageCount + 1;
    }

    // 填充数据
    for(var i = 0; i < cachePageCount; i++) {
        var _obj = {
            page: (i + 1),
            pageCount: pageCount,
            records: []
        };

        for(var j = 0; j < paging; j++) {
            _obj.records.push(data.statList[cacheIndex]);
            cacheIndex++;
        }

        dist.push(_obj);
    }

    if(pageCount > cachePageCount) {
        var _obj = {
            page: pageCount,
            pageCount: pageCount,
            records: []
        };

        for(var i = cacheIndex; i < data.statList.length; i++) {
            _obj.records.push(data.statList[i]);
        }

        dist.push(_obj);
    }

    return dist;
}
