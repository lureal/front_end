var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var config = require('./libs/portal-config'); // 加载配置文件
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
        $('#navbar-change').find('li:eq(0)').css('display', 'none');

        $('#navbar-change').find('li:eq(2)').on('click', function() {
            if($('.inside-letter').hasClass('moveFlag')) {
                $('.inside-letter').animate({right:"-280px"});
                $('.inside-letter').removeClass('moveFlag');
            } else {
                $('.inside-letter').animate({right:"0px"});
                $('.inside-letter').addClass('moveFlag');
            }
        });

        // 如果菜单小于 4 个，则隐藏菜单，否则，则渲染菜单
        if (config.sidebars.length <= 4) {
            $('#navbar-hidden-toggle').hide();
        } else {
            var tpl = $('#hidden-navbar-tpl').html();
            $('#navbar-hidden').html(_.template(tpl)(config));
        }

        // 首次渲染侧边栏
        var sidebarTpl = $('#b-sidebar-tpl').html();
        $('#b-sidebar > ul').html(_.template(sidebarTpl)(config));

        // 获取侧边栏高度，为内容区域设置最小高度
        $('#b-content').css('min-height', $('#b-sidebar > ul').height());

        // 首次渲染内容区域
        var contentTpl = $('#b-content-tpl').html();
        $('#b-content').html(_.template(_.template(contentTpl)(config.sections[0])));

        // 点击侧边栏渲染对应的内容
        $('body').on('click', '.nav-item', function() {
            var id = Number($(this).attr('data-id'));
            var contentTpl = $('#b-content-tpl').html();
            var data;

            // 激活当前项
            $('.nav-item').parent().removeClass('active');
            $(this).parent().addClass('active');

            // 根据 id 查询到实际的数据
            _.each(config.sections, function(section, index) {
                if (section.id === id) {
                    data = section;
                }
            });

            // 渲染实际界面
            $('#b-content').html(_.template(_.template(contentTpl)(data)));
            _.each(config.sections, function(section, index) {
                if (section.id === id) {
                    if(section.id === 7) {
                        $('body').find('.description').html('测试环境需相关配置才可进入');
                    }

                    // 显示公告栏,默认首页显示公告栏，其他隐藏
                    if(section.id === 0) {
                        $('#notice').css('display', 'block');
                    } else {
                        $('#notice').css('display', 'none');
                    }
                }
            });
        });

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

        // 修改密码
        $('body').on('click', '#changePwd', function() {
            location.href = '/#proj_name#/html/user/change-pwd.html?username=' + encodeURIComponent(localStorage.getItem('email'));
        });

        // 公告滚动标题
        ajax.get({
            url: '/admin/notice/roll_notice.do',
            param: {
                page: 1
            },
            cb: function(_data) {

                // 渲染模板,如果没有置顶的公告，则隐藏公告
                if(_data.data.length > 0) {
                    $('.notice').removeClass('z-hidden');
                    var noticeTpl = $('#notice-tpl').html();
                    $('#notice').html(_.template(_.template(noticeTpl)(_data)));
                }

                // 公告滚动代码
                (function (win){
                    var callboarTimer;
                    var callboard = $('.notice');
                    var callboardUl = callboard.find('ul');
                    var callboardLi = callboard.find('li');
                    var liLen = callboard.find('li').length;
                    var initHeight = callboardLi.first().outerHeight(true);
                    win.autoAnimation = function (){
                    if (liLen <= 1) return;
                        var self = arguments.callee;
                        var callboardLiFirst = callboard.find('li').first();
                        callboardLiFirst.animate({
                            marginTop:-initHeight
                        }, 500, function (){
                            clearTimeout(callboarTimer);
                            callboardLiFirst.appendTo(callboardUl).css({marginTop:0});
                            callboarTimer = setTimeout(self, 5000);
                        });
                    }
                    callboard.mouseenter(
                    function (){
                        clearTimeout(callboarTimer);
                        }).mouseleave(function (){
                            callboarTimer = setTimeout(win.autoAnimation, 5000);
                    });
                    }(window));
                    setTimeout(window.autoAnimation, 5000);

                // setTimeout(window.autoAnimation, 1000);
            }
        });

        // 请求待办
        portalPager.render({
            url: '/admin/letter/backlog.do',
            tpl: $('#tabManage-tpl').html(),
            container: '#tabManage',
            handle(data) {
                return data;
            }
        });

        // 请求提醒数据
        portalPager.render({
            url: '/admin/letter/remind.do',
            tpl: $('#tabNotice-tpl').html(),
            container: '#tabNotice',
            handle(data) {
                return data;
            }
        });

        // 切换页面获取已读信息
        $('body').on('click', '.read-info', function() {
            portalPager.render({
                url: '/admin/letter/list_read.do',
                tpl: $('#tabNoticeRead-tpl').html(),
                container: '#tabNotice',
                handle(data) {
                    return data;
                }
            });
            // 隐藏分页标志
            $('.unReadFlag').addClass('z-hidden');
            $('.readFlag').removeClass('z-hidden');
        });

        // 删除提醒数据
        $('body').on('click', '.delete', function() {
            var id = $(this).attr('data-id');
            ajax.get({
                url: '/admin/letter/delRemind.do',
                param: {
                    id: id
                },
                cb: function(data) {
                    if(data.data === true) {
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

        // 标记已读
        $('body').on('click', '.read-btn', function() {
            var id = $(this).attr('data-id');
            letterFlag  = $(this).parents('.letter-content-item').find('.circle');
            ajax.get({
                url: '/admin/letter/read.do',
                param: {
                    id: id
                },
                cb: function(data) {
                    if(data.data === true) {
                        $(letterFlag.addClass('z-hidden'));
                        $('#tip').fadeIn('fast');
                        $('.tip-message').html('标记已读成功');

                        setTimeout("$('#tip').fadeOut('fast');", 1500);
                        // 隐藏绿色小圈圈
                    } else {
                        $('#tip').fadeIn('fast');
                        $('.tip-message').html('标记已读失败');
                        // setTimeout("location.reload();", 1500);
                    }
                }
            });
        });

        // 点击已读提醒，跳回提醒
        $('body').on('click', '.read-remind', function() {
            portalPager.render({
                url: '/admin/letter/remind.do',
                tpl: $('#tabNotice-tpl').html(),
                container: '#tabNotice',
                handle(data) {
                    return data;
                }
            });
            $('.unReadFlag').removeClass('z-hidden');
            $('.readFlag').addClass('z-hidden');
        });

        // 切换待办、提醒按钮
        $('body').on('click', '.backlog', function() {
            $('.tabManage').addClass('active in');
            $('.tabNotice').removeClass('active in');
            $('.backlog').css('background', '#29cc29');
            $('.backlog').css('color', '#fff');
            $('.remind').css('background', '#fafafa');
            $('.remind').css('color', '#96a1b2');
        });

        $('body').on('click', '.remind', function() {
            portalPager.render({
                url: '/admin/letter/remind.do',
                tpl: $('#tabNotice-tpl').html(),
                container: '#tabNotice',
                handle(data) {
                    return data;
                }
            });
            $('.unReadFlag').removeClass('z-hidden');
            $('.readFlag').addClass('z-hidden');
            $('.tabNotice').addClass('active in');
            $('.tabManage').removeClass('active in');
            $('.remind').css('background', '#29cc29');
            $('.remind').css('color', '#fff');
            $('.backlog').css('background', '#fafafa');
            $('.backlog').css('color', '#96a1b2');
        });

        // 站内信进入链接页面
        $('body').on('click', '.le-content', function() {
            var type = $(this).attr('data-type');
            if(type === 'book') {
                location.href = '/#proj_name#/library/my-borrow-record'
            }
        });
    }
});
