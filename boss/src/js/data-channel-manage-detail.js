/*!
 * 渠道商详情
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var urler = require('./modules/urler.js');
var lineId = 0;

auth.toolbar1({
    title: '渠道商管理'
});

// 请求数据
ajax.get({
    url: '/admin/channel/detail.do',
    param: {
        id: urler.normal().id,
        page: 1
    },
    cb: function(data) {

        // 渲染模板
        var tpl = $('#manage-detail-tpl').html();
        $('#manage-detail').html(_.template(tpl)(data));

        // 渲染渠道商
        $('#channel-name').val(data.data.channelBusiness);

        // 级别
        select2.init({
            url: '/admin/channel/grade_option.do',
            title: '级别',
            cb: function(_data) {
                var tpl = $('#level-tpl').html();
                $('#level').html(_.template(tpl)(_data));
                $('#level').select2({
                    placeholder: '级别'
                }).select2('val', data.data.grade);
            }
        });

        // 地区
        select2.init({
            url: '/admin/customer/area_option.do',
            title: '地区',
            cb: function(_data) {
                var tpl = $('#type-tpl').html();
                $('#area').html(_.template(tpl)(_data));
                $('#area').select2({
                    placeholder: '地区'
                }).select2('val', data.data.area);
            }
        });

        // 渠道经理
        select2.init({
            url: '/admin/channel/channel_manager_option.do',
            title: '渠道经理',
            cb: function(_data) {
                var tpl = $('#channel-manage-tpl').html();
                $('#channel-manage').html(_.template(tpl)(_data));
                $('#channel-manage').select2({
                    placeholder: '渠道经理'
                }).select2('val', data.data.channelManager);
            }
        });

        // 是否预开户
        select2.init({
            url: '/admin/channel/boolean_type.do',
            title: '是否预开户',
            cb: function(_data) {
                var tpl = $('#type-tpl').html();
                $('#advance-account').html(_.template(tpl)(_data));
                $('#advance-account').select2({
                    placeholder: '是否预开户'
                }).select2('val', data.data.isOpenAccount);
            }
        });

        // 是否垫票
        select2.init({
            url: '/admin/channel/boolean_type.do',
            title: '是否垫票',
            cb: function(_data) {
                var tpl = $('#type-tpl').html();
                $('#is-ticket').html(_.template(tpl)(_data));
                $('#is-ticket').select2({
                    placeholder: '是否垫票'
                }).select2('val', data.data.isGiveTicket);
            }
        });

        // 是否垫款
        select2.init({
            url: '/admin/channel/boolean_type.do',
            title: '是否垫款',
            cb: function(_data) {
                var tpl = $('#type-tpl').html();
                $('#is-cash').html(_.template(tpl)(_data));
                $('#is-cash').select2({
                    placeholder: '是否垫款'
                }).select2('val', data.data.isGiveMoney);
            }
        });

        $.each(data.data.channels, function(index, val) {

            // 业务线
            select2.init({
                url: '/admin/customer/prod_line_option.do',
                title: '业务线',
                cb: function(_data) {
                    var tpl = $('#type-tpl').html();
                    $('#bussiness-line'+index).html(_.template(tpl)(_data));
                    $('#bussiness-line'+index).select2({
                        placeholder: '业务线'
                    }).select2('val', '');
                }
            });

            $.each(val.channelProductLines, function(index,value) {

                // 返回方式
                select2.init({
                    url: '/admin/channel/return_type.do',
                    title: '方式',
                    cb: function(_data) {
                        var tpl = $('#type-tpl').html();
                        $('#reback'+value.id).html(_.template(tpl)(_data));
                        $('#reback'+value.id).select2({
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
                        $('#discount'+value.id).html(_.template(tpl)(_data));
                        $('#discount'+value.id).select2({
                            placeholder: '折扣'
                        }).select2('val', '');
                    }
                });

                // 返回方式
                select2.init({
                    url: '/admin/channel/return_type.do',
                    title: '方式',
                    cb: function(_data) {
                        var typeTpl = $('#type-tpl').html();
                        $('#reback'+value.id).html(_.template(typeTpl)(_data));
                        $('#reback'+value.id).select2({
                            placeholder: '方式'
                        }).select2('val', val.channelProductLines[index].returnWayId);
                    }
                });

                // 备注
                $('#rebate'+value.id).val(val.channelProductLines[index].rebate);

                // 返回折扣
                select2.init({
                    url: '/admin/channel/return_discount.do',
                    title: '折扣',
                    cb: function(_data) {
                        var tpl = $('#type-tpl').html();
                        $('#discount'+value.id).html(_.template(tpl)(_data));
                        $('#discount'+value.id).select2({
                            placeholder: '折扣'
                        }).select2('val', val.channelProductLines[index].returnRatioId);
                    }
                });
            })

            // 业务线
            select2.init({
                url: '/admin/customer/prod_line_option.do',
                title: '业务线',
                cb: function(_data) {
                    var tpl = $('#type-tpl').html();
                    $('#bussiness-line'+index).html(_.template(tpl)(_data));
                    $('#bussiness-line'+index).select2({
                        placeholder: '业务线'
                    }).select2('val', data.data.channels[index].productLineId);
                }
            });
        });

        // 修改页面
        $('input').attr('disabled', 'disabled');
        $('select').attr('disabled', 'disabled');

        // 拓展进度
        select2.init({
            url: '/admin/channel/expand_progress_option.do',
            title: '拓展进度',
            cb: function(_data) {
                var tpl = $('#type-tpl').html();
                $('#expand-process').html(_.template(tpl)(_data));
                $('#expand-process').select2({
                    placeholder: '拓展进度'
                }).select2('val', data.data.expandProgress);
            }
        });

        // 根据拓展进度返回的值，渲染不同的三种拓展方式（1）建立联系 （2）已合作 （3）BD资源
        switch (data.data.expandProgress) {

           // 建立联系
            case 1:
                $('.cooperation').addClass('z-hidden');
                $('.BD-resource').addClass('z-hidden');
                break;

            // 已合作
            case 2:

                $('.BD-resource').addClass('z-hidden');
                $('.cooperation').removeClass('z-hidden');
                break;

            // BD资源
            case 3:
                $('.cooperation').addClass('z-hidden');
                $('.BD-resource').removeClass('z-hidden');

                // 合作产品
                $('#cooperate-industry').val(data.data.cooperateProduct);

                // 开发区域
                $('#deleveop-area').val(data.data.openAccountArea);

                // 走单区域
                $('#policy').val(data.data.orderPolicy);
                break;
            default:

                // 合作产品
                $('#cooperate-industry').val(data.data.cooperateProduct);

                // 开发区域
                $('#deleveop-area').val(data.data.openAccountArea);

                // 走单区域
                $('#policy').val(data.data.orderPolicy);
                $('.BD-resource').removeClass('z-hidden');
                $('.cooperation').removeClass('z-hidden');
                break;
        }

        // 绑定拓展进度的值，形成联动框，当选中不同的拓展进度的值，拓展进度的下面区域会变化
        $('#expand-process').change(function() {
            var expandProcess = select2.getVal({
                id: '#expand-process'
            });
            switch(expandProcess) {

                // 建立联系
                case '1':
                    $('.cooperation').addClass('z-hidden');
                    $('.BD-resource').addClass('z-hidden');
                    break;

                // 已合作
                case '2':

                    $('.BD-resource').addClass('z-hidden');
                    $('.cooperation').removeClass('z-hidden');
                    break;

                // BD资源
                case '3':
                    $('.cooperation').addClass('z-hidden');
                    $('.BD-resource').removeClass('z-hidden');
                    break;
                default:
                    $('.BD-resource').removeClass('z-hidden');
                    $('.cooperation').removeClass('z-hidden');
                    break;
            }
        });
    }
});

// 添加结算方式
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

    // // 是否预开户
    select2.init({
        url: '/admin/channel/boolean_type.do',
        title: '是否预开户',
        cb: function(_data) {
            var tpl = $('#type-tpl').html();
            $('#advance-account').html(_.template(tpl)(_data));
            $('#advance-account').select2({
                placeholder: '是否预开户'
            }).select2('val', '');
        }
    });

    // 是否垫票
    select2.init({
        url: '/admin/channel/boolean_type.do',
        title: '是否垫票',
        cb: function(_data) {
            var tpl = $('#type-tpl').html();
            $('#is-ticket').html(_.template(tpl)(_data));
            $('#is-ticket').select2({
                placeholder: '是否垫票'
            }).select2('val', '');
        }
    });

    // 是否垫款
    select2.init({
        url: '/admin/channel/boolean_type.do',
        title: '是否垫款',
        cb: function(_data) {
            var tpl = $('#type-tpl').html();
            $('#is-cash').html(_.template(tpl)(_data));
            $('#is-cash').select2({
                placeholder: '是否垫款'
            }).select2('val', '');
        }
    });
});

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

    // 互为二代
    var expandProgressId = select2.getVal({
        id: '#expand-process'
    });

    // 互为二代 是已合作 2代表是已合作的方式
    if(expandProgressId === '2' || expandProgressId === '4') {

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

        // 返点的值
        var rebate = $('#rebate').val();
    }

    // 合作产品
    var cooperateProduct = $('#cooperate-industry').val();

    // 开户区域
    var openAccountArea = $('#deleveop-area').val();

    // 走单政策
    var orderPolicy = $('#policy').val();

    // 校验数据
    if(channelBusiness === '' || channelManagerId === '' || areaId === '' ||  gradeId === '' || expandProgressId === '') {
        modal.nobtn({
            ctx: 'body',
            title: '修改渠道商',
            ctn: '请输入渠道商名称、选择渠道经理、地区、级别、拓展进度选项'
        });
    }

    // 遍历所有的业务线
    var prodLineList = [];
    $('.add-bussiness-line > div ').each(function(index, el) {

        // 获取业务线
        var productLineObj = $(this).find('.bussiness-line-select').attr('data-bussiness-select');
        console.log($(this).find('.bussiness-line-select').html());
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

    // 校验数据
    if(channelBusiness === '' || channelManagerId === '' || areaId === '' ||  gradeId === '' || expandProgressId === '' ) {
        modal.nobtn({
            ctx: 'body',
            title: '修改渠道商',
            ctn: '请输入渠道商名称、选择渠道经理、地区、级别、拓展进度选项'
        });
    }

    ajax.get({
        url:'/admin/channel/modify.do',
        param: {
            id: urler.normal().id,
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

            if(data.data === true) {
                $("#submit").attr("disabled", false);
                modal.onebtn({
                    ctx: 'body',
                    title: '修改渠道商',
                    ctn: '修改成功',
                    event: function() {
                        location.href = '/#proj_name#/html/data/channel-manage.html'
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '修改渠道商',
                    ctn: data.message !== '' ? data.message : '修改失败'
                });
            }
        }
    })
});

// 删除业务线结算方式
$('body').on('click', '#bussiness-line-wrap .delete', function() {
    var $bussinessLine = $(this).parents('.statement-type');
    $bussinessLine.remove();
});

// 删除业务线
$('body').on('click', '#bussiness-line-wrap .delete-all', function() {
    var $bussinessParent = $(this).parents('.bussiness-line');
    $bussinessParent.remove();
});

// 修改按钮
$('#modify').on('click', function() {
    $('.modify').addClass('z-hidden');
    $('.submit').removeClass('z-hidden');

    // 移除disabeld属性
    $('input').attr('disabled', false);
    $('select').attr('disabled', false);
});





