/**
 * 我的记录
 */
var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var time = require('./modules/time.js');
var urler = require('./modules/urler.js');
var cacheDatePlugin = null;

// 初始化导航
auth.toolbar1({
    title: '修改考勤'
});

getMyRecord(urler.normal().month, function(data) {
    renderCalendar(translateDataToEvent(data));

    // 如果 url 后面跟有 jump_month 则跳转到特定月份
    if(urler.normal().jump_month) {
        $('#calendar').fullCalendar( 'gotoDate', urler.normal().jump_month);
    }

    // 渲染页面具体某个人操作
    var _nameData = decodeURI(urler.normal().name);
    $('#edit-name').html(_nameData);
});

/**
 * 根据月份获取我的考勤数据
 * @param {String} month [月份：2016-05]
 * @param {Function} cb [回调函数]
 */
function getMyRecord(month, cb) {
    ajax.get({
        url: '/admin/attendance/detail.do',
        param: {
            month: month,
            userId: urler.normal().id
        },
        cb: cb
    })
}

/**
 * 渲染记录
 * @param {Object} data [数据]
 */
function renderCalendar(event) {
    cacheDatePlugin = $('#calendar').fullCalendar({
        lang: 'zh-CN',
        events: event,
        eventAfterRender: function(event, element, view) {
            if(event.days === 0.5) {
                $(element).css('width', '50%');
            }
        },
        dayClick: function(date) {

            // 获得所有事件
            var events = $('#calendar').fullCalendar('clientEvents');
            var haveEvent = false;
            var calEvent = null;
            var today = moment(date).format('YYYY-MM-DD');

            _.each(events, function(val) {
                if(moment(val.start).format('YYYY-MM-DD') === today) {
                    haveEvent = true;
                    calEvent = val;
                }
            });

            // 当前有事件
            if(haveEvent) {
                modal.custom({
                    tpl: '#select-modal-tpl',
                    data: {
                        title: '修改考勤',
                        edit: 'inline-block',
                        add: 'none',
                        del: 'inline-block'
                    }
                });

                $('#modal-tpl').attr('data-type', '0');
                $('#modal-tpl').attr('data-id', calEvent.id);
                $('#modal-tpl').attr('data-datetype', calEvent.type);
                $('#modal-tpl').attr('data-memo', calEvent.memo);
                $('#modal-tpl').attr('data-days', calEvent.days);

                return;

            // 当前没有事件
            } else {
                modal.custom({
                    tpl: '#select-modal-tpl',
                    data: {
                        title: '修改考勤',
                        edit: 'none',
                        add: 'inline-block',
                        del: 'none'
                    }
                });

                $('#modal-tpl').attr('data-type', '1');
                $('#modal-tpl').attr('data-today', today);

                return;
            }

        }
    });
}

// 修改考勤
$('body').on('click', '#edit-date', function() {
    modal.custom({
        tpl: '#modal-tpl',
        data: {
            title: '修改考勤'
        }
    });

    var id = $('#modal-tpl').attr('data-id');
    var dateType = Number($('#modal-tpl').attr('data-dateType'));
    var days = $('#modal-tpl').attr('data-days');
    var memo = $('#modal-tpl').attr('data-memo');

    select2.init({
        url: '/admin/attendance/type_option.do',
        title: '修改考勤',
        cb: function(data) {
            var tpl = $('#type-tpl').html();
            $('#attendance-type').html(_.template(tpl)(data));
            $('#attendance-type').select2({
                placeholder: '选择缺勤类型'
            }).select2('val', dateType);
        }
    });

    select2.init({
        url: '/admin/attendance/day_option.do',
        title: '天数',
        cb: function(data) {
            var tpl = $('#attentance-day-tpl').html();
            $('#days').html(_.template(tpl)(data));
            $('#days').select2({
                placeholder: '天数'
            }).select2('val', days);
        }
    });
    $('#days').val(days);
    $('#memo').val(memo);

    $('#modal-submit').unbind('click').bind('click', function() {
        $("#modal-submit").attr("disabled", true);
        var type = select2.getVal({
            id: '#attendance-type'
        });
        var days = Number($('#days').val());
        var memo = $('#memo').val();

        if(type === null || !(days === 0.5 || days === 1)) {
            $('#modal-custome').modal('hide');
            modal.nobtn({
                ctx: 'body',
                ctn: '缺勤类型为必选项，缺勤天数只能输入 0.5 或 1',
                title: '修改考勤'
            });
            return;
        }

        ajax.get({
            url: '/admin/attendance/update.do',
            param: {
                id: id,
                type: type,
                days: days,
                memo: memo
            },
            cb: function(data) {
                $('#modal-custome').modal('hide');
                $("#modal-submit").attr("disabled", false);
                if(data.data === true) {
                    modal.onebtn({
                        ctx: 'body',
                        ctn: '修改成功',
                        title: '修改考勤',
                        event: function() {
                            location.href = '/#proj_name#/attendance/edit?id=' + urler.normal().id +
                                '&month=' + urler.normal().month + '&name=' + urler.normal().name +
                                '&jump_month=' + $('#calendar').fullCalendar('getDate').format('YYYY-MM');
                        }
                    });
                } else {
                    modal.nobtn({
                        ctx: 'body',
                        ctn: data.message !== null ? data.message : '修改失败',
                        title: '修改考勤'
                    });
                }
            }
        })
    });

});

// 添加考勤
$('body').on('click', '#add-date', function() {
    modal.custom({
        tpl: '#modal-tpl',
        data: {
            title: '添加考勤'
        }
    });

    var today = $('#modal-tpl').attr('data-today');
    select2.init({
        url: '/admin/attendance/type_option.do',
        title: '修改考勤',
        cb: function(data) {
            var tpl = $('#type-tpl').html();
            $('#attendance-type').html(_.template(tpl)(data));
            $('#attendance-type').select2({
                placeholder: '选择缺勤类型'
            }).select2('val', '');
        }
    });

    select2.init({
        url: '/admin/attendance/day_option.do',
        title: '天数',
        cb: function(data) {
            var tpl = $('#attentance-day-tpl').html();
            $('#days').html(_.template(tpl)(data));
            $('#days').select2({
                placeholder: '天数'
            }).select2('val', '');
        }
    });

    var liColor = {
        '旷工': '#00a65a',
        '事假': '#f39c12',
        '年假': '#FFC107',
        '婚假': '#F44336',
        '丧假': '#9E9E9E',
        '调休': '#00c0ef',
        '病假': '#009688'
    };

    // 给select2 option 背景添加颜色
    $('body').on('click', '#select2-attendance-type-container', function() {
        $('.select2-results__options li').each(function() {
            for(i in liColor) {
                if($(this).html() == i) {
                    $(this).css('background', liColor[i]);
                }
            } 
        });
    });

    $('#modal-submit').unbind('click').bind('click', function() {
        $("#modal-submit").attr("disabled", true);
        var type = select2.getVal({
            id: '#attendance-type'
        });
        var days = Number($('#days').val());
        var memo = $('#memo').val();

        if(type === null || !(days === 0.5 || days === 1)) {
            $('#modal-custome').modal('hide');
            modal.nobtn({
                ctx: 'body',
                ctn: '缺勤类型为必选项，缺勤天数只能输入 0.5 或 1',
                title: '添加考勤'
            });
            return;
        }

        ajax.get({
            url: '/admin/attendance/add.do',
            param: {
                date: today,
                userId: urler.normal().id,
                type: type,
                days: days,
                memo: memo
            },
            cb: function(data) {
                $('#modal-custome').modal('hide');
                $("#modal-submit").attr("disabled", false);
                if(data.data === true) {
                    modal.onebtn({
                        ctx: 'body',
                        ctn: '添加成功',
                        title: '添加考勤',
                        event: function() {
                            location.href = '/#proj_name#/attendance/edit?id=' + urler.normal().id +
                                '&month=' + urler.normal().month + '&name=' + urler.normal().name +
                                '&jump_month=' + $('#calendar').fullCalendar('getDate').format('YYYY-MM');
                        }
                    });
                } else {
                    modal.nobtn({
                        ctx: 'body',
                        ctn: data.message !== null ? data.message : '添加失败',
                        title: '添加考勤'
                    });
                }
            }
        })
    });


});

// 删除考勤
$('body').on('click', '#del-date', function() {
    var id = $('#modal-tpl').attr('data-id');
    ajax.get({
        url: '/admin/attendance/delete.do',
        param: {
            id: id
        },
        cb: function(data) {
            $('#modal-custome').modal('hide');
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '删除成功',
                    title: '删除考勤',
                    event: function() {
                        location.reload();
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    ctn: data.message !== null ? data.message : '删除失败',
                    title: '删除考勤'
                });
            }
        }
    });
});

/**
 * 将服务器返回的数据转换成日历上的事件
 * @param {Object} data [服务器返回的数据]
 */
function translateDataToEvent(data) {
    var absences = [];
    var leavesColor = '#f39c12'; // 事假
    var absenceColor = '#00a65a'; // 旷工
    var dayoffColor = '#00c0ef'; // 调休
    var vacationColor = '#FFC107'; // 年假
    var funeralColor = '#9E9E9E'; //丧假
    var marriageColor = '#F44336'; // 婚假
    var sickColor = '#009688'; //病假

    _.each(data.data.absences, function(val, index) {
        var title = '';
        var color = '';
        var year = Number(val.absenceDate.split('-')[0]);
        var month = Number(val.absenceDate.split('-')[1]) - 1;
        var date = Number(val.absenceDate.split('-')[2]);

        switch(val.type) {
            case 1:
                title = '旷工';
                color = absenceColor;
                break;
            case 2:
                title = '请假';
                color = leavesColor;
                break;
            case 3:
                title = '调休';
                color = dayoffColor;
                break;
            case 4:
                title = '年假';
                color = vacationColor;
                break;
            case 5:
                title = '病假';
                color = sickColor;
                break;
            case 6:
                title = '丧假';
                color = funeralColor;
                break;
            default:
                title = '婚假';
                color = marriageColor;
        }

        switch(val.days) {
            case 0.5:
                title += '半天';
                break;
            default:
                title += '1天';
        }

        absences.push({
            id: val.id,
            title: title,
            start: new Date(year, month, date),
            backgroundColor: color,
            borderColor: color,
            days: val.days,
            type: val.type,
            memo: val.memo
        });
    });
    console.log(absences);
    return absences;
}
