/*!
 * 添加图片
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var upload = require('./modules/upload');

// 渲染添加案例图标模板
var tpl = $('#snapshots-tpl').html();
$('#snapshats').html(_.template(tpl)({
    action: '/admin/introduce/upload.do',
    name: 'snapshotFile'
}));

upload($('body'), modal, '添加图标');


$('#submit').click(function() {

    var title = $('#title').val();
    var description = $('#description').val();  
    var snapshotCur = $('.snapshats-submit').attr('data-img');
    var snapshot = [];
    snapshot.push(snapshotCur);
    console.log(snapshot);
    if(title === '' ||
       description === '' ||
       snapshot === '' 
        ) {
           modal.nobtn({
               ctx: 'body',
               title: '添加案例',
               ctn: '请确保已经输入图片标题，图片描述，并已经上传案例图片'
           });
           return;
       }

    ajax.post({
        url: '/admin/introduce/add_pic.do',
        param: {
            title: title,
            snapshot: JSON.stringify(snapshot),
            description: description,
           
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '添加图片',
                    ctn: '添加图片成功',
                    event: function() {
                        location.href = '/#proj_name#/html/introduce/list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '添加图片',
                    ctn: data.message
                });
            }
        },
        modal: modal,
        title: '添加图片'
    });
});
