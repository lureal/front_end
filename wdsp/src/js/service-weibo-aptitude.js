
// 缓存页面数据
let cachePageStatus = {
    weiboTrade: 0,
    trade: 0,
    base: 0
};

// 获取微博广告行业
requester.get('/select/listTrades.do?id=fans').then(data => {
    let tpl = $('#select-tpl').html();
    $('#weibo-industry').html(_.template(tpl)(data));
    cachePageStatus.weiboTrade = data.data;
});

// 获取平台开户行业
requester.get('/select/listInnerTrades.do').then(data => {
    let tpl = $('#select-tpl').html();
    $('#platform-industry').html(_.template(tpl)(data));
    cachePageStatus.trade = data.data;
});

// 获取平台基础数据，并渲染
requester.get('/external/custom/getPlatform.do', {
    platformId: urler().platformId
}).then(data => {

    // 渲染微博平台数据
    $('[data-id="weiboAccount"] [type="text"]').val(data.data.weiboAccount);
    $('[data-id="weiboUids"] [type="text"]').val(data.data.weiboUids[0]);

    let tpl = $('#uid-tpl').html();
    for (let i = 1; i < data.data.weiboUids.length; i++) {
        $('#uid-wrap').append(_.template(tpl)({
            val: data.data.weiboUids[i]
        }))
    }

    let weiboTrade = setInterval(() => {
        if (cachePageStatus.trade !== 0) {
            $('[data-id="waxTradeId"] [type="text"]').val(cachePageStatus.weiboTrade[data.data.waxTradeId]);
            clearInterval(weiboTrade);
        }
    }, 300);
    
    // 渲染平台基础数据
    $('[data-id="company"] [type="text"]').val(data.data.customName);
    $('[data-id="url"] [type="text"]').val(data.data.url);
    $('[data-id="contact"] [type="text"]').val(data.data.contactName);
    $('[data-id="contactNumber"] [type="text"]').val(data.data.phone);
    $('[data-id="contactSite"] textarea').val(data.data.address);

    let platformTrade = setInterval(() => {
        if (cachePageStatus.trade !== 0) {
            $('[data-id="tradeId"] [type="text"]').val(cachePageStatus.trade[data.data.tradeId]);
            clearInterval(platformTrade);
        }
    }, 300);
            
    // 渲染营业执照
    $('#upload-business-license img').attr('src', data.data.businessLicense);

    // 渲染 ICP 备案
    if (data.data.icpLicense !== null && data.data.icpLicense !== '') {
        $('#weibo-first').attr('data-haveicp', '1');
        $('#icp-readonly').show();
        $('#upload-icp-license-preview img').attr('src', data.data.icpLicense);
    }

    // 渲染其他资质
    if (data.data.otherLicenses !== null && data.data.otherLicenses.length > 0) {
        $('#other-license').show();
        $('#upload-other-license-preview img').attr('src', data.data.otherLicenses[0].url);
        let tpl = $('#other-license-tpl').html();
        $('#other-license').append(_.template(tpl)(data.data));
        console.log(data.data.otherLicenses)
    }

    $('[data-id="salesEmail"] [type="text"]').val(data.data.salesEmail);
    
    cachePageStatus.base = 1;
});

// 申请修改
$('#next').click(e => {

    // 弹出申请修改弹窗
    modaler.dialog({
        msg: '资质修改后，需要1个工作日重新审核<br>是否申请修改?',
        evtLabel: '申请',
        evt() {
            localStorage.removeItem('weibo_submit_data');
            location.href = `/#proj_name#/html/service/weibo/first.html?cid=${urler().cid}&id=${urler().platformId}`;
        }
    });
});