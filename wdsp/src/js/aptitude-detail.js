
// 页面状态
let cachePageStatus = {
    trades: null
};

// 获取行业数据
requester.get('/select/listInnerTrades.do').then(data => {
    cachePageStatus.trades = data.data;
});

// 获取资质详情
requester.get('/external/custom/getBase.do').then(data => {

    // 渲染公司名称
    $('[data-id="customName"] [type="text"]').val(data.data.customName)

    // 渲染网站 URL
    $('[data-id="url"] [type="text"]').val(data.data.url);

    // 渲染联系人姓名
    $('[data-id="contactName"] [type="text"]').val(data.data.contactName);

    // 渲染联系电话
    $('[data-id="phone"] [type="text"]').val(data.data.phone);

    // 渲染通信地址
    $('[data-id="address"] [type="text"]').val(data.data.address);

    // 渲染行业列表
    let tradeTimer = setInterval(e => {
        if (cachePageStatus.trades !== null) {
            $('[data-id="tradeId"] [type="text"]').val(cachePageStatus.trades[data.data.tradeId]);
            clearInterval(tradeTimer);
        }
    }, 300);

    // 渲染营业执照
    $('#upload-business-license .preview-thumbnail').attr('src', data.data.businessLicense);

    // 当前有 ICP 备案
    if (data.data.icpLicense !== null && data.data.icpLicense !== '') {
        $('#upload-icp-license').parents('.w-row').show();
        $('#upload-icp-license .preview-thumbnail').attr('src', data.data.icpLicense);
    }

    // 渲染联系邮箱
    $('[data-id="email"] [type="text"]').val(data.data.salesEmail);
});

// 申请修改
$('#edit').click(e => {

    // 弹出申请修改弹窗
    modaler.dialog({
        msg: '资质修改后，需要1个工作日重新审核<br>是否申请修改?',
        evtLabel: '申请',
        evt() {
            location.href = `/#proj_name#/html/aptitude/edit.html?cid=${urler().cid}&e=1`;
        }
    });
});