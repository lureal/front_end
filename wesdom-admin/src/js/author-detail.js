/*!
 * 作者详情
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var storage = require('./modules/storage.js');
var upload = require('./modules/upload');
var author = JSON.parse(storage.getSession('author'));

console.log(author);

console.log(author.icon)

// 渲染添加作者图片模板
var tpl = $('#snapshots-tpl').html();
$('#snapshats').html(_.template(tpl)({
    action: '/admin/author/upload.do',
    name: 'snapshotFile',
    icon: author.icon
}));

// 填充数据
$('#name').val(author.name);
$('#description').val(author.description);
$('.snapshats-submit').attr('data-img', author.icon);

upload($('body'), modal, '作者详情');

// 更新作者
$('#submit').click(function() {

    var name = $('#name').val();
    var description = $('#description').val();
    var image = $('.snapshats-submit').attr('data-img');

    if(name === '' ) {
        modal.nobtn({
            ctx: 'body',
            title: '更新作者',
            ctn: '请确保已经输入作者名称，作者描述，并已经上传作者头像'
        });
        return;
    }

    ajax.post({
        url: '/admin/author/update.do',
        param: {
            id: author.id,
            name: name,
            icon: image,
            description: description
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '更新作者',
                    ctn: '更新作者成功',
                    event: function() {
                        location.href = '/#proj_name#/html/author/list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '更新作者',
                    ctn: data.message
                });
            }
        },
        modal: modal,
        title: '更新作者'
    });
});
