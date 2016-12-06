const _ = window._;
const tabler = window.tabler;
const requester = window.requester;
import { convertTimestamp } from './libs/tools';

// 渲染顶部 card
requester.get('/external/finance/getSum.do').then(data => {
    let cardsTpl = $('#cards-tpl').html();
    $('#cards').html(_.template(cardsTpl)({
        cards: [
            {
                withIcon: true,
                title: '账户累计总充值（元）',
                money: data.data.total
            },
            {
                withIcon: false,
                title: '粉丝通累计充值（元）',
                money: data.data.fans
            }
        ]
    }));
});

// 渲染明细列表
tabler.render({
    url: '/external/finance/list.do',
    tpl: $('#detail-tpl').html(),
    container: '#detail',
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
