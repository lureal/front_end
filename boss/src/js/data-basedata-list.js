/*!
 * 基础数据管理
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');

// 初始化菜单和权限
auth.toolbar1({
    title: '基础数据管理'
});

console.log(sessionStorage.getItem('basetargetPage'));
// 初始化类型选择
select2.init({
    url: '/admin/base/data_type_option.do',
    title: '基础数据管理',
    cb: function(data) {
        var tpl = $('#basedata-type-tpl').html();
        $('#basedata-type').html(_.template(tpl)(data));
        $('#basedata-type').select2({
            placeholder: '选择类型'
        });

        var databaseType = select2.getVal({
            id: '#basedata-type'
        });

        // 加载列表
        lister({
            ajax: ajax,
            ajaxParam: {
                url: '/admin/base/list.do',
                param: {
                    type: databaseType === 'clear' ? '' : databaseType,
                    page: sessionStorage.getItem('basetargetPage') !== null ? sessionStorage.getItem('basetargetPage') : 1
                },
                title: '基础数据管理'
            },
            $btn: null,
            callback: function(data) {

                // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
                data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                    type: databaseType,
                    page: 1
                }));

                // 渲染模板
                var tpl = $('#list-tpl').html();
                $('#basedata').html(_.template(tpl)(data));
            }
        });

        // 分页
        pager(function(param, $this) {
            lister({
                ajax: ajax,
                ajaxParam: {
                    url: '/admin/base/list.do',
                    param: param,
                    title: '基础数据管理'
                },
                $btn: $this,
                callback: function(data) {

                    // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
                    data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

                    // 渲染模板
                    var tpl = $('#list-tpl').html();
                    $('#basedata').html(_.template(tpl)(data));

                    // 需求：翻页刷新，不回到第一页
                    // 用户翻页时，将这个页码存到sessionStorage里
                    var targetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
                    sessionStorage.setItem('basetargetPage', targetPage);
                }
            });
        });
    }
});

// 搜索按钮
$('#search').click(function() {

    // 获取类型
    var databaseType = select2.getVal({
        id: '#basedata-type'
    });

    // 执行搜索
    ajax.get({
        url: '/admin/base/list.do',
        param: {
            type: databaseType === 'clear' ? '' : databaseType,
            page: 1
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                type: databaseType === 'clear' ? '' : databaseType,
                page: 1
            }));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#basedata').html(_.template(tpl)(data));

        },
        modal: modal,
        title: '基础数据管理'
    });

});

// 导出按钮
$('#export').click(function() {

    // 获取类型
    var databaseType = select2.getVal({
        id: '#basedata-type'
    });

    location.href = '/admin/base/export.do?type=' + (databaseType === null ? '' : databaseType);
});

// 下载按钮
$('#download').click(function() {
    location.href = '/admin/base/download.do';
});

// 删除
$('body').on('click', '.delete', function() {
    var id = $(this).attr('data-id');
    var ajaxParam = JSON.parse(decodeURIComponent($(this).attr('data-ajaxParam')));

    modal.twobtn({
        ctx: 'body',
        ctn: '是否删除基础数据？',
        title: '基础数据管理',
        btnOneText: '取消',
        btnOneClass: 'btn-default',
        eventOne: function() {
            $('#modal-twobtn').modal('hide');
        },
        eventTwo: function() {
            $('#modal-twobtn').modal('hide');
            ajax.post({
                url: '/admin/base/delete.do',
                param: {
                    id: id
                },
                cb: function(data) {
                    if(data.data === true) {
                        modal.onebtn({
                            ctx: 'body',
                            title: '基础数据管理',
                            ctn: '删除基础数据成功',
                            event: function() {

                                // 加载列表
                                lister({
                                    ajax: ajax,
                                    ajaxParam: {
                                        url: '/admin/base/list.do',
                                        param: ajaxParam,
                                        title: '基础数据管理'
                                    },
                                    $btn: null,
                                    callback: function(data) {

                                        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
                                        data.data.ajaxParam = encodeURIComponent(JSON.stringify(ajaxParam));

                                        // 渲染模板
                                        var tpl = $('#list-tpl').html();
                                        $('#basedata').html(_.template(tpl)(data));
                                    }
                                });
                                $('#modal-onebtn').modal('hide');
                            }
                        });
                    } else {
                        modal.nobtn({
                            ctx: 'body',
                            title: '基础数据管理',
                            ctn: data.message
                        });
                    }
                }
            });
        }
    });
});
