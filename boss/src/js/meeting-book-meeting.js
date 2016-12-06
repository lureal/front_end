/*!
 * 会议室预定
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var time = require('./modules/time.js');
var timer = require('./modules/time-picker.js');
var mettingLength;
var roomIndex = 0;
var cacheDatePlugin = null;
auth.toolbar1({
    title: '会议室预定'
});
//

// 获取服务器数据
ajax.get({
    url: '/admin/meetingroom/list.do',
    cb: function(data) {

        // 渲染数据
        var tpl = $('#meeting-tpl').html();
        $('#meeting').html(_.template(tpl)(data));
        setTimeout(function() {
            renderCalendar(translateDateToEvent(data, 0), 0);
            renderCalendar(translateDateToEvent(data, 1), 1);
            renderCalendar(translateDateToEvent(data, 2), 2);
            renderCalendar(translateDateToEvent(data, 3), 3);
            renderCalendar(translateDateToEvent(data, 4), 4);
        }, 0);

        $('#meeting-room0').find('.fc-agendaWeek-button').click();
        $('#meeting-room1').find('.fc-agendaWeek-button').click();
        $('#meeting-room2').find('.fc-agendaWeek-button').click();
        $('#meeting-room3').find('.fc-agendaWeek-button').click();
        $('#meeting-room4').find('.fc-agendaWeek-button').click();
        
        // 利用tab的钩子事件，点击页面上的week按钮，显示页面
        $('.nav').find('li > a').on('shown.bs.tab', function() {
            switch ($(this).attr('data-index')) {
                case '0':
                    $('#meeting-room0').find('.fc-agendaWeek-button').click();
                    break;
                case '1':
                    $('#meeting-room1').find('.fc-agendaWeek-button').click();
                    break;
                case '2':
                    $('#meeting-room2').find('.fc-agendaWeek-button').click();
                    break;
                case '3':
                    $('#meeting-room3').find('.fc-agendaWeek-button').click();
                    break;
                default:
                    $('#meeting-room4').find('.fc-agendaWeek-button').click();
            }

            // 将roomIndex的值，存储到localStorage里，目的是：当页面刷新时，保证页面不返回到第一页
            roomIndex = $(this).attr('data-index');
            localStorage.setItem('tabFlag', roomIndex);

            // 依次切换tab页面，点击编辑会议室通告，从本地存储中得到的值
            $('body').on('click', '#edit'+(localStorage.getItem('tabFlag')), function() {
                var id = $(this).attr('data-id');
                modal.custom({
                    tpl: '#edit-modal-tpl',
                    data: {
                        title: '编辑预约会议室通告'
                    }
                });
                $('.edit-notice').val(data.data.meetingRooms[localStorage.getItem('tabFlag')].notice);

                // 更改会议室声明，发送请求
                $('body').on('click', '#edit-modal-submit', function() {
                    $("#edit-modal-submit").attr("disabled", true);
                    var notice = $('#edit-notice').val();
                    ajax.get({
                        url: '/admin/meetingroom/update_notice.do',
                        param: {
                            id: id,
                            notice: notice
                        },
                        cb: function(data) {
                            $("#edit-modal-submit").attr("disabled", false);
                            $('#modal-custome').modal('hide');
                            if(data.data === true) {
                                modal.onebtn({
                                    ctx: 'body',
                                    ctn: '修改成功',
                                    title: '会议室公告',
                                    event: function() {
                                        location.reload();
                                    }
                                });
                            } else {
                                modal.nobtn({
                                    ctx: 'body',
                                    ctn: data.message ? data.message : '修改失败',
                                    title: '会议室公告'
                                });
                            }
                        }
                    });
                })
            });
        });

        // 刷新页面时（当依次点击切换的过程中，这个代码只执行了一次），点击编辑会议室通告，从本地存储中得到的值
        $('body').on('click', '#edit'+(localStorage.getItem('tabFlag') !== null ? localStorage.getItem('tabFlag') : '0' ), function() {
            var id = $(this).attr('data-id');
            modal.custom({
                tpl: '#edit-modal-tpl',
                data: {
                    title: '编辑预约会议室通告'
                }
            });
            $('.edit-notice').val(data.data.meetingRooms[localStorage.getItem('tabFlag') !== null ? localStorage.getItem('tabFlag') : '0' ].notice);

            // 更改会议室声明，发送请求
            $('body').on('click', '#edit-modal-submit', function() {
                $("#edit-modal-submit").attr("disabled", true);
                var notice = $('#edit-notice').val();
                ajax.get({
                    url: '/admin/meetingroom/update_notice.do',
                    param: {
                        id: id,
                        notice: notice
                    },
                    cb: function(data) {
                        $("#edit-modal-submit").attr("disabled", false);
                        $('#modal-custome').modal('hide');
                        if(data.data === true) {
                            modal.onebtn({
                                ctx: 'body',
                                ctn: '修改成功',
                                title: '会议室公告',
                                event: function() {
                                    location.reload();
                                }
                            });
                        } else {
                            modal.nobtn({
                                ctx: 'body',
                                ctn: data.message ? data.message : '修改失败',
                                title: '会议室公告'
                            });
                        }
                    }
                });
            })
        });

        // 从本地存储中取值，默认没有值的话，则显示第一个tab页面
        var tabFlag = localStorage.getItem('tabFlag');
        if(tabFlag === '1') {
            $('.nav-tabs li:eq(1) a').tab('show');
        } else if(tabFlag === '2') {
            $('.nav-tabs li:eq(2) a').tab('show');
        } else if(tabFlag === '3') {
            $('.nav-tabs li:eq(3) a').tab('show');
        } else if(tabFlag === '4') {
            $('.nav-tabs li:eq(4) a').tab('show');
        }  else {
            $('.nav-tabs li:eq(0) a').tab('show');
        }
    }
});


// ---------------------------------------------------------------------
/**
 * 渲染日历
 * @param {object} data[数据]
*/
function renderCalendar(event, roomIndex) {
	cacheDatePlugin = $('#meeting-room'+ roomIndex).fullCalendar({
        header: {
            right: 'prev, next today',
            center: 'title',
            left: 'agendaWeek'
        },
        lang: 'zh-CN',
        events: event,
        defaultView: 'agendaWeek',
        minTime: '08:00:00',
        maxTime: '19:00:00',
        firstHour: 8,
        timezone: 'local',
        allDaySlot: false, // 是否显示全天
        editable: false,
        droppable: false,
        slotEventOverlap: false, // 视图上的时间是否可以重复覆盖
        eventAfterRender: function(event, element, view) {
        },
        eventClick: function(calEvent, jsEvent, event) {
            var date = new Date();
            var d = date.getDate(),
                m = date.getMonth(),
                h = date.getHours(),
                day = date.getDate();
                minute = date.getMinutes();
                y = date.getFullYear();

            console.log(calEvent._start._d);


            // 获取当前事件开始时间(年月日)
            var theDate  = moment(date).format('YYYY-MM-DD');
            var startEvent = moment(calEvent._start._d).format('YYYY-MM-DD');

            // 获取当前事件开始时间（小时）
            var hourEvent = moment(calEvent._start._d).format().substring(11, 16);

            // 获取当前时间（小时）
            var curHour = moment(date).format().substring(11, 16);

            // 真不容易，打俩个时间，没累死我
            if (startEvent < theDate) {
                modal.nobtn({
                    ctx: 'body',
                    title: '预定会议室',
                    ctn: '已经过了预定时间'
                });
                return;
            }
            if(startEvent === theDate) {
                if(hourEvent < curHour) {
                    modal.nobtn({
                        ctx: 'body',
                        title: '预定会议室',
                        ctn: '已经过了预定时间'
                    });
                    return;
                }
            }

            // 删除会议室操作
            modal.twobtn({
	            ctx: 'body',
	            ctn: '是否删除预定？',
	            title: '预定会议室',
	            btnOneText: '取消',
	            btnOneClass: 'btn-default',
	            eventOne: function() {
	                $('#modal-twobtn').modal('hide');
	            },
	            eventTwo: function() {
	                $('#modal-twobtn').modal('hide');
	                ajax.post({
	                    url: '/admin/schedule/delete.do',
	                    param: {
	                        id: calEvent.id
	                    },
	                    cb: function(data) {
	                        if(data.data === true) {
	                            modal.onebtn({
	                                ctx: 'body',
	                                title: '预定会议室',
	                                ctn: '删除成功',
	                                event: function() {
	                                    location.reload();
	                                }
	                            });
	                        } else {
	                            modal.nobtn({
	                                ctx: 'body',
	                                title: '预定会议室',
	                                ctn: data.message
	                            });
	                        }
	                    }
	                });
	            }
        	});
    	},
	    dayClick: function(date) {
	        var roomId = $(this).parents('.tab-content').find('.active').attr('data-roomid');
	        localStorage.setItem('roomId', roomId);
	        var calEvent = null;

            // 获取当前事件开始时间（小时）
            var eventHour = moment(date._d).format().substring(11, 16);

	        // 获取当前所有事件
	        var events = $('#meeting-calendar0').fullCalendar('clientEvents');
            var nowDate = new Date();
	        var today = moment(nowDate).format('YYYY-MM-DD HH:mm');
            console.log(today);

            // 获取点击当前的事件时间
            var curEventTime = moment(date._d).format('YYYY-MM-DD HH:mm');
            console.log(curEventTime);

            // 如果点击事件的时间小于今天，则出现弹框
            if(curEventTime < today) {
                modal.nobtn({
                    ctx: 'body',
                    ctn: '请在有效的时间预约会议室',
                    title: '预约会议室'
                });
                return;
            }
	        modal.custom({
		        tpl: '#modal-tpl',
		        data: {
		            title: '添加预约会议室'
		        }
    		});

	        // 将当前选框的日期绑定在tpl上
	        $('#modal-tpl').attr('data-today', today);

            // 初始化会议室弹框的时间值
	        $('#time-start').timepicker({
		        showInputs: false,
		        timeFormat: 'H:i',
		        showMeridian: false,
		        minuteStep :30
		    });
		    $('#time-end').timepicker({
		        showInputs: false,
		        timeFormat: 'H:i',
		        showMeridian: false,
		        minuteStep :30
		    });

            // 初始化时间控件， 获得当前点击的时间
            $('#time-start').val(eventHour);
            $('#time-end').val(eventHour);

            // 提交会议室
		    $('#modal-submit').unbind('click').bind('click', function() {
                $("#modal-submit").attr("disabled", true);
		        var start = $('#time-start').val();
		        var today = $('#modal-tpl').attr('data-today');
		        var end = $('#time-end').val();

                 // 取开始时间的小时进行判断
                var startHour = start.split(':')[0];
                var endHour = end.split(':')[0];
		        var startTime = moment(date._d).format('YYYY-MM-DD') + ' ' + start+ ':00';
		        var endTime = moment(date._d).format('YYYY-MM-DD') +' ' + end+ ':00';

                // 对提交的时间进行验证
		        if(startTime === null  || startHour < 8  || endHour < 8 ||  endTime === null ) {
		            $('#modal-custome').modal('hide');
		            modal.nobtn({
		                ctx: 'body',
		                ctn: '请在工作时间预约会议室',
		                title: '预约会议室'
		            });
		            return;
		        }
                if(startHour > endHour) {
                    $('#modal-custome').modal('hide');
                    modal.nobtn({
                        ctx: 'body',
                        ctn: '请正确选择会议时间，会议开始时间需小于结束时间',
                        title: '预约会议室'
                    });
                    return;
                }
		        ajax.get({
		            url: '/admin/schedule/add.do',
		            param: {
		                roomId: localStorage.getItem('roomId'),
		                startTime: startTime,
		                endTime:  endTime
		            },
		            cb: function(data) {
		                $('#modal-custome').modal('hide');
                        $("#modal-submit").attr("disabled", false);
		                if(data.data === true) {
		                    modal.onebtn({
		                        ctx: 'body',
		                        ctn: '预定成功',
		                        title: '预定会议室',
		                        event: function() {
		                            location.reload();
		                        }
		                    });
		                } else {
		                    modal.nobtn({
		                        ctx: 'body',
		                        ctn: data.message ? data.message : '预定失败',
		                        title: '预定会议室'
		                    });
		                }
		            }
		        })
		    });
	    },
	});
}

/**
 * 将服务器返回的数据转换成日历上的事件
 * param {object} data [服务器返回的数据]
 */
function translateDateToEvent(data, roomIndex) {
    var schedules = [];
	_.each(data.data.meetingRooms[roomIndex].schedules, function(val, index) {

        var title = ''; // 预定人，预定职位
        var backgroundColor = ''; // 事件的背景颜色

        // 后端返回的事件的完整的开始时间、结束时间
        var startFullTime = time.unixToTime(val.startTime);
        var endFullTime = time.unixToTime(val.endTime);

        // 获取到的年、月、日
        var year = Number(startFullTime.split('-')[0]);
        var month = Number(startFullTime.split('-')[1]);
        var date = Number(startFullTime.split('-')[2].split(' ')[0]);

        // 截取开始时间小时、开始时间分钟、结束时间小时、结束时间分钟，
        // 目的是转换成插件数据格式（year, month,date, hour, minute）
        var startHour = startFullTime.split('-')[2].split(' ')[1].split(':')[0];
        var startMinute = startFullTime.split('-')[2].split(' ')[1].split(':')[1];
        var endHour = endFullTime.split('-')[2].split(' ')[1].split(':')[0];
        var endMinute = endFullTime.split('-')[2].split(' ')[1].split(':')[1];

        // 判断是上午下午,将小时转换为24小时制
        var isMorning = startFullTime.split('-')[2].split(' ')[2];
        if(isMorning === '下午' || isMorning === '晚上') {
            var startHour = Number(startHour) + 12;
            var endHour = Number(endHour) + 12;
        }

    	schedules.push({
            id: val.id,
            title: val.username + val.position,
            start: new Date(year, month-1, date, Number(startHour), startMinute === '00' ? '00': '30'),
            end: new Date(year, month-1, date, Number(endHour), endMinute === '00' ? '00': '30'),
            allDay: false,
            backgroundColor: isMorning === '下午'? 'rgb(243, 156, 18)': "#00c0ef",
            borderColor: isMorning === '下午'? 'rgb(243, 156, 18)': "#00c0ef"
		});
	});
    return schedules;
}

/**
 * 时间转换成时间戳
 * @param <string> 2014-01-01 20:20:20  日期格式
 * return <int> unix 时间戳（秒）
 */
function DateToUnix(string) {
    var f = string.split(' ', 2);
    var d = (f[0] ? f[0] : '').split('-', 3);
    var t = (f[1] ? f[1] : '').split(':', 3);
    return (new Date(
        parseInt(d[0], 10) || null,
        (parseInt(d[1], 10) || 1) - 1,
        parseInt(d[2], 10) || null,
        parseInt(t[0], 10) || null,
        parseInt(t[1], 10) || null,
        parseInt(t[2], 10) || null
        )).getTime() / 1000;
}

/**
 * 时间戳转换日期
 * @param <int> unixTime 待时间戳抓(秒)
 * @param <bool> isFull 返回完整时间(Y-m-d 或者 Y-m-d H:i:s)
 * @param <int> timeZone 时区
 */
function unixToDate (unixTime, isFull, timeZone) {
    if (typeof (timeZone) == 'number') {
        unixTime = parseInt(unixTime) + parseInt(timeZone) * 60 * 60;
    }
    var time = new Date(unixTime * 1000);
    var ymdhis = "";
    ymdhis += time.getUTCFullYear() + "-";
    ymdhis += (time.getUTCMonth()+1) + "-";
    ymdhis += time.getUTCDate();
    if(isFull === true) {
        ymdhis += " " + time.getUTCHours() + ":";
        ymdhis += time.getUTCMinutes() + ":";
        ymdhis += time.getUTCSeconds();
    }
    return ymdhis;
}

