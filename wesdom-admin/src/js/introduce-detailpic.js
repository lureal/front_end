/*!
 * 添加图片
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var upload = require('./modules/upload');
var urler = require('./modules/urler');

// 根据 url 中的 id 获取图片详情
ajax.get({
    url: '/admin/introduce/detail_pic.do',
    param: {
        id: urler.normal().id
    },
    cb: function(data) {

        // 渲染添加作者图片模板
        var tpl = $('#snapshots-tpl').html();
        $('#snapshats').html(_.template(tpl)({
            action: '/admin/introduce/upload.do',
            name: 'snapshotFile',
            snapshot: data.data.pic.snapshot[0]
        }));
        console.log(data.data.pic.snapshot);

        upload($('body'), modal, '图片详情');

        // 填充数据
        $('#title').val(data.data.pic.title);
        $('#description').val(data.data.pic.description);
    },
    modal: modal,
    title: '案例详情'
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


// 添加案例
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
        url: '/admin/introduce/update_pic.do',
        param: {
            id: urler.normal().id,
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
