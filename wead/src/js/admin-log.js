const _ = window._;
const tabler = window.tabler;
import { convertTimestamp } from './libs/tools';

// 获取操作列表
tabler.render({
    url: '/external/operate/list.do',
    tpl: $('#lists-tpl').html(),
    container: '#lists',
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
