/*!
 *  办公家具明细
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var urler = require('./modules/urler.js');

// 初始化菜单和权限
auth.toolbar1({
    title: '办公家具明细'
});

// 初始化部门下拉框
select2.init({
    url: '/admin/book/book_place_option.do',
    title: '领用记录',
    cb: function(data) {
        var tpl = $('#area-tpl').html();
        $('#area').html(_.template(tpl)(data));
        $('#area').select2({
            placeholder: '选择区域'
        }).select2('val', '');
    }
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/furniture/list.do',
        param: {
            page: sessionStorage.getItem('furnitureTargetPage') !== null ? sessionStorage.getItem('furnitureTargetPage') : 1
        },
        title: '办公家具明细'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        // 渲染模板
        var tpl = $('#furniture-tpl').html();
        $('#furniture').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/furniture/list.do',
            param: param,
            title: '办公家具明细'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#furniture-tpl').html();
            $('#furniture').html(_.template(tpl)(data));

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var targetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('furnitureTargetPage', targetPage);
        }
    });
});

// 搜索按钮
$('#search').click(function() {

    // 获取区域
    var area = select2.getVal({
        id: '#area'
    });

    // 获取名称
    var name = $('#name').val();

    // 执行搜索
    ajax.get({
        url: '/admin/furniture/list.do',
        param: {
            area: area === 'clear' ? '' : area,
            name: name,
            page: 1
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                area: area === 'clear' ? '' : area,
                name: name,
                page: 1
            }));

            // 渲染模板
            var tpl = $('#furniture-tpl').html();
            $('#furniture').html(_.template(tpl)(data));

        },
        modal: modal,
        title: '办公家具明细'
    });
});

// 下载按钮
$('#download').click(function() {
    location.href = '/admin/furniture/download.do';
});

// 导出按钮
$('#export').click(function() {

    // 获取类型
    var area = select2.getVal({
        id: '#area'
    });

    // 获取名称
    var name = $('#name').val();

    location.href = '/admin/furniture/export_furniture.do?area=' + (area === null ? '' : area) + '&name='+ name;
});


// 删除
$('body').on('click', '#delete', function() {
    var id = $(this).attr('data-id');
    // var ajaxParam = JSON.parse(decodeURIComponent($(this).attr('data-ajaxParam')));

    modal.twobtn({
        ctx: 'body',
        ctn: '是否删除办公家具明细？',
        title: '办公家具明细',
        btnOneText: '取消',
        btnOneClass: 'btn-default',
        eventOne: function() {
            $('#modal-twobtn').modal('hide');
        },
        eventTwo: function() {
            $('#modal-twobtn').modal('hide');
            ajax.post({
                url: '/admin/furniture/delete.do',
                param: {
                    id: id
                },
                cb: function(data) {
                    if(data.data === true) {
                        modal.onebtn({
                            ctx: 'body',
                            title: '办公家具明细',
                            ctn: '删除办公家具明细成功',
                            event: function() {
                                location.reload();
                            }
                        });
                    } else {
                        modal.nobtn({
                            ctx: 'body',
                            title: '办公家具明细',
                            ctn: data.message !== null ? data.message: '删除失败'
                        });
                    }
                }
            });
        }
    });
});
