
/**
 * 初始化 highcharts base area
 * @param {String} el - 图表包含块 ID
 * @param {Array} colors - 图标显示区域背景颜色
 */
export let baseArea = ({ el, colors = [], x = [], y = [] }) => {

    // 如果当前没有指明要设置的区域颜色，则自动计算出需要的颜色，
    // 如果 y 轴只有一条，则使用蓝色 rgba(51, 136, 255, .6)，如果 y 轴有两条，则使用
    // 灰色：rgba(154, 175, 204, .6) 和 蓝色：rgba(51, 136, 255, .6)
    if (colors.length === 0) {

        // 当前只有一条 y 轴
        if (y.length <= 1) {
            colors = ['rgba(51, 136, 255, .6)'];

        // 当前有一条以上的 y 轴
        } else {
            colors = ['rgba(154, 175, 204, .6)', 'rgba(51, 136, 255, .6)'];
        }
    }

    // 渲染图表
    $(el).highcharts({
        colors: colors,
        chart: {
            type: 'area' // 表格类型
        },
        title: { // 图表标题
            text: null // 不要设置表格标题
        },
        xAxis: {
            categories: x // x 轴线
        },
        yAxis: {
            title: {
                text: null
            }
        },
        tooltip: {
            pointFormat: '{series.name}<br/><b>{point.y}</b>'
        },
        plotOptions: { // 设置鼠标移动上图表时显示的样式
            area: {
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: y
    });
}

/**
 * 初始化 highmap
 * @param {String} el - 初始化容器
 * @param {Object} data - 初始化数据
 */
export let highmap = ({ el, data, name }) => {
    $(el).highcharts('Map', {

        title: {
            text: null
        },
        mapNavigation: {
            enabled: true,
            enableMouseWheelZoom: false,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },
        colorAxis: {
            min: 0
        },
        series: [{
            data : data,
            mapData: Highcharts.maps['countries/cn/cn-all'],
            joinBy: 'hc-key',
            name: name,
            states: {
                hover: {
                    color: '#BADA55'
                }
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    })
}

/**
 * 初始化饼状图
 * @param {String} el - 初始化容器
 * @param {Object} data - 初始化数据
 * @param {String} name - 图表名称
 */
export let basePie = ({ el, data, name, height = 450, width = 450 }) => {
    Highcharts.getOptions().plotOptions.pie.colors = (function () {
        var colors = [],
            base = '#bdd8ff',
            i;

        for (i = 0; i < 30; i += 1) {
            // Start out with a darkened base color (negative brighten), and end
            // up with a much brighter color
            colors.push(Highcharts.Color(base).brighten((i - 2) / 7).get());
        }
        return colors;
    }());
    $(el).highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie',
            height: height,
            width: width
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
        title: {
            text: null
        },
        series: [{
            name: name,
            data: data
        }]
    });
};