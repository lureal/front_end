const requester = window.requester;
const modaler = window.modaler;
import urler from './libs/urler';
import { checkMobile, checkEmail } from './libs/tools';

// 缓存文件上传路径
var cachePicUploadPath = '';

// 初始化文件上传
uploader.image({
    container: '#pic',
    fileName: 'uploadFile',
    cb(data) {
        cachePicUploadPath = data.data.dlUrl;
        $('#pic-upload-preview')
            .show()
            .find('img')
            .attr('src', data.data.dlUrl);
    }
});

// 当 input 聚焦时去除错误信息
$('[data-type="input"] input, [data-type="textarea"] textarea').focus((e) => {
    let $parent = $(e.currentTarget).parents('.w-row').removeClass('w-error');
});

// 获取查看资质数据
requester.get('/external/business/get.do', { id: urler().id }).then(data => {

    // 渲染数据
    setVal('account', 0, 'weiboAccount', data);
    setVal('uid', 0, 'uid', data);
    setVal('contact', 0, 'contactName', data);
    setVal('company', 0, 'companyName', data);
    setVal('url', 0, 'url', data);
    setVal('contactSite', 1, 'address', data);
    setVal('contactNumber', 0, 'phone', data);

    // 获取行业列表渲染行业数据
    requester.get('/select/listTrades.do', { id: 'fans' }).then(_data => {

        let tpl = $('#industry-tpl').html();
        $('[data-id="industry"] select').html(_.template(tpl)(_data));

        // 循环获得行业数据
        for (let item in _data.data) {

            // 确定行业名称
            if (item === data.data.weiboTradeId) {
                $('[data-id="industry"] select').val(item);
            }
        }
    });

    // 渲染截图
    cachePicUploadPath = data.data.businessLicense;
    // $('#pic-img').show();
    // $('#pic-img > span').html(data.data.businessLicense);
    $('#pic-upload-preview')
        .show()
        .find('img')
        .attr('src', data.data.businessLicense);

    setVal('email', 0, 'salesEmail', data);
});

// 下一步
$('#next').click(() => {
    var isValidate = true; // 标识是否出错了
    var fields = {
        account: '', // 微博登录账号
        uid: '', // 微博 uid
        contact: '', // 联系人姓名
        company: '', // 公司（网站）名称
        url: '', // 网站 URL
        contactSite: '', // 通讯地址
        contactNumber: '', // 联系电话
        industry: '', // 行业
        screenshot: '', // 截图
        email: '' // email
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

    // 判断是否验证出错了
    if (!isValidate) {
        return;
    }

    // 发送请求给服务器
    $('#next').click(() => {
        requester.post('/external/business/submitFans.do', {
            id: urler().id,
            companyName: fields.company, // 公司名称
            weiboAccount: fields.account, // 微博账号
            contactName: fields.contact, // 联系人姓名
            url: fields.url, // 公司首页 url
            address: fields.contactSite, // 通讯地址
            phone: fields.contactNumber, // 联系电话
            weiboTradeId: fields.industry, // 内部行业 ID
            businessLicense: fields.screenshot, // 营业执照文件
            uid: fields.uid, // 微博 uid
            salesEmail: fields.email, // 销售人员邮箱
        }).then(data => {

            // 提交成功
            if (data.data === true) {
                modaler.confirm({
                    msg: `
                        <p style="color: #1b8cfa; font-size: 20px; margin: 0 0 5px 0;">申请已提交，正在审核...</p>
                        <p style="color: #738399; font-size: 14px; margin: 0;">(审核需要1个工作日，请耐心等待)</p>
                    `,
                    evt() {
                        location.href = '/#proj_name#/html/service/index.html';
                    },
                    evtLabel: '确认'
                });

            // 提交失败
            } else {
                modaler.tip('提交申请失败，请重新提交');
            }
        });
    });
});

/**
 * 设置 textarea 或 input 的值
 * @param {String} el - 元素标识符
 * @param {String} type - 标识是什么类型
 * @param {String} field - 字段名称
 * @param {Object} data - 服务器返回的数据
 */
function setVal(el, type, field, data) {

    // input
    if (type === 0) {
        $(`[data-id="${el}"]`).find('input').val(data.data[field]);

    // textarea
    } else {
        $(`[data-id="${el}"]`).find('textarea').val(data.data[field]);
    }
}
