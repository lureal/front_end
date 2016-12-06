
// 当 input 聚焦时去除错误信息
$('[data-type="input"] input').focus((e) => {
    let $parent = $(e.currentTarget).parents('.w-row').removeClass('w-error');
    $(e.currentTarget).next().hide();
});

// 检测密码是否正确
$('#old-pwd input').blur((e) => {
    let $self = $(e.currentTarget);

    if ($self.val() === '') {
        $self.parents('.w-row').addClass('w-error');
        return;
    }

    requester.post('/isPwdRight.do', { password: $self.val() }).then(data => {

        // 与原来的密码不同
        if (data.data === false) {
            $self.parents('.w-row').addClass('w-error');

        // 与原来的密码相同
        } else {
            $self.find('.pass-check').show();
        }
    });
});

// 确认修改
$('#confirm-edit').click(() => {
    var isValidate = true; // 标识是否出错了
    var fields = {
        oldPassword: '',
        newPassword: '',
        reNewPassword: ''
    };

    // 重置错误信息
    $('#new-pwd-errmsg > p').html('请设置您的新密码');
    $('#renew-pwd-errmsg > p').html('请确保两次输入密码相同');

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

    // 检验旧密码和新密码是否相同
    if ($('[data-id="oldPassword"]').find('input').val() === $('[data-id="newPassword"]').find('input').val()) {
        $('#new-pwd-errmsg > p').html('新密码和旧密码相同');
        $('[data-id="newPassword"]').addClass('w-error');
        isValidate = false;
    }

    // 检验新密码和重复密码是否相同
    if ($('[data-id="newPassword"]').find('input').val() !== $('[data-id="reNewPassword"]').find('input').val()) {
        $('[data-id="reNewPassword"]').addClass('w-error');
        isValidate = false;
    }

    // 判断是否验证出错了
    if (!isValidate) {
        return;
    }

    // 将数据发送给服务器
    requester.post('/changePassword.do', {
        username: localStorage.getItem('username'),
        newPassword: fields.newPassword,
        oldPassword: fields.oldPassword
    }).then(data => {
        if (data.data === true) {
            requester.get('/logout.do').then(data => {
                if (data.data === true) {
                    modaler.tip('修改成功，请重新登录', true);

                    setTimeout(() => {
                        $('#tip').fadeOut(() => {
                            location.href = '/#proj_name#/html/user/login.html';
                        })
                    }, 1500);
                } else {
                    modaler.tip('退出失败');
                }
            });
        } else {
            modaler.tip('修改失败');
        }
    });
});