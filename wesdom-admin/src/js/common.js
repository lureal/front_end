
var ajax = require('./modules/ajax');
var modal = require('./modules/modal');

// 返回上一页
$('#canel').click(function() {
    history.back();
});

// 退出登录
$('#logout').click(function() {
    var ajax = require('./modules/ajax');
    var modal = require('./modules/modal');

    ajax.get({
        url: '/admin/logout.do',
        cb: function(data) {
            if(data.data === true) {
                location.href = '/wesdom-admin/user/login';
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
