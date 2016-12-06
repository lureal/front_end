import adjuster from './libs/adjuster.js';
import { checkEmail } from './libs/tools';

// 进行登录判断，如果当前登录过了，直接跳转到对应的页面
window.requester.get('/hasLogin.do').then(data => {
    if (data.data === false) {
        $('.user-login').show();
    } else {

        // 跳转到前台
        if (data.data.sysId === 1) {
            location.href = '/#proj_name#/html/service/index.html';

        // 跳转到后台
        } else {
            location.href = '/#proj_name#/html/admin/customer/index.html';
        }
    }
});

// 背景适配
adjuster({
    $ele: $('.bg'),
    width: 1920,
    height: 1080
});

// 新用户注册
$('#register').click(() => {
    let tpl = $('#register-tpl').html();
    window.modaler.diy({ ctn: tpl, className: 'login-modal' });
});

// 忘记密码
$('#forget-pwd').click(() => {
    let tpl = $('#find-pwd-tpl').html();
    window.modaler.diy({ ctn: tpl, className: 'login-modal' });
});

// 当焦点聚焦时移除 error 类名
$('#username').focus(e => $(e.currentTarget).parent().removeClass('error'));
$('#passwd').focus(e => $(e.currentTarget).parent().removeClass('error'));
$('body').on('focus', '#modal-registe-email', e => $(e.currentTarget).parent().removeClass('error'));
$('body').on('focus', '#modal-registe-passwd', e => $(e.currentTarget).parent().removeClass('error'));
$('body').on('focus', '#modal-findpwd-email', e => $(e.currentTarget).parent().removeClass('error'));

// 登录操作
$('#login').click(() => {
    let $username = $('#username');
    let $passwd = $('#passwd');

    // 如果当前没有输入用户名
    if ($username.val() === '' || !checkEmail($username.val())) {
        showErrorTip($username, '请输入正确的邮箱');
        return;
    }

    // 当前没有输入密码
    if ($passwd.val() === '') {
        showErrorTip($passwd, '请输入密码');
        return;
    }

    // 发送请求
    window.requester.post('/login.do', {
        username: $username.val(),
        password: $passwd.val()
    }).then(data => {

        // 服务器返回 201 账户错误
        if (data.code === 201) {
            showErrorTip($username, '请输入正确的用户名');
            return;
        }

        // 服务器返回 202 密码错误
        if (data.code === 202) {
            showErrorTip($passwd, '请输入正确的密码');
            return;
        }

        // 未激活
        if (data.code === 203) {
            let encodeEmail = encodeURIComponent($username.val());
            window.location.href = `/#proj_name#/html/user/active.html?r=1&email=${encodeEmail}`;
            return;
        }

        // 登录失败
        if (data.data === false) {
            window.modaler.tip('登录失败');

        // 登录失败
        } else {

            // 将用户名存储到本地，方便应用内使用
            localStorage.setItem('username', data.data.username);

            // 跳转到前台
            if (data.data.sysId === 1) {
                location.href = '/#proj_name#/html/service/index.html';

            // 跳转到后台
            } else {
                location.href = '/#proj_name#/html/admin/customer/index.html';
            }
        }

    }, error => {
        console.error(error);
    });
});

// 新用户注册
$('body').on('click', '#modal-registe', e => {
    let $email = $('#modal-registe-email');
    let $passwd = $('#modal-registe-passwd');

    // 当前用户没有输入用户名
    if ($email.val() === '') {
        showErrorTip($email, '请输入注册邮箱');
        return;
    }

    // 当前用户没有输入密码
    if ($passwd.val() === '') {
        showErrorTip($passwd, '请设置密码');
        return;
    }

    // 当前用户填写的邮箱格式不正确
    if (!checkEmail($email.val())) {
        showErrorTip($email, '请填写正确的邮箱');
        return;
    }

    // 检测密码强度
    if (
        $passwd.val().length < 6 ||
        !(/[A-Za-z]/g.test($passwd.val()) && /[\d]/g.test($passwd.val()))
    ) {
        showErrorTip($passwd, '密码至少 6 位，必须包含数字和字母');
        return;
    }

    // 发送请求
    window.requester.post('/register.do', {
        username: $email.val(),
        password: $passwd.val()
    }).then(data => {
        if (data.data === true) {
            let encodeEmail = encodeURIComponent($('#modal-registe-email').val());
            location.href = `/#proj_name#/html/user/active.html?r=0&email=${encodeEmail}`;
        } else {
            showErrorTip($email, '当前邮箱已被注册');
        }
    }, error => {
        console.error(error);
    });
});

// 申请找回密码按钮
$('body').on('click', '#modal-findpwd', e => {
    let $email = $('#modal-findpwd-email');

    // 当前用户没有输入邮箱
    if ($email.val() === '') {
        showErrorTip($email, '请填写邮箱');
        return;
    }

    // 当前用户填写的邮箱格式不正确
    if (!checkEmail($email.val())) {
        showErrorTip($email, '请填写正确的邮箱');
        return;
    }

    // 发送请求
    window.requester.post('/requestResetPwd.do', {
        username: $email.val()
    }).then(data => {

        // 发送成功
        if (data.data === true) {
            let tpl = $('#verify-tpl').html();
            window.modaler.diy({ ctn: _.template(tpl)({ email: $email.val() }), className: 'login-modal' });

        // 发送失败
        } else {
            showErrorTip($email, data.message);
        }
    });
});

/**
 * 错误处理函数，将找到 $ele 元素的父元素，添加一个 error 类名
 * @param {jQuery} e - input 元素
 * @param {String} msg - 待显示的错误信息
 */
function showErrorTip(e, msg) {
    let parent = e.parent();
    parent.find('.error-tip').html(msg);
    parent.addClass('error');
}
