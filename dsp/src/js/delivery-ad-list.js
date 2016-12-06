/*!
 * 广告管理
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var sidebar = require('./modules/sidebar.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var urler = require('./modules/urler.js');
var time = require('./modules/time.js');
var header = require('./modules/header.js');
var cache = require('./modules/cache.js');
var timer = require('./modules/time-picker.js');

// 初始化本地缓存模块
cache.set('delivery_ad_list_order_select', []); // 设置广告订单缓存勾选订单 id 数组名称

//初始化菜单
sidebar.delivery({
    title: '广告管理',
    active: 'ad'
});

// 初始化顶部栏
header.delivery({
    title: '广告管理'
});

// 从cookie中取当前页面的值
$('.nav-tabs').find('li a').click(function(){
    var flag = $(this).attr('data-flag');
    cache.set('tabFlag', flag);
});

// 根据cookie中的值，匿名函数执行切换相应的tab页
(function() {
    var tabFlag = cache.get('tabFlag');
    if(tabFlag == 'subject') {
        $('.nav-tabs li:eq(3) a').tab('show');
    } else if(tabFlag == 'order') {
        $('.nav-tabs li:eq(1) a').tab('show');
    } else if(tabFlag == 'platform') {
        $('.nav-tabs li:eq(2) a').tab('show');
    } else {
        $('.nav-tabs li:eq(0) a').tab('show');
    }
})();

// 公共
// -----------------------------------------------------------------------------
$('body').on('click', '#create-ad', function() {

    // 重置添加广告的缓存变量

    // 跳转到添加广告步骤1
    cache.set('delivery_ad_add', {});
    urler.initLink('/#proj_name#/html/delivery/ad/step1.html');
});

// 点击 2 个按钮的弹窗清除复选框
$('#modal-twobtn').click(function() {

    // 操作成功列表恢复原状
    $('[type="checkbox"]', $('#order')).prop('checked', false);
    cache.set('delivery_ad_list_order_select', []);
});

// 渲染广告组
// -----------------------------------------------------------------------------
renderList({
    url: '/deal/group/list.do',
    listerParam: {
        page: 1,
        customId: urler.normal().cid,
        export: false
    },
    cb: function(data) {
        var tpl = $('#group-tpl').html();
        $('#group-list').html(_.template(tpl)(data));

        // 初始化开关按钮
        $('.group-switch-btn').bootstrapSwitch();

        // 初始化广告组中的状态下拉框
        $('#group-search-state').html(_.template($('#type-tpl').html())({
            data: {
                0: '停用',
                1: '启用'
            }
        }));
        $('#group-search-state').select2({
            placeholder: '选择状态'
        }).select2('val', '');


        // 初始化广告组中的日期选择框
        datePicker.init('#group-search-datepicker');

        // 初始化链接
        urler.initLink();
    }
}, $('#group'));

function renderAdGroup() {

    // 获取名称或 ID
    var keyword = $('#group-search-keyword').val();

    // 获取状态
    var status = select2.getVal({
        id: '#group-search-state'
    });

    // 获取日期
    var date = datePicker.getVal('#group-search-datepicker');

    ajax.get({
        url: '/deal/group/list.do',
        param: {
            page: 1,
            customId: urler.normal().cid,
            export: false,
            startDate: date.start,
            endDate: date.end,
            status: status,
            keyword: keyword
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                page: 1,
                customId: urler.normal().cid,
                export: false
            }));

            var tpl = $('#group-tpl').html();
            $('#group-list').html(_.template(tpl)(data));

            // 初始化链接
            urler.initLink();

            // 初始化开关按钮
            $('.group-switch-btn').bootstrapSwitch();
        },
        modal: modal,
        title: '广告组下订单'
    });
}
setInterval(renderAdGroup, 30000);

// 广告组暂停，启用广告组
$('body').on('switchChange.bootstrapSwitch', '.group-switch-btn', function(e, state) {
    var $self = $(this);
    var id = $self.attr('data-id');

    // 启用
    if(state === true) {
        ajax.get({
            url: '/deal/group/start.do',
            param: {
                customId: urler.normal().cid,
                groupId: id
            },
            cb: function(data) {
                if(data.data === true) {
                    modal.nobtn({
                        ctx: 'body',
                        ctn: '启用成功',
                        title: '广告管理'
                    });
                } else {
                    modal.nobtn({
                        ctx: 'body',
                        ctn: '启用失败',
                        title: '广告管理'
                    });

                    // 启用失败，回到原来状态
                }
            },
            modal: modal,
            title: '广告管理'
        });

    // 停用
    } else {
        ajax.get({
            url: '/deal/group/stop.do',
            param: {
                customId: urler.normal().cid,
                groupId: id
            },
            cb: function(data) {
                if(data.data === true) {
                    modal.nobtn({
                        ctx: 'body',
                        ctn: '停用成功',
                        title: '广告管理'
                    });
                } else {
                    modal.nobtn({
                        ctx: 'body',
                        ctn: '停用失败',
                        title: '广告管理'
                    });

                    // 停用失败，回到原来状态
                }
            },
            modal: modal,
            title: '广告管理'
        });
    }
});

// 广告组修改组限额
$('body').on('click', '.group-edit-quota', function() {
    var $self = $(this);
    var id = $self.attr('data-id');
    var quota = $self.parents('.group-quota-wrap').find('.quota-input').val();

    if(quota === '') {
        modal.nobtn({
            ctx: 'body',
            ctn: '请输入组限额',
            title: '广告管理'
        });
        return;
    }

    // 提交修改数据
    ajax.get({
        url: '/deal/group/updateQuota.do',
        param: {
            customId: urler.normal().cid,
            groupId: id,
            quota: parseInt(parseFloat(Number(quota) * 100).toPrecision(12))
        },
        cb: function(data) {
            if(data.data === true) {
                modal.nobtn({
                    ctx: 'body',
                    ctn: '修改成功',
                    title: '广告管理'
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    ctn: '修改失败',
                    title: '广告管理'
                });
            }
        },
        modal: modal,
        title: '广告管理'
    });
});

// 删除广告组
$('body').on('click', '.group-del-quota', function() {
    var $self = $(this);
    var id = $self.attr('data-id');

    modal.twobtn({
        ctx: 'body',
        ctn: '是否删除广告组',
        title: '广告管理',
        btnOneClass: 'btn-default',
        btnOneText: '取消',
        eventOne: function(e) {
            e.stopPropagation();

            $('#modal-twobtn').modal('hide');
        },
        eventTwo: function(e) {
            e.stopPropagation();

            ajax.get({
                url: '/deal/group/remove.do',
                param: {
                    customId: urler.normal().cid,
                    groupId: id
                },
                cb: function(data) {
                    $('#modal-twobtn').modal('hide');

                    if(data.data === true) {
                        modal.nobtn({
                            ctx: 'body',
                            ctn: '删除成功',
                            title: '广告管理'
                        });
                        location.reload();
                    } else {
                        modal.nobtn({
                            ctx: 'body',
                            ctn: '删除失败',
                            title: '广告管理'
                        });
                    }
                },
                modal: modal,
                title: '广告管理'
            });
        }
    });
});

// 搜索广告组
$('body').on('click', '#group-search', function() {

    // 获取名称或 ID
    var keyword = $('#group-search-keyword').val();

    // 获取状态
    var status = select2.getVal({
        id: '#group-search-state'
    });

    // 获取日期
    var date = datePicker.getVal('#group-search-datepicker');

    // 发起请求
    ajax.get({
        url: '/deal/group/list.do',
        param: {
            customId: urler.normal().cid,
            startDate: date.start,
            endDate: date.end,
            status: status,
            keyword: keyword,
            page: 1,
            export: false
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                customId: urler.normal().cid,
                startDate: date.start,
                endDate: date.end,
                status: status,
                keyword: keyword,
                page: 1,
                export: false
            }));

            var tpl = $('#group-tpl').html();
            $('#group-list').html(_.template(tpl)(data));

            // 初始化开关按钮
            $('.group-switch-btn').bootstrapSwitch();
        },
        modal: modal,
        title: '广告管理'
    });
});

// 导出广告组
$('body').on('click', '#group-export', function() {

    // 获取名称或 ID
    var keyword = $('#group-search-keyword').val();

    // 获取状态
    var status = select2.getVal({
        id: '#group-search-state'
    });

    // 获取日期
    var date = datePicker.getVal('#group-search-datepicker');

    location.href = '/deal/group/list.do?export=true' +
        '&startDate=' + date.start +
        '&endDate=' + date.end +
        '&status=' + (status === null ? '' : status) +
        '&keyword=' + keyword +
        '&customId=' + urler.normal().cid;
});

// 广告组下订单
$('body').on('click', '.group-bill', function() {
    var self = $(this);
    urler.initLink('/#proj_name#/delivery/ad/group-list?groupId=' + self.attr('data-group'));
});

// 渲染广告订单
// -----------------------------------------------------------------------------
renderList({
    url: '/deal/order/list.do',
    listerParam: {
        customId: urler.normal().cid,
        page: 1,
        export: false
    },
    cb: function(data) {

        var tpl = $('#order-tpl').html();
        $('#order-list').html(_.template(tpl)(data));

        $('#order-search-state').html(_.template($('#type-tpl').html())({
            data: {
                0: '未送审',
                1: '审核中',
                2: '审核不通过',
                3: '启用',
                4: '停用',
                5: '投放结束'
            }
        }));
        $('#order-search-state').select2({
            placeholder: '选择状态'
        }).select2('val', '');

        // 如果本地有存储数据，渲染勾选框
        var arr = cache.get('delivery_ad_list_order_select');
        if(arr.length > 0) {
            _.each(arr, function(val) {
                $('input[value="' + val +'"]').prop('checked', true);
            });
        }

        // 初始化广告组中的日期选择框
        datePicker.init('#order-search-datepicker');

        // 初始化链接
        urler.initLink();
    }
}, $('#order'));

function renderAdList() {

    // 获取名称或 ID
    var keyword = $('#order-search-keyword').val();

    // 获取状态
    var status = select2.getVal({
        id: '#order-search-state'
    });

    // 获取日期
    var date = datePicker.getVal('#order-search-datepicker');

    ajax.get({
        url: '/deal/order/list.do',
        param: {
            page: 1,
            customId: urler.normal().cid,
            export: false,
            startDate: date.start,
            endDate: date.end,
            status: status,
            keyword: keyword
        },
        cb: function(data) {
            var tpl = $('#order-tpl').html();
            $('#order-list').html(_.template(tpl)(data));

            // 初始化链接
            urler.initLink();

            // 初始化开关按钮
            $('.order-switch-btn').bootstrapSwitch();
        }
    });
}
setInterval(renderAdList, 30000);

// 订单修改组限额
$('body').on('click', '.bill-edit-quota', function() {
    var $self = $(this);
    var id = $self.attr('data-id');
    modal.custom({
        tpl: '#order-modal-tpl',
        data: {
            title: '每日预算',
            modifyTitle: '请设置每日预算'
        }
    });

    // 获得总体预算的值
    sumJQuota = $(this).attr('data-sumBudget');

    // 提交修改数据
    $('#order-modal-price-submit').unbind('click').bind('click', function() {

        var quota = $('#order-modal-price').val();

        if(quota === '') {
            $('#modal-custome').modal('hide');
            modal.nobtn({
                ctx: 'body',
                ctn: '请输入订单预算',
                title: '广告管理'
            });
            return;
        } else if (Number(quota) > Number(sumJQuota)) {
            $('#modal-custome').modal('hide');
            modal.nobtn({
                ctx: 'body',
                ctn: '总体预算需大于等于每日预算，请重新修改！',
                title: '广告管理'
            });
            return;
        } else {
            ajax.get({
                url: '/deal/order/updateQuota.do',
                param: {
                    customId: urler.normal().cid,
                    orderId: id,
                    quota: parseInt(parseFloat(Number(quota) * 100).toPrecision(12))
                },
                cb: function(data) {
                    $('#modal-custome').modal('hide');
                    if(data.data === true) {
                        modal.onebtn({
                            ctx: 'body',
                            ctn: '修改订单预算成功',
                            title: '广告管理',
                            event: function() {
                                location.reload();
                            }
                        });
                    } else {
                        modal.nobtn({
                            ctx: 'body',
                            ctn: '修改订单预算失败',
                            title: '广告管理'
                        });
                    }
                },
                modal: modal,
                title: '广告管理'
            });
        }
    });

});

// 订单修改总体预算
$('body').on('click', '.bill-edit-sumquota', function() {
    var $self = $(this);
    var id = $self.attr('data-id');
    modal.custom({
        tpl: '#order-modal-tpl',
        data: {
            title: '总体预算',
            modifyTitle: '请设置总体预算'
        }
    });
    eDialyBudget = $(this).attr('data-dialyBudget');

    // 提交修改数据
    $('#order-modal-price-submit').unbind('click').bind('click', function() {
        var sumQuota = $('#order-modal-price').val();
        if(sumQuota === '') {
            $('#modal-custome').modal('hide');
            modal.nobtn({
                ctx: 'body',
                ctn: '请输入总体预算',
                title: '广告管理'
            });
            return;
        } else if(Number(sumQuota) < Number(eDialyBudget)) {
            $('#modal-custome').modal('hide');
            modal.nobtn({
                ctx: 'body',
                ctn: '总体预算需大于等于每日预算，请重新修改',
                title: '广告管理'
            });
            return;
        } else {
            ajax.get({
                url: '/deal/order/updateTotalQuota.do',
                param: {
                    customId: urler.normal().cid,
                    orderId: id,
                    quota: parseInt(parseFloat(Number(sumQuota) * 100).toPrecision(12))
                },
                cb: function(data) {
                    $('#modal-custome').modal('hide');
                    if(data.data === true) {
                        modal.onebtn({
                            ctx: 'body',
                            ctn: '修改订单总体预算成功',
                            title: '广告管理',
                            event: function() {
                                location.reload();
                            }
                        });
                    } else {
                        modal.nobtn({
                            ctx: 'body',
                            ctn: '修改订单总体预算失败',
                            title: '广告管理'
                        });
                    }
                },
                modal: modal,
                title: '广告管理'
            });
        }
    })
});

// 修改订单出价
$('body').on('click', '.bill-edit-price', function() {
    var $self = $(this);
    var id = $self.attr('data-id');
    // var price = $self.parents('.bill-price-wrap').find('.price-input').val();
    modal.custom({
        tpl: '#order-modal-tpl',
        data: {
            title: '订单出价方式',
            modifyTitle: '修改订单出价方式'
        }
    });

    // 提交修改数据
    $('body').on('click', '#order-modal-price-submit', function() {
        var billeditprice = $('#order-modal-price').val();
        if(billeditprice === '') {
            $('#modal-custome').modal('hide');
            modal.nobtn({
                ctx: 'body',
                ctn: '请输入订单出价',
                title: '广告管理'
            });
            return;
        } else {
            ajax.get({
                url: '/deal/order/updatePrice.do',
                param: {
                    customId: urler.normal().cid,
                    orderId: id,
                    price: parseInt(parseFloat(Number(billeditprice) * 100).toPrecision(12))
                },
                cb: function(data) {
                    $('#modal-custome').modal('hide');
                    if(data.data === true) {
                        modal.onebtn({
                            ctx: 'body',
                            ctn: '修改成功',
                            title: '广告管理',
                            event: function() {
                                location.reload();
                            }
                        });
                    } else {
                        modal.nobtn({
                            ctx: 'body',
                            ctn: '修改失败',
                            title: '广告管理'
                        });
                    }
                },
                modal: modal,
                title: '广告管理'
            });
        }
    })
});

// 勾选复选框将 id 推入缓存数组
$('body').on('change', '.order-checkbox', function() {
    var id = Number($(this).val());
    var arr = cache.get('delivery_ad_list_order_select');

    // 勾选勾选框，将 id 推入缓存数组
    if(this.checked) {
        arr.push(id);
        cache.set('delivery_ad_list_order_select', arr);
    }
});

// 批量启用
$('body').on('click', '#order-enable', function() {
    var tabFlag = 1;
    console.log(tabFlag);
    var selectList = cache.get('delivery_ad_list_order_select');

    // 当前没有选择订单
    if(selectList.length < 1) {
        modal.nobtn({
            ctx: 'body',
            ctn: '请选择订单',
            title: '广告管理'
        });
        return;
    }

    // 发送请求
    ajax.get({
        url: '/deal/order/start.do',
        param: {
            customId: urler.normal().cid,
            orderId: JSON.stringify(selectList).replace(/[\[\]]/g, '')
        },
        cb: function(data) {
            $('.nav-tabs li:eq(1) a').tab('show');
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '批量启用成功',
                    title: '广告管理',
                    event: function(cb) {
                        renderAdList();

                        // 关闭提示框
                        $('.modal-header').find('.close').click();
                    }
                });

                // 操作成功列表恢复原状
                $('[type="checkbox"]', $('#order')).prop('checked', false);
                cache.set('delivery_ad_list_order_select', []);
            } else {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '批量启用失败',
                    title: '广告管理',
                    event: function() {
                        location.reload();
                    }
                });
            }
        }
    });
});

// 批量停用
$('body').on('click', '#order-disable', function() {
    var selectList = cache.get('delivery_ad_list_order_select');

    // 当前没有选择订单
    if(selectList.length < 1) {
        modal.nobtn({
            ctx: 'body',
            ctn: '请选择订单',
            title: '广告管理'
        });
        return;
    }

    // 发送请求
    ajax.get({
        url: '/deal/order/stop.do',
        param: {
            customId: urler.normal().cid,
            orderId: JSON.stringify(selectList).replace(/[\[\]]/g, '')
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '批量停用成功',
                    title: '广告管理',
                    event: function() {
                        renderAdList();

                        // 关闭提示框
                        $('.modal-header').find('.close').click();
                    }
                });

                // 操作成功列表恢复原状
                $('[type="checkbox"]', $('#order')).prop('checked', false);
                cache.set('delivery_ad_list_order_select', []);

            } else {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '批量停用失败',
                    title: '广告管理',
                    event: function() {
                        location.reload();
                    }
                });
            }
        }
    });
});

// 单个启用
$('body').on('click', '.order-start', function() {
    var id = $(this).attr('data-id');

    // 发送请求
    ajax.get({
        url: '/deal/order/start.do',
        param: {
            customId: urler.normal().cid,
            orderId: id
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '启用成功',
                    title: '广告管理',
                    event: function() {
                        renderAdList();

                        // 关闭提示框
                        $('.modal-header').find('.close').click();
                    }
                });

            } else {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '启用失败',
                    title: '广告管理',
                    event: function() {
                        location.reload();
                    }
                });
            }
        }
    });
});

// 单个停用
$('body').on('click', '.order-stop', function() {
    var id = $(this).attr('data-id');

    // 发送请求
    ajax.get({
        url: '/deal/order/stop.do',
        param: {
            customId: urler.normal().cid,
            orderId: id
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '停用成功',
                    title: '广告管理',
                    event: function() {
                        renderAdList();

                        // 关闭提示框
                        $('.modal-header').find('.close').click();
                    }
                });

            } else {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '停用失败',
                    title: '广告管理',
                    event: function() {
                        renderAdList();

                        // 关闭提示框
                        $('.modal-header').find('.close').click();
                    }
                });
            }
        }
    });
});

// 批量修改日期
$('body').on('click', '#order-edit-date', function() {
    var selectList = cache.get('delivery_ad_list_order_select');

    // 当前没有选择订单
    if(selectList.length < 1) {
        modal.nobtn({
            ctx: 'body',
            ctn: '请选择订单',
            title: '广告管理'
        });
        return;
    }

    modal.custom({
        tpl: '#date-modal-tpl',
        data: {
            title: '批量修改日期'
        }
    });

    // 初始化弹出窗日期控件
    datePicker.init('#order-modal-datepicker');

    // 提交数据
    $('#order-modal-datepicker-submit')
        .unbind('click')
        .bind('click', function() {
            var date = datePicker.getVal('#order-modal-datepicker');

            ajax.get({
                url: '/deal/order/updateDate.do',
                param: {
                    customId: urler.normal().cid,
                    orderId: JSON.stringify(selectList).replace(/[\[\]]/g, ''),
                    date: date.start + '~' + date.end
                },
                cb: function(data) {

                    // 隐藏当前弹出框
                    $('#modal-custome').modal('hide');

                    if(data.data === true) {
                        modal.onebtn({
                            ctx: 'body',
                            ctn: '批量修改日期成功',
                            title: '广告管理',
                            event: function() {
                                renderAdList();

                                // 关闭提示框
                                $('.modal-header').find('.close').click();
                            }
                        });

                        // 操作成功列表恢复原状
                        $('[type="checkbox"]', $('#order')).prop('checked', false);
                        cache.set('delivery_ad_list_order_select', []);

                    } else {
                        modal.onebtn({
                            ctx: 'body',
                            ctn: '批量修改日期失败',
                            title: '广告管理',
                            event: function() {
                                renderAdList();

                                // 关闭提示框
                                $('.modal-header').find('.close').click();
                            }
                        });
                    }
                }
            });
        });
});

// 批量修改时间
$('body').on('click', '#order-edit-time', function() {
    var selectList = cache.get('delivery_ad_list_order_select');

    // 当前没有选择订单
    if(selectList.length < 1) {
        modal.nobtn({
            ctx: 'body',
            ctn: '请选择订单',
            title: '广告管理'
        });
        return;
    }

    modal.custom({
        tpl: '#time-modal-tpl',
        data: {
            title: '批量修改时间'
        }
    });

    // 初始化时间控件
    timer.init('#order-modal-timepicker-start');
    timer.init('#order-modal-timepicker-end');

    $('#order-modal-timepicker-submit')
        .unbind('click')
        .bind('click', function() {
            var start = timer.getTime('#order-modal-timepicker-start');
            var end = timer.getTime('#order-modal-timepicker-end') !== '00:00' ? timer.getTime('#time-end') : '24:00';

            ajax.get({
                url: '/deal/order/updateTime.do',
                param: {
                    customId: urler.normal().cid,
                    orderId: JSON.stringify(selectList).replace(/[\[\]]/g, ''),
                    time: start + '~' + end
                },
                cb: function(data) {

                    // 隐藏当前弹出框
                    $('#modal-custome').modal('hide');

                    if(data.data === true) {
                        modal.onebtn({
                            ctx: 'body',
                            ctn: '批量修改时间成功',
                            title: '广告管理',
                            event: function() {
                                renderAdList();

                                // 关闭提示框
                                $('.modal-header').find('.close').click();
                            }
                        });

                        // 操作成功列表恢复原状
                        $('[type="checkbox"]', $('#order')).prop('checked', false);
                        cache.set('delivery_ad_list_order_select', []);

                    } else {
                        modal.onebtn({
                            ctx: 'body',
                            ctn: '批量修改时间失败',
                            title: '广告管理',
                            event: function() {
                                 renderAdList();

                                // 关闭提示框
                                $('.modal-header').find('.close').click();
                            }
                        });
                    }
                }
            })
        });
});

// 批量修改出价
$('body').on('click', '#order-edit-money', function() {
    var selectList = cache.get('delivery_ad_list_order_select');

    // 当前没有选择订单
    if(selectList.length < 1) {
        modal.nobtn({
            ctx: 'body',
            ctn: '请选择订单',
            title: '广告管理'
        });
        return;
    }

    modal.custom({
        tpl: '#price-modal-tpl',
        data: {
            title: '批量修改出价'
        }
    });

    $('#order-modal-price-submit')
        .unbind('click')
        .bind('click', function() {
            var price = Number($('#order-modal-price').val());

            if(price <= 0) {

                // 隐藏当前弹出框
                $('#modal-custome').modal('hide');

                modal.nobtn({
                    ctx: 'body',
                    ctn: '出价必须为正数',
                    title: '广告管理'
                });
                return;
            }

            ajax.get({
                url: '/deal/order/updatePrice.do',
                param: {
                    customId: urler.normal().cid,
                    orderId: JSON.stringify(selectList).replace(/[\[\]]/g, ''),
                    price: parseInt(parseFloat(price * 100).toPrecision(12))
                },
                cb: function(data) {

                    // 隐藏当前弹出框
                    $('#modal-custome').modal('hide');

                    if(data.data === true) {
                        modal.onebtn({
                            ctx: 'body',
                            ctn: '批量修改出价成功',
                            title: '广告管理',
                            event: function() {
                                 renderAdList();

                                // 关闭提示框
                                $('.modal-header').find('.close').click();
                            }
                        });

                        // 操作成功列表恢复原状
                        $('[type="checkbox"]', $('#order')).prop('checked', false);
                        cache.set('delivery_ad_list_order_select', []);

                    } else {
                        modal.onebtn({
                            ctx: 'body',
                            ctn: '批量修改出价失败',
                            title: '广告管理',
                            event: function() {
                                 renderAdList();

                                // 关闭提示框
                                $('.modal-header').find('.close').click();
                            }
                        });
                    }
                }
            })
        });
});

// 批量删除
$('body').on('click', '#order-del', function() {
    var selectList = cache.get('delivery_ad_list_order_select');

    // 当前没有选择订单
    if(selectList.length < 1) {
        modal.nobtn({
            ctx: 'body',
            ctn: '请选择订单',
            title: '广告管理'
        });
        return;
    }
    modal.twobtn({
        ctx: 'body',
        ctn: '是否删除广告订单',
        title: '广告管理',
        btnOneText: '取消',
        btnOneClass: 'btn-default',
        eventOne: function(e) {
            e.stopPropagation();

            $('#modal-twobtn').modal('hide');

            // 操作成功列表恢复原状
            $('[type="checkbox"]', $('#order')).prop('checked', false);
            cache.set('delivery_ad_list_order_select', []);
        },
        eventTwo: function(e) {
            e.stopPropagation();

            // 发送请求
            ajax.get({
                url: '/deal/order/remove.do',
                param: {
                    customId: urler.normal().cid,
                    orderId: JSON.stringify(selectList).replace(/[\[\]]/g, '')
                },
                cb: function(data) {
                    $('#modal-twobtn').modal('hide');

                    if(data.data === true) {
                        modal.onebtn({
                            ctx: 'body',
                            ctn: '批量删除成功',
                            title: '广告管理',
                            event: function() {
                                renderAdList();

                                // 关闭提示框
                                $('.modal-header').find('.close').click();
                            }
                        });

                        // 操作成功列表恢复原状
                        $('[type="checkbox"]', $('#order')).prop('checked', false);
                        cache.set('delivery_ad_list_order_select', []);

                    } else {
                        modal.onebtn({
                            ctx: 'body',
                            ctn: '批量删除失败',
                            title: '广告管理',
                            event: function() {
                                renderAdList();

                                // 关闭提示框
                                $('.modal-header').find('.close').click();
                            }
                        });
                    }
                }
            });
        }
    });
});

// 搜索订单
$('body').on('click', '#order-search', function() {

    // 获取名称或 ID
    var keyword = $('#order-search-keyword').val();

    // 获取状态
    var status = select2.getVal({
        id: '#order-search-state'
    });

    // 获取日期
    var date = datePicker.getVal('#order-search-datepicker');

    // 发起请求
    ajax.get({
        url: '/deal/order/list.do',
        param: {
            customId: urler.normal().cid,
            startDate: date.start,
            endDate: date.end,
            status: status,
            keyword: keyword,
            page: 1,
            export: false
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                customId: urler.normal().cid,
                startDate: date.start,
                endDate: date.end,
                status: status,
                keyword: keyword,
                page: 1,
                export: false
            }));

            var tpl = $('#order-tpl').html();
            $('#order-list').html(_.template(tpl)(data));

            // 初始化链接
            urler.initLink();
        },
        modal: modal,
        title: '广告管理'
    });
});

// 下载订单
$('body').on('click', '#order-export', function() {

    // 获取名称或 ID
    var keyword = $('#order-search-keyword').val();

    // 获取状态
    var status = select2.getVal({
        id: '#order-search-state'
    });

    // 获取日期
    var date = datePicker.getVal('#order-search-datepicker');

    location.href = '/deal/order/list.do?export=true' +
        '&startDate=' + date.start +
        '&endDate=' + date.end +
        '&status=' + (status === null ? '' : status) +
        '&keyword=' + keyword +
        '&customId=' + urler.normal().cid;
});

// 全选当前页面订单
$('body').on('change', '#order-all-checkbox', function() {
    var selectList = cache.get('delivery_ad_list_order_select');

    if(this.checked) {
        $('.order-checkbox').each(function() {
            var id = Number($(this).val());

            // 1. 勾选界面中的所有勾选框
            $(this).prop('checked', true);

            // 2. 将 id 缓存到本地
            if(selectList.indexOf(id) === -1) {
                selectList.push(id);
            }
        });
        cache.set('delivery_ad_list_order_select', selectList);
    } else {
        $('.order-checkbox').each(function() {
            var id = Number($(this).val());

            // 1. 取消勾选界面中的所有勾选框
            $(this).prop('checked', false);

            // 2. 将 id 从本地缓存中移除
            if(selectList.indexOf(id) !== -1) {
                selectList.splice(selectList.indexOf(id), 1);
            }
        });
        cache.set('delivery_ad_list_order_select', selectList);
    }
});

// 渲染投放平台
// -----------------------------------------------------------------------------
renderList({
    url: '/deal/data/listPlatformDatas.do',
    listerParam: {
        page: 1,
        customId: urler.normal().cid,
        export: false
    },
    cb: function(data) {
        var tpl = $('#platform-tpl').html();
        $('#platform-list').html(_.template(tpl)(data));

        // 初始化广告组中的日期选择框
        datePicker.init('#platform-search-datepicker');

        // 初始化链接
        urler.initLink();
    }
}, $('#platform'));

// 搜索投放平台
$('body').on('click', '#platform-search', function() {

    // 获取日期
    var date = datePicker.getVal('#platform-search-datepicker');

    // 发起请求
    ajax.get({
        url: '/deal/data/listPlatformDatas.do',
        param: {
            customId: urler.normal().cid,
            startDate: date.start,
            endDate: date.end,
            page: 1,
            export: false
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                customId: urler.normal().cid,
                startDate: date.start,
                endDate: date.end,
                page: 1,
                export: false
            }));

            var tpl = $('#platform-tpl').html();
            $('#platform-list').html(_.template(tpl)(data));

            // 初始化广告组中的日期选择框
            datePicker.init('#platform-search-datepicker');
        },
        modal: modal,
        title: '广告管理'
    });
});

// 导出投放平台
$('body').on('click', '#platform-export', function() {

    // 获取日期
    var date = datePicker.getVal('#platform-search-datepicker');

    location.href = '/deal/data/listPlatformDatas.do?export=true' +
        '&startDate=' + date.start +
        '&endDate=' + date.end +
        '&customId=' + urler.normal().cid;
});


// 渲染投放主体
// -----------------------------------------------------------------------------
renderList({
    url: '/deal/data/listSubjectDatas.do',
    listerParam: {
        page: 1,
        customId: urler.normal().cid,
        export: false
    },
    cb: function(data) {
        var tpl = $('#subject-tpl').html();
        $('#subject-list').html(_.template(tpl)(data));

        // 初始化广告组中的日期选择框
        datePicker.init('#subject-search-datepicker');

        // 初始化链接
        urler.initLink();
    }
}, $('#subject'));

// 搜索投放主体
$('body').on('click', '#subject-search', function() {

    // 获取日期
    var date = datePicker.getVal('#subject-search-datepicker');

    // 发起请求
    ajax.get({
        url: '/deal/data/listSubjectDatas.do',
        param: {
            customId: urler.normal().cid,
            startDate: date.start,
            endDate: date.end,
            page: 1,
            export: false
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                customId: urler.normal().cid,
                startDate: date.start,
                endDate: date.end,
                page: 1,
                export: false
            }));
            var tpl = $('#subject-tpl').html();
            $('#subject-list').html(_.template(tpl)(data));

            // 初始化广告组中的日期选择框
            datePicker.init('#subject-search-datepicker');
        },
        modal: modal,
        title: '广告管理'
    });
});

// 导出投放主体
$('body').on('click', '#subject-export', function() {

    // 获取日期
    var date = datePicker.getVal('#subject-search-datepicker');

    location.href = '/deal/data/listSubjectDatas.do?export=true' +
        '&startDate=' + date.start +
        '&endDate=' + date.end +
        '&customId=' + urler.normal().cid;
});


/**
 * 封装初始化列表和初始化分页，简化代码
 * @param {Object} obj [调用初始化列表和分页传递的自定义数据]
 *
 * 参数 obj 格式
 * {
 *   url: '',
 *   listerParam: '',
 *   cb: function() {}
 * }
 */
function renderList(obj, $ctx) {

    // 获取数据
    lister({
        ajax: ajax,
        ajaxParam: {
            url: obj.url,
            param: obj.listerParam,
            title: '广告管理'
        },
        $btn: null,
        callback: function(data) {
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(obj.listerParam));
            obj.cb(data);
        }
    });

    // 分页
    pager(function(param, $this) {
        lister({
            ajax: ajax,
            ajaxParam: {
                url: obj.url,
                param: param,
                title: '广告管理'
            },
            $btn: $this,
            callback: function(data) {
                data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));
                obj.cb(data);
            }
        })
    }, $ctx);
}

function checkStatus(enable, checkboxVal) {

    // 检测启用中的停用
    if(enable) {
        var isPass = true;
        _.each(checkboxVal, function(val) {
            var checkbox = $('.table input[value="' + val + '"]');
            if(checkbox.attr('data-status') === '4') {
                isPass = false;
            }
        });
        return isPass;

    // 检测停用中的启用
    } else {
        var isPass = true;
        _.each(checkboxVal, function(val) {
            var checkbox = $('.table input[value="' + val + '"]');
            if(checkbox.attr('data-status') === '3') {
                isPass = false;
            }
        });
        return isPass;
    }
}
