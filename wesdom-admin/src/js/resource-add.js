/*!
 * 添加资源
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var upload = require('./modules/upload');

// 渲染添加资源图标模板
var tpl = $('#snapshots-tpl').html();
$('#snapshats').html(_.template(tpl)({
    action: '/admin/resource/upload.do',
    name: 'iconFile',
    title: '资源图标'
}));
$('.paragraph1-snapshats').html(_.template(tpl)({
    action: '/admin/resource/upload.do',
    name: 'iconFile',
    title: '资源图片'
}));

upload($('#snapshats'), modal, '添加资源');
upload($('.paragraph1-snapshats'), modal, '添加资源');

// 获取资源类型
ajax.get({
    url: '/admin/resource/list_type.do',
    cb: function(data) {
        var tpl = $('#type-tpl').html();
        $('#type').html(_.template(tpl)(data));
        $('#type').select2();
    },
    modal: modal,
    title: '添加资源'
});

// 添加资源
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
       wxDescription === '' ,
       !checkContent(content)) {
           modal.nobtn({
               ctx: 'body',
               title: '添加资源',
               ctn: '请确保已经输入资源标题，资源描述，选择类型，资源标识，资源内容(但凡添加的列表项（最多 23 个字），段落都必须填写上传所有字段图片)，并已经上传资源图标'
           });
           return;
       }

    ajax.post({
        url: '/admin/resource/add.do',
        param: {
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
                    title: '添加资源',
                    ctn: '添加资源成功',
                    event: function() {
                        location.href = '/#proj_name#/html/resource/list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '添加资源',
                    ctn: data.message
                });
            }
        },
        modal: modal,
        title: '添加资源'
    });
});

// 添加列表项
$('body').on('click', '.add-list', function() {
    var target = $(this).attr('data-target');
    var tpl = $('#content-list-tpl').html();

    $('.' + target + ' .section').append(_.template(tpl)({target: target}));
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

    $('.' + target + ' .section').append(_.template(tpl)({counter: counter}));

    $('.paragraph' + counter +'-snapshats').html(_.template($('#snapshots-tpl').html())({
        action: '/admin/resource/upload.do',
        name: 'iconFile',
        title: '资源图片'
    }));
    upload($('.paragraph' + counter +'-snapshats'), modal, '添加资源');

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
