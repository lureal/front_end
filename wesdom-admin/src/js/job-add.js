/*!
 * 添加职位
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var upload = require('./modules/upload');

// 渲染添加作者图片模板
var tpl = $('#snapshots-tpl').html(),
    tpl2 = $('#snapshots2-tpl').html();
    tpl3 = $('#snapshots3-tpl').html();

$('#snapshats').html(_.template(tpl)({
    action: '/admin/job/upload.do',
    name: 'iconFile'
}));
$('#snapshats2').html(_.template(tpl2)({
    action: '/admin/job/upload.do',
    name: 'iconFile'
}));
$('#snapshats3').html(_.template(tpl3)({
    action: '/admin/job/upload.do',
    name: 'iconFile'
}));

upload($('#snapshats'), modal, '添加职位');
upload($('#snapshats2'), modal, '添加职位');
upload($('#snapshats3'), modal, '添加职位');

// 渲染
UE.getEditor('myEditor');

// 添加职位
$('#submit').click(function() {

    var name = $('#name').val();
    var snapshot = $('#snapshats .snapshats-submit').attr('data-img');
    var snapshot2 = $('#snapshats2 .snapshats-submit').attr('data-img');
    var snapshot3 = $('#snapshats3 .snapshats-submit').attr('data-img');
    var content = UE.getEditor('myEditor').getContent();

    if(name === '' ||
       snapshot === '' ||
          snapshot2 === '' ||
          snapshot3 === '' ||
       content === '') {
           modal.nobtn({
               ctx: 'body',
               title: '添加职位',
               ctn: '请确保已经输入职位名称，职位图标，职位图标浮动状态和招聘信息'
           });
           return;
       }

    ajax.post({
        url: '/admin/job/add.do',
        param: {
            name: name,
            icon: JSON.stringify([snapshot, snapshot2, snapshot3]),
            content: content
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '添加职位',
                    ctn: '添加职位成功',
                    event: function() {
                        location.href = '/#proj_name#/html/job/list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '添加职位',
                    ctn: data.message
                });
            }
        },
        modal: modal,
        title: '添加职位'
    });
});
