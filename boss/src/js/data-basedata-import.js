/*!
 * 导入数据
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var upload = require('./modules/upload.js');

// 初始化导航
auth.noToolbar({
    title: '导入数据'
});

// 初始化上传文件
$('#file-wrap').html(_.template($('#file-tpl').html())({
    action: '/admin/base/import_data.do',
    title: '导入数据',
    name: 'dataFile'
}));

// 初始化类型选择（需在初始化上传文件之后）
select2.init({
    url: '/admin/base/data_type_option.do',
    title: '基础数据管理',
    cb: function(data) {
        var tpl = $('#basedata-type-tpl').html();
        $('#basedata-type').html(_.template(tpl)(data));
        $('#basedata-type').select2({
            placeholder: '选择类型'
        }).select2('val', '');
    }
});

// 上传文件绑定事件
upload.file($('#file-wrap'), modal, '导入数据', function(data) {
    location.href = '/#proj_name#/html/data/basedata-list.html'
}, function() {

    var type = select2.getVal({
        id: '#basedata-type'
    });

    if(type === null || type === '') {
        modal.nobtn({
            ctx: 'body',
            title: '导入数据',
            ctn: '请选择类型'
        });
        return false;
    }

    return true;
});
