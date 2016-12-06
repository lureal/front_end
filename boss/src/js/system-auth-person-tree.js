/*!
 * 分配用户权限
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var urler = require('./modules/urler.js');

// 初始化导航
auth.noToolbar({
    title: '分配用户权限'
});

// 获取服务器数据
ajax.get({
    url: '/admin/authority/list_user_rihgts.do',
    param: {
        id: urler.normal().id
    },
    cb: function(data) {

        // 初始化树结构
        // github: http://mbraak.github.io/jqTree/
        $('#tree').tree({
            data: data.data.rights,
            autoOpen: true,
            selectable: false,
            onCreateLi: function(node, $li) {
                $li.find('.jqtree-title')
                    .before('<input type="checkbox" ' + (node.haveRight === true ? 'checked' : '') +' value="' + node.id +'" data-menuId="' + node.id +'" data-type="' + node.type + '">')
                    .css({
                        position: 'relative',
                        paddingLeft: '20px',
                        left: '-20px'
                    });
            }
        }).bind('tree.click', function(e) {

            // 如果当前点击了非具体权限项则，则全选底部所有单选框
            if(e.node.type !== 2) {

                // 获取父元素
                var $parent = $(e.node.element);

                // 获取父元素选框
                var checkbox = $('input[data-menuId=' + e.node.id +']');
                var isCheck = checkbox.prop('checked');

                // 如果勾选父元素选框，则全部勾选子元素选框
                if(isCheck) {
                    $('input[type="checkbox"]', $parent).each(function() {
                        $(this).prop('checked', false);
                    });

                // 如果取消勾选父元素选框，则全部取消勾选子元素选框
                } else {
                    $('input[type="checkbox"]', $parent).each(function() {
                        $(this).prop('checked', true);
                    });
                }

            // 如果选择了具体的权限则只选择具体的全选的选框
            } else {
                var checkbox = $('input[data-menuId=' + e.node.id +']');
                var isCheck = checkbox.prop('checked');

                // 勾选了选框
                if(isCheck) {
                    checkbox.prop('checked', false);

                // 没勾选选框
                } else {
                    checkbox.prop('checked', true);
                }
            }
    });
    }
});

// 提交权限
$('#submit').click(function() {

    // 获取权限
    var auth = [];
    $('#tree input[type="checkbox"]:checked').each(function() {
        var id = $(this).attr('data-menuId');

        if($(this).attr('data-type') === '2') {
            auth.push(id);
        }
    });

    // 发送数据给服务器
    ajax.get({
        url: '/admin/authority/assign_user_right.do',
        param: {
            id: urler.normal().id,
            json: JSON.stringify(auth)
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '分配权限',
                    ctn: '分配权限成功',
                    event: function() {
                        location.href = '/#proj_name#/html/system/auth-list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '分配权限',
                    ctn: data.message
                });
            }
        }
    });
});
