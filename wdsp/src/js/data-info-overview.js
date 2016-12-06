import {
    urlAddParam,
    convertMoney,
    convertPercent,
    divideThousand
} from './libs/tools';
import { initDropdownNormal } from './libs/dropdown-select';
import checkbox from './libs/checkbox';
import { baseArea } from './libs/chart';

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

    // 默认获取第一个信息概览
    // 执行默认操作，拿到本月开始时间和结束时间，执行搜索
    let monthStart = moment().startOf('month').format('YYYY-MM-DD');
    let monthEnd = moment().endOf('month').format('YYYY-MM-DD');

    $('#data .w-table-tool [data-field="startDate"]').val(monthStart);
    $('#data .w-table-tool [data-field="endDate"]').val(monthEnd);

    // 获取第一个平台的数据，渲染出数据信息
    if (!urler().pid) {
        renderDataInfo({
            export: false,
            platformId: urler().pid,
            startDate: monthStart,
            endDate: monthEnd
        });
    } else {
        renderDataInfo({
            export: false,
            platformId: data.data.records[0].type,
            startDate: monthStart,
            endDate: monthEnd
        });
    }

    // 绑定获取特定信息概览事件
    $('.info-overview-nav').click(e => {
        let platformId = $(e.currentTarget).attr('data-id');

        // 执行默认操作，拿到本月开始时间和结束时间，执行搜索
        let monthStart = moment().startOf('month').format('YYYY-MM-DD');
        let monthEnd = moment().endOf('month').format('YYYY-MM-DD');
        $('#data .w-table-tool [data-field="startDate"]').val(monthStart);
        $('#data .w-table-tool [data-field="endDate"]').val(monthEnd);

        // 获取请求，渲染数据
        renderDataInfo({
            export: false,
            platformId: platformId,
            startDate: monthStart,
            endDate: monthEnd
        });
    });
});

/**
 * 渲染数据信息区块
 * @description 抽离渲染数据信息，便于复用
 * @param {Object} data - 服务器返回的数据
 */
function renderDataInfo(data) {
    tabler.render({
        url: '/deal/overview/listPlatformDatas.do',
        tpl: $('#data-tpl').html(),
        container: '#data',
        otherParam: data,
        handle(data) {

            for (let record of data.data.records) {

                // 曝光量
                record.showCount =  divideThousand(record.showCount);

                // 互动量
                record.interactCount = divideThousand(record.interactCount);
                
                // 互动率
                record.interactRatio = convertPercent(record.interactRatio);

                // 互动成本
                record.interactPrice = convertMoney(record.interactPrice);

                // 点击量
                record.clickCount = divideThousand(record.clickCount);

                // 点击率
                record.clickRatio = convertPercent(record.clickRatio);

                // 点击均价
                record.clickPrice = convertMoney(record.clickPrice);

                // 消耗
                record.consume = convertMoney(record.consume);

            }

            return data;

        },
        cb(data) {

            // 如果当前没有图表数据，则提示用户当前没有数据
            if (data.data.records.length < 1 || !data.data.records[0].chart) {
                modaler.tip('当前没有图表数据');
                return;
            }

            // 从服务器返回的数据中拿出选项的数据
            let selectItems = [];
            for (let item of data.data.records[0].chart.y) {
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

            // 如果用户选择了相应的选项并且点击了生成图表，则根据用户选择的选项生成一个
            // 新的图表
            $('#data-generate-chart').click(e => {
                let yData = [];
                let xData = data.data.records[0].chart.x;

                // 拿到用户下拉框选择的选项
                if (
                    $('#select-item').attr('data-selected') === undefined ||
                    JSON.parse(decodeURIComponent($('#select-item').attr('data-selected'))).length < 1
                ) {
                    modaler.tip('请至少选择一个选项');
                    return;
                }

                let select = JSON.parse(decodeURIComponent($('#select-item').attr('data-selected')));

                // 根据用户下拉框拿到的选项拿到实际的数据
                for (let item of data.data.records[0].chart.y) {
                    for (let _item of select) {
                        if (item.name === _item.name) {
                            yData.push({
                                data: item.data,
                                name: item.name
                            });
                        }
                    }
                }

                // 显示并渲染出实际的界面
                $('#chart').show();
                baseArea({
                    el: '#chart',
                    x: xData,
                    y: yData
                });
            });

            // 如果当前下拉框里面有值，则选中头两个选项并执行生成图表
            if ($('.w-chart .w-dropdown-normal .w-select-lists > li').length > 0) {

                // 选中头两个选项
                $('.w-chart .w-dropdown-normal .w-select-lists > li')
                    .eq(0)
                    .find('[type="checkbox"]')
                    .prop('checked', true)
                    .trigger('change');
                $('.w-chart .w-dropdown-normal .w-select-footer .w-btn').click();
                $('.w-chart .w-dropdown-normal .w-select-lists > li')
                    .eq(1)
                    .find('[type="checkbox"]')
                    .prop('checked', true)
                    .trigger('change');
                $('.w-chart .w-dropdown-normal .w-select-footer .w-btn').click();

                // 执行生成图表
                $('#data-generate-chart').click();
            }
        }
    });
}