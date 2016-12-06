var home = function(ajax, modal, time, storage) {


    // 通过活动列表来判定首页是否登录
    ajax.get({
        url: '/admin/activity/list.do',
        param: { page: 1 },
        cb: function(data) {}
    });
};

module.exports = home;
