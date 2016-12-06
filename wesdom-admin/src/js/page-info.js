/*!
 * 页面基本信息
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');

// 获取页面基本信息数据
ajax.get({
    url: '/admin/brand/list_title.do',
    cb: function(data) {
        var $list = $('.list');
        _.each(data.data, function(val, index) {
            $('.title', $list.eq(index)).val(val.title);
            $('.description', $list.eq(index)).val(val.description);
        });
    },
    modal: modal,
    title: '页面基本信息'
});

// 更新页面基本信息
$('#submit').click(function() {

    var info = [];

    // 循环赋值
    $('.list').each(function(index) {
        info.push({
            title: $('.title', $(this)).val(),
            description: $('.description', $(this)).val()
        });
    });

    // 判断是否已经输入所有页面的基本信息
    for(var i = 0; i < info.length; i++) {
        var _title = info[i].title,
            _desc = info[i].description;

        if(_title === '' || _desc === '') {

            modal.nobtn({
                ctx: 'body',
                title: '更新页面基本信息',
                ctn: '请输入所有标题和描述'
            });

            return;
        }
    }

    // 提交数据
    ajax.post({
        url: '/admin/brand/add_title.do',
        param: {
            json: JSON.stringify(info)
        },
        cb: function(data) {

            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '更新页面基本信息',
                    ctn: '更新页面基本信息成功',
                    event: function() {
                        location.reload();
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '更新页面基本信息',
                    ctn: data.message
                });
            }
        },
        modal: modal,
        title: '页面基本信息'
    });

});
