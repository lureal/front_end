/*!
 * 添加合作伙伴
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var upload = require('./modules/upload');

// 渲染添加合作伙伴图片模板
var tpl = $('#snapshots-tpl').html();
$('#snapshats').html(_.template(tpl)({
    action: '/admin/partner/upload.do',
    name: 'snapshotFile'
}));

upload($('body'), modal, '添加合作伙伴');

// 提交合作伙伴
$('#submit').click(function() {

    var name = $('#name').val();
    var link = $('#link').val();
    var image = $('.snapshats-submit').attr('data-img');

    if(name === '' || link === '') {
        modal.nobtn({
            ctx: 'body',
            title: '添加合作伙伴',
            ctn: '请确保已经输入合作伙伴名称，合作伙伴链接。'
        });
        return;
    }

    ajax.post({
        url: '/admin/partner/add.do',
        param: {
            name: name,
            icon: image,
            link: link
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '添加合作伙伴',
                    ctn: '添加合作伙伴成功',
                    event: function() {
                        location.href = '/#proj_name#/html/partner/list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '添加合作伙伴',
                    ctn: data.message
                });
            }
        },
        modal: modal,
        title: '添加合作伙伴'
    });
});
