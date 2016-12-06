/*!
 * 添加作者
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var upload = require('./modules/upload');

// 渲染添加作者图片模板
var tpl = $('#snapshots-tpl').html();
$('#snapshats').html(_.template(tpl)({
    action: '/admin/author/upload.do',
    name: 'snapshotFile'
}));

upload($('body'), modal, '添加作者');

// 提交作者
$('#submit').click(function() {

    var name = $('#name').val();
    var description = $('#description').val();
    var image = $('.snapshats-submit').attr('data-img');

    if(name === '') {
        modal.nobtn({
            ctx: 'body',
            title: '添加作者',
            ctn: '请确保已经输入作者名称，作者描述，并已经上传作者头像'
        });
        return;
    }

    ajax.post({
        url: '/admin/author/add.do',
        param: {
            name: name,
            icon: image,
            description: description
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '添加作者',
                    ctn: '添加作者成功',
                    event: function() {
                        location.href = '/#proj_name#/html/author/list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '添加作者',
                    ctn: data.message
                });
            }
        },
        modal: modal,
        title: '添加作者'
    });
});
