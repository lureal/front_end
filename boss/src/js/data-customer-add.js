/*!
 * 添加客户
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');

// 初始化导航
auth.noToolbar({
    title: '添加客户'
});

// 初始化产品线
select2.init({
    url: '/admin/customer/prod_line_option.do',
    title: '添加客户',
    cb: function(data) {
        var tpl = $('#select-tpl').html();
        $('#product-line').html(_.template(tpl)(data));
        $('#product-line').select2({
            placeholder: '选择业务线'
        }).select2('val', '');
    }
});

// 初始化产品
select2.init({
    url: '/admin/customer/product_option.do',
    title: '添加客户',
    cb: function(data) {
        var tpl = $('#select-tpl').html();
        $('#product').html(_.template(tpl)(data));
        $('#product').select2({
            placeholder: '选择产品'
        }).select2('val', '');
    }
});

// 初始化行业
select2.init({
    url: '/admin/customer/industry_option.do',
    title: '添加客户',
    cb: function(data) {
        var tpl = $('#select-tpl').html();
        $('#industry-id').html(_.template(tpl)(data));
        $('#industry-id').select2({
            placeholder: '选择行业'
        }).select2('val', '');
    }
});

// 初始化区域
select2.init({
    url: '/admin/customer/area_option.do',
    title: '添加客户',
    cb: function(data) {
        var tpl = $('#select-tpl').html();
        $('#area-line').html(_.template(tpl)(data));
        $('#area-line').select2({
            placeholder: '选择区域'
        }).select2('val', '');
    }
});

// 初始化运营人员
select2.init({
    url: '/admin/customer/adviser_option.do',
    title: '添加客户',
    cb: function(data) {
        var tpl = $('#select-tpl').html();
        $('#adviser-id').html(_.template(tpl)(data));
        $('#adviser-id').select2({
            placeholder: '选择运营人员'
        }).select2('val', '');
    }
});

// 初始化销售来源
select2.init({
    url: '/admin/customer/channel_option.do',
    title: '添加客户',
    cb: function(data) {
        var tpl = $('#select-tpl').html();
        $('#channel-line').html(_.template(tpl)(data));
        $('#channel-line').select2({
            placeholder: '选择销售来源'
        }).select2('val', '');
    }
});

// 初始化商务丨渠道经理
select2.init({
    url: '/admin/customer/sales_option.do',
    title: '添加客户',
    cb: function(data) {
        var tpl = $('#select-tpl').html();
        $('#sales-id').html(_.template(tpl)(data));
        $('#sales-id').select2({
            placeholder: '选择商务丨渠道经理'
        }).select2('val', '');
    }
});

// 初始化渠道商
select2.init({
    url: '/admin/channel/channel_business.do',
    title: '添加渠道商',
    cb: function(data) {
        var tpl = $('#select-tpl').html();
        $('#channel-manager').html(_.template(tpl)(data));
        $('#channel-manager').select2({
            placeholder: '添加渠道商'
        }).select2('val', '');
    }
});

// 如果销售来源是渠道的话，就显示渠道下拉选框
$('#channel-line').change(function() {
    var channelLineObj = select2.getVal({
        id: '#channel-line'
    });
    if(channelLineObj === '38') {
        $('.channel-manager').removeClass('z-hidden');
        $('.bussiness-manager').addClass('z-hidden');
    } else {
        $('.channel-manager').addClass('z-hidden');
        $('.bussiness-manager').removeClass('z-hidden');
    }
});

// 提交数据
$('#submit').click(function() {
    $("#submit").attr("disabled", true);

    // 获取数据
    var name = $.trim($('#name').val());
    var memo = $.trim($('#memo').val());
    var productLine = select2.getVal({
        id: '#product-line'
    });
    var product = select2.getVal({
        id: '#product'
    });
    var platformLine = $('#platform-line').val();
    var industryId = select2.getVal({
        id: '#industry-id'
    });
    var areaLine = select2.getVal({
        id: '#area-line'
    });
    var adviserId = select2.getVal({
        id: '#adviser-id'
    });
    var channelLine = select2.getVal({
        id: '#channel-line'
    });
    var salesId = select2.getVal({
        id: '#sales-id'
    });
    var channelBusinessId = select2.getVal({
        id: '#channel-manager'
    });
    var rebate = $.trim($('#rebate').val());

    // 数据合法性校验
    var isName = name !== '';
    var isMemo = memo !== '';
    var isProductLine = productLine !== '' && productLine !== null;
    var isProduct = product !== '' && product !== null;
    var isPlatformLine = platformLine !== '' && productLine !== null;
    var isIndustryId = industryId !== '' && industryId !== null;
    var isAreaLine = areaLine !== '' && areaLine !== null;
    //var isAdviserId = adviserId !== '' && areaLine !== null;
    //var isChannelLine = channelLine !== '' && channelLine !== null;
    //var isSalesId = salesId !== '' && salesId !== null;
    //var isRebate = rebate !== '';

    // 判断是否输入字段
    if(!isName || !isProductLine || !isProduct || !isPlatformLine || !isIndustryId || !isAreaLine) {
        modal.nobtn({
            ctx: 'body',
            title: '添加客户',
            ctn: '请输入必选字段：作者名称，产品线，产品，平台，行业和区域'
        });
        return;
    }

    // 提交数据
    ajax.post({
        url: '/admin/customer/add.do',
        param: {
            name: name,
            prodLineId: productLine,
            productId: product,
            platformId: platformLine,
            industryId: industryId,
            rebate: rebate,
            areaId: areaLine,
            adviserId: adviserId,
            channelId: channelLine,
            salesId: salesId,
            channelBusinessId: channelBusinessId,
            memo: memo
        },
        cb: function(data) {
            $("#submit").attr("disabled", false);

            // 导出成功
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '添加客户',
                    ctn: '添加成功',
                    event: function() {
                        location.href = '/#proj_name#/html/data/customer-list.html';
                    }
                });

            // 导出失败
            } else {
                modal.onebtn({
                    ctx: 'body',
                    title: '添加客户',
                    ctn: '添加失败',
                    event: function() {
                        location.href = '/#proj_name#/html/data/customer-list.html';
                    }
                });
            }
        },
        modal: modal,
        title: '添加客户'
    });
});

// 下载按钮(接口待定，后端没写)
$('#download').click(function() {
    location.href = '/admin/channel/download_channel_manage.do';
});

