/**
 * 现有资产
 */
var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var time = require('./modules/time.js');
var urler = require('./modules/urler.js');

// 初始化导航
auth.toolbar1({
    title: '现有资产'
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/asset/list_asset.do',
        param: {
            page: sessionStorage.getItem('targetPage') !== null ? sessionStorage.getItem('targetPage') : 1
        },
        title: '现有资产'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#asset').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/asset/list_asset.do',
            param: param,
            title: '现有资产'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#asset').html(_.template(tpl)(data));

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var targetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('targetPage', targetPage);
        }
    });
});

// 搜索按钮
$('#search').click(function() {
    var name = $.trim($('#name').val());

    ajax.get({
        url: '/admin/asset/list_asset.do',
        param: {
            name: name,
            page: 1
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                page: 1,
                name: name
            }));

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#asset').html(_.template(tpl)(data));
        },
        modal: modal,
        title: '销售和顾问变动日志'
    });
});

// 导出
$('#export').click(function() {
    var name = $.trim($('#name').val());
    location.href = '/admin/asset/export_asset.do?name=' + (name === null ? '' : name);
});

// 删除
$('body').on('click', '.delete', function() {
    var id = $(this).attr('data-id');
    modal.twobtn({
        ctx: 'body',
        ctn: '是否删除资产？',
        title: '现有资产',
        btnOneText: '取消',
        btnOneClass: 'btn-default',
        eventOne: function() {
            $('#modal-twobtn').modal('hide');
        },
        eventTwo: function() {
            $('#modal-twobtn').modal('hide');
            ajax.post({
                url: '/admin/asset/delete.do',
                param: {
                    id: id
                },
                cb: function(data) {
                    if(data.data === true) {
                        modal.onebtn({
                            ctx: 'body',
                            title: '现有资产',
                            ctn: '删除成功',
                            event: function() {
                                location.reload();
                            }
                        });
                    } else {
                        modal.nobtn({
                            ctx: 'body',
                            title: '现有资产',
                            ctn: data.message
                        });
                    }
                }
            });
        }
    });
});

$('body').on('click', '.adjust', function() {
    var id = $(this).parents('tr').find('.adjust').attr('data-id');
    var name = $(this).attr('data-name');
    select2.init({
        url: '/admin/report/transfer_out_cust.do',
        title: '客户转出',
        cb: function(data) {
            var tpl = $('#expand-process-tpl').html();
            $('#s-person').html(_.template(tpl)(data));
            $('#s-person').select2({
                placeholder: '客户转出'
            }).select2('val', '');
        }
    });
    modal.custom({
        tpl: '#modal-tpl',
        data: {
            title: name
        }
    });
    $('body').on('click', '#submit',function() {
        // var channelManagerId   = select2.getVal({
        //     id: '#s-person'
        // });

        ajax.get({
            url:'/admin/report/transfer_out_channel.do',
            param: {
                id: id,
                channelManagerId : channelManagerId
            },
            cb:function(data) {
                 $('#modal-custome').modal('hide');
                if(data.data === true) {
                    modal.onebtn({
                        ctx: 'body',
                        ctn: '修改成功',
                        title: '将客户转出',
                        event: function() {
                            location.reload();
                        }
                    });
                } else {
                    modal.nobtn({
                        ctx: 'body',
                        ctn: data.message ? data.message : '修改失败',
                        title: '将客户转出'
                    });
                }
            }
        });
    });
});

$('body').on('click', '#cancel', function() {
    $('#modal-custome').modal('hide');
});