/*!
 * 添加图片
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var upload = require('./modules/upload');
var urler = require('./modules/urler');

// 渲染大图添加案例图标模板
var tpl = $('#snapshots-tpl').html();
$('#snapshats').html(_.template(tpl)({
    action: '/admin/introduce/upload.do',
    name: 'snapshotFile'
}));

// upload($('body'), modal, '添加图标');
upload($('#snapshats'), modal, '添加图标');


// 渲染小图添加案例图标模板
var tpl = $('#small-snapshats-tpl').html();
$('#small-snapshats').html(_.template(tpl)({
    action: '/admin/introduce/upload.do',
    name: 'snapshotFile'
}));
// upload($('body'), modal, '添加图标');
upload($('#small-snapshats'), modal, '添加图标');

// 添加案例
$('#submit').click(function() {

    var title = $('#title').val();
    var description = $('#description').val();  
    var bigsnapshot = $('#snapshats').find('.snapshats-submit').attr('data-img');
    var smallsnapshats = $('#small-snapshats').find('.snapshats-submit').attr('data-img');
    var snapshot = [];
    snapshot.push(bigsnapshot, smallsnapshats);
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
        url: '/admin/introduce/add_event.do',
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
