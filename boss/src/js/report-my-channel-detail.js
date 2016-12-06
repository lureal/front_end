/*!
 * 我的渠道商明细
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var urler = require('./modules/urler.js');

auth.toolbar1({
    title: '我的客户明细'
})

// 初始化搜索条中的日期控件
datePicker.init('#datepaker');

// 拓展进度
select2.init({
    url: '/admin/channel/expand_progress_option.do',
    title: '拓展进度',
    cb: function(data) {
        var tpl = $('#expand-process-tpl').html();
        $('#expand-process').html(_.template(tpl)(data));
        $('#expand-process').select2({
            placeholder: '拓展进度'
        }).select2('val', '');
    }
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/report/myChannelDetail.do',
        param: {
            page: 1
        },
        title: '我的渠道商管理'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        // 渲染模板
        var tpl = $('#my-channel-detail-tpl').html();
        $('#my-channel-detail').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/report/myChannelDetail.do',
            param: param,
            title: '我的渠道商明细'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#my-channel-detail-tpl').html();
            $('#my-channel-detail').html(_.template(tpl)(data));
        }
    });
});

// 搜索按钮
$('#search').click(function() {

    // 获取日期
    var date = datePicker.getVal('#datepaker');

    // 渠道商名称、ID
    var keyword  = $('#channel-name').val();

    // 拓展进度
    var expandProgressId = select2.getVal({
        id: '#expand-process'
    });

    // 执行搜索
    ajax.get({
        url: '/admin/report/myChannelDetail.do',
        param: {
            startdate: date.start,
            enddate: date.end,
            keyword: keyword,
            expandProgressId: expandProgressId,
            page: 1
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                startdate: date.start,
                enddate: date.end,
                keyword: keyword,
                expandProgressId: expandProgressId,
                page: 1
            }));

            // 渲染模板
            var tpl = $('#my-channel-detail-tpl').html();
            $('#my-channel-detail').html(_.template(tpl)(data));

        },
        modal: modal,
        title: '我的渠道商明细'
    });

});

// 导出按钮
$('#export').click(function() {
    var name = $('#channel-name').val();
    var date = datePicker.getVal('#datepaker');
    var expandProgressId = select2.getVal({
        id: '#expand-process'
    });
    location.href = '/admin/report/export_my_channel_detail.do?expandProgressId=' + (expandProgressId === null ? '' : expandProgressId)+'&startdate=' +
     date.start +
    '&enddate=' + date.end +
    '&name=' + name;
});

// 客户转出
$('body').on('click', '.customer-out', function() {
    var id = $(this).parents('tr').find('.customer-out').attr('data-id');
    console.log(id);
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
            title: '将客户转出'
        }
    });
    $('body').on('click', '#submit',function() {
        var channelManagerId   = select2.getVal({
            id: '#s-person'
        });
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
