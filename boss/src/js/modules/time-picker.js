/*!
 * 时间控件
 * [github](https://github.com/jdewit/bootstrap-timepicker)
 *
 */

var timer = {};

/**
 * 初始化时间控件
 * @param [String] id {时间控件 ID}
 */
timer.init = function(id) {
    $(id).timepicker({
        showInputs: false,
        timeFormat: 'H:i',
        showMeridian: false
    });
};

timer.init_end = function(id) {
    var myDate = new Date();
    var currentMinutes = myDate.getMinutes();
    currentMinutes = currentMinutes-(currentMinutes % 15) +15-1;
    var defaultTime =myDate.getHours + ":" +currentMinutes;
    $(id).timepicker({
        showInputs: false,
        timeFormat: 'H:i',
        showMeridian: false,
        //defaultTime:defaultTime,
        minuteStep :1
    });
};

/**
 * 获取时间控件时间
 * @param [String] id {时间控件 ID}
 */
timer.getTime = function(id) {
    var time = $(id).val();

    // 获取是上午时间还是下午时间（AM 或 PM）
    var sign = time.slice(time.length - 2, time.length);

    // 获取实际的时间并转换成数组
    var timeArr = time.slice(0, time.length - 3).split(':');

    // 根据 sign 将时间转换成 24 小时制
    if(sign === 'PM') {

        if(timeArr[0] !== '12') {
            timeArr[0] = Number(timeArr[0]) + 12;
        } else {
            timeArr[0] = '00';
        }
    }

    // 生成最终服务器要的格式
    return timeArr.join(':');

};

timer.getTimeLast = function(id) {
    var time = $(id).val();

    // 获取是上午时间还是下午时间（AM 或 PM）
    var sign = time.slice(time.length - 2, time.length);

    // 获取实际的时间并转换成数组
    var timeArr = time.slice(0, time.length - 3).split(':');

    // 根据 sign 将时间转换成 24 小时制
    if(sign === 'PM') {
        if(timeArr[0] !== '12') {
            timeArr[0] = Number(timeArr[0]) + 12;
        } else {
            timeArr[0] = '24';
        }
    }

    // 生成最终服务器要的格式
    return timeArr.join(':');
}

/**
 * 将 24 小时制的时间转换成控件需要的时间
 * @param [String] time {24小时制的时间}
 */
timer.format24Time = function(time) {
    var hour = time.split(':')[0];
    var minute = time.split(':')[1];

    // if(Number(hour) - 12 > 0) {
    //     return Number(hour) - 12 + ':' + minute + ' PM';
    // }
    // return hour + ':' + minute + ' AM';

    // 改成24小时制的时间
    if(Number(hour) - 24 > 0) {
        return Number(hour) - 24 + ':' + (minute ? minute : '00');
    }
    return hour + ':' + (minute ? minute : '00');
}

module.exports = timer;
