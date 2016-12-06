import {
    compareTime,
    compareDate,
    getICheckStatus
} from './libs/tools';

// 从本地缓存中获取数据
let cacheData = getCacheData();

// 出价方式
let cachePageStatus = {
    bidWay: 0
}

// 渲染缓存数据
renderDataFromCache();
addBackLinkParam();

// 初始化时间控件
$('#start-time').datetimepicker({
    format: 'HH:mm'
});
$('#end-time').datetimepicker({
    format: 'HH:mm'
});

// 输入框聚焦隐藏错误
$('[data-type="input"] input, [data-type="textarea"] textarea').focus((e) => {
    let $parent = $(e.currentTarget).parents('.w-row').removeClass('w-error');
});

// 初始化出价方式
// 请求出家方式需要获取平台 ID
requester.get('/select/listBidWays.do', {
    platformId: cacheData.platformId
}).then(data => {
    let tpl = $('#select-tpl').html();
    $('#bid-way').html(_.template(tpl)(data));
    
    cachePageStatus.bidWay = 1;
});

// 选择分段时间
$('body').on('ifChecked', '#time [type="radio"]', e => {
    let $self = $(e.currentTarget);
    let value = $self.val();

    // 当进行时段切换时，如果当前开始时间和结束时间有错误，则移除错误
    $('#start-time').parents('.w-row').removeClass('w-error');
    $('#end-time').parents('.w-row').removeClass('w-error');

    // 全时段
    if (value === '0') {
        $('#start-time').attr('readonly', 'readonly').val('');
        $('#end-time').attr('readonly', 'readonly').val('');

    // 特定时间段
    } else {
        $('#start-time').removeAttr('readonly');
        $('#end-time').removeAttr('readonly');
    }
});

// 提交订单
$('#submit').click(e => {
    let isValidate = true; // 标识是否校验成功
    let fields = { // 字段列表
        date: '',
        startTime: '',
        endTime: '',
        startDate: '',
        endDate: '',
        bidWay: '',
        bidPrice: '',
        quota: '',
        timeArea: '' // 时间区域
    };

    $('.w-form .w-row').each((index, el) => {
        let $self = $(el);
        let type = $self.attr('data-type');
        let id = $self.attr('data-id');
        let validates = $self.attr('data-validate').split(','); // 获取需要判断的条件

        switch (type) {
            case 'input':
                let _val = $self.find('input').val(); // 获取输入框的值

                // 如果当前校验的是开始时间和结束时间，需要先判定当前选择的是不是全时段，
                // 如果是，则不继续校验
                if (id === 'startTime' || id === 'endTime') {

                    // 全时段
                    if (getICheckStatus('#time') === '0') {
                        return;
                    }
                }

                // 循环判断条件
                for (let validate of validates) {

                    // 判断是否为空
                    if (validate === 'empty' && _val === '') {
                        $self.addClass('w-error');
                        isValidate = false;
                        return;
                    }

                    // 判断是否为金额
                    if (validate === 'money' && (isNaN(Number(_val)) || Number(_val) === 0)) {
                        $self.addClass('w-error');
                        isValidate = false;
                        return;
                    }

                    // 缓存值
                    fields[id] = _val;
                }
                break;
            case 'select':
                fields[id] = $self.find('select').val();
                break;
            case 'radio':
                fields[id] = getICheckStatus(el);
                break;
            default:
        }
    });

    // 校验开始日期是否大于结束日期
    if (compareDate(fields.startDate, fields.endDate) === 1) {
        modaler.tip('开始日期不能大于结束日期');
        isValidate = false;
        return;
    }

    // 校验开始时间是否大于结束时间
    if (compareTime(fields.startTime, fields.endTime) === 1) {
        modaler.tip('开始时间不能大于结束时间');
        isValidate = false;
        return;
    }

    // 校验失败，中止提交订单
    if (isValidate === false) {
        return;
    }

    // 发送请求并跳转页面
    submitData({
        date: `${fields.startDate}~${fields.endDate}`,
        bidWay: fields.bidWay,
        bidPrice: parseInt(fields.bidPrice) * 100,
        quota: parseInt(fields.quota) * 100,
        time: fields.timeArea === '0' ? '00:00~24:00' : `${fields.startTime}~${fields.endTime}`
    });
});

/**
 * 从缓存中获取数据
 * @returns {Object} 本地缓存的订单数据
 */
function getCacheData() {
    let data;

    // 如果当前是编辑订单，则拿到编辑订单的缓存数据
    if (urler().edit === '1') {
        data = localStorage.getItem('editWeiboAdInfo');

    // 如果当前是新创建的订单，则拿到新创建订单的缓存数据
    } else {
        data = localStorage.getItem('weiboAdInfo');
    }

    if (!data) {
        modaler.tip('本地没有存储订单数据');
        return;
    }

    return JSON.parse(data);
}

/**
 * 从缓存中渲染数据
 * @param {function} cb - 回调函数
 */
function renderDataFromCache() {
    let cacheData = getCacheData();

    // 如果本地没有缓存数据，就直接返回
    if (!cacheData.date || cacheData.date === '') {
        return;
    }

    // 设置分段时间
    // 全时段
    setTimeout(() => {

        // 设置投放日期
        $('#start-date').val(cacheData.date.split('~')[0]);
        $('#end-date').val(cacheData.date.split('~')[1]);

        if (cacheData.time === '00:00~24:00') {
            $('#time [value="0"]').iCheck('check');
        
        // 特定时间段
        } else {
            let timeArr = cacheData.time.split('~');

            $('#time [value="1"]').iCheck('check');
            $('[data-id="startTime"] input').val(timeArr[0]);
            $('[data-id="endTime"] input').val(timeArr[1]);
        }

        // 设置出价方式
        let bidPriceTimer = setInterval(() => {
            if (cachePageStatus.bidWay === 1) {
                $('#bid-way').val(cacheData.bidWay);
            }
        }, 300);

        // 设置出价
        $('[data-id="bidPrice"] input').val(Number(cacheData.bidPrice) / 100);

        // 设置订单限额
        $('[data-id="quota"] input').val(Number(cacheData.quota) / 100);

    }, 0);
}

/**
 * 缓存数据
 */
function setCacheData(data) {
    let weiboAdInfo;

    // 如果当前是编辑订单
    if (urler().edit === '1') {
        weiboAdInfo = localStorage.getItem('editWeiboAdInfo');

    // 如果当前是创建新的订单
    } else {
        weiboAdInfo = localStorage.getItem('weiboAdInfo');
    }
}

/**
 * 发送数据
 * @param {Object} data - 发送给服务器的数据
 */
function submitData(data) {
    let cacheData = getCacheData(); // 之前缓存在本地的数据
    let submitData = {};

    // 将除 ad 字段之外的订单数据拿到提交数据里面
    for (let prop in cacheData) {
        if (prop !== 'ad' && prop !== 'interestIds') {
            submitData[prop] = cacheData[prop];
        }
    }
    
    submitData.interestId = cacheData.interestIds;

    for (let prop in cacheData.ad) {

        // 当前是微博 feed 编辑博文
        if (submitData.subType === 12 && prop === 'picUrls') {
            for (let i = 0; i < cacheData.ad[prop].length; i++) {
                submitData[`ad.${prop}[${i}]`] = cacheData.ad[prop][i];
            }
        
        // 如果当前是九宫格
        } else if (submitData.subType === 41 || submitData.subType === 42) {

            // 当前有上传图片或应用图片字段
            if (prop === 'picUrls' || prop === 'appImages') {
                for (let i = 0; i < cacheData.ad[prop].length; i++) {
                    submitData[`ad.${prop}[${i}]`] = cacheData.ad[prop][i];
                }
            } else {
                submitData[`ad.${prop}`] = cacheData.ad[prop];
            }
        } else {
            submitData[`ad.${prop}`] = cacheData.ad[prop];
        }
    }

    // 更新订单
    if (urler().edit === '1') {
        requester.post('/deal/order/submit.do', $.extend(
            {},
            submitData,
            data,
            {
                orderId: urler().oid
            }
        )).then(data => {
            if (data.data === true) {
                location.href = `/#proj_name#/html/ad/weibo/complete.html?cid=${urler().cid}&oid=${urler().oid}&edit=1`;
            } else {
                modaler.tip('修改订单失败，请重新提交订单');
            }
        });

    // 提交订单
    } else {
        requester.post('/deal/order/submit.do', $.extend(
            {},
            submitData,
            data
        )).then(data => {
            if (data.data === true) {
                location.href = `/#proj_name#/html/ad/weibo/complete.html?cid=${urler().cid}`;
            } else {
                modaler.tip('订单提交失败，请重新提交订单')
            }
        });
    }
}

/**
 * 为后退操作添加正确的参数
 */
function addBackLinkParam() {
    
    // 当前是重新编辑订单
    if (urler().edit === '1') {
        let $link = $('.content-progress .progress-title a');
        $link.each((index, el) => {
            let url = $(el).attr('href');
            $(el).attr('href', `${url}&edit=1&oid=${urler().oid}`);
        });
    }
}