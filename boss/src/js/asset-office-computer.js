/**
 * 办公电脑
 */
var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var time = require('./modules/time.js');

// 初始化导航
auth.toolbar1({
    title: '办公电脑'
});

// 初始化设备列表（设备）
select2.init({
    url: '/admin/device/computer_status_option.do',
    title: '设备列表',
    cb: function(_data) {
        var tpl = $('#computer-device-tpl').html();
        $('#computer-device').html(_.template(tpl)(_data));
        $('#computer-device').select2({
            placeholder: '选择设备列表'
        }).select2('val', '');
    }
});

// 初始化设备列表(电脑)
select2.init({
    url: '/admin/device/computer_status_option.do',
    title: '设备列表',
    cb: function(_data) {
        var tpl = $('#computer-device-tpl').html();
        $('#computer-allot').html(_.template(tpl)(_data));
        $('#computer-allot').select2({
            placeholder: '选择设备列表'
        }).select2('val', '');


    }
});

// 加载设备
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/device/list_allot.do',
        param: {
            page: sessionStorage.getItem('computerTargetPage') !== null ? sessionStorage.getItem('computerTargetPage') : 1
        },
        title: '办公设备'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        // 渲染模板
        var tpl = $('#device-tpl').html();
        $('#device').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/device/list_allot.do',
            param: param,
            title: '办公电脑'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#device-tpl').html();
            $('#device').html(_.template(tpl)(data));

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var targetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('computerTargetPage', targetPage);
        }
    });
});

// 加载电脑
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/device/list_computer.do',
        param: {
            page: sessionStorage.getItem('deviceTargetPage') !== null ? sessionStorage.getItem('deviceTargetPage') : 1
        },
        title: '办公电脑'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        // 渲染模板
        var tpl = $('#computer-tpl').html();
        $('#computer').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/device/list_computer.do',
            param: param,
            title: '办公电脑'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#computer-tpl').html();
            $('#computer').html(_.template(tpl)(data));

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var deviceTargetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('deviceTargetPage', deviceTargetPage);
        }
    });
});

$('.nav').find('li > a').on('shown.bs.tab', function() {
    var tabFlag = $(this).attr('data-tab');
    localStorage.setItem('tabFlag', tabFlag);
    console.log(localStorage.getItem('tabFlag'));
});

// 从本地存储中取值，默认没有值的话，则显示第一个tab页面
var tabFlag = localStorage.getItem('tabFlag');
if(tabFlag === 'computer') {
    $('.nav-tabs li:eq(1) a').tab('show');
} else {
    $('.nav-tabs li:eq(0) a').tab('show');
}

// 设备搜索按钮
$('#device-search').click(function() {
    var username = $('#name').val();
    var allotType  = select2.getVal({
        id: '#computer-device'
    });

    ajax.get({
        url: '/admin/device/list_allot.do',
        param: {
            username: username,
            allotType: allotType === 'clear' ? '' : allotType,
            page: 1
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                username: username,
                allotType: allotType === 'clear' ? '' : allotType,
                page: 1
            }));

            // 渲染模板
            var tpl = $('#device-tpl').html();
            $('#device').html(_.template(tpl)(data));
        },
        modal: modal,
        title: '办公电脑'
    });
});

// 电脑搜索按钮
$('#computer-search').click(function() {
    var number = $('#number').val();
    var status = select2.getVal({
        id: '#computer-allot'
    });


    ajax.get({
        url: '/admin/device/list_computer.do',
        param: {
            number: number,
            status: status === 'clear' ? '' : status,
            page: 1
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                number: number,
                status:  status === 'clear' ? '' : status,
                page: 1
            }));

            // 渲染模板
            var tpl = $('#computer-tpl').html();
            $('#computer').html(_.template(tpl)(data));
        },
        modal: modal,
        title: '办公电脑'
    });
});

// 导出
$('#export').click(function() {
    // var name = $.trim($('#name').val());
    location.href = '/admin/device/export_allot.do';
});

$('#download').click(function() {
    location.href = '/admin/device/download.do';
});

// 删除
$('body').on('click', '#computer-delete', function() {
    var id = $(this).attr('data-id');
    modal.twobtn({
        ctx: 'body',
        ctn: '是否删除电脑明细？',
        title: '电脑明细',
        btnOneText: '取消',
        btnOneClass: 'btn-default',
        eventOne: function() {
            $('#modal-twobtn').modal('hide');
        },
        eventTwo: function() {
            $('#modal-twobtn').modal('hide');
            ajax.post({
                url: '/admin/device/del_computer.do',
                param: {
                    id: id
                },
                cb: function(data) {
                    if(data.data === true) {
                        modal.onebtn({
                            ctx: 'body',
                            title: '删除电脑明细',
                            ctn: '删除成功',
                            event: function() {
                                location.reload();
                            }
                        });
                    } else {
                        modal.nobtn({
                            ctx: 'body',
                            title: '删除电脑明细',
                            ctn: data.message
                        });
                    }
                }
            });
        }
    });
});

