import {
    checkEmail,
    checkMobile
} from './libs/tools';

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

// 当 input 聚焦时去除错误信息
$('.service-weibo-first').on('focus', '[data-type="input"] input, [data-type="textarea"] textarea', e => {
    let $parent = $(e.currentTarget).parents('.w-row').removeClass('w-error');
});

// 添加微博 uid
$('body').on('click', '#add-uid', e => {
    let tpl = $('#uid-tpl').html();
    $('#uid-wrap').append(_.template(tpl)({
        first: false,
        val: ''
    }));
});

// 删除微博 uid
$('#uid-wrap').on('click', '.del-uid', e => {
    let $parent = $(e.currentTarget).parents('.w-row');
    $parent.remove();
});

// 获取平台基础数据，并渲染
requester.get('/external/custom/getPlatform.do', {
    platformId: urler().id
}).then(data => {

    // 渲染微博平台数据
    if (data.data.weiboAccount !== null) {
        $('[data-id="weiboAccount"] [type="text"]').val(data.data.weiboAccount);
    }
    if (data.data.weiboUids !== null) {
        if (data.data.weiboUids.length > 0) {
            $('[data-id="weiboUids"] [type="text"]').val(data.data.weiboUids[0]);

            let tpl = $('#uid-tpl').html();
            for (let i = 1; i < data.data.weiboUids.length; i++) {
                $('#uid-wrap').append(_.template(tpl)({
                    first: false,
                    val: data.data.weiboUids[i]
                }))
            }
        }
    }
    if (data.data.waxTradeId !== null) {
        let weiboTrade = setInterval(() => {
            if (cachePageStatus.trade !== 0) {
                $('[data-id="waxTradeId"] select').val(data.data.waxTradeId);
                clearInterval(weiboTrade);
            }
        }, 300);
    }
    
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
    $('#upload-business-license > div')
        .removeClass('add')
        .addClass('upload')
        .attr('data-url', data.data.businessLicense);
    $('#upload-business-license img').attr('src', data.data.businessLicense);

    // ICP 备案
    if (data.data.icpLicense !== null && data.data.icpLicense !== '') {
        $('#icp-readonly').show();

        $('#upload-icp-license-preview > div')
            .removeClass('add')
            .addClass('upload')
            .attr('data-url', data.data.icpLicense);
        $('#upload-icp-license-preview img').attr('src', data.data.icpLicense);

    }

    // 其他资质
    if (data.data.otherLicenses !== null) {
        let uploadTpl = $('#multi-upload-item-upload-tpl').html();
        let addTpl = $('#multi-upload-item-tpl').html();
        for (let i = 0; i < data.data.otherLicenses.length; i++) {

            // 第一个元素
            if (i === 0) {
                $('#other-license').html(_.template(uploadTpl)({
                    url: data.data.otherLicenses[i].url
                }));

            // 非第一个元素
            } else {
                $('#other-license').append(_.template(uploadTpl)({
                    url: data.data.otherLicenses[i].url
                }));
            }
        }
        $('#other-license').append(addTpl);
    }

    $('[data-id="salesEmail"] [type="text"]').val(data.data.salesEmail);
    
    cachePageStatus.base = 1;

    renderCacheData();
});

// 初始化其他资质
uploader.multiImage({
    container: '#other-license',
    fileName: 'uploadFile'
});

// 下一步
$('#next').click(e => {
    let isValidate = true; // 标识是否出错了
    let fields = {
        weiboAccount: '', // 微博账号
        weiboUids: [], // 微博 uid
        waxTradeId: '', // wax行业ID
        url: '', // 客户首页 url
        otherLicenses: '' // 其他资质文件
    };

    // 循环所有字段
    $('.w-form .w-row').each((index, el) => {
        let $self = $(el);
        let type = $self.attr('data-type');
        let id = $self.attr('data-id');
        let validates = $self.attr('data-validate').split(','); // 获取需要判断的条件

        // 如果当前属于不需要校验的字段，则直接返回
        if (
            id === 'company' ||
            id === 'contact' ||
            id === 'contactName' ||
            id === 'contactSite' ||
            id === 'contactNumber' ||
            id === 'tradeId' ||
            id === 'salesEmail'
        ) {
            return;
        }

        // 选择
        switch (type) {
            case 'input':
                let _val = $self.find('input').val(); // 获取输入框的值

                // 循环判断条件
                for (let validate of validates) {

                    // 判断是否为空
                    if (validate === 'empty' && _val === '') {
                        $self.addClass('w-error');
                        isValidate = false;
                        return;
                    }

                    // 判断当前是不是手机
                    if (validate === 'mobile' && !checkMobile(_val)) {
                        $self.addClass('w-error');
                        isValidate = false;
                        return;
                    }

                    // 判断当前是不是邮箱
                    if (validate === 'email' && !checkEmail(_val)) {
                        $self.addClass('w-error');
                        isValidate = false;
                        return;
                    }

                    // 如果当前是微博 uid，并且已经校验完成，则做别的处理
                    if (id === 'weiboUids') {
                        fields[id].push(_val);
                        return;
                    }

                    // 缓存值
                    fields[id] = _val;
                }
                break;
            case 'textarea':
                let _textareaVal = $self.find('textarea').val();

                // 判断是否为空
                if (_textareaVal === '') {
                    $self.addClass('w-error');
                    isValidate = false;
                    return;
                }
                fields[id] = _textareaVal;
                break;
            case 'select':
                fields[id] = $self.find('select').val();
                break;
            default:
                break;
        }
    });

    // 如果当前可以上传 ICP 备案，则将 ICP 备案缓存到数据中
    if ($('#weibo-first').attr('data-haveicp') === '0') {
        let icp = $('#upload-icp-license > div').attr('data-url');
        icp = icp === undefined ? '' : icp;
        fields.otherLicenses = `[{ "url": "${icp}" }]`;
    }

    // 获取其他资质
    let _otherLicenses = [];
    $('#other-license .multi-upload-item.upload').each((index, el) => {
        _otherLicenses.push(
            {
                name: '',
                url: $(el).attr('data-url')
            }
        )
    });
    
    fields.otherLicenses = _otherLicenses.length === 0 ? '' : JSON.stringify(_otherLicenses);

    // 判断是否验证出错了
    if (!isValidate) {
        return;
    }

    fields.weiboUids = JSON.stringify(fields.weiboUids);

    // 缓存开户数据，并跳转到存入开户金额页面
    localStorage.setItem('weibo_submit_data', JSON.stringify(fields));
    location.href = `/#proj_name#/html/service/weibo/second.html?cid=${urler().cid}&id=${urler().id}`;
});

/**
 * 如果本地缓存中有数据，从本地缓存中渲染数据
 */
function renderCacheData() {
    let cacheFormData = localStorage.getItem('weibo_submit_data');
    if (cacheFormData !== null) {
        cacheFormData = JSON.parse(cacheFormData);
        
        // 微博账号
        $('[data-id="weiboAccount"] [type="text"]').val(cacheFormData.weiboAccount);

        // 微博 uid
        let uids = cacheFormData.weiboUids.replace(/[\[\]]/g, '').split(',');
        let tpl = $('#uid-tpl').html();
        $('#uid-wrap').html(_.template(tpl)({
            first: true,
            val: uids[0]
        }));
        for (let i = 1; i < uids.length; i++) {
            $('#uid-wrap').append(_.template(tpl)({
                first: false,
                val: uids[i]
            }))
        }

        // 微博广告行业
        let weiboTradeTimer = setInterval(() => {
            if (cachePageStatus.weiboTrade !== 0) {
                $('[data-id="waxTradeId"] select').val(cacheFormData.waxTradeId);
                clearInterval(weiboTradeTimer);
            }
        }, 300);

        // 平台基础数据
        let baseTimer = setInterval(() => {

            // 渲染其他资质
            if (cachePageStatus.base !== 0 && cacheFormData.otherLicenses !== '') {
                let otherLicenses = JSON.parse(cacheFormData.otherLicenses);
                let uploadTpl = $('#multi-upload-item-upload-tpl').html();
                let addTpl = $('#multi-upload-item-tpl').html();
                for (let i = 0; i < otherLicenses.length; i++) {

                    // 第一个元素
                    if (i === 0) {
                        $('#other-license').html(_.template(uploadTpl)({
                            url: otherLicenses[i].url
                        }));

                    // 非第一个元素
                    } else {
                        $('#other-license').append(_.template(uploadTpl)({
                            url: otherLicenses[i].url
                        }));
                    }
                }
                $('#other-license').append(addTpl);

                clearInterval(baseTimer);
            }
        }, 300);


    }
}

// // 初始化页面数据
// let cacheFormData = localStorage.getItem('weibo_submit_data');

// // 如果当前本地是存储有数据的，则说明当前是需要初始化数据的
// if (cacheFormData !== null) {
//     cacheFormData = JSON.parse(cacheFormData);
//     let timer = setInterval(() => {

//         // 当前服务器已经把异步数据返回回来，执行初始化
//         if (cachePageStatus.weiboIndustry !== 0 && cachePageStatus.trade !== 0) {
//             clearInterval(timer);

//             // 渲染微博登录账号
//             $('[data-id="account"] [type="text"]').val(cacheFormData.account);

//             // 渲染微博 uid
//             $('[data-id="uid"] [type="text"]').val(cacheFormData.uid[0]);
//             for (let i = 1; i < cacheFormData.uid.length; i++) {
//                 let tpl = $('#uid-tpl').html();
//                 $('#uid-wrap').append(_.template(tpl)({
//                     val: cacheFormData.uid[i]
//                 }));
//             }

//             // 渲染微博广告行业
//             $('[data-id="weiboIndustry"] select').val(cacheFormData.weiboIndustry);

//             // 渲染公司名
//             $('[data-id="company"] [type="text"]').val(cacheFormData.company);

//             // 渲染网站 url
//             $('[data-id="url"] [type="text"]').val(cacheFormData.url);

//             // 渲染联系人姓名
//             $('[data-id="contact"] [type="text"]').val(cacheFormData.contact);

//             // 渲染联系电话
//             $('[data-id="contactNumber"] [type="text"]').val(cacheFormData.contactNumber);

//             // 渲染通信地址
//             $('[data-id="contactSite"] textarea').val(cacheFormData.contactSite);

//             // 渲染平台开户行业
//             $('[data-id="trade"] select').val(cacheFormData.trade);

//             // 渲染营业执照
//             $('#upload-img > div')
//                 .removeClass('add')
//                 .addClass('upload')
//                 .attr('data-url', cacheFormData.screenshot);
//             $('#upload-img img').attr('src', cacheFormData.screenshot);

//             // 渲染邮箱
//             $('[data-id="email"] [type="text"]').val(cacheFormData.email);
            
//         }
//     }, 300);
// }