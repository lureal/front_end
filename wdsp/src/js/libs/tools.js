import urler from './urler';

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
};

/**
 * 判断传进来是不是电话（简单判定是否为 3 位以上的数字）
 * @param {String} phone - 带区号电话
 * @returns {Boolean} - 如果是，返回 true，如果不是，返回 false
 */
export let checkPhone = (phone) => {
    let isPhone = /^\d{3}/g.test(phone);
    if (!isPhone) return false;
    return true;
};

/**
 * 判断传进来是不是银行账号
 * @param {String} bank - 银行账号
 * @returns {Boolean} - 如果是，返回 true，如果不是，返回 false
 */
export let checkBank = (bank) => {
    let isBank = /^\d{16}|\d{19}$/g.test(bank);
    if (!isBank) return false;
    return true;
};

/**
 * 判断传进来是不是推广链接
 * @param {String} url - 推广链接
 * @returns {Boolean} - 如果是，返回 true，如果不是，返回 false
 */
export let checkUrl = (url) => {
    let isUrl = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi.test(url);
    if (!isUrl) return false;
    return true;
};

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

/**
 * 将页面中现有的 URL 添加上 cid 后缀
 * @param {Number} cid - 客户 ID
 */
export let urlAddParam = (cid) => {
    
    if (!cid) {
        cid = urler().cid
    }

    $('body').find('a').each(function(index, ele) {
        let url = $(ele).attr('href');

        // 检测当前 url 是否不为空或者不以 javascript: 开头
        if (
            url !=='' && // url 不为空
            url.indexOf('javascript:') === -1 && // url 不以 javascript: 开头
            url.indexOf('cid=') === -1 // 当前 url 中没有 cid= 参数
        ) {

            // 当前 url 已经有参数
            if (url.indexOf('?') !== -1) {
                $(ele).attr('href', url += `&cid=${cid}`);

            // 当前 url 没有参数
            } else {
                $(ele).attr('href', `${url}?cid=${cid}`);
            }
        }
    });
}

/**
 * 数字每相隔 1000 添加一个 ,
 */
export let divideThousand = (num) => {
    if (num === null) return '-';

    let str = num.toString();
    
    str = str.split('').reverse().join("").replace(/(\d{3})+?/g, (s) => {
        return s + ',';
    }).replace(/,$/, '').split('').reverse().join('');

    return str;
};

/**
 * 将金额转换成特定的形式，因为服务器返回的金额并不是以元为单位，而是以分为单位，实际上
 * 需要先除以 100 如果小数点后有位数，并且不超过 2 位，则显示小数点后位数，如果小数点后
 * 超过两位，则取小数点后两位，如果没有小数点，则显示实际的数值
 * @param {Number} money - 等待被转换的金钱
 * @returns {Number} - 返回转换过后的金钱
 */
export let convertMoney = (money) => {
    let moneyStr = (money / 100).toString(), _money;

    // 如果当前有小数点
    if (moneyStr.indexOf('.') === -1) {
        _money = Number(moneyStr);

    // 小数点后位数为两位以内
    } else if (moneyStr.slice(moneyStr.indexOf('.') + 1).length > 2) {
        _money = Number(moneyStr.slice(0, (moneyStr.indexOf('.') + 3)));

    // 当前没有小数点
    } else {
        _money = Number(moneyStr);
    }

    // 拿到小数点前的位数，然后进行千分
    let prefixMoney = _money.toFixed(2).toString().slice(0, _money.toFixed(2).toString().indexOf('.'));
    let suffixMoney = _money.toFixed(2).toString().slice(_money.toFixed(2).toString().indexOf('.'));

    return divideThousand(Number(prefixMoney)) + suffixMoney;
};

/**
 * 将百分比转换成特定的形式
 * 1. 将实际的数值乘以 100
 * 2. 判定小数点后有多少位，如果是两位以内的，则直接返回，如果是两位以上的，则小数点后
 * 取值两位
 * @param {Number} percent - 百分数
 * @returns {String} - 转换后的百分数
 */
export let convertPercent = (percent) => {
    let _percent = percent * 100;
    let _percentStr = _percent.toString();

    // 当前没有小数点
    if (_percentStr.indexOf('.') === -1) {
        _percent = _percent + '.00%'

    // 当前小数点后超过两位
    } else if (_percentStr.slice(_percentStr.indexOf('.') + 1).length > 2) {
        _percent = _percentStr.slice(0, (_percentStr.indexOf('.') + 3)) + '%';

    // 当前小数点后小于两位
    } else {
        _percent = _percent + '0%'
    }

    return _percent;
};

/**
 * 对比格式为 xx:xx 的两个时间
 * @param {String} time1 - 格式为 xx:xx 的 24 小时制的时间
 * @param {String} time2 - 格式为 xx:xx 的 24 小时制的时间
 * @returns {Number} - 如果 time1 > time2 返回 1, 否则返回 -1, 如果两者相等，返回 0
 */
export let compareTime = (time1, time2) => {

    // 将时间拆分成小时和分钟
    let time1Arr = time1.replace(/\s/g, '').split(':');
    let time2Arr = time2.replace(/\s/g, '').split(':');

    for (let item of time1Arr) {
        item = Number(item);
    }

    for (let item of time2Arr) {
        item = Number(item);
    }

    // 1. time1 的小时是否大于 time2 的小时，如果是，返回 1，否则返回 -1
    // 2. time1 的小时跟 time 2 的小时是否相等，如果是，对比分钟，如果 time1 分钟大于
    //    time2 分钟，返回 1，否则返回 -1，如果相等则返回 0
    if (time1Arr[0] > time2Arr[0]) {
        return 1;
    } else if (time1Arr[0] === time2Arr[0]) {

        if (time1Arr[1] > time2Arr[1]) {
            return 1;

        } else if (time1Arr[1] === time2Arr[1]) {
            return 0;

        } else {
            return -1;
        }

    } else {
        return -1;
    }
};

/**
 * 对比日期
 * @param {String} date1 - 格式为 xxxx-xx-xx 的日期
 * @param {String} date2 - 格式为 xxxx-xx-xx 的日期
 * @returns {Number} - 如果  date1 > date2 返回 1, 否则返回 -1, 如果两者相等，返回 0
 */
export let compareDate = (date1, date2) => {
    let date1Arr = date1.split('-');
    let date2Arr = date2.split('-');

    for (let item of date1Arr) {
        item = Number(item);
    }

    for (let item of date2Arr) {
        item = Number(item);
    }

    // 1. 如果 date1 === date2 返回 0
    // 2. 如果 date1 !== date2，则进行以下对比
    //    1). 对比 date1 和 date2 的年份，如果 date1 年份 大于 date2 年份，返回 1，小于返回 -1，相等则继续
    //        进行月和日的对比
    if (date1 === date2) {
        return 0;
    } else {
        
        // 年份对比
        if (date1Arr[0] > date2Arr[0]) {
            return 1;
        } else if (date1Arr[0] < date2Arr[0]) {
            return -1;
        } else {

            // 月份对比
            if (date1Arr[1] > date2Arr[1]) {
                return 1;
            } else if (date1Arr[1] < date2Arr[1]) {
                return -1;
            } else {
                
                // 日期对比
                if (date1Arr[2] > date2Arr[2]) {
                    return 1;
                } else {
                    return -1;
                }
            }
        }
    }
}

// 由于网络可能不好，为了避免网络不好的情况下用户重复提交表单，所以需要判断用户当前的请
// 求状态，当用户处于请求状态时，则不再请求，只有当用户恢复正常状态，才能继续请求，请求
// 的状态通过绑定在 html 元素上的 data-isLoading来判定。
export let fetchStatus = {

    /**
     * 将当前元素的状态更改为请求中
     * @param {String} el - 当前需要检测状态的元素
     */
    loading(el) {
        let $el = $(el);
        let cacheCtn = $el.html();
        $el.attr('data-originCtn', cacheCtn);

        $el.html('<img src="/#proj_name#/img/loading.gif" style="height:15px; width: 15px;">');
        $el.attr('data-isLoading', 1);
    },

    /**
     * 重置当前元素的状态
     * @param {String} el - 当前需要检测状态的元素
     */
    reset(el) {
        let $el = $(el);
        let originCtn = $el.attr('data-originCtn');

        if (originCtn) {
            $el.html(originCtn);
        }

        $el.attr('data-isLoading', 0);
    },

    /**
     * 获取当前元素的请求状态
     * @param {String} el - 需要获取状态的元素
     * @returns {String} 返回获取的元素的状态
     */
    getState(el) {
        let $el = $(el);
        return $el.attr('data-isLoading');
    }
};

/**
 * 获取当前 iCheck 的状态
 * 由于 iCheck 获取状态的方式是通过绑定 ifChecked 事件来判定，用户只有选择了选项才能获
 * 取到当前选中的值，如果用户没有进行选择，则无法获取到当前选中的元素（如默认第一个勾选
 * 没办法获取到第一个勾选的元素）
 * @param {String} el - 元素
 */
export let getICheckStatus = (el) => {
    return $(el).find('.iradio_flat-blue.checked').find('input').val();
};

/**
 * 对比文件大小
 * @param {Number} size - 文件大小（bytes）
 * @returns {Number} -1:size1 < size 2, 0：相等，1:size1 > size2
 */
export let compareFileSize = (size1, size2) => {
    if (size1 > size2) {
        return 1;
    
    } else if (size1 < size2) {
        return -1

    } else {
        return 0;
    }
};

/**
 * 将不同尺寸的文件转换成 bytes
 * @param {Number} size - 文件大小
 * @param {String} unit - 大小的单位
 * @param {Number} 返回以 bytes 为单位的尺寸
 */
export let convertToBytes = (size, unit) => {
    let distSize;

    switch (unit) {
        case 'bytes':
            distSize = size;
            break;
        case 'kb':
            distSize = size * 1000;
            break;
        case 'mb':
            distSize = size * 1000 * 1000;
            break;
        case 'gb':
            distSize = size * 1000 * 1000 * 1000
            break;
        default:
            console.log('太大了');
            break;
    }

    return distSize;
};

/**
 * 获取 [type="file"] 的图像文件信息
 * @param {Object} files - [type="file"] 的 e.target.files[0] 对象
 * @param {Function} cb - 回调函数
 */
export let getImgFileInfo = (file, cb) => {
    let size = file.size, width, height;
    let _URL = window.URL || window.webkitURL;
    let img = new Image();
    
    img.onload = (e) => {
        let self = e.currentTarget;
        cb(size, self.height, self.width);
    }

    img.src = _URL.createObjectURL(file)
}

/**
 * 获取 [type="file"] 的视频文件信息
 * @param {Object} files - [type="file"] 的 e.target.files[0] 对象
 * @param {Function} cb - 回调函数
 */
export let getVideoFileInfo = (file, cb) => {
    let _URL = window.URL || window.webkitURL;
    let video = document.createElement('video');
    
    video.preload = 'metadata';
    video.onloadedmetadata = (e) => {
        let self = e.currentTarget;
        console.log(self);
    };

    video.src = _URL.createObjectURL(file);;
}

/**
 * 矩阵翻转
 * 
 * [['a', 1, 2], ['b', 1, 2], ['c', 1, 2]]
 * 翻转为
 * [['a', 'b', 'c'], [1, 1, 1], [2, 2, 2]]
 * 
 * @param {Array} arr - 等待被翻转的矩阵数组
 * @returns {Array} 翻转过后的矩阵数组
 */
export let upsiteDown = (arr) => {
    let distArr = [];

    for(let i = 0; i < arr[0].length; i++) {
        distArr[i] = [];
    }

    for(let i = 0; i < arr.length; i++) {
        for(let j = 0; j < arr[i].length; j++) {
            distArr[j][i] = arr[i][j];
        }
    }

    return distArr
}