import { convertTimestamp } from './libs/tools';

// 激活左侧导航栏
$('#sidebar-finance').addClass('w-active');

// 获取发票汇总信息
requester.get('/external/finance/getInvoiceSum.do').then(data => {
    $('#total').html(data.data.total);
    $('#surplus').html(data.data.surplus);

    if (Number(data.data.surplus) > 0) {
        $('#get-invoice').attr('data-money', data.data.surplus);
        $('#get-invoice').show();
    }
});

// 获取发票索取列表
tabler.render({
    url: '/external/finance/listInvoice.do',
    tpl: $('#invoice-tpl').html(),
    container: '#invoice',
    handle(data) {

        // 将时间戳转换成特定格式
        for (let record of data.data.records) {

            // 转换时间
            record.time = convertTimestamp(record.posttime, (year, month, date, hour, minute) => {
                return `${year}年${month}月${date}日 ${hour}:${minute}`;
            });
        }

        return data;
    }
});

// 索取发票
$('#get-invoice').click((e) => {
    let $self = $(e.currentTarget);
    let money = $self.attr('data-money');
    location.href = `/#proj_name#/html/finance/get-invoice.html?cid=${urler().cid}&m=${money}`
});