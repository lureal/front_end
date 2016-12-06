/*!
 * 广告
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var sidebar = require('./modules/sidebar.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var urler = require('./modules/urler.js');
var time = require('./modules/time.js');
var header = require('./modules/header.js');
var cache = require('./modules/cache.js');
var timer = require('./modules/time-picker.js');

// 初始化 url 模块
urler.initLink();

//初始化菜单
sidebar.delivery({
    title: '广告',
    active: 'ad'
});

// 初始化顶部栏
header.delivery({
    title: '广告'
});

// 获取数据
if(urler.normal().order_id) {
    var dataStore = cache.get('delivery_ad_detail');
} else {
    var dataStore = cache.get('delivery_ad_add');
}

// 将数据拼接成服务器需要的格式
var data = {
    name: dataStore.one.name, // 订单名称
    groupId: dataStore.one.group, // 广告组 id
    platformId: dataStore.one.platform, // 平台 id
    type: dataStore.two.type, // 类型
    adPlacementId: dataStore.two.adPlacementId, // 广告位 id
    ad: dataStore.two.ad, // 广告素材
    bidWay: dataStore.three.bidWay, // 竞价方式
    os: dataStore.three.os, // 系统
    wifi: dataStore.three.wifi, // 网络
    date: dataStore.three.date, // 日期
    time: dataStore.three.time, // 时间
    bidPrice: dataStore.three.bidPrice, // 出价
    quota: dataStore.three.quota, // 限额
    age: dataStore.three.age, // 年龄
    sex: dataStore.three.sex, // 性别
    areaId: dataStore.three.areaId, // 地域 id
    interestId: dataStore.three.interestId, // 兴趣
    lifeIds: dataStore.three.lifeIds, // 生活状态
    uids: dataStore.three.uids, // uid的值
    apps: dataStore.three.apps, // app的值
    exposureMonitorUrl: dataStore.three.exposureMonitorUrl,
    clickMonitorUrl: dataStore.three.clickMonitorUrl
};

console.log(data);

// 获取数据，渲染模板
$('#detail').html(_.template($('#preview-tpl').html())(data));

// 页面中有一些数据需要调用接口才能渲染出来
// 推广计划
ajax.get({
    url: '/select/listAdGroups.do',
    param: {
        customId: urler.normal().cid
    },
    cb: function(_data) {

        // 获取广告名称
        var plan = _data.data[data.groupId];

        // 填充数据
        $('#plan').val(plan);

    },
    title: '广告',
    modal: modal
});

// 定向用户
// 用户地域
renderArea(function(obj) {
    renderInterest(function(interestObj) {
        renderLifes(function(lifeObj) {
            renderApp(function(appObj) {
                var _areaId = JSON.parse('[' + data.areaId + ']');
                var areaStr = []; // 用户地域字符串
                _.each(_areaId, function(id) {
                    areaStr.push(obj[id]);
                });

                var _interestId = JSON.parse('[' + data.interestId + ']');
                var interestArr = [];
                _.each(_interestId, function(id) {
                    interestArr.push(interestObj[id]);
                });

                // 生活状态
                var _lifeIds = JSON.parse('['+ data.lifeIds +']');
                var lifeArr = [];
                _.each(_lifeIds, function(id) {
                    lifeArr.push(lifeObj[id]);
                });

                // app
                var _apps = JSON.parse('['+ data.apps +']');
                var appArr = [];
                _.each(_apps, function(id) {
                    appArr.push(appObj[id]);
                });

                var _sexId = JSON.parse('[' + data.sex + ']');
                var sexArr = [];
                _.each(_sexId, function(sex) {
                    switch(sex) {
                        case 0:
                            sexArr.push('不限');
                            break;
                        case 1:
                            sexArr.push('男');
                            break;
                        case 2:
                            sexArr.push('女');
                            break;
                        default:
                            sexArr.push('未知');
                    }
                });

                var _wifiId = JSON.parse('[' + data.wifi +']');
                var wifiArr = [];
                _.each(_wifiId, function(wifi) {
                    switch(wifi) {
                        case 0:
                            wifiArr.push('不限');
                            break;
                        case 1:
                            wifiArr.push('WIFI');
                            break;
                        case 2:
                            wifiArr.push('2G');
                            break;
                        case 3:
                            wifiArr.push('3G');
                            break;
                        default:
                            wifiArr.push('4G');
                            break;

                    }
                });

                var _systemId = JSON.parse('[' + data.os + ']');
                var systemArr = [];
                _.each(_systemId, function(system) {
                    switch(system) {
                        case 0:
                            systemArr.push('不限');
                            break;
                        case 1:
                            systemArr.push('IOS');
                            break;
                        default:
                            systemArr.push('安卓');
                    }
                });

                var ageStr = data.age.replace(/~/g, '岁至') + '岁',
                    areaStr = '在' + areaStr.toString().replace(/[\[\]]/g, '') + '地区 ',
                    sexStr = '性别为' + sexArr.toString().replace(/[\[\]]/g, ''),
                    wifiStr = '网络为' + wifiArr.toString().replace(/[\[\]]/g, ''),
                    systemStr = '系统为' + systemArr.toString().replace(/[\[\]]/g, ''),
                    lifeStr = '用户的生活状态为' + lifeArr.toString().replace(/[\[\]]/g, ''),
                    appStr = '用户偏好的APP为' + appArr.toString().replace(/[\[\]]/g, ''),
                    interestStr = '兴趣为' + interestArr.toString().replace(/[\[\]]/g, '');
                $('#target').html(ageStr + '\r' + areaStr + '\r' + sexStr + '\r' + wifiStr + '\r' + systemStr + '\r' + interestStr + '\r' + appStr + '\r' + lifeStr);
            });
        });
    });
});

// 出价方式
ajax.get({
    url: '/select/listBidWays.do',
    param: {
        platformId: urler.normal().order_id ? cache.get('delivery_ad_detail.one.platform') : cache.get('delivery_ad_add.one.platform'),
        customId: urler.normal().cid
    },
    title: '广告',
    cb: function(_data) {
        console.log(_data.data[data.bidWay])
        $('#price-type').val(_data.data[data.bidWay] + " " + (data.bidPrice / 100) + '元');
    }
});

// 提交订单
$('#submit').click(function() {

    var _data = {
        name: data.name, // 订单名称
        groupId: data.groupId, // 广告组 id
        platformId: data.platformId, // 平台 id
        type: data.type, // 类型
        adPlacementId: data.adPlacementId, // 广告位 id
        bidWay: data.bidWay, // 竞价方式
        os: data.os, // 系统
        wifi: data.wifi, // 网络
        date: data.date, // 日期
        time: data.time, // 时间
        bidPrice: data.bidPrice, // 出价
        quota: data.quota, // 限额
        age: data.age, // 年龄
        sex: data.sex, // 性别
        areaId: data.areaId, // 地域 id
        interestId: data.interestId, // 兴趣
        lifeIds: data.lifeIds, // 生活状态
        uids: data.uids, // uid的值
        apps: data.apps, // app的值
        customId: urler.normal().cid,
        exposureMonitorUrl: data.exposureMonitorUrl,
        clickMonitorUrl: data.clickMonitorUrl
    };

    console.log(data);
    console.log(JSON.stringify(data.ad.picUrls));


    // 将 data 字段中的 ad 转换成服务器想要的样子
    // 通过特定字段判定当前 ad 属于那种类型
    // 博文 mid
    if(data.ad.mid !== undefined) {

        _data['ad.mid'] = data.ad.mid;
        _data['ad.uid'] = data.ad.uid;

    // 博文
    } else if(data.ad.text !== undefined && data.ad.cardTitle === undefined && data.ad.appType === undefined ) {
        _data['ad.text'] = data.ad.text;
        _data['ad.uid'] = data.ad.uid;

        _.each(data.ad.picUrls, function(pic, index) {
            _data['ad.picUrls[' + index + ']'] = data.ad.picUrls[index];
        });

    // 品速card
    } else if(data.ad.cardTitle !== undefined) {

        _data['ad.text'] = data.ad.text;
        _data['ad.cardTitle'] = data.ad.cardTitle;
        _data['ad.cardType'] = data.ad.cardType;
        _data['ad.cardDesc'] = data.ad.cardDesc;
        _data['ad.cardButtonUrl'] = data.ad.cardButtonUrl;
        _data['ad.cardButtonType'] = data.ad.cardButtonType;
        if(data.ad.cardType === 1) {
            _data['ad.videoPath'] = '';
        } else {
            _data['ad.videoPath'] = data.ad.videoPath;
        }

        _data['ad.uid'] = data.ad.uid;
        // _data['ad.picUrl'] = data.ad.picUrl;
        _.each(data.ad.picUrls, function(pic, index) {
            _data['ad.picUrls[' + index + ']'] = data.ad.picUrls[index];
        });
        _data['ad.landingpageUrl'] = data.ad.landingpageUrl;


    // 九宫格
    } else if(data.ad.appType !== undefined) {

        _data['ad.text'] = data.ad.text;
        // _data['ad.picUrls'] = JSON.stringify(data.ad.picUrls);
        _.each(data.ad.picUrls, function(pic, index) {
            _data['ad.picUrls[' + index + ']'] = data.ad.picUrls[index];
        });
        _data['ad.uid'] = data.ad.uid;
        // _.each(data.ad.picUrls, function(pic, index) {
        //     _data['ad.picUrls[' + index + ']'] = data.ad.picUrls[index];
        // });
        _data['ad.cardButtonType'] = data.ad.cardButtonType;
        _data['ad.appType'] = data.ad.appType;
        _data['ad.appUrl'] = data.ad.appUrl;
        _data['ad.appName'] = data.ad.appName;
        _data['ad.appClassify'] = data.ad.appType === '0' ? data.ad.appClassify : '';
        _data['ad.appDeveloper'] = data.ad.appType === '0' ? data.ad.appDeveloper : '';
        _data['ad.appDesc'] = data.ad.appType === '0'? data.ad.appDesc : '';
        _data['ad.appIcon'] = data.ad.appType === '0'? data.ad.appIcon : '';
        _data['ad.appImages'] = data.ad.appType === '0'? JSON.stringify(data.ad.appImages): '';
        _data['ad.appUpdate'] = data.ad.appType === '0'? data.ad.appUpdate: '';
    }

    // Banner
    else {
        _data['ad.landingpageUrl'] = data.ad.landingpageUrl;
        _data['ad.picUrl'] = data.ad.picUrl;
    }

    modal.nobtn({
        ctx: 'body',
        title: '广告',
        ctn: '正在提交，请稍等'
    });

    if(urler.normal().order_id) {
        ajax.post({
            url: '/deal/order/submit.do',
            param: _.extend({}, _data, {orderId: urler.normal().order_id}),
            cb: function(data) {
                if(data.data === true) {
                    modal.onebtn({
                        ctx: 'body',
                        title: '广告',
                        ctn: '更新广告成功',
                        event: function() {
                            urler.initLink('/#proj_name#/html/delivery/ad/list.html');
                        }
                    });
                } else {
                    modal.nobtn({
                        ctx: 'body',
                        title: '广告',
                        ctn: data.message !== '' ? data.message : '添加广告失败'
                    });
                }
            }
        });
    } else {
        ajax.post({
            url: '/deal/order/submit.do',
            param: _data,
            cb: function(data) {
                if(data.data === true) {
                    modal.onebtn({
                        ctx: 'body',
                        title: '广告',
                        ctn: '添加广告成功',
                        event: function() {
                            urler.initLink('/#proj_name#/html/delivery/ad/list.html');
                        }
                    });
                } else {
                    modal.nobtn({
                        ctx: 'body',
                        title: '广告',
                        ctn: data.message !== '' ? data.message : '添加广告失败'
                    });
                }
            }
        });
    }
});

/**
 * 从服务器获取地域数据并转换服务器传递过来的数据
 */
function renderArea(cb) {
    ajax.get({
        url: '/deal/listAreas.do',
        param: {
            customId: urler.normal().cid
        },
        cb: function(data) {

            var arr = {};
            _.each(data.data.records, function(record) {
                arr[record.areaId] = record.name;

                // 如果有子菜单
                _.each(record.childAreas, function(childArea) {
                    arr[childArea.areaId] = childArea.name;
                })
            })
            cb(arr, data);
        }
    });
}

/**
 * 从服务器获取兴趣数据并进行转换
 */
function renderInterest(cb) {
    ajax.get({
        url: '/deal/listInterests.do',
        param: {
            customId: urler.normal().cid
        },
        cb: function(data) {
            var arr = {};
            _.each(data.data.records, function(record) {
                arr[record.areaId] = record.name;

                // 如果有子菜单
                _.each(record.childAreas, function(childArea) {
                    arr[childArea.areaId] = childArea.name;
                })
            })

            cb(arr, data);
        }
    });
}

/**
 * 从服务器获取生活状态相关数据并转换服务器传递过来的数据
 */
function renderLifes(cb) {
    ajax.get({
        url: '/deal/listLifes.do',
        param: {
            customId: urler.normal().cid
        },
        cb: function(data) {

            var arr = {};
            _.each(data.data.records, function(record) {
                arr[record.areaId] = record.name;

                // 如果有子菜单
                _.each(record.childAreas, function(childArea) {
                    arr[childArea.areaId] = childArea.name;
                })
            })
            cb(arr, data);
        }
    });
}

/**
 * 从服务器获取app的数据并转换相应的数据
 */
function renderApp(cb) {
    ajax.get({
        url: '/deal/listApps.do',
        param: {
            customId: urler.normal().cid
        },
        cb: function(data) {

            var arr = {};
            _.each(data.data.records, function(record) {
                arr[record.areaId] = record.name;

                // 如果有子菜单
                _.each(record.childAreas, function(childArea) {
                    arr[childArea.areaId] = childArea.name;
                })
            })
            cb(arr, data);
        }
    });
}
