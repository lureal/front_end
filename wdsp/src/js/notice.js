import { convertTimestamp } from './libs/tools';

// 渲染表格
tabler.render({
    url: '/external/tips/listMy.do',
    tpl: $('#notice-tpl').html(),
    container: '#notice',
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
