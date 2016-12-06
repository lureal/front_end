/*!
 * 案例详情
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var upload = require('./modules/upload');
var urler = require('./modules/urler');


// 根据 url 中的 id 获取案例详情
ajax.get({
    url: '/admin/case/detail.do',
    param: {
        id: urler.normal().id
    },
    cb: function(data) {

        // 渲染添加作者图片模板
        var tpl = $('#snapshots-tpl').html();
        $('#snapshats').html(_.template(tpl)({
            action: '/admin/case/upload.do',
            name: 'iconFile',
            icon: data.data.case.icon
        }));

        upload($('body'), modal, '案例详情');

        // 填充数据
        $('#title').val(data.data.case.title);
        $('#description').val(data.data.case.description);
        $('#sign').val(data.data.case.signId);
        $('#weixin-title').val(data.data.case.wxTitle);
        $('#weixin-description').val(data.data.case.wxDescription);

        // 获取案例类型
        ajax.get({
            url: '/admin/case/list_type.do',
            cb: function(_data) {
                var tpl = $('#type-tpl').html();
                $('#type').html(_.template(tpl)(_data));
                $('#type').select2().select2('val', data.data.case.type);
            },
            modal: modal,
            title: '案例详情'
        });

        // 填充内容
        _.each(data.data.case.content, function(val, index) {
            var $ctx = $('.case-content').eq(index);

            $('.case-content-title', $ctx).val(val.title);
            $('.case-content-ctn', $ctx).val(val.text);
        });

    },
    modal: modal,
    title: '案例详情'
});

// 更新案例
$('#submit').click(function() {

    var title = $('#title').val();
    var description = $('#description').val();
    var type = $('#type').select2('val');
    var snapshot = $('.snapshats-submit').attr('data-img');
    var content = getContent($('.case-content'));
    var sign = $('#sign').val();
    var wxTitle = $('#weixin-title').val();
    var wxDescription = $('#weixin-description').val();

    if(title === '' ||
       description === '' ||
       type === '' ||
       snapshot === '' ||
       sign === '' ||
       wxTitle === '' ||
       wxDescription === '' ,
       !checkContent(content)) {
           modal.nobtn({
               ctx: 'body',
               title: '添加案例',
               ctn: '请确保已经输入案例标题，案例描述，选择类型，案例标识，案例内容，并已经上传案例图标'
           });
           return;
       }

    ajax.post({
        url: '/admin/case/update.do',
        param: {
            title: title,
            id: urler.normal().id,
            content: JSON.stringify(content),
            icon: snapshot,
            type: type,
            description: description,
            signId: sign,
            wxTitle: wxTitle,
            wxDescription: wxDescription
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '案例详情',
                    ctn: '更新案例成功',
                    event: function() {
                        location.href = '/#proj_name#/html/case/list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '案例详情',
                    ctn: data.message
                });
            }
        },
        modal: modal,
        title: '案例详情'
    });
});

/**
 * 获取案例内容，拼接成数组
 * @param {Object} $wrap [包含块]
 */
function getContent($wrap) {
    var contents = [];

    $wrap.each(function() {
        var _title = $('.case-content-title', $(this)).val();
        var _ctn = $('.case-content-ctn', $(this)).val();

        contents.push({
            title: _title,
            text: _ctn
        });
    });

    return contents;
}

/**
 * 检查内容是否填满
 * @param [Array] arr [对象数组 [{}, {}, {}] ]
 */
function checkContent(arr) {
    var isAll = true;

    for(var i = 0; i < arr.length; i++) {
        if(arr[i].title === '' || arr[i].text === '') {
            isAll = false;
        }
    }

    return isAll;
}
