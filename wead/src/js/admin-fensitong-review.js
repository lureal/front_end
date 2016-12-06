const _ = window._;
const requester = window.requester;
const modaler = window.modaler;
import urler from './libs/urler';
var cachePassStatus = 1; // 缓存通过状态，2 -> 不通过 1 -> 通过

// 获取公司名，并渲染到页面中
$('#breadcrumb-company').html(decodeURIComponent(urler().company));
$('#box-company').html(decodeURIComponent(urler().company));

// 获取开户审核信息，渲染数据
requester.get('/external/manage/getBusiness.do', { id: urler().id }).then(data => {
    $('#account').val(data.data.weiboAccount);
    $('#uid').val(data.data.uid);
    $('#contact').val(data.data.contactName);
    $('#companyName').val(data.data.companyName);
    $('#url').val(data.data.url);
    $('#address').val(data.data.address);
    $('#contactNumber').val(data.data.phone);
    $('#pic').find('span span').val(data.data.businessLicense);
    $('#pic').find('a').attr('data-url', data.data.businessLicense);
    $('#pic-download-preview')
        .show()
        .find('img')
        .attr('src', data.data.businessLicense);

    $('#email').val(data.data.salesEmail);


    // 获取行业列表渲染行业数据
    requester.get('/select/listTrades.do', { id: 'fans' }).then(_data => {

        // 循环获得行业数据
        for (let item in _data.data) {

            // 确定行业名称
            if (item === data.data.weiboTradeId) {
                $('#industry').val(_data.data[item]);
            }
        }
    });
});

// 下载图片
$('#download').click(e => {
    let url = $(e.currentTarget).attr('data-url');
    location.href = `/external/manage/downloadLicense.do?imageUrl=${url}`;
});

// 切换通过还是不通过
$('#pass-status [type="radio"]').on('ifChecked', e => {
    let $self = $(e.currentTarget);
    $('#not-pass-reason textarea').val('').css('height', '40px'); // 重置 textarea

    // 通过
    if ($self.val() === '0') {
        $('#not-pass-reason').hide();
        cachePassStatus = 1;

    // 不通过
    } else {
        $('#not-pass-reason').show();
        cachePassStatus = 2;
    }
});

// 确认
$('#confirm').click(() => {
    var reason = '';

    // 不通过，填写原因
    if (cachePassStatus === 2) {
        reason = $('#not-pass-reason textarea').val();

        // 如果不通过需要判定原因
        if (reason === '') {
            modaler.tip('请填写不通过原因');
            return;
        }
    }

    // 发送请求
    requester.get('/external/manage/approveBusiness.do', {
        id: urler().id,
        status: cachePassStatus,
        reason: reason
    }).then(data => {
        if (data.data === true) {
            localStorage.removeItem('updateNumber');
            location.href = '/#proj_name#/html/admin/customer/index.html';
        } else {
            modaler.tip('审核失败');
        }
    });
});
