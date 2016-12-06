const requester = window.requester;
import adjuster from './libs/adjuster.js';
import urler from './libs/urler';
var passCheck = true;

// 背景适配
adjuster({
    $ele: $('.bg'),
    width: 1920,
    height: 1080
});

$('[type="password"]').focus(e => {
    $(e.currentTarget).parent().removeClass('error');
});

// 焦点不见时检查密码是否正确
$('#new-pwd').blur(e => {
    let $self = $(e.currentTarget);
    let value = $self.val();

    // 数据校验
    if (value === '') {
        $self.next().html('请输入正确的密码');
        $self.parent().addClass('error');
        passCheck = false;
        return;
    }

    // 检测密码强度
    if (
        value.length < 6 ||
        !(/[A-Za-z]/g.test(value) && /[\d]/g.test(value))
    ) {
        $self.next().html('密码至少 6 位，必须包含数字和字母');
        $self.parent().addClass('error');
        passCheck = false;
        return;
    }

    // 发送数据校验密码是否是原来那个密码
    window.requester.post('/isPwdRight.do', { password: value }).then(data => {
        if (data.data === true) {
            passCheck = false;
            $self.parent().addClass('error');
        } else {
            $self.parent().addClass('pass');
            passCheck = true;
        }
    });
});
$('#repeat-pwd').blur(e => {
    let $self = $(e.currentTarget);
    let value = $self.val();

    // 数据校验
    if (value === '' || value !== $('#new-pwd').val()) {
        $self.parent().addClass('error');
        passCheck = false;
        return;
    } else {
        $self.parent().addClass('pass');
        passCheck = true;
    }
});

// 修改密码
$('#confirm').click(e => {
    let value = $('#new-pwd').val();

    // 数据校验
    if (value === '' || !passCheck) {
        window.modaler.tip('请输入正确的密码');
        return;
    }

    window.requester.post('/resetPassword.do', {
        password: value,
        username: urler().username,
        sign: urler().key,
        time: (+new Date)
    }).then(data => {
        location.href = '/#proj_name#/html/user/login.html';
    });
});
