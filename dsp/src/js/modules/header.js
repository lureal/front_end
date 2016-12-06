/*!
 * 顶部横栏模块
 */

var ajax = require('./ajax');
var modal = require('./modal');
var urler = require('./urler');
var header = {};

/**
 * 初始化管理系统顶部横栏右侧菜单
 */
header.manage = function(ajaxParam) {

    ajax.get({
        url: '/checkLogin.do',
        cb: function(data) {

            data.system = 0;

            var tpl = $('#header-menu-tpl').html();
            $('#header-menu').html(_.template(tpl)(data));
        }
    });

    // 登出
    $('#main-header').on('click', '#signout', function() {
        var $self = $(this);
        $('i', $self).removeClass('fa-sign-out').addClass('fa-spin fa-refresh');

        ajax.get({
            url: '/logout.do',
            cb: function(data) {
                if(data.data === true) {
                    location.href = '/#proj_name#/html/user/login.html';
                } else {
                    modal.nobtn({
                        ctx: 'body',
                        title: '退出登录',
                        ctn: '退出登录失败'
                    });
                }
            },
            modal: modal,
            title: ajaxParam.title
        });
    });
};

/**
 * 初始化投放系统顶部横栏右侧菜单
 */
header.delivery = function(ajaxParam) {

    ajax.get({
        url: '/deal/getLoginCustom.do',
        param: {
            customId: urler.normal().cid
        },
        cb: function(data) {
            data.system = 1; // 0 -> 管理系统， 1 -> 投放系统

            var tpl = $('#header-menu-tpl').html();
            $('#header-menu').html(_.template(tpl)(data));

            // 渲染公司信息
            $('#company').html(_.template($('#company-tpl').html())(data));
            $('#company').css('display', 'block');
        },
        modal: modal,
        title: ajaxParam.title
    });

    // 实时消耗/余额
    $('#main-header').on('click', '.real-time-btn', function() {
        ajax.get({
            url: '/deal/overview/getRtConsume.do',
            param: {
                customId: urler.normal().cid
            },
            cb: function(data) {

                // 渲染实时数据
                var tpl = $('#real-time-detail-tpl').html();
                $('#real-time-detail').html(_.template(tpl)(data));
            },
            modal: modal,
            title: ajaxParam.title
        });
    });

    // 登出
    $('#main-header').on('click', '#signout', function() {
        var $self = $(this);
        $('i', $self).removeClass('fa-sign-out').addClass('fa-spin fa-refresh');

        ajax.get({
            url: '/logout.do',
            param: {
                customId: urler.normal().cid
            },
            cb: function(data) {
                if(data.data === true) {
                    location.href = '/#proj_name#/html/user/login.html';
                } else {
                    modal.nobtn({
                        ctx: 'body',
                        title: '退出登录',
                        ctn: '退出登录失败'
                    });
                }
            },
            modal: modal,
            title: ajaxParam.title
        });
    });

    // 禁止实时数据下的菜单项冒泡
    $('#main-header').on('click', '.notifications-menu #real-time-detail a', function(e) {
        e.stopPropagation();
    });

    // 弹出修改限额弹窗
    $('#main-header').on('click', '#real-time-detail-edit', function() {
        modal.custom({
            tpl: '#everyday-limit-tpl',
            data: {
                title: 'Wesdom DSP'
            }
        });
    });

    // 修改每日限额
    $('body').on('click', '#everyday-limit-edit', function() {

        var limit = $('#everyday-limit-edit-input').val();

        ajax.get({
            url: '/deal/overview/updateConsumeQuota.do',
            param: {
                customId: urler.normal().cid,
                quota: parseInt(parseFloat(limit * 100).toPrecision(12))
            },
            cb: function(data) {
                $('#modal-custome').modal('hide');

                if(data.data === true) {
                    modal.nobtn({
                        ctx: 'body',
                        ctn: '修改每日限额成功',
                        title: 'Wesdom DSP'
                    });
                } else {
                    modal.nobtn({
                        ctx: 'body',
                        ctn: '修改每日限额失败',
                        title: 'Wesdom DSP'
                    });
                }
            },
            modal: modal,
            title: 'Wesdom DSP'
        });
    });
};

/**
 * 初始化后台顶部横栏右侧菜单
 */

header.boss = function(ajaxParam) {
    var tpl = $('#header-menu-tpl').html();
    $('#header-menu').html(_.template(tpl)({
        system: 2
    }));

    // 登出
    $('#main-header').on('click', '#signout', function() {
        var $self = $(this);
        $('i', $self).removeClass('fa-sign-out').addClass('fa-spin fa-refresh');

        ajax.get({
            url: '/logout.do',
            cb: function(data) {
                if(data.data === true) {
                    location.href = '/#proj_name#/html/user/login.html';
                } else {
                    modal.nobtn({
                        ctx: 'body',
                        title: '退出登录',
                        ctn: '退出登录失败'
                    });
                }
            },
            modal: modal,
            title: ajaxParam.title
        });
    });
};

module.exports = header;
