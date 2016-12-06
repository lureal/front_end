/**
 * 领用记录
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
    title: '领用记录'
});

// 初始化部门下拉框
select2.init({
    url: '/admin/asset/depart_option.do',
    title: '领用记录',
    cb: function(data) {
        var tpl = $('#type-tpl').html();
        $('#depart').html(_.template(tpl)(data));
        $('#depart').select2({
            placeholder: '选择部门'
        }).select2('val', '');
    }
});

// 初始化搜索条中的日期控件
datePicker.init('#datapicker');

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/asset/list_used.do',
        param: {
            page: sessionStorage.getItem('useTargetPage') !== null ? sessionStorage.getItem('useTargetPage') : 1
        },
        title: '领用记录'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#asset').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/asset/list_used.do',
            param: param,
            title: '领用记录'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#asset').html(_.template(tpl)(data));

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var targetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('useTargetPage', targetPage);
        }
    });
});

// 搜索按钮
$('#search').click(function() {
    var date = datePicker.getVal('#datapicker');
    var name = $('#name').val();
    var customer = $('#customer').val();
    var depart = select2.getVal({
        id: '#depart'
    });

    // 执行搜索
    ajax.get({
        url: '/admin/asset/list_used.do',
        param: {
            startdate: date.start,
            enddate: date.end,
            departId: depart === 'clear' ? '' : depart,
            custName: customer,
            name: name,
            page: 1
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                startdate: date.start,
                enddate: date.end,
                departId: depart === 'clear' ? '' : depart,
                custName: customer,
                page: 1
            }));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#asset').html(_.template(tpl)(data));

        },
        modal: modal,
        title: '领用记录'
    });

});


// 导出按钮
$('#export').click(function() {
    var date = datePicker.getVal('#datapicker');
    var name = $('#name').val();
    var customer = $('#customer').val();
    var depart = select2.getVal({
        id: '#depart'
    });

    location.href = '/admin/asset/export_used.do?departId=' + (depart === null ? '' : depart) +
        '&startdate=' + date.start + '&enddate=' + date.end +
        '&custName=' + customer +
        '&name=' + name;

});

// 删除领用记录
$('body').on('click', '.delete', function() {
    var id = $(this).attr('data-id');
    modal.twobtn({
        ctx: 'body',
        ctn: '是否删除领用记录？',
        title: '领用记录',
        btnOneText: '取消',
        btnOneClass: 'btn-default',
        eventOne: function() {
            $('#modal-twobtn').modal('hide');
        },
        eventTwo: function() {
            $('#modal-twobtn').modal('hide');
            ajax.post({
                url: '/admin/asset/delete_use.do',
                param: {
                    id: id
                },
                cb: function(data) {
                    if(data.data === true) {
                        modal.onebtn({
                            ctx: 'body',
                            title: '领用记录',
                            ctn: '删除成功',
                            event: function() {
                                location.reload();
                            }
                        });
                    } else {
                        modal.nobtn({
                            ctx: 'body',
                            title: '领用记录',
                            ctn: data.message
                        });
                    }
                }
            });
        }
    });
});
