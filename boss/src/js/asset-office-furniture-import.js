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

// 初始化导航
auth.noToolbar({
    title: '导入办公家具'
});

// 初始化上传文件
$('#file-wrap').html(_.template($('#file-tpl').html())({
    action: '/admin/furniture/import_furniture.do',
    title: '导入办公家具',
    name: 'dataFile'
}));

// 上传文件绑定事件
upload.file($('#file-wrap'), modal, '导入办公家具', function(data) {
    location.href = '/#proj_name#/html/asset/office-furniture.html'
}, function() {
    return true;
});
