/*!
 * 添加洞察文章
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var upload = require('./modules/upload');

// 渲染添加作者图片模板
var tpl = $('#snapshots-tpl').html();
$('#snapshats').html(_.template(tpl)({
    action: '/admin/insight/upload.do',
    name: 'snapshotFile'
}));

upload($('body'), modal, '添加洞察文章');

// 获取文章类型
ajax.get({
    url: '/admin/insight/list_type.do',
    cb: function(data) {
        var tpl = $('#type-tpl').html();
        $('#type').html(_.template(tpl)(data));
        $('#type').select2();
    },
    modal: modal,
    title: '添加洞察文章'
});

// 获取作者
ajax.get({
    url: '/admin/author/list_all.do',
    cb: function(data) {
        var tpl = $('#author-tpl').html();
        $('#author').html(_.template(tpl)(data));
        $('#author').select2();
    },
    modal: modal,
    title: '添加洞察文章'
});

// 渲染
UE.getEditor('myEditor');

// 添加文章
$('#submit').click(function() {

    var title = $('#name').val();
    var authorId = $('#author').select2('val');
    var type = $('#type').select2('val');
    var description = $('#description').val();
    var snapshot = $('.snapshats-submit').attr('data-img');
    var content = UE.getEditor('myEditor').getContent();
    var signId = $('#sign').val();
    var htmlTitle = $('#html-title').val();
    var htmlDescription = $('#html-description').val();
    var htmlKeyword = $('#html-keyword').val();

    if(title === '' ||
       authorId === '' ||
       type === '' ||
       description === '' ||
       snapshot === '' ||
       content === '' ||
       signId === '' ||
       htmlTitle === '' ||
       htmlDescription === '' ||
       htmlKeyword === '') {
           modal.nobtn({
               ctx: 'body',
               title: '添加洞察文章',
               ctn: '请确保已经输入文章标题，文章描述，选择作者，选择类型，html 头部 title、description、keyword，并且上传文章略缩图'
           });
           return;
       }

    if(description.length > 100) {
        modal.nobtn({
            ctx: 'body',
            title: '添加洞察文章',
            ctn: '文章描述不能超过 100 个字'
        });
        return;
    }

    ajax.post({
        url: '/admin/insight/add.do',
        param: {
            title: title,
            content: content,
            snapshot: snapshot,
            authorId: authorId,
            type: type,
            description: description,
            signId: signId,
            htmlTitle: htmlTitle,
            htmlDescription: htmlDescription,
            htmlKeyword: htmlKeyword
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '添加洞察文章',
                    ctn: '添加文章成功',
                    event: function() {
                        location.href = '/#proj_name#/html/insight/list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '添加洞察文章',
                    ctn: data.message
                });
            }
        },
        modal: modal,
        title: '添加洞察文章'
    });
});
