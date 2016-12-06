const modaler = window.modaler;
const requester = window.requester;
import { checkMobile } from './libs/tools';

// 当 input 聚焦时去除错误信息
$('[data-type="input"] input').focus((e) => {
    let $parent = $(e.currentTarget).parents('.w-row').removeClass('w-error');
});

// 提交数据
$('#save').click(e => {
    let $self = $(e.currentTarget);
    let id = $self.attr('data-id');
    var isValidate = true; // 标识是否出错了
    var fields = {
        email: '',
        name: '',
        mobile: '',
        address: ''
    };

    // 循环所有字段
    $('.w-form .w-row').each((index, el) => {
        let $self = $(el);
        let type = $self.attr('data-type');
        let id = $self.attr('data-id');
        let validates = $self.attr('data-validate').split(','); // 获取需要判断的条件

        // 邮箱不用验证，返回
        if (id === 'email') {
            fields[id] = $self.find('input').val();
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

                    // 缓存值
                    fields[id] = _val;
                }
                break;
            default:
                break;
        }
    });

    // 判断是否验证出错了
    if (!isValidate) {
        return;
    }

    // 将数据发送给服务器
    requester.post('/external/account/submit.do', {
        id: id,
        name: fields.name,
        address: fields.address,
        phone: fields.mobile
    }).then(data => {
        if (data.data === true) {
            modaler.tip('保存成功');
        } else {
            modaler.tip('保存失败');
        }
    });
});

// 初始化页面数据
// 1. 从服务器获取账号数据渲染
requester.get('/external/account/get.do').then(data => {

    // 渲染邮箱
    $('[data-id="email"]').find('input').val(data.data.email);

    // 渲染姓名
    $('[data-id="name"]').find('input').val(data.data.name);

    // 渲染手机
    $('[data-id="mobile"]').find('input').val(data.data.phone);

    // 渲染联系地址
    $('[data-id="address"]').find('input').val(data.data.address);

    // 缓存 id
    $('#save').attr('data-id', data.data.id);
});
