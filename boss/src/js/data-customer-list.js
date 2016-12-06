/*!
 * 客户管理
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');

auth.toolbar1({
    title: '客户管理'
})

// 初始化搜索条中的日期控件
datePicker.init('#search-datapicker');

// 初始化搜索条中的日期控件
datePicker.init('#export-datapicker');

// 业务线
select2.init({
    url: '/admin/customer/prod_line_option.do',
    title: '业务线',
    cb: function(data) {
        var tpl = $('#product-line-tpl').html();
        $('#product-line').html(_.template(tpl)(data));
        $('#product-line').select2({
            placeholder: '业务线'
        }).select2('val', '');
    }
});


// 所属行业
select2.init({
    url: '/admin/customer/industry_option.do',
    title: '所属行业',
    cb: function(data) {
        var tpl = $('#industry-tpl').html();
        $('#industry').html(_.template(tpl)(data));
        $('#industry').select2({
            placeholder: '所属行业'
        }).select2('val', '');
    }
});

// 所属区域
select2.init({
    url: '/admin/customer/area_option.do',
    title: '所属区域',
    cb: function(data) {
        var tpl = $('#area-tpl').html();
        $('#area').html(_.template(tpl)(data));
        $('#area').select2({
            placeholder: '所属区域'
        }).select2('val', '');
    }
});

// 客户来源
select2.init({
    url: '/admin/customer/channel_option.do',
    title: '客户来源',
    cb: function(data) {
        var tpl = $('#customer-source-tpl').html();
        $('#customer-source').html(_.template(tpl)(data));
        $('#customer-source').select2({
            placeholder: '客户来源'
        }).select2('val', '');
    }
});

// 商务|渠道经理
select2.init({
    url: '/admin/customer/sales_option.do',
    title: '商务|渠道经理',
    cb: function(data) {
        var tpl = $('#manager-channels-tpl').html();
        $('#manager-channels').html(_.template(tpl)(data));
        $('#manager-channels').select2({
            placeholder: '商务|渠道经理'
        }).select2('val', '');
    }
});

// 运营经理
select2.init({
    url: '/admin/customer/adviser_option.do',
    title: '运营经理',
    cb: function(data) {
        var tpl = $('#operations-manager-tpl').html();
        $('#operations-manager').html(_.template(tpl)(data));
        $('#operations-manager').select2({
            placeholder: '运营经理'
        }).select2('val', '');
    }
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/customer/list.do',
        param: {
            page: sessionStorage.getItem('cuslTargetPage') !== null ? sessionStorage.getItem('cuslTargetPage') : 1
        },
        title: '客户管理'
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
            url: '/admin/customer/list.do',
            param: param,
            title: '客户管理'
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
            var cuslTargetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('cuslTargetPage', cuslTargetPage);
        }
    });
});

// 搜索按钮
$('#search').click(function() {

    // 获取日期
    var date = datePicker.getVal('#search-datapicker');

    // 获取业务
    var prodLine = select2.getVal({
        id: '#product-line'
    });

    // 客户名称
    var name = $('#customer-name').val();

    // 所属行业
    var industry = select2.getVal({
        id: '#industry'
    });

    // 所属区域
    var area = select2.getVal({
        id: '#area'
    });

    // 客户来源
    var customerSource = select2.getVal({
        id: '#customer-source'
    });

    // 商务|渠道经理
    var managerChannels = select2.getVal({
        id: '#manager-channels'
    });

    // 运营经理
    var operationsManager = select2.getVal({
        id: '#operations-manager'
    });

    // 客户名称
    var customerName = $('#customer-name').val();

    // 执行搜索
    ajax.get({
        url: '/admin/customer/list.do',
        param: {
            startdate: date.start,
            name: name,
            industryId: industry === 'clear' ? '' : industry,
            areaId: area === 'clear' ? '' : area,
            channelId: customerSource === 'clear' ? '' : customerSource,
            salesId: managerChannels === 'clear' ? '' : managerChannels,
            prodLineId: prodLine === 'clear' ? '' : prodLine,
            adviserId: operationsManager === 'clear' ? '' : operationsManager,
            enddate: date.end,
            page: 1
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                startdate: date.start,
                name: name,
                industryId:industry === 'clear' ? '' : industry,
                areaId: area === 'clear' ? '' : area,
                channelId: customerSource === 'clear' ? '' : customerSource,
                salesId: managerChannels === 'clear' ? '' : managerChannels,
                prodLineId: prodLine === 'clear' ? '' : prodLine,
                adviserId: operationsManager === 'clear' ? '' : operationsManager,
                enddate: date.end,
                page: 1
            }));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#customer').html(_.template(tpl)(data));

        },
        modal: modal,
        title: '客户管理'
    });

});


// 导出按钮
$('#export').click(function() {

    // 获取日期
    var date = datePicker.getVal('#search-datapicker');

    // 获取搜索名称
    var name = $('#export-name').val();

    location.href = '/admin/customer/export.do?name=' + (name === null ? '' : name) +
        '&startdate=' + date.start + '&enddate=' + date.end;

});

// 删除产品
$('body').on('click', '.delete', function() {
    var id = $(this).attr('data-id');
    modal.twobtn({
        ctx: 'body',
        ctn: '是否删除客户？',
        title: '客户管理',
        btnOneText: '取消',
        btnOneClass: 'btn-default',
        eventOne: function() {
            $('#modal-twobtn').modal('hide');
        },
        eventTwo: function() {
            $('#modal-twobtn').modal('hide');

            ajax.post({
                url: '/admin/customer/delete.do',
                param: {
                    id: id
                },
                cb: function(data) {
                    if(data.data === true) {
                        modal.onebtn({
                            ctx: 'body',
                            title: '客户管理',
                            ctn: '删除客户成功',
                            event: function() {
                                location.reload();
                            }
                        });
                    } else {
                        modal.nobtn({
                            ctx: 'body',
                            title: '客户管理',
                            ctn: data.message
                        });
                    }
                }
            });
        }
    });

});

// 下载按钮
$('#download').click(function() {
    location.href = '/admin/customer/download.do';
});
