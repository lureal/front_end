import {
    convertMoney,
    convertPercent
} from './libs/tools';

// 激活左侧导航栏
$('#sidebar-ad').addClass('w-active');

// 渲染投放平台
tabler.render({
    url: '/deal/data/listPlatformDatas.do',
    tpl: $('#dimension-platform-tpl').html(),
    container: '#dimension-platform',
    handle(data) {

        for (let record of data.data.records) {

            // 互动率
            record.interactRatio = convertPercent(record.interactRatio);

            // 互动成本
            record.interactPrice = convertMoney(record.interactPrice);

            // 点击率
            record.clickRatio = convertPercent(record.clickRatio);

            // 点击成本
            record.clickPrice = convertMoney(record.clickPrice);

            // 消耗
            record.consume = convertMoney(record.consume);
        }

        return data;
    },
    otherParam: {
        export: false
    }
});

// 创建新广告
$('#create-ad').click(e => {
    localStorage.removeItem('weiboAdInfo');
    location.href = `/#proj_name#/html/ad/weibo/base-info.html?cid=${urler().cid}`;
});
