/*!
 * 渠道商管理
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var lineId = 0;

auth.toolbar1({
    title: '渠道商管理'
})

// 添加业务线
$('body').on('click', '#add-bussiness-line', function() {

    // 获取并渲染模板
    var tpl = $('#bussiness-line-tpl').html();
    $('#bussiness-line-wrap').append(_.template(tpl)({
        index: ++lineId
    }));

    // 业务线
    select2.init({
        url: '/admin/customer/prod_line_option.do',
        title: '业务线',
        cb: function(data) {
            var tpl = $('#type-tpl').html();
            $('.bussiness-line' + lineId + ' .bussiness-line-select').html(_.template(tpl)(data));
            $('.bussiness-line' + lineId + ' .bussiness-line-select').select2({
                placeholder: '业务线'
            }).select2('val', '');
        }
    });

    // 返回方式
    select2.init({
        url: '/admin/channel/return_type.do',
        title: '方式',
        cb: function(data) {
            var tpl = $('#type-tpl').html();
            $('.bussiness-line' + lineId + ' .reback-select').html(_.template(tpl)(data));
            $('.bussiness-line' + lineId + ' .reback-select').select2({
                placeholder: '方式'
            }).select2('val', '');
        }
    });

    // 返回折扣
    select2.init({
        url: '/admin/channel/return_discount.do',
        title: '折扣',
        cb: function(data) {
            var tpl = $('#type-tpl').html();
            $('.bussiness-line' + lineId + ' .discount-select').html(_.template(tpl)(data));
            $('.bussiness-line' + lineId + ' .discount-select').select2({
                placeholder: '折扣'
            }).select2('val', '');
        }
    });
});

// 删除业务线
$('body').on('click', '#bussiness-line-wrap .delete-all', function() {
    var $bussinessParent = $(this).parents('.bussiness-line');
    $bussinessParent.remove();
});

// 添加业务线结算方式
$('body').on('click', '.add', function() {

    var $settlement = $(this).parents('.bussiness-line').find('.bussiness-line-add');

    // 获取并渲染模板
    var statementTpl = $('#statement-tpl').html();
    $settlement.append(_.template(statementTpl)({
        index: ++lineId
    }));

    // 返回方式
    select2.init({
        url: '/admin/channel/return_type.do',
        title: '方式',
        cb: function(data) {
            var tpl = $('#type-tpl').html();
            $('.statement-type' + lineId + ' .reback-select').html(_.template(tpl)(data));
            $('.statement-type' + lineId + ' .reback-select').select2({
                placeholder: '方式'
            }).select2('val', '');
        }
    });

    // 返回折扣
    select2.init({
        url: '/admin/channel/return_discount.do',
        title: '折扣',
        cb: function(_data) {
            var tpl = $('#type-tpl').html();
            $('.statement-type' + lineId + ' .discount-select').html(_.template(tpl)(_data));
            $('.statement-type' + lineId + ' .discount-select').select2({
                placeholder: '折扣'
            }).select2('val', '');
        }
    });
});

// 删除业务线结算方式
$('body').on('click', '#bussiness-line-wrap .delete', function() {
    var $bussinessLine = $(this).parents('.statement-type');
    $bussinessLine.remove();
});

// 拓展进度（联动框，三种方式：分别为：1）建立联系 2）已合作 3）BD资源）
select2.init({
    url: '/admin/channel/expand_progress_option.do',
    title: '拓展进度',
    cb: function(data) {
        var tpl = $('#type-tpl').html();
        $('#expand-process').html(_.template(tpl)(data));
        $('#expand-process').select2({
            placeholder: '拓展进度'
        }).select2('val', '');

        // 绑定拓展进度的值，形成联动框，当选中不同的拓展进度的值，拓展进度的下面区域会变化
        $('#expand-process').change(function() {
            var expandProcess = select2.getVal({
                id: '#expand-process'
            });
            switch(expandProcess) {

                // 1）建立联系
                case '1':
                    $('.cooperation').addClass('z-hidden');
                    $('.BD-resource').addClass('z-hidden');
                    $('.cooperation-flag').removeClass('z-hidden');
                    $('.uncooperation-flag').addClass('z-hidden');
                    break;

                // 2）已合作
                case '3':

                    $('.cooperation').addClass('z-hidden');
                    $('.BD-resource').removeClass('z-hidden');
                    $('.uncooperation-flag').removeClass('z-hidden');
                    break;

                // 3）BD资源
                case '2':
                     $('.BD-resource').addClass('z-hidden');
                    $('.cooperation').removeClass('z-hidden');
                    $('.cooperation-flag').removeClass('z-hidden');
                    $('.uncooperation-flag').addClass('z-hidden');

                    // 给业务线设id值
                    $('.add-bussiness-line').find('.bussiness-line-select').attr('id', 'bussiness-line');

                    // 业务线
                    select2.init({
                        url: '/admin/customer/prod_line_option.do',
                        title: '业务线',
                        cb: function(data) {
                            var tpl = $('#type-tpl').html();
                            $('#bussiness-line').html(_.template(tpl)(data));
                            $('#bussiness-line').select2({
                                placeholder: '业务线'
                            }).select2('val', '');
                        }
                    });

                    // 给方式设id值
                    $('.add-bussiness-line').find('.reback-select').attr('id', 'reback');

                    // 给折扣设id值
                    $('.add-bussiness-line').find('.discount-select').attr('id', 'discount');

                    // 返回方式
                    select2.init({
                        url: '/admin/channel/return_type.do',
                        title: '方式',
                        cb: function(data) {
                            var tpl = $('#type-tpl').html();
                            $('#reback').html(_.template(tpl)(data));
                            $('#reback').select2({
                                placeholder: '方式'
                            }).select2('val', '');
                        }
                    });

                    // 返回折扣
                    select2.init({
                        url: '/admin/channel/return_discount.do',
                        title: '折扣',
                        cb: function(data) {
                            var tpl = $('#type-tpl').html();
                            $('#discount').html(_.template(tpl)(data));
                            $('#discount').select2({
                                placeholder: '折扣'
                            }).select2('val', '');
                        }
                    });
                    break;

                    default:
                        $('.BD-resource').removeClass('z-hidden');
                        $('.cooperation').removeClass('z-hidden');
                        $('.cooperation-flag').removeClass('z-hidden');
                        $('.uncooperation-flag').addClass('z-hidden');

                        // 给业务线设id值
                        $('.add-bussiness-line').find('.bussiness-line-select').attr('id', 'bussiness-line');

                        // 业务线
                        select2.init({
                            url: '/admin/customer/prod_line_option.do',
                            title: '业务线',
                            cb: function(data) {
                                var tpl = $('#type-tpl').html();
                                $('#bussiness-line').html(_.template(tpl)(data));
                                $('#bussiness-line').select2({
                                    placeholder: '业务线'
                                }).select2('val', '');
                            }
                        });

                        // 给方式设id值
                        $('.add-bussiness-line').find('.reback-select').attr('id', 'reback');

                        // 给折扣设id值
                        $('.add-bussiness-line').find('.discount-select').attr('id', 'discount');

                        // 返回方式
                        select2.init({
                            url: '/admin/channel/return_type.do',
                            title: '方式',
                            cb: function(data) {
                                var tpl = $('#type-tpl').html();
                                $('#reback').html(_.template(tpl)(data));
                                $('#reback').select2({
                                    placeholder: '方式'
                                }).select2('val', '');
                            }
                        });

                        // 返回折扣
                        select2.init({
                            url: '/admin/channel/return_discount.do',
                            title: '折扣',
                            cb: function(data) {
                                var tpl = $('#type-tpl').html();
                                $('#discount').html(_.template(tpl)(data));
                                $('#discount').select2({
                                    placeholder: '折扣'
                                }).select2('val', '');
                            }
                        });
                        break;
            }
        });
    }
});

// 级别
select2.init({
    url: '/admin/channel/grade_option.do',
    title: '级别',
    cb: function(data) {
        var tpl = $('#level-tpl').html();
        $('#level').html(_.template(tpl)(data));
        $('#level').select2({
            placeholder: '级别'
        }).select2('val', '');
    }
});

// 地区
select2.init({
    url: '/admin/customer/area_option.do',
    title: '地区',
    cb: function(data) {
        var tpl = $('#type-tpl').html();
        $('#area').html(_.template(tpl)(data));
        $('#area').select2({
            placeholder: '地区'
        }).select2('val', '');
    }
});

// 渠道经理
select2.init({
    url: '/admin/channel/channel_manager_option.do',
    title: '渠道经理',
    cb: function(data) {
        var tpl = $('#channel-manage-tpl').html();
        $('#channel-manage').html(_.template(tpl)(data));
        $('#channel-manage').select2({
            placeholder: '渠道经理'
        }).select2('val', '');
    }
});

// 是否预开户
select2.init({
    url: '/admin/channel/boolean_type.do',
    title: '是否预开户',
    cb: function(data) {
        var tpl = $('#type-tpl').html();
        $('#advance-account').html(_.template(tpl)(data));
        $('#advance-account').select2({
            placeholder: '是否预开户'
        }).select2('val', '');
    }
});

// 是否垫票
select2.init({
    url: '/admin/channel/boolean_type.do',
    title: '是否垫票',
    cb: function(data) {
        var tpl = $('#type-tpl').html();
        $('#is-ticket').html(_.template(tpl)(data));
        $('#is-ticket').select2({
            placeholder: '是否垫票'
        }).select2('val', '');
    }
});

// 是否垫款
select2.init({
    url: '/admin/channel/boolean_type.do',
    title: '是否垫款',
    cb: function(data) {
        var tpl = $('#type-tpl').html();
        $('#is-cash').html(_.template(tpl)(data));
        $('#is-cash').select2({
            placeholder: '是否垫款'
        }).select2('val', '');
    }
});

// 提交
$('#submit').on('click', function() {
    $("#submit").attr("disabled", true);

    //  渠道商名称
    var channelBusiness = $('#channel-name').val();

    // 渠道经理Id
    var channelManagerId = select2.getVal({
        id: '#channel-manage'
    });

    // 地区Id
    var areaId = select2.getVal({
        id: '#area'
    });

    // 级别
    var gradeId = select2.getVal({
        id: '#level'
    });

    // 自营产品
    var selfProduct = $('#self-product').val();

    // 主要客户
    var mainCustomer = $('#customer').val();

    // 合作方向
    var cooperateDirection = $('#cooperation').val();

    // 主要行业
    var industry = $('#industry').val();

    // 拓展进度
    var expandProgressId = $('#expand-process').val();

    // 合作产品
    var cooperateProduct = $('#cooperate-industry').val();

    // 开户区域
    var openAccountArea = $('#deleveop-area').val();

    // 走单政策
    var orderPolicy = $('#policy').val();


    // 业务线是 已合作
    if(expandProgressId === '2' || expandProgressId === '4') {
        var productLineId = select2.getVal({
            id: '#bussiness-line'
        });

        // 是否预开户
        var isOpenAccount = select2.getVal({
            id: '#advance-account'
        });

        //  是否垫票
        var isGiveTicket = select2.getVal({
            id: '#is-ticket'
        });

        // 是否垫款
        var isGiveMoney = select2.getVal({
            id: '#is-cash'
        });

        // 合作结算方式
        var returnWayId = select2.getVal({
            id: '#reback'
        });

        // 折扣
        var returnRatioId = select2.getVal({
            id: '#discount'
        });

        // 返点的值
        var rebate = $('#rebate').val();

        // 遍历所有的业务线
        var prodLineList = [];
        $(".add-bussiness-line > div ").each(function(index, el) {

            // 获取业务线的值
            var productLineObj = $(this).find('.bussiness-line-select').attr('data-bussiness-select');
            var productLineId = select2.getVal({
                id: '#' + productLineObj
            });
            $(el).find('.statement-type').each(function () {

                // 获取方式
                var rebackObj = $(this).find('.reback-select').attr('data-reback-select');
                var returnWayId = select2.getVal({
                    id: '#' + rebackObj
                });

                // 获取折扣
                var discountObj = $(this).find('.discount-select').attr('data-discount-select');
                var returnRatioId = select2.getVal({
                    id: '#' + discountObj
                });

                //获取其他信息
                var rebate = $(this).find('.rebate').val();
                prodLineList.push(
                    {
                        "productLineId":productLineId,
                        "returnRatioId":returnRatioId,
                        "returnWayId": returnWayId,
                        "rebate": rebate
                    }
                );
            });
        });
    }

    // 校验数据
    if(channelBusiness === '' || channelManagerId === null || areaId === null ||  gradeId === null || expandProgressId === null ) {
        modal.nobtn({
            ctx: 'body',
            title: '修改渠道商',
            ctn: '请输入渠道商名称、选择渠道经理、地区、级别、拓展进度选项'
        });
        return;
    }

    ajax.get({
        url:'/admin/channel/add.do',
        param: {
            channelBusiness: channelBusiness,
            channelManagerId: channelManagerId,
            areaId: areaId,
            isGiveMoney: isGiveMoney,
            isOpenAccount: isOpenAccount,
            orderPolicy: orderPolicy,
            openAccountArea: openAccountArea,
            isGiveTicket: isGiveTicket,
            cooperateProduct: cooperateProduct,
            expandProgressId: expandProgressId,
            industry: industry,
            cooperateDirection: cooperateDirection,
            gradeId: gradeId,
            selfProduct: selfProduct,
            mainCustomer: mainCustomer,
            productLine: JSON.stringify(prodLineList)
        },
        cb: function(data) {
            $("#submit").attr("disabled", false);
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '添加渠道商',
                    ctn: '添加成功',
                    event: function() {
                        location.href = '/#proj_name#/html/data/channel-manage.html'
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '添加渠道商',
                    ctn: data.message
                });
            }
        }
    })
});



