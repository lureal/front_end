/*!
 * 合作伙伴详情
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var storage = require('./modules/storage.js');
var upload = require('./modules/upload');
var partner = JSON.parse(storage.getSession('partner'));

console.log(partner);

console.log(partner.icon)

// 渲染添加更新合作图片模板
var tpl = $('#snapshots-tpl').html();
$('#snapshats').html(_.template(tpl)({
    action: '/admin/partner/upload.do',
    name: 'snapshotFile',
    icon: partner.icon
}));

// 填充数据
$('#name').val(partner.name);
$('#link').val(partner.link);
$('.snapshats-submit').attr('data-img', partner.icon);

upload($('body'), modal, '合作伙伴详情');

// 更新合作伙伴
$('#submit').click(function() {

    var name = $('#name').val();
    var link = $('#link').val();
    var image = $('.snapshats-submit').attr('data-img');

    if(name === '' || link === '') {
        modal.nobtn({
            ctx: 'body',
            title: '更新合作伙伴',
            ctn: '请确保已经输入更新合作名称，更新合作链接。'
        });
        return;
    }

    ajax.post({
        url: '/admin/partner/update.do',
        param: {
            id: partner.id,
            name: name,
            icon: image,
            link: link
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '更新合作伙伴',
                    ctn: '更新合作伙伴成功',
                    event: function() {
                        location.href = '/#proj_name#/html/partner/list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '更新合作伙伴',
                    ctn: data.message
                });
            }
        },
        modal: modal,
        title: '更新合作伙伴'
    });
});
