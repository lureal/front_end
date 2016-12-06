/*!
 * 人员管理
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var tableListObj = $('#system-address-list');
var bookObj = $('#list-book');

// 初始化导航
auth.toolbar1({
    title: '人员管理'
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/user/list.do',
        param: {
            page: sessionStorage.getItem('userListTargetPage') !== null ? sessionStorage.getItem('userListTargetPage') : 1
        },
        title: '人员管理'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#user').html(_.template(tpl)(data));
    }
});

//加载数列表
ajax.get({
    url: '/admin/user/list_depart.do',
    cb: function(data) {

        // 渲染模板
        var tpl = $('#list-book-tpl').html();
        $('#list-book').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/user/list.do',
            param: param,
            title: '人员管理'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#user').html(_.template(tpl)(data));

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var targetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('userListTargetPage', targetPage);
        }
    });
});

// 导出按钮
$('#export').click(function() {
    location.href = '/admin/user/export.do';
});

// 同步数据
$('#sync').click(function() {
    var $self = $(this);
    $('i', $self).css('display', 'inline-block');
    ajax.get({
        url: '/admin/user/sync.do',
        cb: function(data) {
            $('i', $self).css('display', 'none');

            // 同步成功
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '人员管理',
                    ctn: '同步成功',
                    event: function() {
                        location.reload();
                    }
                });

            // 导出失败
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '人员管理',
                    ctn: '同步失败'
                });
            }
        },
        modal: modal,
        title: '人员管理'
    });
});

// 搜索按钮
$('#search').click(function() {

    // 获取产品名称
    var name = $('#name').val();

    // 执行搜索
    ajax.get({
        url: '/admin/user/list.do',
        param: {
            name: name,
            page: 1
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                name: name,
                page: 1
            }));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#user').html(_.template(tpl)(data));

        },
        modal: modal,
        title: '人员管理'
    });
});

//点击一级菜单，右侧导航栏显示整组详细信息
bookObj.on('click', '.first-menu-open .first-treeview > a', function() {
    var departId = $(this).attr('data-departId');

    //移除其他同级节点的颜色
    $(this).parents('.menuFlag').find('.first-treeview').removeClass('hoverColor');

    //点击添加背景颜色
    //移除三级菜单，二级菜单的背景颜色
    $(this).parents('.menuFlag').find('a').removeClass('fontColor');
    $(this).parents('.first-treeview').addClass('hoverColor');
    var $secondMenu = $(this).parents('.first-menu-open').find('.second-menu-open');
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/user/list.do',
            param: {
                departId: departId,
                page: 1
            },
            title: '人员管理'
        },
        $btn: null,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                page: 1,
                departId: departId
            }));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#user').html(_.template(tpl)(data));
        }
    });
});

//点击一级菜单，更换图标
bookObj.on('click', '.first-menu-open .first-treeview > a > i', function(e) {
    e.stopPropagation();
    var $secondMenu = $(this).parents('.first-menu-open').find('.second-menu-open');
    var $state = $(this).eq(0);
    if($secondMenu.hasClass('z-hidden')) {
        $secondMenu.removeClass('z-hidden');
    } else {
        $secondMenu.addClass('z-hidden');
    }

    // 更换收缩图标标志
    if($state.hasClass('fa-plus')) {
        $state.removeClass('fa-plus').addClass('fa-minus');
    } else if ($state.hasClass('fa-user')) {
        return;
    } else {
        $state.removeClass('fa-minus').addClass('fa-plus');
    }
});

//点击二级菜单，右侧导航栏组内详细信息
bookObj.on('click', '.second-menu-open .second-treeview > a ', function() {
    var departId = $(this).attr('data-departId');
    $(this).parents('.menuFlag').find('a').removeClass('fontColor');
    $(this).addClass('fontColor');
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/user/list.do',
            param: {
                departId: departId,
                page: 1
            },
            title: '人员管理'
        },
        $btn: null,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                page: 1,
                departId: departId
            }));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#user').html(_.template(tpl)(data));
        }
    });
});

//点击二级菜单，更换图标
bookObj.on('click', '.second-menu-open .second-treeview > a > i', function(e) {
    e.stopPropagation();
    var $state = $(this).eq(0);
    var $thirdMenu = $(this).parents('.second-menu-open').find('.third-menu-open');
    if($thirdMenu.hasClass('z-hidden')) {
        $thirdMenu.removeClass('z-hidden');
    } else {
        $thirdMenu.addClass('z-hidden');
    }
    //更换收缩图标标志
    if($state.hasClass('fa-plus')) {
        $state.removeClass('fa-plus').addClass('fa-minus');
    } else if ($state.hasClass('fa-user')) {
        return;
    } else {
        $state.removeClass('fa-minus').addClass('fa-plus');
    }
});

//点击三级菜单，右侧导航栏组内个人详细信息
bookObj.on('click', '.third-menu-open .third-treeview > a', function() {
    var departId = $(this).attr('data-departId');
    $(this).parents('.menuFlag').find('a').removeClass('fontColor');
    $(this).addClass('fontColor');
    $(this)
    ajax.get({
        url: '/admin/user/list.do',
        param: {
            departId: departId,
            page: 1
        },
        cb: function(data) {

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#user').html(_.template(tpl)(data));
        }
    });
});

//收缩全部信息
bookObj.on('click', '#company', function() {
    var $firstMenu = $(this).parents('#list-book').find('.first-menu-open');
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/user/list.do',
            param: {
                page: 1
            },
            title: '人员管理'
        },
        $btn: null,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                page: 1
            }));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#user').html(_.template(tpl)(data));
        }
    });
});

// 批量分配角色
$('body').on('click', '#allocation', function() {
    var userArray = [];
    var roleId = [];
    $('#user tbody').find('input[type=checkbox]').each(function() {
        if(this.checked) {
            var id = $(this).attr("data-id");
            console.log(Number(id));
            userArray.push(id);
        }
        return userArray;

    });

    if(userArray == '') {
        modal.nobtn({
            ctx: 'body',
            ctn: '请选择用户',
            title: '角色下用户'
        });
        return;
    } else {
        modal.custom({
            tpl: '#modal-tpl',
            data: {
                title: '角色下用户'
            }
        });
    }
    select2.init({
        url: '/admin/role/role_option.do',
        title: '角色',
        cb: function(data) {
            var tpl = $('#user-choose-tpl').html();
            $('#user-choose').html(_.template(tpl)(data));
            $('#user-choose').select2({
                placeholder: '角色'
            }).select2('val', '');
        }
    });

    // 验证提交
    $('body').on('click', '#modal-submit', function() {
        $("#modal-submit").attr("disabled", true);

        // 获取用户角色id
        var userChooseId = select2.getVal({
            id: '#user-choose'
        });
        roleId.push(userChooseId);
        ajax.get({
            url: '/admin/role/add_list_user.do',
            param: {
                id: JSON.stringify(roleId),
                user: JSON.stringify(userArray)
            },
            cb: function(data) {
                $("#modal-submit").attr("disabled", false);
                $('#modal-custome').modal('hide');
                if(data.data === true) {
                    modal.onebtn({
                        ctx: 'body',
                        ctn: '批量启用成功',
                        title: '角色管理',
                        event: function() {
                            location.reload();
                        }
                    });
                } else {
                    modal.nobtn({
                        ctx: 'body',
                        ctn: '批量启用失败',
                        title: '角色管理'
                    });
                    return;
                }
            }
        })
    });

});


// 删除产品
$('body').on('click', '.delete', function() {
    var id = $(this).attr('data-id');

    modal.twobtn({
        ctx: 'body',
        ctn: '是否删除人员？',
        title: '人员管理',
        btnOneText: '取消',
        btnOneClass: 'btn-default',
        eventOne: function() {
            $('#modal-twobtn').modal('hide');
        },
        eventTwo: function() {
            $('#modal-twobtn').modal('hide');
            ajax.post({
                url: '/admin/user/delete.do',
                param: {
                    id: id
                },
                cb: function(data) {
                    if(data.data === true) {
                        modal.onebtn({
                            ctx: 'body',
                            title: '人员管理',
                            ctn: '删除人员成功',
                            event: function() {
                                location.reload();
                            }
                        });
                    } else {
                        modal.nobtn({
                            ctx: 'body',
                            title: '人员管理',
                            ctn: data.message
                        });
                    }
                }
            });
        }
    });
});
