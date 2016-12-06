import { initHighmap, getProvinceName } from './libs/highmap-zh-CN';
import { highmap, basePie } from './libs/chart';
import { upsiteDown } from './libs/tools';

let cachePageStatus = {
    platform: null,
    group: null,
    originCrowd: null
};

// 获取业务
requester.get('/external/custom/listPlatformStatus.do').then(data => {
    let _data = {
        navs: []
    };

    // 处理服务器返回的数据 
    for (let item of data.data.records) {
        _data.navs.push({
            type: item.platformId,
            content: item.platformName
        });
    }

    let tpl = $('#content-nav-tpl').html();
    $('#content-sub-nav').html(_.template(tpl)(_data));

    // 数据概览下拉项单击事件
    $('.content-nav-link').unbind('click').bind('click', e => {
        let type = $(e.currentTarget).attr('data-type');
        location.href = `/#proj_name#/html/data/info-overview.html?cid=${urler().cid}&pid=${type}`;
    });
});

// highmap 本地化
initHighmap();

// 激活左侧导航栏
$('#sidebar-statis').addClass('w-active');

// 获取投放平台
requester.get('/select/listPlatForms.do').then(data => {
    for (let prop in data.data) {
        $('#platform').append(`<option value="${prop}">${data.data[prop]}</option>`)
    }
    
    cachePageStatus.platform = data.data;
});

// 获取广告组
requester.get('/select/listAdGroups.do').then(data => {
    for (let prop in data.data) {
        $('#group').append(`<option value="${prop}">${data.data[prop]}</option>`)
    }

    cachePageStatus.group = data.data;
});

// 由于当前设计有问题，其实初始化数据不应该前端根据多个接口返回的数据来进行请求，
// 而应该服务器本身如果不传数据就默认拿某些数据返回过来。
// 这里是用 setInterval 持续不断地监听判断当前是否数据已经拿回来了，如果是，则进行初始化
let timer = setInterval(() => {

    // 如果投放平台和广告组的数据已经返回回来了
    if (cachePageStatus.platform !== null && cachePageStatus.group !== null) {

        // 执行默认操作，拿到本月开始时间和结束时间，执行搜索
        let monthStart = moment().startOf('month').format('YYYY-MM-DD');
        let monthEnd = moment().endOf('month').format('YYYY-MM-DD');
        $('#select-chart-start-date').val(monthStart);
        $('#select-chart-end-date').val(monthEnd);

        // 构造人群数据初始请求参数
        let param = {
            startDate: monthStart,
            endDate: monthEnd,
            page: 1,
            export: false,
            platformId: Object.keys(cachePageStatus.platform)[0],
            groupId: Object.keys(cachePageStatus.group)[0]
        };

        // 获取人群数据并清除定时器
        getCrowData(param);
        clearInterval(timer);
    }
}, 100);

// 搜索
$('#search').click(e => {
    let platformId = $('#platform').val();
    let groupId = $('#group').val();
    let startDate = $('#select-chart-start-date').val();
    let endDate = $('#select-chart-end-date').val();

    // 数据校验
    if (!platformId) {
        modaler.tip('请选择投放平台');
        return;
    }

    // 广告组
    if (!groupId) {
        modaler.tip('请选择广告组');
        return;
    }

    // 搜索人群数据
    getCrowData({
        startDate: startDate,
        endDate: endDate,
        page: 1,
        export: false,
        platformId: platformId,
        groupId: groupId
    });
});

// 导出
$('#export').click(e => {
    let platformId = $('#platform').val();
    let groupId = $('#group').val();
    let startDate = $('#select-chart-start-date').val();
    let endDate = $('#select-chart-end-date').val();

    // 数据校验
    if (!platformId) {
        modaler.tip('请选择投放平台');
        return;
    }

    // 广告组
    if (!groupId) {
        modaler.tip('请选择广告组');
        return;
    }

    // 导出对象
    let exportObj = {
        startDate: startDate,
        endDate: endDate,
        customId: urler().cid,
        groupId: groupId,
        platformId: platformId
    };

    // 拼接下载链接
    let exportUrl = '/deal/data/getCrowdData.do?export=true';
    for (let prop in exportObj) {
        exportUrl += `&${prop}=${exportObj[prop]}`;
    }
    
    location.href = exportUrl;
});

/**
 * 获取人群数据
 * @param {Object} param - 请求的参数
 */
function getCrowData(param, cb = () => {}) {
    requester.get('/deal/data/getCrowdData.do', param).then(data => {
        let infoTpl = $('#info-tpl').html();
        let tableTpl = $('#table-tpl').html();

        // 如果当前有省份数据
        if (data.data.area.y.length > 0) {
            $('#province').show();

            // 渲染省份图表表格
            $('#province-table').html(_.template(infoTpl)({
                radioName: 'province',
                selects: getSelectData(data.data.area)
            }));
            $('#province-table .info-table').html(_.template(tableTpl)({
                table: upsiteDown(
                    [
                        getProvinceName(getTableData(data.data.area)[0]),
                        getTableData(data.data.area)[1]
                    ]
                )
            }));

            let provinceChartOriginData = upsiteDown(getTableData(data.data.area));
            let provinceChartData = [];
            for (let i = 1; i < provinceChartOriginData.length; i++) {
                provinceChartData.push({
                    'hc-key': provinceChartOriginData[i][0],
                    value: provinceChartOriginData[i][1]
                })
            }

            highmap({
                el: '#province-chart',
                data: provinceChartData,
                name: provinceChartOriginData[0][1]
            });

            // 监听地域图表 select 切换
            $('#province-table').off('ifChecked').on('ifChecked', '.info-select [type="radio"]', e => {
                let value = $(e.currentTarget).val();

                $('#province-table .info-table').html(_.template(tableTpl)({
                    table: upsiteDown(
                        [
                            getProvinceName(getTableData(data.data.area, value)[0]),
                            getTableData(data.data.area, value)[1]
                        ]
                    )
                }));

                let provinceChartOriginData = upsiteDown(getTableData(data.data.area, value));
                let provinceChartData = [];
                for (let i = 1; i < provinceChartOriginData.length; i++) {
                    provinceChartData.push({
                        'hc-key': provinceChartOriginData[i][0],
                        value: provinceChartOriginData[i][1]
                    })
                }

                highmap({
                    el: '#province-chart',
                    data: provinceChartData,
                    name: provinceChartOriginData[0][1]
                });
            });
        } else {
            $('#province').hide()
        }

        // 如果当前有年龄数据
        if (data.data.age.y.length > 0) {
            $('#age').show();

            // 渲染年龄图表表格
            $('#age-table').html(_.template(infoTpl)({
                radioName: 'age',
                selects: getSelectData(data.data.age)
            }));
            $('#age-table .info-table').html(_.template(tableTpl)({
                table: upsiteDown(getTableData(data.data.age))
            }));

            let ageChartOriginData = upsiteDown(getTableData(data.data.age));
            let ageChartData = []
            for (let i = 1; i < ageChartOriginData.length; i++) {
                ageChartData.push({
                    name: ageChartOriginData[i][0],
                    y: ageChartOriginData[i][1]
                })
            }

            basePie({
                el: '#age-chart',
                data: ageChartData,
                name: ageChartOriginData[0][1],
                height: 500,
                width: 500
            });

            // 监听年龄图表 select 切换
            $('#age-table').off('ifChecked').on('ifChecked', '.info-select [type="radio"]', e => {
                let value = $(e.currentTarget).val();

                $('#age-table .info-table').html(_.template(tableTpl)({
                    table: upsiteDown(getTableData(data.data.age, value))
                }));

                let ageChartOriginData = upsiteDown(getTableData(data.data.age, value));
                let ageChartData = []
                for (var i = 1; i < ageChartOriginData.length; i++) {
                    ageChartData.push({
                        name: ageChartOriginData[i][0],
                        y: ageChartOriginData[i][1]
                    })
                }

                basePie({
                    el: '#age-chart',
                    data: ageChartData,
                    name: ageChartOriginData[0][1],
                    height: 500,
                    width: 500
                });
            });

        } else {
            $('#age').hide()
        }

        // 如果当前有性别数据
        if (data.data.sex.y.length > 0) {
            $('#sex').show();

            // 渲染性别图表表格
            $('#sex-table').html(_.template(infoTpl)({
                radioName: 'sex',
                selects: getSelectData(data.data.sex)
            }));
            $('#sex-table .info-table').html(_.template(tableTpl)({
                table: upsiteDown(getTableData(data.data.sex))
            }));
            
            let sexChartOriginData = upsiteDown(getTableData(data.data.sex));
            let sexChartData = []
            for (let i = 1; i < sexChartOriginData.length; i++) {
                sexChartData.push({
                    name: sexChartOriginData[i][0],
                    y: sexChartOriginData[i][1]
                })
            }
            
            basePie({
                el: '#sex-chart',
                data: sexChartData,
                name: sexChartOriginData[0][1]
            });

            $('[type="radio"]').iCheck({
                checkboxClass: 'icheckbox_flat-blue',
                radioClass: 'iradio_flat-blue'
            });

            // 监听性别图表 select 切换
            $('#sex-table').off('ifChecked').on('ifChecked', '.info-select [type="radio"]', e => {
                let value = $(e.currentTarget).val();

                $('#sex-table .info-table').html(_.template(tableTpl)({
                    table: upsiteDown(getTableData(data.data.sex, value))
                }));
            
                let sexChartOriginData = upsiteDown(getTableData(data.data.sex, value));
                let sexChartData = []
                for (var i = 1; i < sexChartOriginData.length; i++) {
                    sexChartData.push({
                        name: sexChartOriginData[i][0],
                        y: sexChartOriginData[i][1]
                    })
                }
                
                basePie({
                    el: '#sex-chart',
                    data: sexChartData,
                    name: sexChartOriginData[0][1]
                });
            });
        } else {
            $('#sex').hide()
        }

        if (
            data.data.area.y.length < 1 &&
            data.data.age.y.length < 1 &&
            data.data.sex.y.length < 1
        ) {
            modaler.tip('当前没有数据');
        }

        cb();
    });
}

/**
 * 将服务器返回的数据提取成 [[xxx, xxx, xxx], [1, 2, 3], [4, 5, 6]...] 这种形式
 * @param {Object} data - 服务器返回数据中某个数据块
 * @returns {Object} 返回处理过的数据
 */
function handleData(data) {
    let arr = [];

    // 添加表格头数组
    arr[0] = [data.name];
    for (let item of data.x) {
        arr[0].push(item);
    }

    // 添加表格体数组
    for (let item of data.y) {
        let length = arr.length;
        arr[length] = [item.name];
        for (let _item of item.data) {
            arr[length].push(_item);
        }
    }

    return arr;
}

/**
 * 抽取渲染 select 选项所需要的值
 * @param {Object} data - 服务器返回数据中某个数据块
 * @returns {Object} 返回处理过的数据
 */
function getSelectData(data) {
    var distArr = [];
    
    for (let i = 0; i < data.y.length; i++) {
        if (i === 0) {
            distArr.push({
                check: true,
                val: data.y[i].name
            });
        } else {
            distArr.push({
                check: false,
                val: data.y[i].name
            });
        }
    }

    return distArr;
}

/**
 * 获取表格所需要的数据
 * @param {Object} data - 服务器返回数据中某个数据块
 * @returns {Object} 返回处理过的数据
 */
function getChartData(data) {
    let distData = {};
    return distData;
}

/**
 * 抽取渲染表格所需要的数据
 * @param {Object} data - 服务器返回数据中的某个数据块
 * @returns {Object} 返回处理过的数据
 */
function getTableData(data, target) {
    let _data = handleData(data), dist = [];

    if (!target) {
        dist = [_data[0], _data[1]]
    } else {
        dist.push(_data[0]);

        for (let item of _data) {
            if (item[0] === target) {
                dist.push(item);
            }
        }
    }

    return dist
}

/**
 * 渲染图表和渲染表格
 * @param {String} el - 元素
 * @param {Object} data - 渲染所需要的数据 -> {table: '', chart: ''}
 * @param {Number} type - 标识当前渲染的是地图（1）还是饼状图（2）
 */
function renderData({ el, data, type }) {

    // 渲染表格
    let tpl = $('#table-tpl').html();
    $(el).html(_.template(tpl)(data.table))

    // 渲染图表
    switch (type) {

        // 渲染地图
        case 1:
            break;
        
        // 渲染饼状图
        case 2:
            break;
        default:
            break;
    }
}

// 人群返回过来的假数据
// {"code":200,"message":"","data":{"area":{"name":"地域","x":["0","300","301","302","303","304","305","306","307","308","309","310","311","312","313","314","315","316","317","318","319","320","321","322","323","324","325","326","327","328","329","330","331","332","333","334","335","336","337","338","339","340","341","342"],"y":[{"name":"曝光量","data":[0,0,122533,0,0,13192,0,24639,0,0,0,0,0,0,0,39690,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"name":"互动量","data":[0,0,12,0,0,32,0,63,0,0,0,0,0,0,0,54,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"name":"互动率","data":[0,0,0.01,0,0,0.24,0,0.26,0,0,0,0,0,0,0,0.14,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"name":"互动成本","data":[0,0,9.3,0,0,4.36,0,4.59,0,0,0,0,0,0,0,4.59,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"name":"点击量","data":[0,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"name":"点击率","data":[0,0,0,0,0,0.02,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"name":"点击均价","data":[0,0,0,0,0,69.83,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"name":"下载量","data":[0,0,0,0,0,2,0,7,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"name":"下载率","data":[0,0,0,0,0,0.02,0,0.03,0,0,0,0,0,0,0,0.02,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"name":"下载均价","data":[0,0,0,0,0,69.83,0,41.37,0,0,0,0,0,0,0,41.37,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},{"name":"消耗","data":[0,0,111.7,0,0,139.66,0,289.59,0,0,0,0,0,0,0,248.22,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]}]},"sex":{"name":"性别","x":["男","女","未知"],"y":[{"name":"曝光量","data":[9888,8932,0]},{"name":"互动量","data":[9,18,0]},{"name":"互动率","data":[0.09,0.2,0]},{"name":"互动成本","data":[4.59,4.59,0]},{"name":"下载量","data":[1,2,0]},{"name":"下载率","data":[0.01,0.02,0]},{"name":"下载均价","data":[41.37,41.37,0]},{"name":"消耗","data":[41.37,82.74,0]}]},"age":{"name":"年龄","x":["1~10","11~20","21~30","31~40","41~50","51~60","61~70","71~80","81~90","91~100"],"y":[{"name":"曝光量","data":[0,42080,35646,0,0,0,0,0,0,0]},{"name":"互动量","data":[0,44,72,0,0,0,0,0,0,0]},{"name":"互动率","data":[0,0.1,0.2,0,0,0,0,0,0,0]},{"name":"互动成本","data":[0,5.71,4.59,0,0,0,0,0,0,0]},{"name":"点击量","data":[0,2,0,0,0,0,0,0,0,0]},{"name":"点击均价","data":[0,125.68,0,0,0,0,0,0,0,0]},{"name":"下载量","data":[0,2,8,0,0,0,0,0,0,0]},{"name":"下载率","data":[0,0.0,0.02,0,0,0,0,0,0,0]},{"name":"下载均价","data":[0,125.68,41.37,0,0,0,0,0,0,0]},{"name":"消耗","data":[0,251.36,330.96,0,0,0,0,0,0,0]}]}}}