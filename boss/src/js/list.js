/*!
 * 罗列全部菜单
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

        // 初始化类型
        select2.init({
            url: '/admin/opinion/opinion_option.do',
            title: '选择类型',
            cb: function(_data) {
                var feedTpl = $('#type-tpl').html();
                $('#feedback-type').html(_.template(feedTpl)(_data));
            }
        });

        portalPager.render({
            url: '/admin/opinion/opinionManage.do',
            tpl: $('#b-content-tpl').html(),
            container: '#b-content',
            handle(data) {
                for(var i = 0 ; i< data.data.opinions.length; i++) {
                    var val = data.data.opinions[i];
                    val.question_str = (data.data.opinions[i].question).replace(/\n/g, '<br />');
                    if(val.answer.length > 1) {
                        for(var j = 0; j< val.answer.length; j++) {
                            val.answer[j].content_str = (val.answer[j].content).replace(/\n/g, '<br />');
                        }
                    }
                }
                return data;
            }
        });

        datePicker.init('#date');

        // 修改密码
        $('body').on('click', '#changePwd', function() {
            location.href = '/#proj_name#/html/user/change-pwd.html?username=' + encodeURIComponent(localStorage.getItem('email'));
        });

        // 查询
        $('body').on('click', '.search', function() {
            var typeStatusId = $('#feedback-type option:selected').val();
            var date = datePicker.getVal('#date');
            portalPager.render({
                url: '/admin/opinion/opinionManage.do',
                otherParam: {
                    statusId: typeStatusId,
                    startdate: date.startdate,
                    enddate: date.enddate
                },
                param: param,
                tpl: $('#b-content-tpl').html(),
                container: '#b-content',
                handle(data) {
                    for(var i = 0 ; i< data.data.opinions.length; i++) {
                    var val = data.data.opinions[i];
                    val.question_str = (data.data.opinions[i].question).replace(/\n/g, '<br />');
                    if(val.answer.length > 1) {
                        for(var j = 0; j< val.answer.length; j++) {
                            val.answer[j].content_str = (val.answer[j].content).replace(/\n/g, '<br />');
                        }
                    }
                }
                    return data;
                }
            });
        });

        $('body').on('click', '.table-operate', function() {
            var id = $(this).parents('tr').find('.table-operate').attr('data-id');
            $('.submit-input').val('');
            $('#myModal').attr('data-id', id);
            $('#myModal').modal('show');
            $('.submit').on('click', function() {
                var content = $('.submit-input').val();
                var dataId = $('#myModal').attr('data-id');
                ajax.get({
                    url: '/admin/opinion/adminReply.do',
                    param: {
                        content: content,
                        id: dataId
                    },
                    cb: function(data) {
                        $('#myModal').modal('hide');
                        if(data.data === true) {
                            $('#tip').fadeIn('fast');
                            $('.tip-message').html('保存反馈成功');
                            setTimeout("location.reload();", 1500);
                        } else {
                            $('#tip').fadeIn('fast');
                            $('.tip-message').html('保存反馈失败');
                            // setTimeout($('#tip').fadeOut('fast'), 150000);
                            setTimeout("location.reload();", 1500);
                        }
                    }
                })
            });
        });

        $(function() {

            // 日期
            $("#date:text").focus(function() {
                $(this).css('border-color', '#29cc29');
            }).blur(function() {
            $(this).css('border-color', '#eeeeee');
            });
        });

        $(function() {
            
            // 下拉选框，hover时边框变色
            $("#feedback-type:text").focus(function() {
                $(this).css('border-color', '#29cc29');
            }).blur(function() {
            $(this).css('border-color', '#eeeeee');
            })
        });

        // 回复里的弹框
        $(function() {
            $(".submit-input").focus(function() {
                $(this).css('border-color', '#29cc29');
            }).blur(function() {
            $(this).css('border-color', '#eeeeee');
            })
        });
    }
});





