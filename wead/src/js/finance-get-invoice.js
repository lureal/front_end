const uploader = window.uploader;
const modaler = window.modaler;
import urler from './libs/urler';
import { checkEmail, checkMobile, checkBank, checkPhone } from './libs/tools';
var cacheBusinessLicensePath = ''; // 缓存营业执照服务器返回路径
var cacheTaxCertificationPath = ''; // 缓存一般纳税人证明服务器返回路径
var cacheInvoiceSelect; // 缓存发票抬头，公司或者个人

// 获取当前可开局的发票金额
$('#surplus').html(urler().m);

// 初始化上传营业执照
uploader.image({
    container: '#business',
    fileName: 'uploadFile',
    cb(data) {
        cacheBusinessLicensePath = data.data.dlUrl;
        $('#business-upload-preview')
            .show()
            .find('img')
            .attr('src', data.data.dlUrl);
    }
});

// 初始化上传一般纳税人证明
uploader.image({
    container: '#tax-certification',
    fileName: 'uploadFile',
    cb(data) {
        cacheTaxCertificationPath = data.data.dlUrl;
        $('#tax-certification-upload-preview')
            .show()
            .find('img')
            .attr('src', data.data.dlUrl);
    }
});

// 当 input 聚焦时去除错误信息
$('[data-type="input"] input, [data-type="textarea"] textarea').focus((e) => {
    let $parent = $(e.currentTarget).parents('.w-row').removeClass('w-error');
});

// 切换发票类型
$('#invoice-select').change(e => {
    let $self = $(e.currentTarget);
    $('.w-row').removeClass('w-error');

    // 增值税专用发票
    if ($self.val() === '1') {
        $('.special-invoice').show();
        $('.normal-invoice').hide();

    // 增值税普通发票
    } else {
        $('.special-invoice').hide();
        $('.normal-invoice').show();
    }
});

// 切换普通发票个人还是公司
$('#invoice-header-select [type="radio"]').on('ifChecked', e => {
    let $self = $(e.currentTarget);
    $('.w-row').removeClass('w-error');

    // 公司
    if ($self.val() === '0') {
        cacheInvoiceSelect = 0;
        $('#company-header').show();

    // 个人
    } else {
        cacheInvoiceSelect = 1;
        $('#company-header').hide();
        $('.normal-tax[data-id="companyName"]').find('input').val('');
    }
});

// 提交数据
$('#submit').click(() => {

    // 判断当前发票是哪种类型
    let type = $('#invoice-select').val();
    var isValidate = true; // 标识是否出错了
    var fields = {
        content: '信息服务费', // 发票内容
        type: type, // 发票类型
        companyName: '', // 公司名称（发票抬头）
        companyAddress: '', // 公司地址
        companyPhone: '', // 公司电话
        taxno: '', // 税务登记证号
        bank: '', // 开户银行
        account: '', // 银行账号
        businessLicense: '', // 营业执照
        taxCertification: '', // 一般纳税人证明
        recipient: '', // 收件人
        address: '', // 邮寄地址
        phone: '', // 收件人手机
        amount: '' // 金额
    };

    // 公共部分校验

    // 发票金额校验
    let $amount = $('[data-id="amount"]');
    let amountType = $amount.attr('data-type');
    let amountId = $amount.attr('data-id');
    let amountVal = $amount.find('input').val();

    // 金额不能为空，不能为非数字，不能等于0，不能大于可开发票金额
    if(
        amountVal === '' ||
        window.isNaN(Number(amountVal)) ||
        Number(amountVal) === 0 ||
        Number(amountVal) < 100 ||
        Number(amountVal) > urler().m
    ) {
        $amount.addClass('w-error');
        isValidate = false;
    } else {
        fields[amountId] = Number(amountVal).toFixed(2);
    }

    // 增值税专用发票
    if (type === '1') {

        $('.w-form .add-tax').each((index, el) => {
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

                        // 判断当前是不是银行账号
                        if (validate === 'bank' && !checkBank(_val)) {
                            $self.addClass('w-error');
                            isValidate = false;
                            return;
                        }

                        // 判定当前是不是电话
                        if (validate === 'phone' && !checkPhone(_val)) {
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

                    // 如果用户没上传营业执照，也没上传一般纳税人证明
                    if (cacheBusinessLicensePath === '' && cacheTaxCertificationPath === '') {
                        modaler.tip('请上传营业执照和一般纳税人证明');
                        isValidate = false;
                        return;
                    }

                    // 营业执照校验
                    if (id === 'businessLicense') {
                        if (cacheBusinessLicensePath === '') {
                            modaler.tip('请上传营业执照');
                            isValidate = false;
                            return;
                        }
                        fields[id] = cacheBusinessLicensePath;
                    }

                    // 一般纳税人证明校验
                    if (id === 'taxCertification') {
                        if (cacheTaxCertificationPath === '') {
                            modaler.tip('请上传一般纳税人证明')
                            isValidate = false;
                        }
                        fields[id] = cacheTaxCertificationPath;
                    }

                    switch (id) {

                        // 营业执照
                        case 'businessLicense':
                            if (cacheBusinessLicensePath === '') {
                                modaler.tip('请上传营业执照');
                                isValidate = false;
                                return;
                            }
                            fields[id] = cacheBusinessLicensePath;
                            break;

                        // 一般纳税人证明
                        case 'taxCertification':
                            if (cacheTaxCertificationPath === '') {
                                modaler.tip('请上传一般纳税人证明');
                                isValidate = false;
                                return;
                            }
                            fields[id] = cacheTaxCertificationPath;
                            break;
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
        });

    // 增值税普通发票
    } else {
        $('.w-form .normal-tax').each((index, el) => {
            let $self = $(el);
            let type = $self.attr('data-type');
            let id = $self.attr('data-id');
            let validates = $self.attr('data-validate').split(','); // 获取需要判断的条件

            // 选择
            switch (type) {
                case 'input':

                    // 如果当前选择的是个人发票抬头，则不校验发票抬头是否为空
                    if (cacheInvoiceSelect === 1 && id === 'companyName') {
                        return;
                    }

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
                default:
                    break;

            }
        });
    }

    // 如果校验失败了，不发送请求
    if(isValidate === false) {
        return;
    }

    // 校验成功，发送数据给服务器
    requester.get('/external/finance/applyInvoice.do', fields).then(data => {
        if (data.data === true) {
            modaler.confirm({
                msg: '提交成功',
                evt () {
                    $('#modal-confirm').modal();
                    window.location.href = '/#proj_name#/html/finance/invoice.html';
                },
                evtLabel: '确定'
            });
        } else {
            modaler.tip('提交失败');
        }
    });
});
