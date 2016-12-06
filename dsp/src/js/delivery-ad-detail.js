/*!
 * 广告详情
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
    title: '广告详情',
    active: 'ad'
});

// 初始化顶部栏
header.delivery({
    title: '广告详情'
});

// 获取订单详情
ajax.get({
    url: '/deal/order/get.do',
    param: {
        orderId: urler.normal().id,
        customId: urler.normal().cid
    },
    cb: function(data) {

        console.log('---------------');
        console.log(data);
        console.log('---------------');
        console.log(data.data.orderId);

        // 构造渲染页面需要的数据
        var renderData = {
            name: data.data.name,
            groupId: data.data.groupId,
            platformId: data.data.platformId,
            type: String(data.data.type),
            adPlacementId: data.data.adPlacementId,
            bidWay: data.data.bidWay,
            os: data.data.os,
            wifi: data.data.wifi,
            date: data.data.date,
            time: data.data.time,
            bidPrice: data.data.bidPrice,
            quota: data.data.quota,
            age: data.data.age,
            sex: data.data.sex,
            areaId: data.data.areaIds,
            ad: data.data.ad,
            interestId: data.data.interestIds, // 兴趣
            lifeIds: data.data.lifeIds, // 生活状态
            apps: data.data.apps, //喜爱的app
            uids: data.data.uids, // 用户输入的uids
            exposureMonitorUrl: data.data.exposureMonitorUrl,
            clickMonitorUrl: data.data.clickMonitorUrl
        };

        // 获取数据，渲染模板
        $('#detail').html(_.template($('#preview-tpl').html())(renderData));

        // 填充广告ID（自动生成）
        $('#order-id').val(data.data.orderId);

        // 页面中有一些数据需要调用接口才能渲染出来
        // 推广计划
        ajax.get({
            url: '/select/listAdGroups.do',
            param: {
                customId: urler.normal().cid
            },
            cb: function(_data) {

                // 获取广告名称
                var plan = _data.data[renderData.groupId];


                // 填充数据
                $('#plan').val(plan);

            },
            title: '广告详情',
            modal: modal
        });

        // 定向用户
        // 用户地域
        renderArea(function(obj) {
            renderInterest(function(interestObj) {
                renderLifes(function(lifeObj) {
                    renderApp(function(appObj) { 
                        var _areaId = JSON.parse('[' + renderData.areaId + ']');
                        var areaStr = []; // 用户地域字符串
                        _.each(_areaId, function(id) {
                            areaStr.push(obj[id]);
                        });

                        var _interestId = JSON.parse('[' + renderData.interestId + ']');
                        var interestArr = [];
                        _.each(_interestId, function(id) {
                            interestArr.push(interestObj[id]);
                        });

                        // 生活状态
                        var _lifeIds = JSON.parse('['+ renderData.lifeIds +']');
                        var lifeArr = [];
                        _.each(_lifeIds, function(id) {
                            lifeArr.push(lifeObj[id]);
                        });

                        // app 
                        var _apps = JSON.parse('['+ renderData.apps +']');
                        var appArr = [];
                        _.each(_apps, function(id) {
                            appArr.push(appObj[id]);
                        });


                        var _sexId = JSON.parse('[' + renderData.sex + ']');
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

                        var _wifiId = JSON.parse('[' + renderData.wifi +']');
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

                        var _systemId = JSON.parse('[' + renderData.os + ']');
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

                        var ageStr = renderData.age.replace(/~/g, '岁至') + '岁',
                            areaStr = '在' + areaStr.toString().replace(/[\[\]]/g, '') + '地区 ',
                            sexStr = '性别为' + sexArr.toString().replace(/[\[\]]/g, ''),
                            wifiStr = '网络为' + wifiArr.toString().replace(/[\[\]]/g, ''),
                            systemStr = '系统为' + systemArr.toString().replace(/[\[\]]/g, ''),
                            lifeStr = '用户的生活状态为' + lifeArr.toString().replace(/[\[\]]/g, ''),
                            appStr = '用户偏好的APP为' + appArr.toString().replace(/[\[\]]/g, ''),
                            interestStr = '兴趣为' + interestArr.toString().replace(/[\[\]]/g, '');

                        $('#target').html(ageStr + '\r' + areaStr + '\r' + sexStr + '\r ' + wifiStr + '\r ' + systemStr + '\r' + interestStr + '\r ' + appStr + '\r' + lifeStr);
                    });
                });
            });
        });

        // 出价方式
        ajax.get({
            url: '/select/listBidWays.do',
            param: {
                platformId: data.data.platformId,
                customId: urler.normal().cid
            },
            title: '广告详情',
            cb: function(_data) {
                console.log(_data.data[renderData.bidWay])
                $('#price-type').val(_data.data[renderData.bidWay] + " " + (renderData.bidPrice / 100) + '元');
            }
        });

        // 获取订单图表
        ajax.get({
            url: '/deal/order/getChart.do',
            param: {
                startDate: '',
                endDate: '',
                orderId: urler.normal().id,
                customId: urler.normal().cid
            },
            cb: function(data) {
                var cacheData = data; // 缓存数据，给生成图表使用

                if(cacheData.data === null) {
                    cacheData.data = {
                        name: '',
                        x: [],
                        y: []
                    }
                }

                // 初始化图表日期
                datePicker.init('#chart-datepicker');

                // 构造数据
                var selectData = {};
                _.each(cacheData.data.y, function(val, index) {
                    selectData[index] = val.name;
                });

                // 渲染下拉选择框模板
                $('#chart-select').html(_.template($('#type-tpl').html())({data: selectData}));

                // 初始化图表下拉选择框
                $('#chart-select').select2({
                    placeholder: '选择显示数据'
                }).select2('val', '');

                // 构造渲染图表数据
                var y = {
                    info: [],
                    data: []
                };
                _.each(cacheData.data.y, function(val, index) {

                    // y 轴标题
                    if(index % 2 !== 0) {
                        y.info.push({
                            labels: {
                                format: '{value}'
                            },
                            title: {
                                text: ''
                            },
                            opposite: true
                        });
                    } else {
                        y.info.push({
                            labels: {
                                format: '{value}'
                            },
                            title: {
                                text: ''
                            }
                        });
                    }

                    // y 轴数据
                    y.data.push({
                        name: val.name,
                        type: 'spline',
                        data: val.data
                    })
                });

                // 渲染图表
                renderChart($('#chart'), {
                    title: cacheData.data.name,
                    x: cacheData.data.x,
                    y: y
                });

                // 搜索
                $('#chart-search').click(function() {

                    // 获取值
                    var date = datePicker.getVal('#chart-datepicker');

                    // 请求数据，渲染图表
                    ajax.get({
                        url: '/deal/order/getChart.do',
                        param: {
                            startDate: date.start,
                            endDate: date.end,
                            orderId: urler.normal().id,
                            customId: urler.normal().cid
                        },
                        cb: function(data) {
                            cacheData = data; // 将数据绑定到 cacheData

                            if(cacheData.data === null) {
                                cacheData.data = {
                                    name: '',
                                    x: [],
                                    y: []
                                }
                            }

                            // 构造数据
                            var selectData = {};
                            _.each(cacheData.data.y, function(val, index) {
                                selectData[index] = val.name;
                            });

                            // 渲染下拉选择框模板
                            $('#chart-select').html(_.template($('#type-tpl').html())({data: selectData}));

                            // 初始化图表下拉选择框
                            $('#chart-select').select2({
                                placeholder: '选择显示数据'
                            }).select2('val', '');

                            // 构造渲染图表数据
                            var y = {
                                info: [],
                                data: []
                            };
                            _.each(cacheData.data.y, function(val, index) {

                                // y 轴标题
                                if(index % 2 !== 0) {
                                    y.info.push({
                                        labels: {
                                            format: '{value}'
                                        },
                                        title: {
                                            text: ''
                                        },
                                        opposite: true
                                    });
                                } else {
                                    y.info.push({
                                        labels: {
                                            format: '{value}'
                                        },
                                        title: {
                                            text: ''
                                        }
                                    });
                                }

                                // y 轴数据
                                y.data.push({
                                    name: val.name,
                                    type: 'spline',
                                    data: val.data
                                })
                            });

                            // 渲染图表
                            renderChart($('#chart'), {
                                title: cacheData.data.name,
                                x: cacheData.data.x,
                                y: y
                            });
                        }
                    });
                });

                // 生成图表
                $('#generate-chart').click(function() {
                    var select = select2.getVal({
                        id: '#chart-select'
                    });

                    // 当前服务器没有返回数据
                    if(select === null) {
                        modal.nobtn({
                            ctx: 'body',
                            ctn: '请选择坐标轴，如果当前无法先择坐标轴则是当前没有数据可以展示',
                            title: '广告详情'
                        });
                        return;
                    }

                    // 判定数量只能为两个
                    if(select.length !== 2 || select === null) {
                        modal.nobtn({
                            ctx: 'body',
                            ctn: '请选择两个选项',
                            title: '广告详情'
                        });
                        return;
                    }

                    // 根据用户的选择重新构造数据
                    var _data = {
                        name: cacheData.data.name,
                        x: cacheData.data.x,
                        y: []
                    };

                    _.each(select, function(val, index) {
                        _data.y.push(cacheData.data.y[val]);
                    });

                    // 构造渲染图表数据
                    var y = {
                        info: [],
                        data: []
                    };
                    _.each(_data.y, function(val, index) {

                        // y 轴标题
                        if(index % 2 !== 0) {
                            y.info.push({
                                labels: {
                                    format: '{value}'
                                },
                                title: {
                                    text: ''
                                },
                                opposite: true
                            });

                            // y 轴数据
                            y.data.push({
                                name: val.name,
                                type: 'spline',
                                yAxis: index,
                                data: val.data
                            })
                        } else {
                            y.info.push({
                                labels: {
                                    format: '{value}'
                                },
                                title: {
                                    text: ''
                                }
                            });

                            // y 轴数据
                            y.data.push({
                                name: val.name,
                                type: 'spline',
                                dashStyle: 'shortdot',
                                yAxis: index,
                                data: val.data
                            })
                        }
                    });

                    // 渲染图表
                    renderChart($('#chart'), {
                        title: _data.name,
                        x: _data.x,
                        y: y
                    });
                });
            }
        });

        // 复制当前订单，创建一个新的订单
        $('#copy').click(function() {
            cache.set('delivery_ad_add', {
                one: {
                    group: data.data.groupId,
                    name: data.data.name,
                    platform: data.data.platformId
                },
                two: {
                    type: String(data.data.type),
                    adPlacementId: String(data.data.adPlacementId),
                    ad: data.data.ad
                },
                three: {
                    bidWay: data.data.bidWay,
                    os: data.data.os,
                    wifi: data.data.wifi,
                    date: data.data.date,
                    time: data.data.time,
                    bidPrice: data.data.bidPrice,
                    quota: data.data.quota,
                    age: data.data.age,
                    sex: data.data.sex,
                    uids: data.data.uids, // uid的值
                    apps: JSON.stringify(data.data.apps).replace(/[\[\]]/g, ''), // app的值
                    lifeIds: JSON.stringify(data.data.lifeIds).replace(/[\[\]]/g, ''), // 生活状态
                    areaId: JSON.stringify(data.data.areaIds).replace(/[\[\]]/g, ''),
                    interestId: JSON.stringify(data.data.interestIds).replace(/[\[\]]/g, ''),
                    exposureMonitorUrl: data.data.exposureMonitorUrl,
                    clickMonitorUrl: data.data.clickMonitorUrl
                }
            });

            console.log({
                one: {
                    group: data.data.groupId,
                    name: data.data.name,
                    platform: data.data.platformId
                },
                two: {
                    type: String(data.data.type),
                    adPlacementId: data.data.adPlacementId,
                    ad: data.data.ad
                },
                three: {
                    bidWay: data.data.bidWay,
                    os: data.data.os,
                    wifi: data.data.wifi,
                    date: data.data.date,
                    time: data.data.time,
                    bidPrice: data.data.bidPrice,
                    quota: data.data.quota,
                    age: data.data.age,
                    sex: data.data.sex,
                    uids: data.data.uids,
                    lifeIds: JSON.stringify(data.data.lifeIds).replace(/[\[\]]g/, ''),
                    apps: JSON.stringify(data.data.apps).replace(/[\[\]]g/, ''),
                    areaId: JSON.stringify(data.data.areaIds).replace(/[\[\]]g/, ''),
                    exposureMonitorUrl: data.data.exposureMonitorUrl,
                    clickMonitorUrl: data.data.clickMonitorUrl
                }
            });

            urler.initLink('/#proj_name#/html/delivery/ad/step1.html');
        });

        // 编辑当前广告
        $('#edit').click(function() {
            cache.set('delivery_ad_detail', {
                one: {
                    group: data.data.groupId,
                    name: data.data.name,
                    platform: data.data.platformId
                },
                two: {
                    type: String(data.data.type),
                    adPlacementId: String(data.data.adPlacementId),
                    ad: data.data.ad
                },
                three: {
                    bidWay: data.data.bidWay,
                    os: data.data.os,
                    wifi: data.data.wifi,
                    date: data.data.date,
                    time: data.data.time,
                    bidPrice: data.data.bidPrice,
                    quota: data.data.quota,
                    age: data.data.age,
                    sex: data.data.sex,
                    uids: data.data.uids,
                    lifeIds: JSON.stringify(data.data.lifeIds).replace(/[\[\]]g/, ''),
                    apps: JSON.stringify(data.data.apps).replace(/[\[\]]g/, ''),
                    areaId: JSON.stringify(data.data.areaIds).replace(/[\[\]]/g, ''),
                    interestId: JSON.stringify(data.data.interestIds).replace(/[\[\]]/g, ''),
                    exposureMonitorUrl: data.data.exposureMonitorUrl,
                    clickMonitorUrl: data.data.clickMonitorUrl
                }
            });

            console.log({
                one: {
                    group: data.data.groupId,
                    name: data.data.name,
                    platform: data.data.platformId
                },
                two: {
                    type: String(data.data.type),
                    adPlacementId: data.data.adPlacementId,
                    ad: data.data.ad
                },
                three: {
                    bidWay: data.data.bidWay,
                    os: data.data.os,
                    wifi: data.data.wifi,
                    date: data.data.date,
                    time: data.data.time,
                    bidPrice: data.data.bidPrice,
                    quota: data.data.quota,
                    age: data.data.age,
                    sex: data.data.sex,
                    uids: data.data.uids,
                    lifeIds: JSON.stringify(data.data.lifeIds).replace(/[\[\]]g/, ''),
                    apps: JSON.stringify(data.data.apps).replace(/[\[\]]g/, ''),
                    areaId: JSON.stringify(data.data.areaIds).replace(/[\[\]]g/, ''),
                    exposureMonitorUrl: data.data.exposureMonitorUrl,
                    clickMonitorUrl: data.data.clickMonitorUrl
                }
            });

            // detail 用来标识当前是不是详情
            urler.initLink('/#proj_name#/html/delivery/ad/step1.html?order_id=' + urler.normal().id);
        });
    }
});

/**
 * 从服务器获取并转换服务器传递过来的数据
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

/**
 * 渲染图图表，列表一开始是通过日期去请求数据，数据请求完成后需要将 Y 轴的 name
 * 提取出来，作为图表左上和右上两个下拉框，当用户选择左上和右上两个下拉框则重新
 * 渲染图表，图表中展示的就是左边和右边两个下拉框选择的数据
 */
function renderChart($el, chart) {
    $el.highcharts({
        chart: {
            zoomType: 'xy'
        },
        title: {
            text: chart.title
        },
        subtitle: {
            text: ''
        },
        xAxis: [{
            categories: chart.x,
            crosshair: true
        }],
        yAxis: chart.y.info,
        series: chart.y.data
    });

    // 隐藏图表信息
    $('[style="cursor:pointer;color:#909090;font-size:9px;fill:#909090;"]').css('display', 'none');
}
