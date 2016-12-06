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

// 获取填充资金汇总信息
requester.get('/external/manage/getFinanceSum.do', {
    userId: urler().userId
}).then(data => {
    $('#all-money').html(data.data.total);
    $('#fensitong-money').html(data.data.fans);
});

// 定制账户累计总充值弹出框内容
let rechargeAllModal = $('#recharge-all-modal-tpl').html();

// 定制粉丝通累计充值弹出框内容
let rechargeFensitongModal = $('#recharge-fensitong-modal-tpl').html();

// 定制明细内容弹出框内容
let detailModal = $('#detail-modal-tpl').html();

// 弹出修改账户累计总充值按钮
$('#edit-all').click(() => {
    window.modaler.diy({ ctn: rechargeAllModal });
});

// 弹出修改粉丝通累计充值
$('#edit-fensitong').click(() => {
    window.modaler.diy({ ctn: rechargeFensitongModal });
});

// 弹出修改明细详情弹出框
$('body').on('click', '.edit-detail-ctn', e => {
    let id = $(e.currentTarget).attr('data-id');
    window.modaler.diy({ ctn: detailModal });
    $('#modal-detail-edit').attr('data-id', id);
});

// 自定义弹窗中的 input 当焦点聚焦时把错误信息去除掉
$('body').on('focus', '.modal-diy-body input', e => {
    $(e.currentTarget).parents('.modal-diy-body').removeClass('error');
});

// 修改累计总充值
$('body').on('click', '#modal-all-edit', e => {
    let value = $('#modal-all-input').val();

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
    requester.get('/external/manage/updateRecharge.do', {
        userId: urler().userId,
        key: 'all',
        amount: parseInt(value)
    }).then(data => {
        if (data.data === true) {
            $('#modal-diy').modal('hide');
            location.reload();
        } else {
            $('#modal-diy').modal('hide');
            modaler.tip('修改失败');
        }
    });
});

// 修改粉丝通累计充值
$('body').on('click', '#modal-fensitong-edit', e => {
    let value = $('#modal-fensitong-input').val();

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
    requester.get('/external/manage/updateRecharge.do', {
        userId: urler().userId,
        key: 'fans',
        amount: parseInt(value)
    }).then(data => {
        if (data.data === true) {
            $('#modal-diy').modal('hide');
            location.reload();
        } else {
            $('#modal-diy').modal('hide');
            modaler.tip('修改失败');
        }
    });
});

// 渲染内容列表
tabler.render({
    url: '/external/manage/listFinance.do',
    tpl: $('#details-tpl').html(),
    otherParam: {
        userId: urler().userId
    },
    container: '#details',
    handle(data) {

        // 将时间戳转换成特定格式
        for (let record of data.data.records) {
            record.time = convertTimestamp(record.posttime, (year, month, date, hour, minute) => {
                return `${year}年${month}月${date}日 ${hour}:${minute}`;
            });
        }

        // 获取当前时间
        data.data.dateNow = convertTimestamp((+ new Date()), (year, month, date, hour, minute) => {
            return `${year}年${month}月${date}日 ${hour}:${minute}`;
        });

        return data;
    }
});

// 新增明细
$('body').on('click', '#add-detail', e => {
    let ctn = $('#detail-ctn').val();

    // 数据校验
    if (ctn === '') {
        modaler.tip('请填写明细内容');
        return;
    }

    // 发送数据
    requester.get('/external/manage/submitFinance.do', {
        userId: urler().userId,
        content: ctn
    }).then(data => {
        if (data.data === true) {
            location.reload();
        } else {
            modaler.tip('添加失败');
        }
    });
});

// 删除明细
$('body').on('click', '.del-detail', e => {
    let id = $(e.currentTarget).attr('data-id');

    requester.get('/external/manage/deleteFinance.do', {
        id: id
    }).then(data => {
        if (data.data === true) {
            location.reload();
        } else {
            modaler.tip('删除失败')
        }
    });
});

// 修改明细内容
$('body').on('click', '#modal-detail-edit', e => {
    let id = $(e.currentTarget).attr('data-id');
    let value = $('#modal-detail-input').val();

    // 数据校验
    if (value === '') {
        modaler.tip('请填写明细内容');
        return;
    }

    // 发送数据
    requester.get('/external/manage/submitFinance.do', {
        id: id,
        userId: urler().userId,
        content: value
    }).then(data => {
        if (data.data === true) {
            location.reload();
        } else {
            modaler.tip('修改失败');
        }
    });
});
