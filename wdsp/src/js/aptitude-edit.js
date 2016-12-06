import {
    checkEmail,
    checkMobile,
    urlAddParam
} from './libs/tools';

// 缓存界面状态
let cachePageStatus = {
    tradeIds: null
}

// 获取行业数据
// 接口待确定
requester.get('/select/listInnerTrades.do').then(data => {
    let tpl = $('#select-tpl').html();
    $('#industry').html(_.template(tpl)(data));
    cachePageStatus.tradeIds = data.data;
});

// 初始化上传营业执照
uploader.singleImage({
    container: '#upload-business-license',
    fileName: 'uploadFile'
});

// 初始化上传 ICP 备案
uploader.singleImage({
    container: '#upload-icp-license',
    fileName: 'uploadFile'
});

// 输入框聚焦隐藏错误
$('[data-type="input"] input, [data-type="textarea"] textarea').focus((e) => {
    let $parent = $(e.currentTarget).parents('.w-row').removeClass('w-error');
});

renderAptitude();

// 提交数据
$('#submit').click(e => {

    let isValidate = true; // 标识是否出错了
    let fields = {
        customName: '', // 客户名称
        url: '', // 网站 URL
        contactName: '', // 联系人姓名
        phone: '', // 联系电话
        address: '', // 通讯地址
        tradeId: '', // 行业 ID
        businessLicense: '', // 营业执照
        icpLicense: '', // ICP 备案
        salesEmail: '', // 联系邮箱
    };

    // 循环所有字段
    $('.w-form .w-row').each((index, el) => {
        let $self = $(el);
        let type = $self.attr('data-type');
        let id = $self.attr('data-id');
        let validates = $self.attr('data-validate').split(','); // 获取需要判断的条件

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
            case 'image':
                if (cachePicUploadPath === '') {
                    window.modaler.tip('请上传营业执照/微博截图');
                    isValidate = false;
                    return;
                }
                fields[id] = cachePicUploadPath;
                break;
            default:
                break;

        }
    });

    // 校验营业执照和 ICP 备案，营业执照和 ICP 备案必须上传一个
    let businessLicense = $('#upload-business-license > div').attr('data-url');
    let icpLicense = $('#upload-icp-license > div').attr('data-url');
    icpLicense = icpLicense === undefined ? '' : icpLicense;

    if (businessLicense === undefined || businessLicense === '') {
        modaler.tip('请上传营业执照');
        return;
    }
    
    fields['businessLicense'] = businessLicense;
    fields['icpLicense'] = icpLicense;
    
    // 判断是否验证出错了
    if (!isValidate) {
        return;
    }

    if (urler().e) {
        $.extend({}, fields, {
            customeId: urler().cid
        });
    }

    // 提交数据
    requester.get('/external/custom/submitBase.do', fields).then(data => {
        if (data.data === false) {
            modaler.tip('提交失败');
            return;
        }
        
        // 跳转到首页
        location.href = `/#proj_name#/html/overview/index.html?cid=${data.data.customId}`;
    });
});

/**
 * 从服务器获取资质详情，渲染相应位置
 */
function renderAptitude() {
    if (urler().e) {
        requester.get('/external/custom/getBase.do').then(data => {
            $('[data-id="customName"] [type="text"]').val(data.data.customName);
            $('[data-id="url"] [type="text"]').val(data.data.url);
            $('[data-id="contactName"] [type="text"]').val(data.data.contactName);
            $('[data-id="phone"] [type="text"]').val(data.data.phone);
            $('[data-id="address"] [type="text"]').val(data.data.address);
            
            let tradeTimer = setInterval(() => {
                if (cachePageStatus.tradeIds !== null) {
                    $('[data-id="tradeId"] select').val(data.data.tradeId);
                }
            }, 300);

            $('#upload-business-license > div')
                .removeClass('add')
                .addClass('upload')
                .attr('data-url', data.data.businessLicense);
            $('#upload-business-license img').attr('src', data.data.businessLicense);

            if (data.data.icpLicense !== null && data.data.icpLicense !== '') {
                $('#upload-icp-license > div')
                    .removeClass('add')
                    .addClass('upload')
                    .attr('data-url', data.data.icpLicense);
                $('#upload-icp-license img').attr('src', data.data.icpLicense);
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
        });
    }
}