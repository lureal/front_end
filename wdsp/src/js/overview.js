// 当添加一个新的广告平台时应该做什么操作
// 1. 在 html 中添加一个 <script type="text/template">
// 2. 在 renderCardDetail 中添加一条 if 语句，用于渲染新广告，并且，新广告平台的相关操作都在里面定义
// 3. 加开通服务事件

import {
    urlAddParam,
    convertMoney,
    convertPercent,
    divideThousand
} from './libs/tools';
import { initDropdownNormal } from './libs/dropdown-select';
import checkbox from './libs/checkbox';
import { baseArea } from './libs/chart';

// 为避免下拉框被 wrapper 元素所设置的 overflow: hidden 隐藏，这里判定如果当前页面
// wrapper 元素 min-height 小于 950px，则设置为 950px
resizeWrapper();
$(window, '.wrapper').resize(resizeWrapper);

// 获取平台开户信息
requester.get('/external/custom/listPlatformStatus.do').then(data => {

    let cardTpl = $('#card-tpl').html();

    // 渲染数据
    $('#cards').html(_.template(cardTpl)(data));

    // 默认渲染第一个 card
    let id = $('#cards > div').eq(0).find('.info-box').attr('data-id');
    renderCardDetail(id);
});

// 点击 card 时，渲染特定的内容
$('body').on('click', '.info-box', e => {
    let id = $(e.currentTarget).attr('data-id');
    renderCardDetail(id);
});

// card 中的按钮避免事件冒泡
$('body').on('click', '.card-open span, .card-open a', e => {
    e.stopPropagation();
});

// card 中的开通／重新开通服务
$('body').on('click', '.open-service', e => {
    let id = $(e.currentTarget).attr('data-id');
    
    switch(id) {
        case '1':
            localStorage.removeItem('weibo_submit_data');
            location.href = `/#proj_name#/html/service/weibo/first.html?cid=${urler().cid}&id=${id}`;
            break;
    }
});

// 查看资质
$('body').on('click', '.service-detail', e => {
    let platformId = $(e.currentTarget).attr('data-platformId');
    location.href = `/#proj_name#/html/service/weibo/aptitude.html?cid=${urler().cid}&platformId=${platformId}`;
});

/**
 * 渲染广告详情
 * @param {Number} id 广告类型 ID
 */
function renderCardDetail(id) {

    // 微博广告
    if (id === '1') {
        let tpl = $('#weibo-tpl').html();
        $('#cards-ctn').html(tpl);

        // 渲染服务介绍
        let introTpl = $('#intro-tpl').html();
        $('#intro').html(_.template(introTpl)({
            intros: [
                {
                    id: 0,
                    title: '微博粉丝通：基于新浪微博海量的用户，把推广信息广泛传送给粉丝和潜在客户的营销产品'
                }
            ]
        }));

        // 渲染资质详情
        tabler.render({
            url: '/external/custom/listPlatform.do',
            tpl: $('#detail-tpl').html(),
            container: '#detail'
        });
    }
}

// // 获得所有平台，并渲染 card
// requester.get('/select/listPlatForms.do').then(data => {

//     // 转换数据
//     // 将服务器返回过来的 { 平台ID: 平台名称 } 转换为 [ { id: 平台ID, name: 平台名称 } ]
//     let platform = [];
//     for (let prop in data.data) {
//         platform.push({
//             id: prop,
//             name: data.data[prop]
//         });
//     }

//     // 循环数据，获取相应的统计信息
//     _.each(platform, item => {
//         requester.get('/deal/overview/countAd.do', { platformId: item.id }).then(data => {

//             // 将服务器返回的数据作为 platform 中的项的属性保存，方便渲染
//             for (let prop in data.data) {
//                 item[prop] = data.data[prop];
//             }

//             // 如果 platform 的数目小于 3 个，补足到 3 个
//             for (let i = platform.length; i < 3; i++) {
//                 platform.push({
//                     id: -1,
//                     name: '',
//                     invalidCount: 0,
//                     validCount: 0,
//                     verifyingCount: 0
//                 });
//             }

//             // 渲染模板
//             let tpl = $('#card-tpl').html();
//             $('#cards').html(_.template(tpl)({
//                 platform: platform
//             }));
//         });
//     });

//     // 执行默认操作，拿到本月开始时间和结束时间，执行搜索
//     let monthStart = moment().startOf('month').format('YYYY-MM-DD');
//     let monthEnd = moment().endOf('month').format('YYYY-MM-DD');

//     $('#data .w-table-tool [data-field="startDate"]').val(monthStart);
//     $('#data .w-table-tool [data-field="endDate"]').val(monthEnd);

//     // 获取第一个平台的数据，渲染出数据信息
//     renderDataInfo({
//         export: false,
//         platformId: platform[0].id,
//         startDate: monthStart,
//         endDate: monthEnd
//     });
// });

// // 点击 card，获取并渲染不同的表格，图表数据
// $('body').on('click', '.card-item', e => {
//     let platformId = $(e.currentTarget).attr('data-id');

//     // 执行默认操作，拿到本月开始时间和结束时间，执行搜索
//     let monthStart = moment().startOf('month').format('YYYY-MM-DD');
//     let monthEnd = moment().endOf('month').format('YYYY-MM-DD');
//     $('#data .w-table-tool [data-field="startDate"]').val(monthStart);
//     $('#data .w-table-tool [data-field="endDate"]').val(monthEnd);

//     // 获取请求，渲染数据
//     renderDataInfo({
//         export: false,
//         platformId: platformId,
//         startDate: monthStart,
//         endDate: monthEnd
//     });
// });

// /**
//  * 渲染数据信息区块
//  * @description 抽离渲染数据信息，便于复用
//  * @param {Object} data - 服务器返回的数据
//  */
// function renderDataInfo(data) {
//     tabler.render({
//         url: '/deal/overview/listPlatformDatas.do',
//         tpl: $('#data-tpl').html(),
//         container: '#data',
//         otherParam: data,
//         handle(data) {

//             for (let record of data.data.records) {

//                 // 曝光量
//                 record.showCount =  divideThousand(record.showCount);

//                 // 互动量
//                 record.interactCount = divideThousand(record.interactCount);
                
//                 // 互动率
//                 record.interactRatio = convertPercent(record.interactRatio);

//                 // 互动成本
//                 record.interactPrice = convertMoney(record.interactPrice);

//                 // 点击量
//                 record.clickCount = divideThousand(record.clickCount);

//                 // 点击率
//                 record.clickRatio = convertPercent(record.clickRatio);

//                 // 点击均价
//                 record.clickPrice = convertMoney(record.clickPrice);

//                 // 消耗
//                 record.consume = convertMoney(record.consume);

//             }

//             return data;

//         },
//         cb(data) {

//             // 如果当前没有图表数据，则提示用户当前没有数据
//             if (data.data.records.length < 1 || !data.data.records[0].chart) {
//                 modaler.tip('当前没有图表数据');
//                 return;
//             }

//             // 从服务器返回的数据中拿出选项的数据
//             let selectItems = [];
//             for (let item of data.data.records[0].chart.y) {
//                 selectItems.push({
//                     name: item.name,
//                     val: selectItems.length
//                 });
//             }

//             // 初始化图表内容选择下拉框
//             initDropdownNormal({
//                 el: '.w-dropdown-normal',
//                 data: {
//                     records: selectItems
//                 }
//             });

//             // 初始化 checkbox
//             checkbox.render({
//                 selector: '.w-checkbox'
//             });

//             // 如果用户选择了相应的选项并且点击了生成图表，则根据用户选择的选项生成一个
//             // 新的图表
//             $('#data-generate-chart').click(e => {
//                 let yData = [];
//                 let xData = data.data.records[0].chart.x;

//                 // 拿到用户下拉框选择的选项
//                 if (
//                     $('#select-item').attr('data-selected') === undefined ||
//                     JSON.parse(decodeURIComponent($('#select-item').attr('data-selected'))).length < 1
//                 ) {
//                     modaler.tip('请至少选择一个选项');
//                     return;
//                 }

//                 let select = JSON.parse(decodeURIComponent($('#select-item').attr('data-selected')));

//                 // 根据用户下拉框拿到的选项拿到实际的数据
//                 for (let item of data.data.records[0].chart.y) {
//                     for (let _item of select) {
//                         if (item.name === _item.name) {
//                             yData.push({
//                                 data: item.data,
//                                 name: item.name
//                             });
//                         }
//                     }
//                 }

//                 // 显示并渲染出实际的界面
//                 $('#chart').show();
//                 baseArea({
//                     el: '#chart',
//                     x: xData,
//                     y: yData
//                 });
//             });

//             // 如果当前下拉框里面有值，则选中头两个选项并执行生成图表
//             if ($('.w-chart .w-dropdown-normal .w-select-lists > li').length > 0) {

//                 // 选中头两个选项
//                 $('.w-chart .w-dropdown-normal .w-select-lists > li')
//                     .eq(0)
//                     .find('[type="checkbox"]')
//                     .prop('checked', true)
//                     .trigger('change');
//                 $('.w-chart .w-dropdown-normal .w-select-footer .w-btn').click();
//                 $('.w-chart .w-dropdown-normal .w-select-lists > li')
//                     .eq(1)
//                     .find('[type="checkbox"]')
//                     .prop('checked', true)
//                     .trigger('change');
//                 $('.w-chart .w-dropdown-normal .w-select-footer .w-btn').click();

//                 // 执行生成图表
//                 $('#data-generate-chart').click();
//             }
//         }
//     });
// }

/**
 * 为避免下拉框被 wrapper 元素所设置的 overflow: hidden 隐藏，这里判定如果当前页面
 * wrapper 元素 min-height 小于 950px，则设置为 950px
 */
function resizeWrapper() {
    let minHeight = Number($('.content-wrapper').css('min-height').slice(0, -2));
    if (minHeight < 950) {
        setTimeout(() => {
            $('.content-wrapper').css('min-height', '950px');
        }, 100);
    }
}
