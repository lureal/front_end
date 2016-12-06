/*!
 * 广告组下订单
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
    title: '广告组下订单',
    active: 'ad'
});

// 初始化顶部栏
header.delivery({
    title: '广告组下订单'
});

// 点击 2 个按钮的弹窗清除复选框
$('#modal-twobtn').click(function() {

    // 操作成功列表恢复原状
    $('[type="checkbox"]', $('#group-bill-list')).prop('checked', false);
    cache.set('delivery_ad_list_order_select', []);
});

// 添加广告
$('body').on('click', '#create-ad', function() {

    // 跳转到添加广告步骤1
    cache.set('delivery_ad_add', {});
    urler.initLink('/#proj_name#/html/delivery/ad/step1.html');
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/deal/order/list.do',
        param: {
            page: 1,
            export: false,
            groupId: urler.normal().groupId,
            customId: urler.normal().cid
        },
        title: '广告组下订单'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1,
            export: false
        }));

        for(var i = 0; i < data.data.records.length; i++) {
            var val = data.data.records[i];
            val.posttime_str = time.unixToTime(val.posttime);
        }

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#group-bill-list').html(_.template(tpl)(data));

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
});

//30秒定时查询
function adGroupList() {

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
            groupId: urler.normal().groupId,
            status: status,
            keyword: keyword,
            page: 1,
            export: false
        },
        cb: function(data) {
            var tpl = $('#list-tpl').html();
            $('#group-bill-list').html(_.template(tpl)(data));

            // 初始化链接
            urler.initLink();
        },
        modal: modal,
        title: '广告组下订单'
    });
}
setInterval(adGroupList, 30000);

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/deal/order/list.do',
            param: param,
            title: '广告组下订单'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            for(var i = 0; i < data.data.records.length; i++) {
                var val = data.data.records[i];
                val.posttime_str = time.unixToTime(val.posttime);
            }

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#group-bill-list').html(_.template(tpl)(data));
        }
    });
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
    var selectList = cache.get('delivery_ad_list_order_select');

    // 当前没有选择订单
    if(selectList.length < 1) {
        modal.nobtn({
            ctx: 'body',
            ctn: '请选择订单',
            title: '广告组下订单'
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
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '批量启用成功',
                    title: '广告组下订单',
                    event: function() {
                        location.reload();
                    }
                });

                // 操作成功列表恢复原状
                $('[type="checkbox"]', $('#group-bill-list')).prop('checked', false);
                cache.set('delivery_ad_list_order_select', []);

            } else {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '批量启用失败',
                    title: '广告组下订单',
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
            title: '广告组下订单'
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
                    title: '广告组下订单',
                    event: function() {
                        location.reload();
                    }
                });

                // 操作成功列表恢复原状
                $('[type="checkbox"]', $('#group-bill-list')).prop('checked', false);
                cache.set('delivery_ad_list_order_select', []);

            } else {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '批量停用失败',
                    title: '广告组下订单',
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
                        location.reload();
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
                        location.reload();
                    }
                });

            } else {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '停用失败',
                    title: '广告管理',
                    event: function() {
                        location.reload();
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
            title: '广告组下订单'
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
                            title: '广告组下订单',
                            event: function() {
                                location.reload();
                            }
                        });

                        // 操作成功列表恢复原状
                        $('[type="checkbox"]', $('#group-bill-list')).prop('checked', false);
                        cache.set('delivery_ad_list_order_select', []);

                    } else {
                        modal.onebtn({
                            ctx: 'body',
                            ctn: '批量修改日期失败',
                            title: '广告组下订单',
                            event: function() {
                                location.reload();
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
            title: '广告组下订单'
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
            var end = timer.getTime('#order-modal-timepicker-end') !== '00:00' ? timer.getTime('#order-modal-timepicker-end') : '24:00';

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
                            title: '广告组下订单',
                            event: function() {
                                location.reload();
                            }
                        });

                        // 操作成功列表恢复原状
                        $('[type="checkbox"]', $('#group-bill-list')).prop('checked', false);
                        cache.set('delivery_ad_list_order_select', []);

                    } else {
                        modal.onebtn({
                            ctx: 'body',
                            ctn: '批量修改时间失败',
                            title: '广告组下订单',
                            event: function() {
                                location.reload();
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
            title: '广告组下订单'
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
                    title: '广告组下订单'
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
                            title: '广告组下订单',
                            event: function() {
                                location.reload();
                            }
                        });

                        // 操作成功列表恢复原状
                        $('[type="checkbox"]', $('#group-bill-list')).prop('checked', false);
                        cache.set('delivery_ad_list_order_select', []);

                    } else {
                        modal.onebtn({
                            ctx: 'body',
                            ctn: '批量修改出价失败',
                            title: '广告组下订单',
                            event: function() {
                                location.reload();
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
            title: '广告组下订单'
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
            $('[type="checkbox"]', $('#group-bill-list')).prop('checked', false);
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
                            title: '广告组下订单',
                            event: function() {
                                location.reload();
                            }
                        });

                        // 操作成功列表恢复原状
                        $('[type="checkbox"]', $('#group-bill-list')).prop('checked', false);
                        cache.set('delivery_ad_list_order_select', []);

                    } else {
                        modal.onebtn({
                            ctx: 'body',
                            ctn: '批量删除失败',
                            title: '广告组下订单',
                            event: function() {
                                location.reload();
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
            groupId: urler.normal().groupId,
            status: status,
            keyword: keyword,
            page: 1,
            export: false
        },
        cb: function(data) {
            var tpl = $('#list-tpl').html();
            $('#group-bill-list').html(_.template(tpl)(data));

            // 初始化链接
            urler.initLink();
        },
        modal: modal,
        title: '广告组下订单'
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

// 修改限额
$('body').on('click', '.group-edit-quota', function() {
    var $self = $(this);
    var id = $self.attr('data-id');
    var quota = $self.parents('.group-quota-wrap').find('.quota-input').val();

    if(quota === '') {
        modal.nobtn({
            ctx: 'body',
            ctn: '请输入组限额',
            title: '广告组下订单'
        });
        return;
    }

    // 提交修改数据
    ajax.get({
        url: '/deal/order/updateQuota.do',
        param: {
            customId: urler.normal().cid,
            orderId: id,
            quota: parseInt(parseFloat(Number(quota) * 100).toPrecision(12))
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '修改成功',
                    title: '广告组下订单',
                    event: function() {
                        location.reload();
                    }
                });
            } else {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '修改失败',
                    title: '广告组下订单',
                    event: function() {
                        location.reload();
                    }
                });
            }
        },
        modal: modal,
        title: '广告组下订单'
    });
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
