/*!
 * 通讯录
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var tableListObj = $('#system-address-list');
var bookObj = $('#system-address-book');

// 初始化导航
auth.noToolbar({
    title: '通讯录'
});

//发送请求，初始化数据
ajax.get({
    url: '/admin/organization/list_depart.do',
    cb: function(data) {

        // 渲染模板
        var tpl = $('#system-address-book-tpl').html();
        $('#system-address-book').html(_.template(tpl)(data));
    }
});

//加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/organization/list_user.do',
        param: {
             page: sessionStorage.getItem('mailListTargetPage') !== null ? sessionStorage.getItem('mailListTargetPage') : 1
        },
        title: '通讯录'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        // 渲染模板
        var tpl = $('#system-address-list-tpl').html();
        $('#system-address-list').html(_.template(tpl)(data));

    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/organization/list_user.do',
            param: param ,
            title: '通讯录'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#system-address-list-tpl').html();
            $('#system-address-list').html(_.template(tpl)(data));

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var targetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('mailListTargetPage', targetPage);
        }
    });
});

//查询通讯录详细信息
tableListObj.on('click', '#search-btn', function(data) {
    var name = $('#name').val();
    ajax.get({
        url: '/admin/organization/list_user.do',
        param: {
            name: name,
            page: 1
        },
        cb: function(data) {

            // 渲染模板
            var tpl = $('#system-address-list-tpl').html();
            $('#system-address-list').html(_.template(tpl)(data));
        }
    });
});

//收缩全部信息
bookObj.on('click', '#company', function() {
    var $firstMenu = $(this).parents('#system-address-book').find('.first-menu-open');
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/organization/list_user.do',
            param: {
                page: 1
            },
            title: '通讯录'
        },
        $btn: null,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                page: 1
            }));

            // 渲染模板
            var tpl = $('#system-address-list-tpl').html();
            $('#system-address-list').html(_.template(tpl)(data));
        }
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
            url: '/admin/organization/list_user.do',
            param: {
                departId: departId,
                page: 1
            },
            title: '通讯录'
        },
        $btn: null,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                page: 1,
                departId: departId
            }));

            // 渲染模板
            var tpl = $('#system-address-list-tpl').html();
            $('#system-address-list').html(_.template(tpl)(data));
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
            url: '/admin/organization/list_user.do',
            param: {
                departId: departId,
                page: 1
            },
            title: '通讯录'
        },
        $btn: null,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                page: 1,
                departId: departId
            }));

            // 渲染模板
            var tpl = $('#system-address-list-tpl').html();
            $('#system-address-list').html(_.template(tpl)(data));
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
        url: '/admin/organization/list_user.do',
        param: {
            departId: departId,
            page: 1
        },
        cb: function(data) {

            // 渲染模板
            var tpl = $('#system-address-list-tpl').html();
            $('#system-address-list').html(_.template(tpl)(data));
        }
    });
});



