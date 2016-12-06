/*!
 * 罗列全部产品维度统计
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');

// 初始化导航条和权限
auth.toolbar2({
    title: '产品维度统计'
});

// 初始化选择客户
select2.init({
    url: '/admin/report/cust_filter_type.do',
    title: '产品维度统计',
    cb: function(data) {
        var tpl = $('#type-tpl').html();
        $('#customer-type').html(_.template(tpl)(data));
        $('#customer-type').select2({
            placeholder: '选择客户'
        });

        var customerType = select2.getVal({
            id: '#customer-type'
        });

        // 加载列表
        lister({
            ajax: ajax,
            ajaxParam: {
                url: '/admin/report/list_all_prod.do',
                param: {
                    type: customerType === 'clear' ? '' : customerType,
                    page: sessionStorage.getItem('staticTargetPage') !== null ? sessionStorage.getItem('staticTargetPage') : 1
                },
                title: '产品维度统计'
            },
            $btn: null,
            callback: function(data) {

                // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
                data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                    type: customerType,
                    page: 1
                }));

                // 渲染模板
                var tpl = $('#list-tpl').html();
                $('#static').html(_.template(tpl)(data));
            }
        });

        // 分页
        pager(function(param, $this) {
            lister({
                ajax: ajax,
                ajaxParam: {
                    url: '/admin/report/list_all_prod.do',
                    param: param,
                    title: '产品维度统计'
                },
                $btn: $this,
                callback: function(data) {

                    // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
                    data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

                    // 渲染模板
                    var tpl = $('#list-tpl').html();
                    $('#static').html(_.template(tpl)(data));

                    // 需求：翻页刷新，不回到第一页
                    // 用户翻页时，将这个页码存到sessionStorage里
                    var targetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
                    sessionStorage.setItem('staticTargetPage', targetPage);
                }
            });
        });
    }
});

// 初始化搜索条中选择产品线
select2.init({
    url: '/admin/report/prod_line_option.do',
    title: '产品维度统计',
    cb: function(data) {
        var tpl = $('#type-tpl').html();
        $('#product-line').html(_.template(tpl)(data));
        $('#product-line').select2({
            placeholder: '选择业务线'
        }).select2('val', '');
    }
});

// 初始化销售来源
select2.init({
    url: '/admin/customer/channel_option.do',
    title: '销售来源',
    cb: function(data) {
        var tpl = $('#type-tpl').html();
        $('#consumption').html(_.template(tpl)(data));
        $('#consumption').select2({
            placeholder: '销售来源'
        }).select2('val', '');
    }
});

// 初始化排序字段
select2.init({
    url: '/admin/report/sort_column_option.do',
    title: '排序字段',
    cb: function(data) {
        var tpl = $('#col-sort-tpl').html();
        $('#col-sort').html(_.template(tpl)(data));
        $('#col-sort').select2({
            placeholder: '排序字段'
        }).select2('val', '');
    }
});

// 初始化排序类型
select2.init({
    url: '/admin/report/sort_type_option.do',
    title: '排序类型',
    cb: function(data) {
        var tpl = $('#type-sort-tpl').html();
        $('#type-sort').html(_.template(tpl)(data));
        $('#type-sort').select2({
            placeholder: '排序类型'
        }).select2('val', '');
    }
});

// 初始化日期控件
datePicker.init('#datapicker');

// 搜索按钮
$('#search').click(function() {

    // 获取日期
    var date = datePicker.getVal('#datapicker');

    // 获取产品线
    var productLine = select2.getVal({
        id: '#product-line'
    });

    // 获取客户
    var customerType = select2.getVal({
        id: '#customer-type'
    });

    // 排序字段
    var col = select2.getVal({
        id: '#col-sort'
    });

    // 排序类型
    var sortType = select2.getVal({
        id: '#type-sort'
    });

    // 销售来源
    var channelId = select2.getVal({
        id: '#consumption'
    });

    // 客户名称
    var name = $('#customer-name').val();

    // 执行搜索
    ajax.get({
        url: '/admin/report/list_all_prod.do',
        param: {
            startdate: date.start,
            enddate: date.end,
            name: name,
            type: customerType === 'clear' ? '' : customerType,
            line: productLine === 'clear' ? '' : productLine,
            page: 1,
            col: col === 'clear' ? '' : col,
            sortType: sortType === 'clear' ? '' : sortType,
            channelId : channelId === 'clear' ? '' : channelId,
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                startdate: date.start,
                enddate: date.end,
                name: name,
                type: customerType === 'clear' ? '' : customerType,
                line: productLine === 'clear' ? '' : productLine,
                page: 1,
                col: col === 'clear' ? '' : col,
                sortType: sortType === 'clear' ? '' : sortType,
                channelId : channelId === 'clear' ? '' : channelId,
            }));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#static').html(_.template(tpl)(data));

        },
        modal: modal,
        title: '产品维度统计'
    });

});

// 跳转到图表页面
$('.charts').click(function() {

    // 获取图表类型
    var type = $(this).attr('data-type'); // 0 -> 行业 1 -> 区域 2 -> 团队

    // 获取日期
    var date = datePicker.getVal('#datapicker');

    // 获取产品线
    var line = select2.getVal({
        id: '#product-line'
    });

    // 获取客户
    var custtype = select2.getVal({
        id: '#customer-type'
    });

    if(custtype === '' || custtype === null) {
        modal.nobtn({
            ctx: 'body',
            title: '产品维度统计',
            ctn: '客户类型为必选字段'
        });
        return;
    }

    location.href = '/#proj_name#/html/report/static-chart.html?type=' + type +
        '&datestart=' + encodeURIComponent(date.start) +
        '&dateend=' + encodeURIComponent(date.end) +
        '&line=' + (line === null ? '' : line) +
        '&custtype=' + (custtype === 'clear' ? '' : customerType);
});
