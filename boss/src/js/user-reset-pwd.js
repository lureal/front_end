var ajax = require('./modules/ajax');
var modal = require('./modules/modal');

// 返回按钮
$('#back').click(function() {
    history.back();
});

// 发送邮件
$('#send').click(function() {
    $("#send").attr("disabled", true);
    var email = $('#email').val();

    // 数据校验
    if (email === '' || !(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/).test(email)) {
        modal.nobtn({
            ctx: 'body',
            ctn: '请输入正确的邮箱',
            title: '重置密码'
        });
        return;
    }

    // 发送请求
    ajax.post({
        url: '/auth/initPassword.do',
        param: {
            email: email
        },
        cb: function(data) {
            $("#send").attr("disabled", false);
            if(data.data === false) {
                modal.nobtn({
                    ctx: 'body',
                    title: '重置密码',
                    ctn: '请输入正确的账号'
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '重置密码',
                    ctn: '发送成功，请去邮箱查收邮件'
                });
            }
        },
        modal: modal
    });
});

// 回车登录
$('body').keydown(function() {
    if(event.keyCode == '13') {
        $('#send').click();
    }
});
