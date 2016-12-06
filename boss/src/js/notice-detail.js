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

        ajax.get({
            url: '/admin/notice/detail.do',
            param: {
                id: urler.normal().id
            },
            cb: function(data) {
                $('#notice-title').val(data.data.notices.title);
                // $('#myEditor').val(data.data.notices.content);

                 // 渲染
                UE.getEditor('myEditor');

                if(urler.normal().flag === '1') {

                    // 将内容填充进编辑器
                    var ue = UE.getEditor('myEditor');
                    ue.addListener("ready", function () {
                        ue.setContent(sessionStorage.getItem('content'));
                    });
                    $('#notice-title').val(sessionStorage.getItem('title'));
                } else {

                    // 将内容填充进编辑器
                    var ue = UE.getEditor('myEditor');
                    ue.addListener("ready", function () {
                        ue.setContent(data.data.notices.content);
                    });
                }
            }
        });

        // 保存草稿
        $('body').on('click', '.save', function() {
            var title = $('#notice-title').val();
            var content = UE.getEditor('myEditor').getContent();

            // 校验标题
            if(title === '') {
                $('#addtip').fadeIn('fast');
                $('.tip-message1').html('请输入标题');
                setTimeout("$('#addtip').fadeOut('fast');", 1500);
                return ;
            }

            // 校验内容
            if(content === '') {
                $('#addtip').fadeIn('fast');
                $('.tip-message1').html('请输入内容');
                setTimeout("$('#addtip').fadeOut('fast');", 1500);
                return;
            }
            ajax.get({
                url: '/admin/notice/saveDraft.do',
                param: {
                    id: urler.normal().id,
                    title: title,
                    content: content
                },
                cb: function(data) {
                    if(data.data === true) {
                        $('#tip').fadeIn('fast');
                        $('.tip-message').html('保存成功');
                        setTimeout("$('#tip').fadeOut('fast');", 1500);
                    } else {
                        $('#tip').fadeIn('fast');
                        $('.tip-message').html('保存失败');
                        setTimeout("$('#tip').fadeOut('fast');", 1500);
                    }
                }
            });
        });

        // 预览
        $('body').on('click', '.preview', function() {
            var title = $('#notice-title').val();
            var content = UE.getEditor('myEditor').getContent();
            sessionStorage.setItem('title', title);
            sessionStorage.setItem('content', content);
            sessionStorage.setItem('date', getDate());

            // 如果是详情页面flag=1，携带id的值，以判断是否是详情页面
            location.href = '/#proj_name#/portal/notice-preview?flag=1&id='+(urler.normal().id);
        });

        // 发布
        $('body').on('click', '.release', function() {
            var title = $('#notice-title').val();
            var content = UE.getEditor('myEditor').getContent();

            // 校验标题
            if(title === '') {
                $('#addtip').fadeIn('fast');
                $('.tip-message1').html('请输入标题');
                setTimeout("$('#addtip').fadeOut('fast');", 1500);
                return ;
            }

            // 校验内容
            if(content === '') {
                $('#addtip').fadeIn('fast');
                $('.tip-message1').html('请输入内容');
                setTimeout("$('#addtip').fadeOut('fast');", 1500);
                return;
            }
            ajax.get({
                url: '/admin/notice/update.do',
                param: {
                    id: urler.normal().id,
                    title: title,
                    content: content
                },
                cb: function(data) {
                    if(data.data === true) {
                        $('#tip').fadeIn('fast');
                        $('.tip-message').html('发布成功');
                        setTimeout("location.href ='/#proj_name#/portal/notice-list';", 1500);
                    } else {
                        $('#tip').fadeIn('fast');
                        $('.tip-message').html('发布失败');
                    }
                }
            });
        });

        // 获取当前时间
        function getDate() {
            var mydate = new Date();
            var str = "" + mydate.getFullYear() + "-";
            str += (mydate.getMonth()+1) + "-";
            str += mydate.getDate() ;
            return str;
        }

        // 点击输入框，输入框变绿色
        $(function() {
            $("#notice-title:text").focus(function() {
                $(this).css('border-color', '#29cc29');
            }).blur(function() {
                $(this).css('border-color', '#eeeeee');
            })
        });

        // 返回上一页
        $('#back').on('click', function() {
            history.back(-1);
        });

    }
});





