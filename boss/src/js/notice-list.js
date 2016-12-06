/*!
 * 公告管理员可见页面
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var config = require('./libs/portal-config'); // 加载配置文件
var select2 = require('./modules/select2');
var datePicker = require('./modules/date-picker');
var pager = require('./modules/pager');
var modal = require('./modules/modal');
var portalPager = require('./modules/portal-pager');

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

        // 渲染记录详情列表
        portalPager.render({
            url: '/admin/notice/noticeManage.do',
            tpl: $('#b-content-tpl').html(),
            container: '#b-content',
            handle(data) {
                return data;
            }
        });

        $('body').on('click', '.search', function() {
            var mkeyword = $('#keyword').val();
            portalPager.render({
                url: '/admin/notice/noticeManage.do',
                otherParam: {
                    keyword: mkeyword
                },
                param: param,
                tpl: $('#b-content-tpl').html(),
                container: '#b-content',
                handle(data) {
                    return data;
                }
            });
        });

        // 删除
        $('body').on('click', '.delete', function() {
            var id = $(this).attr('data-id');
            $('#myModal').modal('show');
            $('body').on('click', '.submit', function() {
                ajax.get({
                    url: '/admin/notice/delete.do',
                    param: {
                        id: id
                    },
                    cb:function(data) {
                        $('#modal-onebtn').find('.modal-content').css('height', '160px');
                        $('#modal-onebtn').find('.modal-content').css('width', '280px');
                        if(data.data === true) {
                            $('#myModal').modal('hide');
                            $('#tip').fadeIn('fast');
                            $('.tip-message').html('删除成功');
                            setTimeout("location.reload();", 1500);
                        } else {
                            $('#tip').fadeIn('fast');
                            $('.tip-message').html('删除失败');
                            setTimeout("location.reload();", 1500);
                        }
                    }
                });
            });

            // 取消
            $('body').on('click', '.cancel', function() {
                $('#myModal').modal('hide');
            });

        });

        // 设为置顶
        $('body').on('click', '.top', function() {
            var id = $(this).attr('data-id');
            ajax.get({
                url: '/admin/notice/top.do',
                param: {
                    id: id
                },
                cb:function(data) {
                    $('#modal-onebtn').find('.modal-content').css('height', '160px');
                    $('#modal-onebtn').find('.modal-content').css('width', '280px');
                    if(data.data === true) {
                        $('#tip').fadeIn('fast');
                        $('.tip-message').html('置顶成功');
                        setTimeout("location.reload();", 1500);
                    } else {
                        $('#tip').fadeIn('fast');
                        $('.tip-message').html('置顶失败');
                        setTimeout("location.reload();", 1500);
                    }
                }
            });
        });

        // 取消置顶
        $('body').on('click', '.cancel-top', function() {
            var id = $(this).attr('data-id');
            ajax.get({
                url: '/admin/notice/untop.do',
                param: {
                    id: id
                },
                cb:function(data) {
                    $('#modal-onebtn').find('.modal-content').css('height', '160px');
                    $('#modal-onebtn').find('.modal-content').css('width', '280px');
                    if(data.data === true) {
                        $('#tip').fadeIn('fast');
                        $('.tip-message').html('取消置顶成功');
                        setTimeout("location.reload();", 1500);
                    } else {
                        $('#tip').fadeIn('fast');
                        $('.tip-message').html('取消置顶失败');
                        setTimeout("location.reload();", 1500);
                    }
                }
            });
        });

        $(function() {
            $("#keyword:text").focus(function() {
                $(this).css('border-color', '#29cc29');
            }).blur(function() {
            $(this).css('border-color', '#eeeeee');
            })
        });
    }
});





