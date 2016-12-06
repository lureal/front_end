/*!
 * 环评，管理模块
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var time = require('./modules/time.js');
auth.toolbar1({
    title: '环评管理'
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/grade/list.do',
        param: {
            page: sessionStorage.getItem('scoreManTargetPage') !== null ? sessionStorage.getItem('scoreManTargetPage') : 1
        },
        title: '环评管理'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        // 渲染模板
        var tpl = $('#manage-table-tpl').html();
        $('#manage-table').html(_.template(tpl)(data));

        // 查看未评分的主管、部分
        ajax.get({
            url: '/admin/grade/list_not_grade.do',
            cb: function(data) {
                unGradeList = data.data.cycleGrade;
                unDepartList = data.data.mgrGrade;
                console.log(data.data.cycleGrade.length);

                // 查看未评分主管、未评分部分
                $('body').on('click', '.unsubmit', function() {
                    modal.custom({
                        tpl: '#modal-tpl',
                        data: {
                            unGrade: unGradeList.length === 0 ? '无': unGradeList,
                            unDepart: unDepartList.length === 0 ? '无':unDepartList
                         }
                    });
                });
            }
        });
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/grade/list.do',
            param: param,
            title: '环评管理'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#manage-table-tpl').html();
            $('#manage-table').html(_.template(tpl)(data));

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var targetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('scoreManTargetPage', targetPage);
        }
    });
});

//初始化季度日期,用户列表选择
select2.init({
    url: '/admin/grade/quarter_option.do',
    title: '季度选择',
    cb: function(data) {
        var tpl = $('#quarter-tpl').html();
        $('#quarter').html(_.template(tpl)(data));
        $('#quarter').select2({
            placeholder: '季度选择'
        }).select2('val', '');
    }
});

//初始化部门
select2.init({
    url: '/admin/grade/depart_option.do',
    title: '部门选择',
    cb: function(data) {
        var tpl = $('#department-tpl').html();
        $('#department').html(_.template(tpl)(data));
        $('#department').select2({
            placeholder: '部门选择'
        }).select2('val', '');
    }
});

$('#search').on('click', function(data) {
    var dateDate = $('#quarter').val();
    var departId  = $('#department').val();
    ajax.get({
        url: '/admin/grade/list.do',
        param: {
            dateDate: dateDate,
            departId: departId,
            page: 1
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                dateDate: dateDate,
                departId: departId,
                page: 1
            }));

            // 渲染模板
            var tpl = $('#manage-table-tpl').html();
            $('#manage-table').html(_.template(tpl)(data));
        },
        modal: modal,
        title: '环评管理'
    });
});

// 导出按钮
$('#export').click(function() {
    var dateDate = $('#quarter').val();
    var departId  = $('#department').val();
    if(dateDate === null || departId === null) {
        modal.nobtn({
            ctx: 'body',
            ctn: '请选择季度、部门参数',
            title: '环评管理',
        });
        return;
    }
    location.href = '/admin/grade/export.do?dateDate =' + dateDate + '&departId=' + departId;
});
