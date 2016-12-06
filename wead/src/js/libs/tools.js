
/**
 * 判断传进来是不是 email
 * [stackoverflow](http://stackoverflow.com/questions/46155/validate-email-address-in-javascript)
 *
 * @param {String} email - 邮箱
 * @returns {Boolean} - 如果是，返回 true，如果不是，返回 false
 */
export let checkEmail = (email) => {
    let isEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g.test(email);
    if (!isEmail) return false;
    return true;
};

/**
 * 判断传进来是不是手机
 * @param {String} mobile - 手机号
 * @returns {Boolean} - 如果是，返回 true，如果不是，返回 false
 */
export let checkMobile = (mobile) => {
    let isMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|18[0-9]|14[57]|17[0-9]|)[0-9]{8}$/g.test(mobile);
    if (!isMobile) return false;
    return true;
}

/**
 * 判断传进来是不是电话（简单判定是否为 3 位以上的数字）
 * @param {String} phone - 带区号电话
 * @returns {Boolean} - 如果是，返回 true，如果不是，返回 false
 */
export let checkPhone = (phone) => {
    let isPhone = /^\d{3}/g.test(phone);
    if (!isPhone) return false;
    return true;
}

/**
 * 判断传进来是不是银行账号
 * @param {String} bank - 银行账号
 * @returns {Boolean} - 如果是，返回 true，如果不是，返回 false
 */
export let checkBank = (bank) => {
    let isBank = /^\d{16}|\d{19}$/g.test(bank);
    if (!isBank) return false;
    return true;
}

/**
 * 将服务器返回的时间戳转换成文章需要的格式
 * @param {Number} timestamp - 时间戳
 * @param {Function} format - 格式化函数，返回值为格式化后的字符串
 * @returns {String} - 返回格式化后的字符串
 */
export let convertTimestamp = (timestamp, format) => {
    let _date = new Date(timestamp);

    // 得到必要的时间片段
    let year = _date.getFullYear();
    let month = _date.getMonth() + 1;
    let date = _date.getDate();
    let hour = _date.getHours();
    let minute = _date.getMinutes();
    let second = _date.getSeconds();

    // 小时，分钟和秒数小于十的数可能返回一个位数的数字，如果返回一个位数的数字则在前面加 0
    hour = hour < 10 ? '0' + hour : hour;
    minute = minute < 10 ? '0' + minute : minute;
    second = second < 10 ? '0' + second : second;

    return format(year, month, date, hour, minute, second);
};
