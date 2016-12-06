var ajax = require('./modules/ajax');
var modal = require('./modules/modal');

// 返回上一页
$('body').on('click', '#canel', function() {
    history.back();
});

// 登出
$('body').on('click', '#signout', function() {
    ajax.get({
        url: '/auth/logout.do',
        cb: function(data) {
            if(data.data === false) {
                modal.nobtn({
                    ctx: 'body',
                    // title: 'BOSS',
                    ctn: '退出登录失败'
                });
            } else {
                modal.onebtn({
                    ctx: 'body',
                    // title: 'BOSS',
                    ctn: '退出登录成功',
                    btnText: '重新登录',
                    event: function() {
                        location.href = '/#proj_name#/html/user/login.html';
                    }
                });
            }
        },
        title: 'BOSS 系统',
        modal: modal
    });
});
