const uploader = window.uploader;
const modaler = window.modaler;
const requester = window.requester;
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

    // 缓存开户数据，并跳转到存入开户金额页面
    window.localStorage.setItem('fensitong_submit_data', JSON.stringify(fields));
    window.location.href = '/#proj_name#/html/service/fensitong/second.html';
});

// 初始化页面数据
// 1. 获取行业数据并初始化
// 2. 如果本地存在数据，则用这些数据来渲染页面（当填写完进入第二步骤后再回退到第一步骤时）
// -----------------------------------------------------------------------------
let cacheFormData = JSON.parse(localStorage.getItem('fensitong_submit_data'));

// 获取行业列表
requester.get('/select/listTrades.do', { id: 'fans' }).then(data => {

    // 渲染行业数据
    let tpl = $('#industry-tpl').html();
    $('[data-id="industry"] select').html(_.template(tpl)(data));


    // 如果本地有缓存数据，则进行数据的渲染
    if (cacheFormData !== null) {

        // 渲染微博登录账号
        $('[data-id="account"] input').val(cacheFormData.account);

        // 渲染微博 uid
        $('[data-id="uid"] input').val(cacheFormData.uid);

        // 渲染联系人姓名
        $('[data-id="contact"] input').val(cacheFormData.contact);

        // 渲染公司（网站）姓名
        $('[data-id="company"] input').val(cacheFormData.company);

        // 渲染网站 URL
        $('[data-id="url"] input').val(cacheFormData.url);

        // 渲染通讯地址
        $('[data-id="contactSite"] textarea').val(cacheFormData.contactSite);

        // 渲染联系电话
        $('[data-id="contactNumber"] input').val(cacheFormData.contactNumber);

        // 渲染行业
        $('[data-id="industry"] select').val(cacheFormData.industry);

        // 渲染截图
        cachePicUploadPath = cacheFormData.screenshot;
        // $('#pic-img').show();
        // $('#pic-img > span').html(cacheFormData.screenshot);
        $('#pic-upload-preview')
            .show()
            .find('img')
            .attr('src', cacheFormData.screenshot);

        // 渲染 email
        $('[data-id="email"] input').val(cacheFormData.email);
    }
});
