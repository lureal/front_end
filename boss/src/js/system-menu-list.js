/*!
 * 罗列全部菜单
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');

// 初始化导航
auth.noToolbar({
    title: '菜单管理'
});

// 获取服务器数据
ajax.get({
    url: '/admin/menu/list.do',
    cb: function(data) {

        // 初始化树结构
        // github: http://mbraak.github.io/jqTree/
        $('#tree').tree({
            data: data.data.menus,
            autoOpen: true,
            selectable: false
        }).bind('tree.click', function(e) {
            var parentId = e.node.parentId;
            var id = e.node.id;
            var name = e.node.name;

            var tpl = $('#modal-menu-tpl').html();
            $('#modal-menu__body').html(_.template(tpl)({
                id: id,
                parentId: parentId,
                menuName: name
            }));

            $('#modal-menu').modal();
        });
    }
});

// 删除菜单
$('body').on('click', '#del-menu', function() {
    var id = $(this).attr('data-id');
    $('#modal-menu').modal('hide');
    
    modal.twobtn({
        ctx: 'body',
        ctn: '是否删除菜单？',
        title: '菜单管理',
        btnOneText: '取消',
        btnOneClass: 'btn-default',
        eventOne: function() {
            $('#modal-twobtn').modal('hide');
        },
        eventTwo: function() {
            $('#modal-twobtn').modal('hide');

            ajax.get({
                url: '/admin/menu/delete.do',
                param: {
                    id: id
                },
                cb: function(data) {
                    $('#modal-menu').modal('hide');

                    if(data.data === true) {
                        modal.onebtn({
                            ctx: 'body',
                            title: '菜单管理',
                            ctn: '删除菜单成功',
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
        }
    });
});
