/*!
 * 添加客户
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var upload = require('./modules/upload');

// 渲染添加客户图标模板
var tpl = $('#snapshots-tpl').html();
$('#snapshats').html(_.template(tpl)({
    action: '/admin/customer/upload.do',
    name: 'iconFile'
}));

upload($('body'), modal, '添加客户');

// 获取客户类型
ajax.get({
    url: '/admin/customer/list_type.do',
    cb: function(data) {
        var tpl = $('#type-tpl').html();
        $('#type').html(_.template(tpl)(data));
        $('#type').select2();
    },
    modal: modal,
    title: '添加客户'
});

// 添加客户
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
        url: '/admin/customer/add.do',
        param: {
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
                    title: '添加客户',
                    ctn: '添加客户成功',
                    event: function() {
                        location.href = '/#proj_name#/html/customer/list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '添加客户',
                    ctn: data.message
                });
            }
        },
        modal: modal,
        title: '添加客户'
    });
});
