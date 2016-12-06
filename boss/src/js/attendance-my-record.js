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
var cacheDatePlugin = null;
var cacheData = null;

// 初始化导航
auth.toolbar1({
    title: '我的记录'
});

getMyRecord('', function(data) {
    cacheData = data;

    // 填充左侧剩余假期数据
    $('#dayoff-remain').html(data.data.holidayRemain); // 剩余年假
    $('#holiday-remain').html(data.data.dayoffRemain); // 剩余调休

    renderCalendar(translateDataToEvent(data));
    var otherInfo = calcInfo($('#calendar').fullCalendar('getDate').format('YYYY-MM'), data.data.absences);

    $('#leaves').html(otherInfo.leaves); // 事假
    $('#absence').html(otherInfo.absence); // 旷工
    $('#vacation').html(otherInfo.vacation); // 年假
    $('#death').html(otherInfo.death); // 丧假
    $('#dayoff').html(otherInfo.dayoff); // 调休
    $('#wedding').html(otherInfo.wedding); // 婚假
    $('#sick').html(otherInfo.sick); // 病假
});

// 日历往前翻页
$('body').on('click', '.fc-prev-button', function() {
    var otherInfo = calcInfo($('#calendar').fullCalendar('getDate').format('YYYY-MM'), cacheData.data.absences);

    $('#leaves').html(otherInfo.leaves); // 事假
    $('#absence').html(otherInfo.absence); // 旷工
    $('#vacation').html(otherInfo.vacation); // 年假
    $('#dayoff').html(otherInfo.dayoff); // 调休
    $('#death').html(otherInfo.death); // 丧假
    $('#wedding').html(otherInfo.wedding); // 婚假
    $('#sick').html(otherInfo.sick); // 病假
});

// 日历往后翻页
$('body').on('click', '.fc-next-button', function() {
    var otherInfo = calcInfo($('#calendar').fullCalendar('getDate').format('YYYY-MM'), cacheData.data.absences);

    $('#leaves').html(otherInfo.leaves); // 事假
    $('#absence').html(otherInfo.absence); // 旷工
    $('#vacation').html(otherInfo.vacation); // 年假
    $('#dayoff').html(otherInfo.dayoff); // 调休
    $('#death').html(otherInfo.death); // 丧假
    $('#wedding').html(otherInfo.wedding); // 婚假
    $('#sick').html(otherInfo.sick); // 病假
});

/**
 * 根据月份获取我的考勤数据
 * @param {String} month [月份：2016-05]
 * @param {Function} cb [回调函数]
 */
function getMyRecord(month, cb) {
    ajax.get({
        url: '/admin/attendance/list_my.do',
        // param: {
        //     // month: month
        // },
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
        }
    });
}

/**
 * 将服务器返回的数据转换成日历上的事件
 * @param {Object} data [服务器返回的数据]
 */
function translateDataToEvent(data) {
    var absences = [];
    var leavesColor = '#f39c12'; // 请假
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
                title = '事假';
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
            title: title,
            start: new Date(year, month, date),
            backgroundColor: color,
            borderColor: color,
            days: val.days
        });
    });
    console.log(absences);
    return absences;
}

/**
 * 根据服务器传递过来的数据和用户选择的日期计算出出勤情况
 * @param {String} date [年月]
 * @param {Object} data [服务器返回的数据]
 */
function calcInfo(date, data) {
    var leaves = 0; // 事假
    var absence = 0; // 旷工
    var vacation = 0; // 年假
    var dayoff = 0; // 调休
    var sick = 0; // 病假
    var death = 0; // 丧假
    var wedding = 0; // 丧假

    _.each(data, function(val, index) {
        var _date = val.absenceDate.slice(0, -3);

        // 日期日期相同
        if(date === _date) {
            switch(val.type) {

                // 旷工
                case 1:
                    absence += val.days;
                    break;

                // 事假
                case 2:
                    leaves += val.days;
                    break;

                // 调休
                case 3:
                    dayoff += val.days;
                    break;

                // 年假
                case 4:
                    vacation += val.days;
                    break;

                // 病假
                case 5:
                    sick += val.days;
                    break;

                // 丧假
                case 6:
                    death += val.days;
                    break;

                // 婚假
                default:
                    wedding += val.days;
            }
        }
    });

    return {
        leaves: leaves,
        absence: absence,
        vacation: vacation,
        dayoff: dayoff,
        sick: sick,
        death: death,
        wedding: wedding
    };
}
