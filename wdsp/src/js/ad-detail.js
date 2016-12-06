import urler from './libs/urler';
import { initDropdownNormal } from './libs/dropdown-select';
import checkbox from './libs/checkbox';
import { baseArea } from './libs/chart';
import {
    convertMoney,
    convertPercent
} from './libs/tools';

let cacheChartData = {}; // 缓存订单表格数据

// 删除缓存在本地的数据
localStorage.removeItem('editWeiboAdInfo');

// 激活左侧导航栏
$('#sidebar-ad').addClass('w-active');

// 获取订单数据，初始化订单数据中的选项和图表
requester.get('/deal/order/getChart.do', {
    startDate: '',
    endDate: '',
    orderId: urler().id,
    customId: urler().cid
}).then(data => {
    // data = {
    //     "code": 200,
    //     "message": "",
    //     "data": {
    //         "name": "平台效果",
    //         "x": [
    //             "2016-10-18",
    //             "2016-10-19",
    //             "2016-10-20",
    //             "2016-10-21"
    //         ],
    //         "y": [
    //             {
    //                 "name": "曝光量",
    //                 "data": [
    //                     0,
    //                     5569,
    //                     16432,
    //                     2614
    //                 ]
    //             },
    //             {
    //                 "name": "消耗",
    //                 "data": [
    //                     0,
    //                     69.22,
    //                     200.18,
    //                     43.18
    //                 ]
    //             }
    //         ]
    //     }
    // }

    // 如果当前没有图标数据，则提示用户当前没有数据
    if (data.data === null) {
        modaler.tip('当前没有图表数据');
        return;
    }

    if (data.data.y.length < 1) {
        modaler.tip('当前没有图表数据');
        return;
    }

    // 从服务器返回的数据中拿出选项的数据
    let selectItems = [];
    for (let item of data.data.y) {
        selectItems.push({
            name: item.name,
            val: selectItems.length
        });
    }

    // 初始化图表内容选择下拉框
    initDropdownNormal({
        el: '.w-dropdown-normal',
        data: {
            records: selectItems
        }
    });

    // 初始化 checkbox
    checkbox.render({
        selector: '.w-checkbox'
    });

    cacheChartData = data; // 缓存数据
});

// 当用户点击了生成图表按钮时，
// 如果用户选择了日期，则发起请求拿到该日期的数据，重新渲染图表
// 如果用户选择了内容，则在已有的基础上筛选数据
// 如果用户既选择了日期，又选择了内容，则发起请求后，在拿来的数据的基础上筛选出想要的结果
// 如果用户什么都没有选择，则不操作，直接返回
$('#data-generate-chart').on('click', e => {
    let $startDate = $('#select-chart-start-date');
    let $endDate = $('#select-chart-end-date');
    let $selectChartDate = $('#select-chart-date');
    let $selecItem = $('#select-item');

    // 如果用户什么都没有选择，直接返回
    if (
        (
            $selecItem.attr('data-selected') === undefined ||
            JSON.parse(decodeURIComponent($selecItem.attr('data-selected'))).length < 1
        ) &&
        $startDate.val() === '' &&
        $endDate.val() === ''
    ) {
        return;
    }

    // 如果用户没选择日期，则不发请求
    if ($startDate.val() === '' && $endDate.val() === '') {

        // 根据用户选择的标签渲染数据
        renderChart();

    // 如果用户选择了日期，则发送请求
    } else {

        // 发起请求拿到新的数据
        requester.get('/deal/order/getChart.do', {
            startDate: $startDate.val(),
            endDate: $endDate.val(),
            orderId: urler().id,
            customId: urler().cid
        }).then(data => {

            // 将数据存储到缓存数组
            cacheChartData = data;

            // 根据用户选择的标签渲染数据
            renderChart();
        });
    }
});

// 获取详情数据
requester.get('/deal/order/get.do', {
    orderId: urler().id
}).then(data => {

    // 渲染微博预览
    renderWeiboPreview(data.data.type, !!data.data.ad.mid, data);
    // renderWeiboPreview(3, !!data.data.ad.mid, data);

    // 渲染订单信息
    requester.get('/select/listAdGroups.do').then(_data => {
        for (let prop in _data.data) {
            if (prop.toString() === data.data.groupId.toString()) {
                $('#group').val(_data.data[prop]);
            }
        }
    });

    // 渲染广告订单
    $('#bill').val(data.data.name);

    // 渲染广告ID
    $('#orderId').val(data.data.platformOrderId);

    // 渲染投放日期
    $('#date').val(data.data.date);

    // 渲染投放时间
    $('#time').val(data.data.time);

    // 渲染出价
    $('#bid-price').val(convertMoney(data.data.bidPrice));

    // 渲染订单限额
    $('#quota').val(convertMoney(data.data.quota));

    // 渲染定向用户
    // 定向用户：年龄，地域，性别，网络，系统，生活状态，偏好的APP，兴趣
    // 年龄
    $('#user').val(`${data.data.age}岁`);

    // 性别
    let _sexStr = getValByProp(data.data.sex, {
        '0': '不限',
        '1': '男',
        '2': '女',
        '3': '性别未知'
    });
    $('#user').val(`${$('#user').val()}; 性别${_sexStr}`);

    // 网络情况
    let _wifiStr = getValByProp(data.data.wifi, {
        '0': '不限',
        '1': 'wifi',
        '2': '2G',
        '3': '3G',
        '4': '4G'
    });
    $('#user').val(`${$('#user').val()}; 网络${_wifiStr}`);

    // 系统
    let _sysStr = getValByProp(data.data.os, {
        '0': '不限',
        '1': 'ios',
        '2': '安卓'
    });
    $('#user').val(`${$('#user').val()}; 系统${_sysStr}`);

    // 地域
    // 地域返回的数据类似于
    // {areaId: '1', name: '山东省', childAreas: [{ areaId: '11', name: '青岛' }]}
    requester.get('/deal/listAreas.do').then(_data => {
        let _areaStr = getValByProp(data.data.areaIds.toString(), handleSubChildData(_data));
        $('#user').val(`${$('#user').val()}; 地域: ${_areaStr}`);
    });

    // 兴趣
    requester.get('/deal/listInterests.do').then(_data => {
        let _interestStr = getValByProp(data.data.interestIds.toString(), handleSubChildData(_data));
        $('#user').val(`${$('#user').val()}; 兴趣: ${_interestStr}`);
    });

    // 生活状态
    requester.get('/deal/listLifes.do').then(_data => {
        let _lifeStr = getValByProp(data.data.lifeIds.toString(), handleSubChildData(_data));
        $('#user').val(`${$('#user').val()}; 人生状态: ${_lifeStr}`);
    });

    // 偏好的 APP
    requester.get('/deal/listApps.do').then(_data => {
        let _appsStr = getValByProp(data.data.apps.toString(), handleSubChildData(_data));
        $('#user').val(`${$('#user').val()}; 偏好APP: ${_appsStr}`);
    });

    // 编辑订单按钮事件
    $('body').on('click', '#edit', e => {

        // 构造并存储订单数据
        let cacheData = {
            ad: data.data.ad,
            adPlacementId: data.data.adPlacementId,
            age: data.data.age,
            apps: data.data.apps.toString(),
            areaId: data.data.areaIds.toString(),
            bidPrice: data.data.bidPrice,
            bidWay: data.data.bidWay,
            date: data.data.date,
            quota: data.data.quota,
            endAge: data.data.age.split('~')[1],
            groupId: data.data.groupId,
            interestIds: data.data.interestIds.toString(),
            lifeIds: data.data.lifeIds.toString(),
            name: data.data.name,
            os: data.data.os,
            platformId: data.data.platformId,
            sex: data.data.sex,
            startAge: data.data.age.split('~')[0],
            time: data.data.time,
            type: data.data.type,
            uids: data.data.uids,
            wifi: data.data.wifi
        };

        // 对当前数据是 feeds 或者品速 card 中的哪种子类型进行区分
        switch (cacheData.type) {
            
            // feeds
            case 1:
                
                // 博文推广链接
                if (cacheData.ad.mid) {
                    cacheData.subType = 11;

                // 编辑博文
                } else {
                    cacheData.subType = 12;

                    // 如果当前没有图片则设置一个空鼠族
                    if (cacheData.ad.picUrls === null) {
                        cacheData.ad.picUrls = [];
                    }
                }
                break;
            
            // banner
            case 2:
                break;
            
            // card
            case 3:

                // 视频活动
                if (
                    cacheData.ad.videoPath !== '' &&
                    cacheData.ad.videoPath !== null &&
                    cacheData.ad.cardButtonUrl !== null
                ) {
                    cacheData.subType = 33;
                }

                // 视频
                if (
                    cacheData.ad.videoPath !== null &&
                    cacheData.ad.cardButtonUrl === null
                ) {
                    cacheData.subType = 32;
                }

                // 活动
                if (
                    cacheData.ad.cardButtonUrl !== null && 
                    (
                        cacheData.ad.videoPath === '' ||
                        cacheData.ad.videoPath === null
                    )
                ) {
                    cacheData.subType = 31;
                }

                break;
            case 4:
                
                // IOS
                if (cacheData.ad.appDeveloper === '' || cacheData.ad.appDeveloper === null) {
                    cacheData.subType = 42;
                
                // 安卓
                } else {
                    cacheData.subType = 41;
                }

                break;
            default:
                break;
        }

        // 存储数据
        localStorage.setItem('editWeiboAdInfo', JSON.stringify(cacheData));

        // 跳转到相应的步骤页
        location.href = `/#proj_name#/html//ad/weibo/base-info.html?cid=${urler().cid}&edit=1&oid=${urler().id}`;
    });
});

/**
 * 根据用户选择的内容来渲染出实际的图表
 */
function renderChart() {

    // 如果当前没有数据，则不进行渲染操作
    if (cacheChartData.data === null) {
        modaler.tip('当前没数据');
        return;
    }

    // 根据用户选择的标签渲染数据
    let yData = [];
    let xData = cacheChartData.data.x;

    let select = JSON.parse(decodeURIComponent($('#select-item').attr('data-selected')));

    // 根据用户下拉框拿到的选项拿到实际的数据
    for (let item of cacheChartData.data.y) {
        for (let _item of select) {
            if (item.name === _item.name) {
                yData.push({
                    data: item.data,
                    name: item.name
                });
            }
        }
    }

    // 渲染并显示出实际的界面
    $('#chart').show();
    baseArea({
        el: '#chart',
        x: xData,
        y: yData
    });
}

/**
 * 根据服务器返回的数据判断应该渲染那种样式的预览形式
 * @param {Number} type - 当前预览的类型
 * @param {Boolean} isMis - 当前是否有 mid，现有微博
 * @param {Object} data - 服务器返回的数据
 */
function renderWeiboPreview(type, isMid, data) {

    // 博文
    if (type === 1) {

        // 服务器直接返回博文数据
        // 当前通过 mid 获取博文，则不渲染预览
        if (!isMid) {
            let tpl = $('#weibo-feed-preview-tpl').html();
            $('.weibo-preview').html(_.template(tpl)(data));
        }

    // banner
    } else if (type === 2) {
        let tpl = $('#weibo-banner-preview-tpl').html();
        $('.weibo-preview').html(_.template(tpl)(data))

    // 品速 card
    } else if (type === 3) {
        let tpl = $('#weibo-card-preview-tpl').html();
        $('.weibo-preview').html(_.template(tpl)(data));
    } else {
        let tpl = $('#weibo-grid-preview-tpl').html();
        $('.weibo-preview').html(_.template(tpl)(data));
    }
}

/**
 * 服务器会返回一些类似于 1,2,3 之类的数据，这些数据一般是 { 1: xx, 2: xx, 3: xx }
 * 这种对象的属性名称。
 * @param {String} propStr - 属性字符串
 * @param {Object} obj - 实际数据对象
 * returns {String} - 返回属性名拼接的字符串，如 3g,4g,5g 这种
 */
function getValByProp(propStr, obj) {
    let str = '';
    let propArr = propStr.replace(/\s/g, '').split(',');

    for (let item of propArr) {
        if (str === '') {
            str += obj[item];
        } else {
            str += `,${obj[item]}`;
        }
    }

    return str;
}

/**
 * 服务器返回的地域，兴趣，生活状态和感兴趣的 APP 这几个的数据是相同的，对数据进行的处
 * 理也是相同的，所以把这部分的处理抽离出来，避免重复代码
 * @param {Object} data - 服务器返回的数据
 * @returns {Object} - 处理完的数据对象
 */
function handleSubChildData(data) {
    let obj = {};

    // 将兴趣保存到缓存数组
    for (let item of data.data.records) {
        obj[item.areaId] = item.name;

        // 如果有子兴趣，则将子兴趣一并保存到缓存数组
        for (let childItem of item.childAreas) {
            obj[childItem.areaId] = childItem.name;
        }
    }

    return obj;
}
