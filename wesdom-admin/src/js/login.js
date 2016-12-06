/*!
 * 登录
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');

$('#login').click(function() {
    var username = $('#username').val();
    var passwd = $('#passwd').val();

    if(username === '' || passwd === '') {
        modal.nobtn({
            ctx: 'body',
            title: '登录',
            ctn: '请输入账户密码'
        });
        return;
    }

    ajax.get({
        url: '/admin/login.do',
        param: {
            username: username,
            token: passwd
        },
        cb: function(data) {
            if(data.data === true) {
                location.href = '/wesdom-admin/case/list';
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '登录',
                    ctn: data.message
                });
            }
        }
    });
});
