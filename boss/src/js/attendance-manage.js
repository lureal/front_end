/**
 * 考勤管理
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
    title: '考勤管理'
});

// 初始化组件
datePicker.initMonthDate('#datapicker');
select2.init({
    url: '/admin/attendance/depart_option.do',
    title: '考勤管理',
    cb: function(data) {
        var tpl = $('#type-tpl').html();
        $('#depart').html(_.template(tpl)(data));
        $('#depart').select2({
            placeholder: '选择部门'
        }).select2('val', '');
    }
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/attendance/list.do',
        param: {
            page: sessionStorage.getItem('manageTargetPage') !== null ? sessionStorage.getItem('manageTargetPage') : 1
        },
        title: '考勤管理'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#manage').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/attendance/list.do',
            param: param,
            title: '考勤管理'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#manage').html(_.template(tpl)(data));

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var manageTargetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('manageTargetPage', manageTargetPage);
        }
    });
}, $('#manage'));

// 搜索按钮
$('#search').click(function() {
    var date = datePicker.getMonthDateVal('#datapicker');
    var name = $('#name').val();
    var depart = select2.getVal({
        id: '#depart'
    });

    // 执行搜索
    ajax.get({
        url: '/admin/attendance/list.do',
        param: {
            month: date,
            departId: depart === 'clear' ? '' : depart,
            name: name,
            page: 1
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                month: date,
                departId: depart === 'clear' ? '' : depart,
                name: name,
                page: 1
            }));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#manage').html(_.template(tpl)(data));

        },
        modal: modal,
        title: '考勤管理'
    });
});

// 导出按钮
$('#export').click(function() {
    var date = datePicker.getMonthDateVal('#datapicker');
    var name = $('#name').val();
    var depart = select2.getVal({
        id: '#depart'
    });

    location.href = '/admin/attendance/export.do?departId=' + (depart === null ? '' : depart) +
        '&month=' + date +
        '&name=' + name;
});

// 增加调休天数
$('body').on('click', '.add-attendance', function() {
    var id = $(this).attr('data-id');
    $('#add-attendance-tpl').attr('data-id', id);

    modal.custom({
        tpl: '#add-attendance-tpl',
        data: {
            title: '考勤管理'
        }
    });
});

// 提交增加天数
$('body').on('click', '#add-modal-submit', function() {
    $("#add-modal-submit").attr("disabled", true);
    var days = Number($('#add-days').val());
    var memo = $('#add-memo').val();
    var id = $('#add-attendance-tpl').attr('data-id');

    if(days <= 0) {
        $('#modal-custome').modal('hide');
        modal.nobtn({
            ctx: 'body',
            ctn: '增加的天数必须大于 0 ',
            title: '增加天数'
        });
        return;
    }

    ajax.get({
        url: '/admin/attendance/add_dayoff.do',
        param: {
            userId: id,
            days: days,
            memo: memo
        },
        cb: function(data) {
            $("#add-modal-submit").attr("disabled", true);
            $('#modal-custome').modal('hide');
            if(data.data === true) {
                modal.onebtn({
                    title: '增加天数',
                    ctx: 'body',
                    ctn: '增加成功',
                    event: function() {
                        location.reload();
                    }
                });
            } else {
                modal.nobtn({
                    title: '增加天数',
                    ctx: 'body',
                    ctn: '增加失败'
                });
            }
        }
    });

});
