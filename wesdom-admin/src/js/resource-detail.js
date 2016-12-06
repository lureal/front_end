/*!
 * 更新资源
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var upload = require('./modules/upload');
var urler = require('./modules/urler');

ajax.get({
    url: '/admin/resource/detail.do',
    param: {
        id: urler.normal().id
    },
    cb: function(data) {
        $('#title').val(data.data.resource.name);
        $('#description').val(data.data.resource.description);
        $('#weixin-title').val(data.data.resource.wxTitle);
        $('#weixin-description').val(data.data.resource.wxDescription);

        // 获取资源类型
        ajax.get({
            url: '/admin/resource/list_type.do',
            cb: function(_data) {
                var tpl = $('#type-tpl').html();
                $('#type').html(_.template(tpl)(_data));
                $('#type').select2().select2('val', data.data.resource.type);
            },
            modal: modal,
            title: '资源详情'
        });


        // 渲染添加作者图片模板
        var tpl = $('#snapshots-tpl').html();
        $('#snapshats').html(_.template(tpl)({
            action: '/admin/resource/upload.do',
            name: 'iconFile',
            icon: data.data.resource.icon,
            title: '资源图标'
        }));

        upload($('#snapshats'), modal, '资源详情');

        // 渲染内容
        // 内容块一
        $('#content1-title').val(data.data.resource.content[0].title);
        $('#content1-ctn').val(data.data.resource.content[0].text);

        // 内容块二
        $('#content2-title').val(data.data.resource.content[1].title);
        _.each(data.data.resource.content[1].paragraphs, function(val, index) {
            if(index === 0) {
                $('.content2-list').eq(0).val(val.text);
            } else {
                var tpl = $('#content-list-tpl').html();
                var target = $('#content2 .add-list').attr('data-target');
                $('.content2 .section').append(_.template(tpl)({target: target, value: val.text}));
            }
        });

        // 内容块三
        $('#content3-title').val(data.data.resource.content[2].title);
        _.each(data.data.resource.content[2].paragraphs, function(val, index) {
            if(index === 0) {
                $('#content3 .paragraph').eq(0).find('.paragraph-title').val(val.title);
                $('#content3 .paragraph').eq(0).find('.paragraph-ctn').val(val.text);
                $('#content3 .paragraph').eq(0).find('.snapshats').html(_.template(tpl)({
                    action: '/admin/resource/upload.do',
                    name: 'iconFile',
                    icon: val.snapshot,
                    title: '资源图片'
                }));

                upload($('#content3 .paragraph').eq(0).find('.snapshats'), modal, '资源详情');
            } else {
                var counter = Number($('.add-paragraph').attr('data-counter')) + 1;;
                var target = $('.add-paragraph').attr('data-target');
                $('.' + target + ' .section').append(
                    _.template($('#paragraph-tpl').html())({
                        counter: counter,
                        title: val.title,
                        content: val.text
                    })
                );

                $('.paragraph' + counter +'-snapshats').html(_.template($('#snapshots-tpl').html())({
                    action: '/admin/resource/upload.do',
                    name: 'iconFile',
                    icon: val.snapshot,
                    title: '资源图片'
                }));
                upload($('.paragraph' + counter +'-snapshats'), modal, '资源详情');

                $('.add-paragraph').attr('data-counter', counter);
            }
        });


        // 内容块四
        $('#content4-title').val(data.data.resource.content[3].title);
        _.each(data.data.resource.content[3].paragraphs, function(val, index) {
            if(index === 0) {
                $('.content4-list').eq(0).val(val.text);
            } else {
                var tpl = $('#content-list-tpl').html();
                var target = $('#content4 .add-list').attr('data-target');
                $('.content4 .section').append(_.template(tpl)({target: target, value: val.text}));
            }
        });
    },
    modal: modal,
    title: '资源详情'
});

// // 渲染更新资源图标模板
// var tpl = $('#snapshots-tpl').html();
// $('#snapshats').html(_.template(tpl)({
//     action: '/admin/resource/upload.do',
//     name: 'iconFile'
// }));
// $('.paragraph1-snapshats').html(_.template(tpl)({
//     action: '/admin/resource/upload.do',
//     name: 'iconFile'
// }));
//
// upload($('#snapshats'), modal, '更新资源');
// upload($('.paragraph1-snapshats'), modal, '更新资源');


// 更新资源
$('#submit').click(function() {

    var title = $('#title').val();
    var description = $('#description').val();
    var type = $('#type').select2('val');
    var snapshot = $('.snapshats-submit').attr('data-img');
    var content = getContent();
    var wxTitle = $('#weixin-title').val();
    var wxDescription = $('#weixin-description').val();

    if(title === '' ||
       description === '' ||
       type === '' ||
       snapshot === '' ||
       wxTitle === '' ||
       wxDescription === '',
       !checkContent(content)) {
           modal.nobtn({
               ctx: 'body',
               title: '更新资源',
               ctn: '请确保已经输入资源标题，资源描述，选择类型，资源标识，资源内容(但凡添加的列表项（最多 23 个字），段落都必须填写上传所有字段图片)，并已经上传资源图标'
           });
           return;
       }

    ajax.post({
        url: '/admin/resource/update.do',
        param: {
            id: urler.normal().id,
            name: title,
            icon: snapshot,
            type: type,
            description: description,
            wxTitle: wxTitle,
            wxDescription: wxDescription,
            content: JSON.stringify(content)
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '更新资源',
                    ctn: '更新资源成功',
                    event: function() {
                        location.href = '/#proj_name#/html/resource/list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '更新资源',
                    ctn: data.message
                });
            }
        },
        modal: modal,
        title: '更新资源'
    });
});

// 添加列表项
$('body').on('click', '.add-list', function() {
    var target = $(this).attr('data-target');
    var tpl = $('#content-list-tpl').html();

    $('.' + target + ' .section').append(_.template(tpl)({target: target, value: ''}));
});

// 删除列表项
$('body').on('click', '.del-list', function() {
    $(this).parents('.list').remove();
});

// 添加段落
$('body').on('click', '.add-paragraph', function() {
    var target = $(this).attr('data-target');
    var counter = Number($(this).attr('data-counter')) + 1;
    var tpl = $('#paragraph-tpl').html();

    $('.' + target + ' .section').append(_.template(tpl)({
        counter: counter,
        title: '',
        content: ''
    }));

    $('.paragraph' + counter +'-snapshats').html(_.template($('#snapshots-tpl').html())({
        action: '/admin/resource/upload.do',
        name: 'iconFile',
        icon: '',
        title: '资源图片'
    }));
    upload($('.paragraph' + counter +'-snapshats'), modal, '更新资源');

    $(this).attr('data-counter', counter)
});

// 删除段落
$('body').on('click', '.del-paragraph', function() {
    $(this).parents('.paragraph').remove();
});

/**
 * 获取接口所需要的内容
 */
function getContent() {
    var content = [];

    // 获取第一个块
    content.push({
        title: $('#content1-title').val(),
        text: $('#content1-ctn').val()
    });

    // 获取第二个块
    var cacheCtn2List = [];
    $('#content2 .section > div').each(function() {
        var _list = $('.content2-list', $(this)).val();
        cacheCtn2List.push({
            text: _list
        });
    });

    content.push({
        title: $('#content2-title').val(),
        paragraphs: cacheCtn2List
    });

    // 获取第三个块
    var cacheCtn3List = [];
    $('#content3 .section > div').each(function() {
        var _title = $('.paragraph-title', $(this)).val();
        var _ctn = $('.paragraph-ctn', $(this)).val()
        var _snapshot = $('.snapshats-submit', $(this)).attr('data-img');

        cacheCtn3List.push({
            title: _title,
            text: _ctn,
            snapshot: _snapshot
        });
    });

    content.push({
        title: $('#content3-title').val(),
        paragraphs: cacheCtn3List
    });

    // 获取第四个块
    var cacheCtn4List = [];
    $('#content4 .section > div').each(function() {
        var _list = $('.content4-list', $(this)).val();
        cacheCtn4List.push({
            text: _list
        });
    });

    content.push({
        title: $('#content4-title').val(),
        paragraphs: cacheCtn4List
    });

    return content;
}

/**
 * 检查内容，检查规则有，第一个块是否输入标题内容，
 * 第二个，第四个块是否输入标题，并且用户手动添加的块必须全部输入
 * 第三个块是否输入标题，并且用户手动添加的块必须全部输入
 * param {Array} content [等待被检查的内容]
 */
function checkContent(content) {
    var isPass = true;

    _.each(content, function(val, index) {

        // 第一个块，检测标题内容
        if(index === 0) {
            if(val.title === '' || val.text === '') {
                isPass = false;
            }
        }

        // 第二/四个块，检测标题，至少一个列表项
        if(index === 1 || index === 3) {
            if(val.title === '') {
                isPass = false;
            }

            if(val.length < 1) {
                isPass = false;
            }

            _.each(val.paragraphs, function(_val, _index) {
                if(_val.text === '' || _val.text.length > 23) {
                    isPass = false;
                }
            });
        }

        // 第三个块
        if(index === 2) {
            if(val.title === '') {
                isPass = false;
            }

            if(val.length < 1) {
                isPass = false;
            }

            _.each(val.paragraphs, function(_val, _index) {
                if(_val.title === '') {
                    isPass = false;
                }
                if(_val.snapshot === '') {
                    isPass = false;
                }
                if(_val.text === '') {
                    isPass = false;
                }
            });
        }

    });

    return isPass;
}
