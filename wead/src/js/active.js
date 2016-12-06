import adjuster from './libs/adjuster.js';
import urler from './libs/urler.js';

// 背景适配
adjuster({
    $ele: $('.bg'),
    width: 1920,
    height: 1080
});

// 根据 url 中的 r 来判断当前应该显示哪个模板
switch (urler().r) {

    // 渲染注册成功模板
    case '0':
        let registeTpl = $('#registe-success').html();
        $('#body').html(registeTpl);
        break;

    // 渲染尚未激活模板
    case '1':
        let notActiveTpl = $('#not-active').html();
        $('#body').html(notActiveTpl);
        break;

    // 渲染链接过期模板
    case '2':
        let expireTpl = $('#expire').html();
        $('#body').html(expireTpl);
        break;

    // 渲染激活成功模板
    case '3':
        let activeSuccessTpl = $('#active-success').html();
        $('#body').html(activeSuccessTpl);

    default:
        break;
}

// 填充激活邮箱
$('#email').html(decodeURIComponent(urler().email));

// 返回首页
$('body').on('click', '.back-to-home', () => {
    location.href = '/#proj_name#/html/user/login.html';
});

// 重新激活
$('body').on('click', '.re-active', () => {
    window.requester.get('/sendActivateLink.do', {
        username: decodeURIComponent(urler().email)
    }).then(data => {
        if (data.data === true) {
            window.modaler.tip('发送成功');
        } else {
            window.modaler.tip('发送失败')
        }
    });
});
