const _ = window._;
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

// 设置更新的数量
let updateNumber = Number(localStorage.getItem('updateNumber'));
if (updateNumber > 0) {
    $('#aptitude-notice-num').html(updateNumber);
    $('#aptitude-notice-num').show();
}

// 获取发票汇总信息
requester.get('/external/finance/getInvoiceSum.do', {
    userId: urler().userId
}).then(data => {
    $('#opened-money').html(data.data.total);
    $('#open-money').html(data.data.surplus);
});

// 定制已开发票金额弹出框内容
let editOpenedInvoice = $('#opened-invoice-modal-tpl').html();

// 定制可开具发票金额弹出框内容
let editOpenInvoice = $('#open-invoice-modal-tpl').html();

// 定制驳回弹出框内容
let reject = $('#reject-modal-tpl').html();

// 定制通过弹出框内容
let pass = $('#pass-modal-tpl').html();

// 自定义弹窗中的 input 当焦点聚焦时把错误信息去除掉
$('body').on('focus', '.modal-diy-body input', e => {
    $(e.currentTarget).parents('.modal-diy-body').removeClass('error');
});

// 弹出已开发票金额弹窗
$('#edit-opened-invoice').click(() => {
    window.modaler.diy({ ctn: editOpenedInvoice });
});

// 弹出可开局发票金额弹窗
$('#edit-open-invoice').click(() => {
    window.modaler.diy({ ctn: editOpenInvoice });
});

// 更新已开发票金额
$('body').on('click', '#modal-opened-invoice-btn', e => {
    let value = $('#modal-opened-invoice-input').val();

    // 数据校验
    if (
        value === '' ||
        window.isNaN(Number(value)) ||
        Number(value) === 0
    ) {
        $('.modal-diy-body').addClass('error');
        return;
    }

    // 发送请求
    requester.get('/external/manage/updateInvoice.do', {
        userId: urler().userId,
        key: 'used',
        amount: parseInt(value)
    }).then(data => {
        if (data.data === true) {
            $('#modal-diy').modal('hide');
            location.reload();
        } else {
            modaler.tip('修改失败');
        }
    });
});

// 更新可开发票金额
$('body').on('click', '#modal-open-invoice-btn', e => {
    let value = $('#modal-open-invoice-input').val();

    // 数据校验
    if (
        value === '' ||
        window.isNaN(Number(value)) ||
        Number(value) === 0
    ) {
        $('.modal-diy-body').addClass('error');
        return;
    }

    // 发送请求
    requester.get('/external/manage/updateInvoice.do', {
        userId: urler().userId,
        key: 'unused',
        amount: parseInt(value)
    }).then(data => {
        if (data.data === true) {
            $('#modal-diy').modal('hide');
            location.reload();
        } else {
            modaler.tip('修改失败');
        }
    });
});

// 渲染发票审核列表
tabler.render({
    url: '/external/manage/listInvoice.do',
    tpl: $('#invoices-tpl').html(),
    otherParam: {
        userId: urler().userId
    },
    container: '#invoices',
    handle(data) {

        // 将时间戳转换成特定格式
        for (let record of data.data.records) {

            // 转换时间
            record.time = convertTimestamp(record.posttime, (year, month, date, hour, minute) => {
                return `${year}年${month}月${date}日 ${hour}:${minute}`;
            });

            // 发票内容
            var serialNo = record.serialNo === '' || record.serialNo === undefined || record.serialNo === null ? '-' : record.serialNo;
            record.content = `
                <div class="table-invoice-ctn">
                    <div>发票抬头：${record.companyName}</div>
                    <div>发票金额：${record.amount}元</div>
                    <div>发票类型：${record.typeName}</div>
                    <div>邮寄地址：${record.address}</div>
                    <div>快递单号：${serialNo}</div>
            `;

            // 如果当前是驳回，则添加驳回原因
            if (record.status === 2) {
                record.content += `<div style="padding: 10px 20px; background: #f5f5f5; line-height: 1; border-radius: 4px;">驳回原因：${record.memo}</div>`;
            }

            record.content += '</div>';

        }

        return data;
    }
});

// 下载发票文件
$('body').on('click', '.download-invoice', e => {
    let url = $(e.currentTarget).attr('data-url');
    location.href = `/external/manage/downloadInvoice.do?id=${url}`;
});

// 弹出通过菜单
$('body').on('click', '.table-btn-pass', e => {
    let id = $(e.currentTarget).attr('data-id');
    window.modaler.diy({ ctn: _.template(pass)({ id: id }) });
});

// 弹出驳回菜单
$('body').on('click', '.table-btn-reject', (e) => {
    let id = $(e.currentTarget).attr('data-id');
    window.modaler.diy({ ctn: _.template(reject)({ id: id }) });
});

// 通过菜单
$('body').on('click', '#modal-pass-btn', e => {
    let value = $('#modal-pass-input').val();
    let id = $(e.currentTarget).attr('data-id');

    // 数据校验
    if (value === '') {
        $('.modal-diy-body').addClass('error');
        return;
    }

    // 发送请求
    requester.get('/external/manage/approveInvoice.do', {
        id: id,
        status: 1,
        memo: value
    }).then(data => {
        if (data.data === true) {
            $('#modal-diy').modal('hide');
            location.reload();
        } else {
            modaler.tip('通过失败');
        }
    });
});

// 不通过菜单
$('body').on('click', '#modal-reject-btn', e => {
    let value = $('#modal-reject-input').val();
    let id = $(e.currentTarget).attr('data-id');

    // 数据校验
    if (value === '') {
        $('.modal-diy-body').addClass('error');
        return;
    }

    // 发送请求
    requester.get('/external/manage/approveInvoice.do', {
        id: id,
        status: 2,
        memo: value
    }).then(data => {
        if (data.data === true) {
            $('#modal-diy').modal('hide');
            location.reload();
        } else {
            modaler.tip('驳回失败');
        }
    });
});
