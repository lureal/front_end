import {
    convertMoney
} from './libs/tools';

// 渲染顶部 card
requester.get('/deal/overview/getRtConsume.do').then(data => {
    let cardsTpl = $('#cards-tpl').html();
    $('#cards').html(_.template(cardsTpl)({
        cards: [
            {
                withIcon: true,
                title: '账户余额（元）',
                money: convertMoney(data.data.balance),
                button: true
            }
        ]
    }));
});

// 渲染明细列表
tabler.render({
    url: '/deal/finance/list.do',
    tpl: $('#detail-tpl').html(),
    container: '#detail',
    otherParam: {
        export: false
    },
    handle(data) {

        // 将时间戳转换成特定格式
        for (let record of data.data.records) {
            record.time = convertTimestamp(record.posttime, (year, month, date, hour, minute) => {
                return `${year}年${month}月${date}日 ${hour}:${minute}`;
            });
        }

        return data;
    }
});