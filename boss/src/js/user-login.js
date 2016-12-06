/*!
 * 登录页面
 */
var ajax = require('./modules/ajax');
var modal = require('./modules/modal');

// 登录
$('body').on('click', '#login-submit', function() {
    var _username = $('#username').val(),
        _password = $('#password').val();

    // 数据有效性校验
    if(_username === '' || _password === '') {
        modal.nobtn({
            ctx: 'body',
            ctn: '请确保已输入邮箱和密码',
            title: '登录'
        });
        return;
    }

    // 校验邮箱
    if(!(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(_username))) {
        modal.nobtn({
            ctx: 'body',
            ctn: '请输入正确的邮箱',
            title: '登录'
        });
        return;
    }
    ajax.post({
        url: '/auth/login.do',
        param: {
            email: _username,
            password: _password
        },
        cb: function(data) {
            if(data.data === false) {
                modal.nobtn({
                    ctx: 'body',
                    title: '登录',
                    ctn: '请输入正确的用户名与密码'
                });
                return;
            } else {
                localStorage.setItem('email', _username);
                location.href = '/#proj_name#/html/portal/index.html';
            }
        },
        modal: modal
    });
});

// 回车登录
$('body').keydown(function() {
    if(event.keyCode == '13') {
        $('body #login-submit').click();
    }
});
