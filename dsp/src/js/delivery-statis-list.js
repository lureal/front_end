/*!
 * 数据统计
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
var arrayer = require('./modules/arrayer.js');
var province = require('./modules/province.js');

//初始化菜单
sidebar.delivery({
    title: '数据统计',
    active: 'statis'
});

// 初始化顶部栏
header.delivery({
    title: '数据统计'
});

// 获取数据概览数据
// 获取平台数据
ajax.get({
    url: '/select/listPlatForms.do',
    param: {
        customId: urler.normal().cid
    },
    cb: function(platformData) {

        // 获取数据概览数据
        lister({
            ajax: ajax,
            ajaxParam: {
                url: '/deal/data/listPlacementDatas.do',
                param: {
                    page: 1,
                    export: false,
                    platformId: Object.keys(platformData.data)[0],
                    placementId: 1,
                    customId: urler.normal().cid
                },
                title: '数据统计'
            },
            $btn: null,
            callback: function(data) {

                // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
                data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                    page: 1,
                    export: false,
                    platformId: Object.keys(platformData.data)[0],
                    placementId: 1,
                    customId: urler.normal().cid
                }));

                // 渲染模板
                var tpl = $('#overview-list-tpl').html();
                $('#overview-list').html(_.template(tpl)(data));

                datePicker.init('#overview-datepicker');

                // 渲染投放位置下拉选择框模板
                $('#overview-local').html(_.template($('#type-tpl').html())({data: {
                    1: 'banner',
                    2: 'feed'
                }}));

                // 初始化投放位置下拉选择框,默认选中为banner
                $('#overview-local').select2({
                    placeholder: '选择投放位置'
                }).select2('val', '1');

                // 渲染投放平台下拉选择框模板
                $('#overview-platform-select').html(_.template($('#type-tpl').html())(platformData));

                // 初始化投放平台下拉选择框
                $('#overview-platform-select').select2({
                    placeholder: '选择投放平台'
                }).select2('val', '');

                // 生成图表
                $('.generate-chart').click(function() {
                    var id = $(this).attr('data-id');

                    ajax.get({
                        url: '/deal/data/getPlacementChart.do',
                        param: {
                            id: id,
                            customId: urler.normal().cid,
                            export: false
                        },
                        cb: function(data) {

                            var chartTableData = [];
                            var yName = [];

                            // 1. 提取 x 轴数据
                            chartTableData.push(data.data.x);

                            // 2. 提取 y 轴数据
                            _.each(data.data.y, function(val, index) {
                                chartTableData.push(val.data);
                                yName.push(val.name)
                            });

                            $('#overview-chart-wrap').html(_.template($('#overview-chart-tpl').html())({
                                data: {
                                    records: arrayer.upsideDown(chartTableData),
                                    yName: yName
                                }
                            }))

                            // 构造渲染图表数据
                            var y = {
                                info: [],
                                data: []
                            };
                            _.each(data.data.y, function(val, index) {

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
                            renderChart($('#overview-chart'), {
                                title: data.data.name,
                                x: data.data.x,
                                y: y
                            });

                            // 构造数据
                            var selectData = {};
                            _.each(data.data.y, function(val, index) {
                                selectData[index] = val.name;
                            });

                            // 渲染下拉选择框模板
                            $('#overview-chart-select').html(_.template($('#type-tpl').html())({data: selectData}));

                            // 初始化图表下拉选择框
                            $('#overview-chart-select').select2({
                                placeholder: '选择显示数据'
                            }).select2('val', '');

                            // 生成图表
                            $('#overview-generate-chart').click(function() {
                                var select = select2.getVal({
                                    id: '#overview-chart-select'
                                });

                                // 判定数量只能为两个
                                if(select.length !== 2) {
                                    modal.nobtn({
                                        ctx: 'body',
                                        ctn: '请选择两个选项',
                                        title: '数据统计'
                                    });
                                    return;
                                }

                                // 根据用户的选择重新构造数据
                                var _data = {
                                    name: data.data.name,
                                    x: data.data.x,
                                    y: []
                                };

                                _.each(select, function(val, index) {
                                    _data.y.push(data.data.y[val]);
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
                                renderChart($('#overview-chart'), {
                                    title: _data.name,
                                    x: _data.x,
                                    y: y
                                });
                            });

                            // 导出表格
                            $('#overview-export-chart').click(function() {
                                location.href = '/deal/data/getPlacementChart.do?export=true' +
                                    '&id=' + id + '&customId=' + urler.normal().cid;
                            });
                        }
                    });
                });

            }
        });

        // 分页
        pager(function(param, $this) {
            lister({
                ajax: ajax,
                ajaxParam: {
                    url: '/deal/data/listPlacementDatas.do',
                    param: param,
                    title: '数据统计'
                },
                $btn: $this,
                callback: function(data) {

                    // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
                    data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

                    // 渲染模板
                    var tpl = $('#overview-list-tpl').html();
                    $('#overview-list').html(_.template(tpl)(data));

                    datePicker.init('#overview-datepicker');

                    // 渲染投放位置下拉选择框模板
                    $('#overview-local').html(_.template($('#type-tpl').html())({data: {
                        1: 'banner',
                        2: 'feed'
                    }}));

                    // 初始化投放位置下拉选择框
                    $('#overview-local').select2({
                        placeholder: '选择投放位置'
                    }).select2('val', '');

                    // 渲染投放平台下拉选择框模板
                    $('#overview-platform-select').html(_.template($('#type-tpl').html())(platformData));

                    // 初始化投放平台下拉选择框
                    $('#overview-platform-select').select2({
                        placeholder: '选择投放平台'
                    }).select2('val', '');

                    // 生成图表
                    $('.generate-chart').click(function() {
                        var id = $(this).attr('data-id');

                        ajax.get({
                            url: '/deal/data/getPlacementChart.do',
                            param: {
                                id: id,
                                customId: urler.normal().cid,
                                export: false
                            },
                            cb: function(data) {

                                var chartTableData = [];
                                var yName = [];

                                // 1. 提取 x 轴数据
                                chartTableData.push(data.data.x);

                                // 2. 提取 y 轴数据
                                _.each(data.data.y, function(val, index) {
                                    chartTableData.push(val.data);
                                    yName.push(val.name)
                                });

                                $('#overview-chart-wrap').html(_.template($('#overview-chart-tpl').html())({
                                    data: {
                                        records: arrayer.upsideDown(chartTableData),
                                        yName: yName
                                    }
                                }))

                                // 构造渲染图表数据
                                var y = {
                                    info: [],
                                    data: []
                                };
                                _.each(data.data.y, function(val, index) {

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
                                renderChart($('#overview-chart'), {
                                    title: data.data.name,
                                    x: data.data.x,
                                    y: y
                                });

                                // 构造数据
                                var selectData = {};
                                _.each(data.data.y, function(val, index) {
                                    selectData[index] = val.name;
                                });

                                // 渲染下拉选择框模板
                                $('#overview-chart-select').html(_.template($('#type-tpl').html())({data: selectData}));

                                // 初始化图表下拉选择框
                                $('#overview-chart-select').select2({
                                    placeholder: '选择显示数据'
                                }).select2('val', '');

                                // 生成图表
                                $('#overview-generate-chart').click(function() {
                                    var select = select2.getVal({
                                        id: '#overview-chart-select'
                                    });

                                    // 判定数量只能为两个
                                    if(select.length !== 2) {
                                        modal.nobtn({
                                            ctx: 'body',
                                            ctn: '请选择两个选项',
                                            title: '数据统计'
                                        });
                                        return;
                                    }

                                    // 根据用户的选择重新构造数据
                                    var _data = {
                                        name: data.data.name,
                                        x: data.data.x,
                                        y: []
                                    };

                                    _.each(select, function(val, index) {
                                        _data.y.push(data.data.y[val]);
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
                                    renderChart($('#overview-chart'), {
                                        title: _data.name,
                                        x: _data.x,
                                        y: y
                                    });
                                });

                                // 导出表格
                                $('#overview-export-chart').click(function() {
                                    location.href = '/deal/data/getPlacementChart.do?export=true' +
                                        '&id=' + id + '&customId=' + urler.normal().cid;
                                });
                            }
                        });
                    });

                }
            });
        }, $('#overview'));

        // 数据概览搜索
        $('#overview').on('click', '#overview-search', function() {

            // 获取平台 id
            var platform = select2.getVal({
                id: '#overview-platform-select'
            });

            // 获取投放位置
            var placement = select2.getVal({
                id: '#overview-local'
            });

            // 选择日期
            var date = datePicker.getVal('#overview-datepicker');

            // 校验：平台 id 是必选字段
            if(platform === null || placement === null) {
                modal.nobtn({
                    ctx: 'body',
                    ctn: '平台 ID，投放位置必选选项',
                    title: '数据统计'
                });
                return;
            }

            // console.log(date.start);
            // console.log(date.end);
            // console.log(platform);
            // console.log(placement);
            // return;

            // 执行搜索
            ajax.get({
                url: '/deal/data/listPlacementDatas.do',
                param: {
                    page: 1,
                    export: false,
                    startDate: date.start,
                    endDate: date.end,
                    platformId: platform,
                    placementId: placement,
                    customId: urler.normal().cid
                },
                cb: function(data) {

                    // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
                    data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                        page: 1,
                        export: false,
                        startDate: date.start,
                        endDate: date.end,
                        platformId: platform,
                        placementId: placement,
                        customId: urler.normal().cid
                    }));

                    // 渲染模板
                    var tpl = $('#overview-list-tpl').html();
                    $('#overview-list').html(_.template(tpl)(data));

                    // 生成图表
                    $('.generate-chart').click(function() {
                        var id = $(this).attr('data-id');

                        ajax.get({
                            url: '/deal/data/getPlacementChart.do',
                            param: {
                                id: id,
                                customId: urler.normal().cid,
                                export: false
                            },
                            cb: function(data) {

                                var chartTableData = [];
                                var yName = [];

                                // 1. 提取 x 轴数据
                                chartTableData.push(data.data.x);

                                // 2. 提取 y 轴数据
                                _.each(data.data.y, function(val, index) {
                                    chartTableData.push(val.data);
                                    yName.push(val.name)
                                });

                                $('#overview-chart-wrap').html(_.template($('#overview-chart-tpl').html())({
                                    data: {
                                        records: arrayer.upsideDown(chartTableData),
                                        yName: yName
                                    }
                                }))

                                // 构造渲染图表数据
                                var y = {
                                    info: [],
                                    data: []
                                };
                                _.each(data.data.y, function(val, index) {

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
                                renderChart($('#overview-chart'), {
                                    title: data.data.name,
                                    x: data.data.x,
                                    y: y
                                });

                                // 构造数据
                                var selectData = {};
                                _.each(data.data.y, function(val, index) {
                                    selectData[index] = val.name;
                                });

                                // 渲染下拉选择框模板
                                $('#overview-chart-select').html(_.template($('#type-tpl').html())({data: selectData}));

                                // 初始化图表下拉选择框
                                $('#overview-chart-select').select2({
                                    placeholder: '选择显示数据'
                                }).select2('val', '');

                                // 生成图表
                                $('#overview-generate-chart').click(function() {
                                    var select = select2.getVal({
                                        id: '#overview-chart-select'
                                    });

                                    // 判定数量只能为两个
                                    if(select.length !== 2) {
                                        modal.nobtn({
                                            ctx: 'body',
                                            ctn: '请选择两个选项',
                                            title: '数据统计'
                                        });
                                        return;
                                    }

                                    // 根据用户的选择重新构造数据
                                    var _data = {
                                        name: data.data.name,
                                        x: data.data.x,
                                        y: []
                                    };

                                    _.each(select, function(val, index) {
                                        _data.y.push(data.data.y[val]);
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
                                    renderChart($('#overview-chart'), {
                                        title: _data.name,
                                        x: _data.x,
                                        y: y
                                    });
                                });

                                // 导出表格
                                $('#overview-export-chart').click(function() {
                                    location.href = '/deal/data/getPlacementChart.do?export=true' +
                                        '&id=' + id + '&customId=' + urler.normal().cid;
                                });
                            }
                        });
                    });

                },
                modal: modal,
                title: '数据统计'
            });
        });

        // 数据概览导出
        $('#overview').on('click', '#overview-export', function() {

            // 获取平台 id
            var platform = select2.getVal({
                id: '#overview-platform-select'
            });

            // 获取投放位置
            var placement = select2.getVal({
                id: '#overview-local'
            });

            // 选择日期
            var date = datePicker.getVal('#overview-datepicker');

            // 校验：平台 id 是必选字段
            if(platform === null) {
                modal.nobtn({
                    ctx: 'body',
                    ctn: '平台 ID，投放位置是必选项',
                    title: '数据统计'
                });
                return;
            }

            location.href = '/deal/data/listPlacementDatas.do?export=true' +
                '&startDate=' + date.start +
                '&endDate=' + date.end +
                '&platformId=' + platform +
                '&placementId=' + (placement === null ? '' : placement) +
                '&customId=' + urler.normal().cid;
        });
    }
});

// 获取人群数据
// 获取平台数据
ajax.get({
    url: '/select/listPlatForms.do',
    param: {
        customId: urler.normal().cid
    },
    cb: function(platformData) {

        // 获取广告组数据
        ajax.get({
            url: '/select/listAdGroups.do',
            param: {
                customId: urler.normal().cid
            },
            cb: function(groupData) {

                // 第一次进入初始化界面
                renderCrowd({
                    ajaxParam: {
                        startDate: '',
                        endDate: '',
                        page: 1,
                        export: false,
                        platformId: Object.keys(platformData.data)[0],
                        groupId: '',
                        customId: urler.normal().cid
                    },
                    platformData: platformData,
                    groupData: groupData
                });

                // 搜索
                $('#crowd').on('click', '#crowd-search', function() {

                    // 获取平台
                    var platform = select2.getVal({
                        id: '#crowd-platform-select'
                    });

                    // 获取广告组
                    var group = select2.getVal({
                        id: '#crowd-group'
                    });

                    // 获取日期
                    var date = datePicker.getVal('#crowd-datepicker');

                    // 校验：平台 id 是必选字段
                    if(platform === '' || platform === undefined || platform === null) {
                        modal.nobtn({
                            ctx: 'body',
                            ctn: '平台 ID 是必选字段',
                            title: '数据统计'
                        });
                        return;
                    }

                    ajax.get({
                        url: '/deal/data/getCrowdData.do',
                        param: {
                            startDate: date.start,
                            endDate: date.end,
                            page: 1,
                            export: false,
                            platformId: platform,
                            groupId: group,
                            customId: urler.normal().cid
                        },
                        cb: function(crowdData) {

                            // 构造图表地图数据，以提供给模板渲染
                            // 获取所有单选框数据，从area字段中获取
                            var checkData = {};
                            _.each(crowdData.data.area.y, function(val, index) {
                                checkData[index] = val.name;
                            });

                            // 渲染模板数据
                            $('#crowd-list').html(_.template($('#crowd-list-tpl').html())({
                                checkData: checkData
                            }));

                            // 初始化地图和饼状图
                            var chartData = generateChartData(0, crowdData)
                            renderPie($('#crowd-sex-pie'), crowdData.data.sex.name, chartData.sex);
                            renderPie($('#crowd-age-pie'), crowdData.data.age.name, chartData.age);
                            renderMap($('#crowd-map'), crowdData.data.area.name, chartData.area, crowdData.data.area.y.length > 0 ? crowdData.data.area.y[0].name : '');

                            // 用户选择展示图表
                            $('#crowd-show-table').unbind('click').bind('click', function() {
                                var chartData = generateChartData(Number($('.chartShowRadio:checked').val()), crowdData)
                                renderPie($('#crowd-sex-pie'), crowdData.data.sex.name, chartData.sex);
                                renderPie($('#crowd-agMape-pie'), crowdData.data.age.name, chartData.age);
                                renderMap($('#crowd-map'), crowdData.data.area.name, chartData.area, crowdData.data.area.y.length > 0 ? crowdData.data.area.y[Number($('.chartShowRadio:checked').val())].name : '');
                            });

                            // 地图和饼状图下面的生成图表
                            $('.generate-table').unbind('click').bind('click', function() {
                                var chartTableData = [];
                                var yName = [];
                                var type = $(this).attr('data-type');

                                // 判断当前要生成地图还是性别还是年龄图表
                                // 地图
                                if(type === 'map') {
                                    var _x = [];
                                    _.each(crowdData.data.area.x, function(val, index) {
                                        _x.push(province[val])
                                    });
                                    chartTableData.push(_x);
                                    _.each(crowdData.data.area.y, function(val, index) {
                                        chartTableData.push(val.data);
                                        yName.push(val.name)
                                    });

                                // 年龄
                                } else if(type === 'age') {
                                    chartTableData.push(crowdData.data.age.x);
                                    _.each(crowdData.data.age.y, function(val, index) {
                                        chartTableData.push(val.data);
                                        yName.push(val.name)
                                    });

                                // 性别
                                } else {
                                    chartTableData.push(crowdData.data.sex.x);
                                    _.each(crowdData.data.sex.y, function(val, index) {
                                        chartTableData.push(val.data);
                                        yName.push(val.name)
                                    });
                                }

                                // 渲染模板
                                $('#crowd-chart-table').html(_.template($('#crowd-chart-table-tpl').html())({
                                    data: {
                                        records: arrayer.upsideDown(chartTableData),
                                        yName: yName
                                    }
                                }))
                            });
                        }
                    });





                });

                // 导出
                $('#crowd').on('click', '#crowd-export', function() {

                    // 获取平台
                    var platform = select2.getVal({
                        id: '#crowd-platform-select'
                    });

                    // 获取广告组
                    var group = select2.getVal({
                        id: '#crowd-group'
                    });

                    // 获取日期
                    var date = datePicker.getVal('#crowd-datepicker');

                    // 校验：平台 id 是必选字段
                    if(platform === '' || platform === undefined || platform === null) {
                        modal.nobtn({
                            ctx: 'body',
                            ctn: '平台 ID 是必选字段',
                            title: '数据统计'
                        });
                        return;
                    }

                    location.href = '/deal/data/getCrowdData.do?export=true' +
                        '&page=1' +
                        '&startDate=' + date.start +
                        '&endDate=' + date.end +
                        '&customId=' + urler.normal().cid +
                        '&groupId=' + (group === null ? '' : group) +
                        '&platformId=' + (platform === null ? '' : platform);
                });

            }
        })
    }
});

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
}

/**
 *  渲染饼状图
 */
function renderPie($el, chart) {
    $el.highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: chart.title
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: chart.data
    });
}

/**
 * 获取人群数据
 * @param {Object} obj [渲染所需要的参数 {ajaxParam: {}, groupData: {}, platformData: {}} ]
 */
function renderCrowd(obj, cb) {
    ajax.get({
        url: '/deal/data/getCrowdData.do',
        param: obj.ajaxParam,
        cb: function(crowdData) {

            // 构造图表地图数据，以提供给模板渲染
            // 获取所有单选框数据，从area字段中获取
            var checkData = {};
            _.each(crowdData.data.area.y, function(val, index) {
                checkData[index] = val.name;
            });

            // 渲染模板数据
            $('#crowd-list').html(_.template($('#crowd-list-tpl').html())({
                checkData: checkData
            }));

            if(cb) {
                cb();
            }

            var selectTpl = $('#type-tpl').html();

            // 初始化平台 ID
            $('#crowd-platform-select').html(_.template(selectTpl)(obj.platformData));
            $('#crowd-platform-select').select2({
                placeholder: '选择平台'
            }).select2('val', '');

            // 初始化广告组 ID
            $('#crowd-group').html(_.template(selectTpl)(obj.groupData));
            $('#crowd-group').select2({
                placeholder: '选择广告组'
            }).select2('val', '');

            // 初始化选择日期
            datePicker.init('#crowd-datepicker');

            // 初始化地图和饼状图
            var chartData = generateChartData(0, crowdData)
            renderPie($('#crowd-sex-pie'), crowdData.data.sex.name, chartData.sex);
            renderPie($('#crowd-age-pie'), crowdData.data.age.name, chartData.age);
            renderMap($('#crowd-map'), crowdData.data.area.name, chartData.area, crowdData.data.area.y.length > 0 ? crowdData.data.area.y[0].name : '');

            // 用户选择展示图表
            $('#crowd-show-table').unbind('click').bind('click', function() {
                var chartData = generateChartData(Number($('.chartShowRadio:checked').val()), crowdData)
                renderPie($('#crowd-sex-pie'), crowdData.data.sex.name, chartData.sex);
                renderPie($('#crowd-age-pie'), crowdData.data.age.name, chartData.age);
                renderMap($('#crowd-map'), crowdData.data.area.name, chartData.area, crowdData.data.area.y.length > 0 ? crowdData.data.area.y[Number($('.chartShowRadio:checked').val())].name : '');
            });

            // 地图和饼状图下面的生成图表
            $('.generate-table').unbind('click').bind('click', function() {
                var chartTableData = [];
                var yName = [];
                var type = $(this).attr('data-type');

                // 判断当前要生成地图还是性别还是年龄图表
                // 地图
                if(type === 'map') {
                    var _x = [];
                    _.each(crowdData.data.area.x, function(val, index) {
                        _x.push(province[val])
                    });
                    chartTableData.push(_x);
                    _.each(crowdData.data.area.y, function(val, index) {
                        chartTableData.push(val.data);
                        yName.push(val.name)
                    });

                // 年龄
                } else if(type === 'age') {
                    chartTableData.push(crowdData.data.age.x);
                    _.each(crowdData.data.age.y, function(val, index) {
                        chartTableData.push(val.data);
                        yName.push(val.name)
                    });

                // 性别
                } else {
                    chartTableData.push(crowdData.data.sex.x);
                    _.each(crowdData.data.sex.y, function(val, index) {
                        chartTableData.push(val.data);
                        yName.push(val.name)
                    });
                }

                // 渲染模板
                $('#crowd-chart-table').html(_.template($('#crowd-chart-table-tpl').html())({
                    data: {
                        records: arrayer.upsideDown(chartTableData),
                        yName: yName
                    }
                }))
            });
        }
    });
}

/**
 * 构造饼状图和地图所需要的数据
 * @param {Number} select [用户当前选择的选项]
 * @param {Object} data [从服务器获取的数据格式]
 * @return {Object} 返回格式化过后可以让地图或者饼状图直接使用的数据
 */
function generateChartData(select, data) {

    // 得到地图数据
    var area = [];
    _.each(data.data.area.x, function(val, index) {
        if(data.data.area.y.length > 0) {
            area.push({
                'hc-key': val,
                value: data.data.area.y[select].data[index]
            });
        } else {
            area.push({
                'hc-key': val,
                value: 0
            })
        }
    });

    // 得到性别数据
    var sex = [];
    _.each(data.data.sex.x, function(val, index) {
        if(data.data.sex.y.length > 0) {
            sex.push({
                name: val,
                y: data.data.sex.y[select].data[index]
            });
        } else {
            sex.push({
                name: val,
                y: 0
            });
        }
    });

    // 得到年龄数据
    var age = [];
    _.each(data.data.age.x, function(val, index) {
        if(data.data.age.y.length > 0) {
            age.push({
                name: val,
                y: data.data.age.y[select].data[index]
            });
        } else {
            age.push({
                name: val,
                y: 0
            });
        }
    });

    // 得到地图数据

    return {
        area: area,
        sex: sex,
        age: age
    };
}

/**
 * 渲染饼状图
 * @param {jQuery} $el [jQuery 元素]
 * @param {String} name [饼状图名称]
 * @param {Object} data [饼状图所需要的数据]
 */
function renderPie($el, name, data) {
    $el.highcharts({chart: {
        plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: name
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b><br>数量：{point.y}</br>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: '占比',
            colorByPoint: true,
            data: data
        }],
        exporting: {
            enabled: false
        }
    });

    // 隐藏图表信息
    $('[style="cursor:pointer;color:#909090;font-size:9px;fill:#909090;"]').css('display', 'none');
}

function renderMap($el, name, data, yName) {
    $el.highcharts('Map', {
        title: {
            text: name
        },
        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            },
            enableMouseWheelZoom: false
        },
        colorAxis: {
            min: 0
        },
        series : [{
            data : data,
            mapData: Highcharts.maps['countries/cn/cn-all'],
            joinBy: 'hc-key',
            name: yName,
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }],
        exporting: {
            enabled: false
        }
    });

    // 隐藏图表信息
    $('[style="cursor:pointer;color:#909090;font-size:9px;fill:#909090;"]').css('display', 'none');
}
