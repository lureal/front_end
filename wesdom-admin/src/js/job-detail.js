/*!
 * 职位详情
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var upload = require('./modules/upload');
var urler = require('./modules/urler');


// 根据 url 中的 id 获取职位详情
ajax.get({
    url: '/admin/job/detail.do',
    param: {
        id: urler.normal().id
    },
    cb: function(data) {

        // 渲染添加作者图片模板
        var tpl = $('#snapshots-tpl').html();
        var tpl2 = $('#snapshots2-tpl').html();
        var tpl3 = $('#snapshots3-tpl').html();

        $('#snapshats').html(_.template(tpl)({
            action: '/admin/job/upload.do',
            name: 'iconFile',
            icon: data.data.job.icon[0]
        }));
        $('#snapshats2').html(_.template(tpl2)({
            action: '/admin/job/upload.do',
            name: 'iconFile',
            icon: data.data.job.icon[1]
        }));
        $('#snapshats3').html(_.template(tpl3)({
            action: '/admin/job/upload.do',
            name: 'iconFile',
            icon: data.data.job.icon[2]
        }));

        upload($('#snapshats'), modal, '职位详情');
        upload($('#snapshats2'), modal, '职位详情');
        upload($('#snapshats3'), modal, '职位详情');

        // 填充数据
        $('#name').val(data.data.job.name);

        // 将内容填充进编辑器
        var ue = UE.getEditor('myEditor');
        ue.addListener("ready", function () {
            ue.setContent(data.data.job.content);
        });

    },
    modal: modal,
    title: '职位详情'
});

// 更新职位
$('#submit').click(function() {

    var name = $('#name').val();
    var snapshot = $('#snapshats .snapshats-submit').attr('data-img');
    var snapshot2 = $('#snapshats2 .snapshats-submit').attr('data-img');
    var snapshot3 = $('#snapshats3 .snapshats-submit').attr('data-img');
    var content = UE.getEditor('myEditor').getContent();

    if(name === '' ||
       snapshot === '' ||
       snapshot2 === '' ||
       snapshot3 === ''||
       content === '') {
           modal.nobtn({
               ctx: 'body',
               title: '添加职位',
               ctn: '请确保已经输入职位名称，职位图标和招聘信息'
           });
           return;
       }

    ajax.post({
        url: '/admin/job/update.do',
        param: {
            id: urler.normal().id,
            name: name,
            icon: JSON.stringify([snapshot, snapshot2,snapshot3]),
            content: content
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '职位详情',
                    ctn: '更新职位成功',
                    event: function() {
                        location.href = '/#proj_name#/html/job/list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '职位详情',
                    ctn: data.message
                });
            }
        },
        modal: modal,
        title: '职位详情'
    });
});
