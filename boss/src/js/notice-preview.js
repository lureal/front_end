/*!
 * 公告用户可见页面
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var config = require('./libs/portal-config'); // 加载配置文件
var select2 = require('./modules/select2');
var datePicker = require('./modules/date-picker');
var pager = require('./modules/pager');
var modal = require('./modules/modal');
var urler = require('./modules/urler');

// 使用接口判定当前是否登陆，如果没登陆则直接跳转到登陆页面，如果登陆了，则展示实际的内容
$.get('/admin/organization/list_depart.do', function(data) {
    data = JSON.parse(data);
    if (data.code === -100) {
        location.href = '/login';
    } else {
        $('#loading').hide();
        $('#main-content').show();

        // 渲染用户名
        $('#username').html(localStorage.getItem('email'));

        // 首次渲染顶部栏
        var navbarTpl = $('#b-navbar-tpl').html();
        $('#navbar-change').html(_.template(navbarTpl)(config));

        // 如果菜单小于 4 个，则隐藏菜单，否则，则渲染菜单
        if (config.sidebars.length <= 4) {
            $('#navbar-hidden-toggle').hide();
        } else {
            var tpl = $('#hidden-navbar-tpl').html();
            $('#navbar-hidden').html(_.template(tpl)(config));
        }

        // 登出
        $('body').on('click', '#logout', function() {
            ajax.get({
                url: '/auth/logout.do',
                cb: function(data) {
                    if(data.data === false) {
                        modal.nobtn({
                            ctx: 'body',
                            title: 'BOSS',
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
                modal: modal
            });
        });
        var id = urler.normal().id;

        $('.title').html(sessionStorage.getItem('title'));
        $('.notice-preview-content').html(sessionStorage.getItem('content'));
        $('.date').html( sessionStorage.getItem('date'));

        // 如果flag=0，则跳转回添加页面，如果flag=1，则跳转回详情页面
        if(urler.normal().flag === '0') {
            $('#back').on('click', function() {
                location.href = '/#proj_name#/portal/notice-add?flag=0'
            });
        } else if(urler.normal().flag === '1') {
            $('#back').on('click', function() {
                location.href = '/#proj_name#/portal/notice-detail?flag=1&id='+id;
            });
        } else {
            $('#back').on('click', function() {
                history.back(-1);
            });
        }

    }
});





