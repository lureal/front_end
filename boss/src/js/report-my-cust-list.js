/*!
 * 罗列全部我的客户明细
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');

// 客户明细
auth.toolbar1({
    title: '客户明细'
});

// 初始化搜索条中选择客户
select2.init({
    url: '/admin/report/cust_filter_type.do',
    title: '我的客户明细',
    cb: function(data) {
        var tpl = $('#customer-type-tpl').html();
        $('#customer-type').html(_.template(tpl)(data));
        $('#customer-type').select2({
            placeholder: '选择客户'
        }).select2('val', '2');
    }
});

// 初始化搜索条中选择产品线
select2.init({
    url: '/admin/report/prod_line_option.do',
    title: '选择业务线',
    cb: function(data) {
        var tpl = $('#product-line-tpl').html();
        $('#product-line').html(_.template(tpl)(data));
        $('#product-line').select2({
            placeholder: '选择业务线'
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

// 初始化搜索条中的日期控件
datePicker.init('#search-datapicker');

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/report/list_my_cust.do',
        param: {
            page: sessionStorage.getItem('custlistTargetPage') !== null ? sessionStorage.getItem('custlistTargetPage') : 1
        },
        title: '我的客户明细'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#customer').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/report/list_my_cust.do',
            param: param,
            title: '我的客户明细'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#customer').html(_.template(tpl)(data));

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var targetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('targetPage', targetPage);

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var targetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('custlistTargetPage', targetPage);
        }
    });
});

// 搜索按钮
$('#search').click(function() {

    // 获取日期
    var date = datePicker.getVal('#search-datapicker');

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

    // 客户名称
    var name = $('#customer-name').val();

    // 执行搜索
    ajax.get({
        url: '/admin/report/list_my_cust.do',
        param: {
            startdate: date.start,
            enddate: date.end,
            name: name,
            type: customerType === 'clear' ? '' : customerType,
            line: productLine  === 'clear' ? '' : productLine,
            page: 1,
            col: col  === 'clear' ? '' : col,
            sortType: sortType  === 'clear' ? '' : sortType,
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                startdate: date.start,
                enddate: date.end,
                name: name,
                type: customerType === 'clear' ? '' : customerType,
                line: productLine  === 'clear' ? '' : productLine,
                page: 1,
                col: col  === 'clear' ? '' : col,
                sortType: sortType  === 'clear' ? '' : sortType,
            }));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#customer').html(_.template(tpl)(data));

        },
        modal: modal,
        title: '我的客户明细'
    });

});

// 导出按钮
$('#export').click(function() {

    // 获取日期
    var date = datePicker.getVal('#search-datapicker');

    // 获取产品线
    var productLine = select2.getVal({
        id: '#product-line'
    });

    // 获取客户
    var customerType = select2.getVal({
        id: '#customer-type'
    });
    location.href = '/admin/report/export_my_cust.do?line=' + (productLine === null ? '' : productLine) +
        '&startdate=' + date.start + '&enddate=' + date.end +
        '&type=' + (customerType === null ? '' : customerType) + '&line=' + (productLine === null ? '' : productLine);

});

// 客户转出
$('body').on('click', '.customer-out', function() {
    var id = $(this).parents('tr').find('.customer-out').attr('data-id');
    console.log(id);
    select2.init({
        url: '/admin/report/transfer_out_cust.do',
        title: '客户转出',
        cb: function(data) {
            var tpl = $('#type-sort-tpl').html();
            $('#s-person').html(_.template(tpl)(data));
            $('#s-person').select2({
                placeholder: '客户转出'
            }).select2('val', '');
        }
    });
    modal.custom({
        tpl: '#modal-tpl',
        data: {
            title: '将客户转出'
        }
    });
    $('body').on('click', '#submit',function() {
        var salesId  = select2.getVal({
            id: '#s-person'
        });
        ajax.get({
            url:'/admin/report/update_cust.do',
            param: {
                id: id,
                salesId: salesId
            },
            cb:function(data) {
                 $('#modal-custome').modal('hide');
                if(data.data === true) {
                    modal.onebtn({
                        ctx: 'body',
                        ctn: '修改成功',
                        title: '将客户转出',
                        event: function() {
                            location.reload();
                        }
                    });
                } else {
                    modal.nobtn({
                        ctx: 'body',
                        ctn: data.message ? data.message : '修改失败',
                        title: '将客户转出'
                    });
                }
            }
        });
    });
});

$('body').on('click', '#cancel', function() {
    $('#modal-custome').modal('hide');
});

