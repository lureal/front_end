/*!
 * 洞察文章详情
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var upload = require('./modules/upload');
var urler = require('./modules/urler');


// 根据 url 中的 id 获取文章详情
ajax.get({
    url: '/admin/insight/detail.do',
    param: {
        id: urler.normal().id
    },
    cb: function(data) {

        // 渲染添加作者图片模板
        var tpl = $('#snapshots-tpl').html();
        $('#snapshats').html(_.template(tpl)({
            action: '/admin/insight/upload.do',
            name: 'snapshotFile',
            icon: data.data.article.snapshot
        }));

        upload($('body'), modal, '洞察文章详情');

        // 填充数据
        $('#name').val(data.data.article.title);
        $('#description').val(data.data.article.description);
        $('#sign').val(data.data.article.signId);

        // 获取文章类型
        ajax.get({
            url: '/admin/insight/list_type.do',
            cb: function(_data) {
                var tpl = $('#type-tpl').html();
                $('#type').html(_.template(tpl)(_data));
                $('#type').select2().select2('val', data.data.article.type);
            },
            modal: modal,
            title: '洞察文章详情'
        });

        // 获取作者
        ajax.get({
            url: '/admin/author/list_all.do',
            cb: function(_data) {
                var tpl = $('#author-tpl').html();
                $('#author').html(_.template(tpl)(_data));
                $('#author').select2().select2('val', data.data.article.authorId);
            },
            modal: modal,
            title: '洞察文章详情'
        });

        // 将内容填充进编辑器
        var ue = UE.getEditor('myEditor');
        ue.addListener("ready", function () {
            ue.setContent(data.data.article.content);
        });

        // 填充 html title, description, keyword
        $('#html-title').val(data.data.article.htmlTitle);
        $('#html-description').val(data.data.article.htmlDescription);
        $('#html-keyword').val(data.data.article.htmlKeyword);

    },
    modal: modal,
    title: '洞察文章详情'
});

// 更新文章
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
       content === ''||
       signId === '' ||
       htmlTitle === '' ||
       htmlDescription === '' ||
       htmlKeyword === '') {
           modal.nobtn({
               ctx: 'body',
               title: '洞察文章详情',
               ctn: '请确保已经输入文章标题，文章描述，选择作者，选择类型，html 头部 title、description、keyword，并且上传文章略缩图'
           });
           return;
       }

    if(description.length > 100) {
        modal.nobtn({
            ctx: 'body',
            title: '洞察文章详情',
            ctn: '文章描述不能超过 100 个字'
        });
        return;
    }

    ajax.post({
        url: '/admin/insight/update.do',
        param: {
            id: urler.normal().id,
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
                    title: '洞察文章详情',
                    ctn: '更新文章成功',
                    event: function() {
                        location.href = '/#proj_name#/html/insight/list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '洞察文章详情',
                    ctn: data.message
                });
            }
        },
        modal: modal,
        title: '洞察文章详情'
    });
});
