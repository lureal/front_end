/*!
 * 添加菜单权限
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var urler = require('./modules/urler.js');

// 填充数据
$('.box-title').html(decodeURIComponent(urler.normal().menuName) + '的菜单权限');

// 初始化导航
auth.noToolbar({
    title: '添加菜单权限'
});

// 获取渲染菜单页面权限
ajax.get({
    url: '/admin/menu/list_action.do',
    param: {
        id: urler.normal().id
    },
    cb: function(data) {
        var tpl = $('#list-tpl').html();
        $('#action').html(_.template(tpl)(data));
    }
});

// 添加菜单权限
$('#add-action').click(function() {
    location.href = '/#proj_name#/html/system/menu-action-add.html?id=' + urler.normal().id + '&parentId=' + urler.normal().parentId +
    '&menuName=' + urler.normal().menuName
});

// 查看详情
$('body').on('click', '.detail-action', function() {
    var id = $(this).attr('data-id');
    var menuId = urler.normal().id;
    var parentId = urler.normal().parentId;
    var name = decodeURIComponent($(this).attr('data-name'));
    var code = decodeURIComponent($(this).attr('data-code'));
    var url = $(this).attr('data-url');
    location.href = '/#proj_name#/html/system/menu-action-detail.html?id=' + id +
        '&menuId=' + menuId + '&name=' + name + '&code=' + code + '&parentId=' + parentId +
        '&url=' + url + '&menuName=' + urler.normal().menuName;
});

// 删除权限按钮
$('body').on('click', '.delete-action', function() {
    var id = $(this).attr('data-id');
    ajax.get({
        url: '/admin/menu/delete_action.do',
        param: {
            id: id
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '添加菜单',
                    ctn: '删除菜单权限成功',
                    event: function() {
                        location.reload();
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '菜单管理',
                    ctn: data.message
                });
            }
        }
    });
});
