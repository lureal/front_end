import checkbox from './libs/checkbox';
import {
    initDropdownNormal,
    initDropdownComplex
} from './libs/dropdown-select';

// 缓存页面状态，方便渲染数据
let cachePageStatus = {
    areaId: null,
    interestIds: null,
    lifeIds: null,
    apps: null
}

// 从缓存中渲染数据
renderDataFromCache();
addBackLinkParam();

// 获取地域信息
requester.get('/deal/listAreas.do').then(data => {
    initDropdownNormal({
        el: '#area-dropdown',
        data: data.data,
        isComplex: true,
        complexTpl: $('#dropdown-complex-tpl').html()
    });

    // 初始化 checkbox
    checkbox.render({
        selector: '.w-checkbox'
    });

    // 将数据缓存到页面状态对象，方便初始化
    cachePageStatus.areaId = data.data.records;
});

// 获取兴趣信息
requester.get('/deal/listInterests.do').then(data => {
    initDropdownNormal({
        el: '#interest-dropdown',
        data: data.data,
        isComplex: true,
        complexTpl: $('#dropdown-complex-tpl').html(),
        noLimitOpera: true
    });

    // 初始化 checkbox
    checkbox.render({
        selector: '.w-checkbox'
    });

    // 将数据缓存到页面状态对象，方便初始化
    cachePageStatus.interestIds = data.data.records;

    // 默认选中不限
    $('#interest-dropdown .w-select-lists [value="0"]')
        .prop('checked', true)
        .trigger("change");
    $('#interest-dropdown .w-select-footer .w-btn').click();
});

// 获取人生状态
requester.get('/deal/listLifes.do').then(data => {
    initDropdownNormal({
        el: '#life-dropdown',
        data: data.data,
        isComplex: true,
        complexTpl: $('#dropdown-complex-tpl').html(),
        noLimitOpera: true
    });

    // 初始化 checkbox
    checkbox.render({
        selector: '.w-checkbox'
    });

    // 将数据缓存到页面状态对象，方便初始化
    cachePageStatus.lifeIds = data.data.records;

    // 默认选中不限
    $('#life-dropdown .w-select-lists [value="0"]')
        .prop('checked', true)
        .trigger("change");
    $('#life-dropdown .w-select-footer .w-btn').click();
});

// 获取 APP 偏好
requester.get('/deal/listApps.do').then(data => {
    initDropdownNormal({
        el: '#like-dropdown',
        data: data.data,
        isComplex: true,
        complexTpl: $('#dropdown-complex-tpl').html(),
        noLimitOpera: true
    });

    // 初始化 checkbox
    checkbox.render({
        selector: '.w-checkbox'
    });

    // 将数据缓存到页面状态对象，方便初始化
    cachePageStatus.apps = data.data.records;

    // 默认选中不限
    $('#like-dropdown .w-select-lists [value="0"]')
        .prop('checked', true)
        .trigger("change");
    $('#like-dropdown .w-select-footer .w-btn').click();
});

// 当 input 聚焦时去除错误信息
$('[type="text"]').focus((e) => {
    let $parent = $(e.currentTarget).parents('.w-row').removeClass('w-error');
});

// 当性别勾选不限时，取消勾选男，女和未知
$('#sex [type="checkbox"]').change(e => {
    let value = $(e.currentTarget).val();

    // 当选中不限的时候，取消勾选其他的选框
    if (value === '0') {
        if (e.currentTarget.checked) {
            $('#sex [type="checkbox"]:not([value="0"])').each((index, el) => {
                $(el).prop('checked', false);
                $(el).parent().removeClass('active');
            });
        }
    
    // 如果当前选中的不是不限取消则勾选不限
    } else {
        if (e.currentTarget.checked) {
            $('#sex [type="checkbox"][value="0"]').prop('checked', false);
            $('#sex [type="checkbox"][value="0"]').parent().removeClass('active');
        }
    }
    
});

// 当系统勾选不限时，取消勾选安卓和 IOS
$('#system [type="checkbox"]').change(e => {
    let value = $(e.currentTarget).val();

    // 当选中不限的时候，取消勾选其他的选框
    if (value === '0') {
        if (e.currentTarget.checked) {
            $('#system [type="checkbox"]:not([value="0"])').each((index, el) => {
                $(el).prop('checked', false);
                $(el).parent().removeClass('active');
            });
        }
    
    // 如果当前选中的不适不限取消勾选不限
    } else {
        if (e.currentTarget.checked) {
            $('#system [type="checkbox"][value="0"]').prop('checked', false);
            $('#system [type="checkbox"][value="0"]').parent().removeClass('active');
        }
    }
});

// 当网络勾选不限时，取消勾选 2G 3G 4G WIFI
$('#wifi [type="checkbox"]').change(e => {
    let value = $(e.currentTarget).val();

    // 当选中不限的时候，取消勾选其他的选框
    if (value === '0') {
        if (e.currentTarget.checked) {
            $('#wifi [type="checkbox"]:not([value="0"])').each((index, el) => {
                $(el).prop('checked', false);
                $(el).parent().removeClass('active');
            });
        }
    
    // 如果当前选中的不适不限取消勾选不限
    } else {
        if (e.currentTarget.checked) {
            $('#wifi [type="checkbox"][value="0"]').prop('checked', false);
            $('#wifi [type="checkbox"][value="0"]').parent().removeClass('active');
        }
    }
});

// 下一步
$('#submit').click(e => {
    let startAge = $('#start-age').val().replace(/\s/g, '');
    let endAge = $('#end-age').val().replace(/\s/g, '');
    let sex = getCheckboxId('#sex');
    let areaId = getDropdownSelect('#area-select-item');
    let interestIds = getDropdownSelect('#interest-select-item');
    let lifeIds = getDropdownSelect('#life-select-item');
    let apps = getDropdownSelect('#like-select-item');
    let uids = $('#uid').val().replace(/\s/g, '');
    let os = getCheckboxId('#system');
    let wifi = getCheckboxId('#wifi');

    // 数据校验
    // 年龄
    if (
        isNaN(parseInt(startAge)) ||
        parseInt(startAge) < 0 ||
        isNaN(parseInt(endAge)) ||
        parseInt(endAge) < 0 ||
        parseInt(startAge) > parseInt(endAge)
    ) {
        $('#age').addClass('w-error');
        return;
    }
    
    // 性别
    if (sex === '') {
        modaler.tip('请选择性别');
        return;
    }

    // 地域
    if (areaId.length < 1) {
        modaler.tip('请选择地域');
        return;
    }

    // 兴趣
    if (interestIds.length < 1) {
        modaler.tip('请选择兴趣');
        return;
    }

    // 人生状态
    if (lifeIds.length < 1) {
        modaler.tip('请选择人生状态');
        return;
    }

    // 用户偏好
    if (apps.length < 1) {
        modaler.tip('请选择用户偏好');
        return;
    }

    // 非默认选项
    // // uid
    // if (uids === '') {
    //     modaler.tip('请输入 uid');
    //     return;
    // }

    // 系统
    if (os === '') {
        modaler.tip('请选择系统');
        return;
    }

    // 网络
    if (wifi === '') {
        modaler.tip('请选择网络');
        return;
    }
    
    // 缓存数据
    setCacheData({
        startAge: startAge,
        endAge: endAge,
        sex: sex,
        areaId: convertDropdownData(areaId),
        interestIds: convertDropdownData(interestIds),
        lifeIds: convertDropdownData(lifeIds),
        apps: convertDropdownData(apps),
        uids: uids,
        os: os,
        wifi: wifi
    });
    
    // 跳转到下一步骤
    jump2NextStep();
});

/**
 * 将数据缓存到本地
 */
function setCacheData(data) {
    let cacheData = getCacheData();

    cacheData.age = `${data.startAge}~${data.endAge}`;

    for (let prop in data) {
        if (prop !== 'startAge' || prop !== 'endAge') {
            cacheData[prop] = data[prop];
        }
    }

    // 如果当前是编辑订单
    if (urler().edit === '1') {
        localStorage.setItem('editWeiboAdInfo', JSON.stringify(cacheData));

    // 如果当前是创建新的订单
    } else {
        localStorage.setItem('weiboAdInfo', JSON.stringify(cacheData));
    }
}

/**
 * 从本地缓存中获取数据
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
 * 从本地缓存中渲染数据
 */
function renderDataFromCache() {
    let cacheData = getCacheData();

    // 如果本地没有缓存数据，就直接返回
    if (!cacheData.sex) {
        return;
    }

    // 设置年龄
    $('#start-age').val(cacheData.startAge);
    $('#end-age').val(cacheData.endAge);

    // 设置性别
    let sex = cacheData.sex.split(',');
    for (let item of sex) {
        let $checkbox = $(`#sex [value="${item}"]`);
        let $checkboxWrap = $checkbox.parent();
        $checkbox.prop('checked', true);
        $checkboxWrap.addClass('active');
    }

    // 设置地域
    let areaTimer = setInterval(() => {
        if (cachePageStatus.areaId) {
            renderDropdownComplex(cachePageStatus.areaId, cacheData.areaId, '#area-select-item', 'areaId');

            // 停止定时器
            clearInterval(areaTimer);
        }
    }, 300);

    // 设置兴趣
    let interestTimer = setInterval(() => {
        if (cachePageStatus.interestIds) {
            renderDropdownComplex(cachePageStatus.interestIds, cacheData.interestIds, '#interest-select-item', 'interestIds');

            // 停止定时器
            clearInterval(interestTimer);
        }
    }, 300);

    // 设置人生状态
    let lifeTimer = setInterval(() => {
        if (cachePageStatus.lifeIds) {
            renderDropdownComplex(cachePageStatus.lifeIds, cacheData.lifeIds, '#life-select-item', 'lifeIds');

            // 停止定时器
            clearInterval(lifeTimer);
        }
    }, 300);

    // 设置用户偏好
    let appTimer = setInterval(() => {
        if (cachePageStatus.apps) {
            renderDropdownComplex(cachePageStatus.apps, cacheData.apps, '#like-select-item', 'apps');

            // 停止定时器
            clearInterval(appTimer);
        }
    }, 300);

    // 设置用户 uid
    $('#uid').val(cacheData.uids);

    // 设置系统
    let os = cacheData.os.split(',');
    for (let item of os) {
        let $checkbox = $(`#system [value="${item}"]`);
        let $checkboxWrap = $checkbox.parent();
        $checkbox.prop('checked', true);
        $checkboxWrap.addClass('active');
    }

    // 设置网络
    let wifi = cacheData.wifi.split(',');
    for (let item of wifi) {
        let $checkbox = $(`#wifi [value="${item}"]`);
        let $checkboxWrap = $checkbox.parent();
        $checkbox.prop('checked', true);
        $checkboxWrap.addClass('active');
    }
}

/**
 * 获取特定元素 checkbox ID
 * @param {String} el - 包含块元素
 * @returns {}
 */
function getCheckboxId(el) {
    let idStr = '';

    $('[type="checkbox"]', $(el)).each((index, el) => {
        let id = $(el).val();

        // 如果当前勾选框有勾选的则将 ID 追加到 idStr 中
        if (el.checked) {
            if (idStr === '') {
                idStr += `${id}`;
            } else {
                idStr += `,${id}`;
            }
        }
    });

    return idStr;
}

/**
 * 获取多选下拉框选中的项
 * @param {String} el 包含块元素
 */
function getDropdownSelect(el) {
    let selectItem = $(el).attr('data-selected');

    // 如果当前没有选中任何元素，则返回空数组
    if (!selectItem || selectItem === '') {
        return [];
    }

    selectItem = JSON.parse(decodeURIComponent(selectItem));
    return selectItem;
}

/**
 * 跳转到下一步骤
 */
function jump2NextStep() {
    
    // 如果当前是编辑订单
    if (urler().edit === '1') {
        location.href = `/#proj_name#/html/ad/weibo/time-to-market.html?cid=${urler().cid}&edit=1&oid=${urler().oid}`;

    // 当前不是编辑订单
    } else {
        location.href = `/#proj_name#/html/ad/weibo/time-to-market.html?cid=${urler().cid}`;
    }
}

/**
 * 将下拉多项选择框得到的数据转换成服务器需要的形式
 * @param {Array} data - 下拉框多项选择的数据
 * @param {String} str - 转换后得到的字符串
 */
function convertDropdownData(data) {
    let str = '';

    for (let item of data) {
        if (str === '') {
            str += item.val;
        } else {
            str += `,${item.val}`;
        }
    }

    return str;
}

/**
 * 抽离渲染复杂下拉框
 * @description 因为复杂下拉框的初始化在多处用到并且代码比较复杂，所以抽离出来
 * @param {Object} fetchData - 服务器返回的数据 data.data.records
 * @param {Object} localData - 本地缓存的数据
 * @param {String} el - 填充数据的目标元素
 */
function renderDropdownComplex(fetchData, localData, el, status) {
    let targetData = [];
    let ids = localData.split(',');
    let originData = [];
    
    // 将服务器返回的数据转换成只有一层的对象数组
    for (let item of cachePageStatus[status]) {
        
        originData.push({
            val: item.areaId,
            name: item.name
        });

        for (let subItem of item.childAreas) {
            originData.push({
                val: subItem.areaId,
                name: subItem.name
            });
        }
    }

    // 根据缓存的数据，抽出渲染需要的数据
    for (let item of originData) {
        for (let _item of ids) {
            if (String(_item) === String(item.val)) {
                targetData.push(item);
            }
        }
    }

    // 渲染实际数据
    if (originData.length > 0) {
        $(el)
            .attr('data-selected', encodeURIComponent(JSON.stringify(targetData)))
            .show();
        for (let item of targetData) {
            $(el).append(`<span data-val="${item.val}">${item.name}</span>`);
        }
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