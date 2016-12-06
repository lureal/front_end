const _ = window._;
const modaler = window.modaler;
const tabler = window.tabler;
import urler from './libs/urler';
import { convertTimestamp } from './libs/tools';

// 获取未处理的发票申请的数量
requester.get('/external/manage/getInvoiceUndo.do', { userId: urler().userId }).then(data => {
    if (data.data.cnt > 0) {
        $('#invoice-notice-num').show().html(data.data.cnt);
    }
});

// 获取公司名，并渲染到页面中
$('#breadcrumb-company').html(decodeURIComponent(urler().company));
$('#box-company').html(decodeURIComponent(urler().company));

// 获取 url 后面的 id 拼接到内容导航的后面
$('.content-nav-link').each((index, el) => {
    let cacheHref = $(el).attr('href');
    cacheHref += '?id=' + urler().id;
    cacheHref += '&userId=' + urler().userId;
    cacheHref += '&company=' + urler().company;

    if (urler().f) {
        cacheHref += '&f=' + urler().f;
    }

    $(el).attr('href', cacheHref);
});

// 如果当前审核失败，只能查看账户，则隐藏多余的项
if (!urler().f) {
    $('#content-nav-finance').show();
}

// 渲染内容列表
tabler.render({
    url: '/external/manage/listAccountOperate.do',
    otherParam: {
        userId: urler().userId,
    },
    tpl: $('#records-tpl').html(),
    container: '#records',
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

// 设置更新的数量
let updateNumber = Number(localStorage.getItem('updateNumber'));
if (updateNumber > 0) {
    $('#aptitude-notice-num').html(updateNumber);
    $('#aptitude-notice-num').show();
}
