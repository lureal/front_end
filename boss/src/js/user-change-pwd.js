var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var urler = require('./modules/urler');

// 返回按钮
$('#back').click(function() {
    history.back();
});

// 发送邮件
$('#comfirm').click(function() {
    $("#comfirm").attr("disabled", true);
    var oldPwd = $('#old-password').val();
    var newPwd = $('#new-password').val();
    var surePwd = $('#sure-password').val();

    // 数据校验
    if (newPwd === '' || surePwd === '' || oldPwd === '') {
        modal.nobtn({
            ctx: 'body',
            ctn: '请输入旧密码，新密码和重复新密码',
            title: '修改密码'
        });
        return;
    }

    if (oldPwd === newPwd) {
        modal.nobtn({
            ctx: 'body',
            ctn: '旧密码和新密码相同',
            title: '修改密码'
        });
        return;
    }

    if (newPwd !== surePwd) {
        modal.nobtn({
            ctx: 'body',
            ctn: '新密码和重复密码不相同',
            title: '修改密码'
        });
        return;
    }

    // 发送请求
    ajax.post({
        url: '/auth/changePassword.do',
        param: {
            email: decodeURIComponent(urler.normal().username),
            oldPassword: oldPwd,
            newPassword: newPwd,
            repeatPassword: surePwd
        },
        cb: function(data) {
            $("#comfirm").attr("disabled", false);
            if(data.data === false) {
                modal.nobtn({
                    ctx: 'body',
                    title: '修改密码',
                    ctn: '密码修改失败'
                });
            } else {
                modal.onebtn({
                    ctx: 'body',
                    title: '修改密码',
                    ctn: '密码修改成功',
                    btnText: '重新登录',
                    event: function() {
                        location.href = '/#proj_name#/html/user/login.html';
                    }
                });
            }
        },
        modal: modal
    });
});

// 回车登录
$('body').keydown(function() {
    if(event.keyCode == '13') {
        $('#comfirm').click();
    }
});
