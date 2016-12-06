/*!
 * 客户详情
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var upload = require('./modules/upload');
var urler = require('./modules/urler');


// 根据 url 中的 id 获取客户详情
ajax.get({
    url: '/admin/customer/detail.do',
    param: {
        id: urler.normal().id
    },
    cb: function(data) {

        // 渲染添加图片模板
        var tpl = $('#snapshots-tpl').html();
        $('#snapshats').html(_.template(tpl)({
            action: '/admin/customer/upload.do',
            name: 'iconFile',
            icon: data.data.customer.icon
        }));

        upload($('body'), modal, '客户详情');

        // 填充数据
        $('#name').val(data.data.customer.name);
        $('#link').val(data.data.customer.link);
        $('#description').val(data.data.customer.description);

        // 获取客户类型
        ajax.get({
            url: '/admin/customer/list_type.do',
            cb: function(_data) {
                var tpl = $('#type-tpl').html();
                $('#type').html(_.template(tpl)(_data));
                $('#type').select2().select2('val', data.data.customer.type);
            },
            modal: modal,
            title: '客户详情'
        });

    },
    modal: modal,
    title: '客户详情'
});

// 更新客户
$('#submit').click(function() {

    var name = $('#name').val();
    var link = $('#link').val();
    var description = $('#description').val();
    var type = $('#type').select2('val');
    var snapshot = $('.snapshats-submit').attr('data-img');

    if(name === '' ||
       link === '' ||
       description === '' ||
       type === '' ||
       snapshot === '') {
           modal.nobtn({
               ctx: 'body',
               title: '添加客户',
               ctn: '请确保已经输入客户名称，客户链接，客户描述，选择客户类型，并已经上传客户图标'
           });
           return;
       }

    ajax.post({
        url: '/admin/customer/update.do',
        param: {
            id: urler.normal().id,
            name: name,
            link: link,
            icon: snapshot,
            type: type,
            description: description
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '客户详情',
                    ctn: '更新客户成功',
                    event: function() {
                        location.href = '/#proj_name#/html/customer/list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '客户详情',
                    ctn: data.message
                });
            }
        },
        modal: modal,
        title: '客户详情'
    });
});
