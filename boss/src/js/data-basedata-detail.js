/*!
 * 数据详情
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var urler = require('./modules/urler.js');

// 初始化导航
auth.noToolbar({
    title: '数据详情'
});

// 获取数据
ajax.get({
    url: '/admin/base/detail.do',
    param: {
        id: urler.normal().id
    },
    cb: function(data) {
        var tpl = $('#detail-tpl').html();
        $('#detail').html(_.template(tpl)(data));

        // 初始化类型选择
        select2.init({
            url: '/admin/base/data_type_option.do',
            title: '基础数据管理',
            cb: function(_data) {
                var tpl = $('#basedata-type-tpl').html();
                $('#basedata-type').html(_.template(tpl)(_data));
                $('#basedata-type').select2({
                    placeholder: '选择类型'
                }).select2('val', data.data.basedata.type);
            }
        });

    }
});

// 数据详情
$('#submit').click(function() {
    $("#submit").attr("disabled", true);

    // 获取类型
    var databaseType = select2.getVal({
        id: '#basedata-type'
    });

    // 获取数据
    var name = $('#name').val();
    var memo = $('#memo').val();

    // 数据判定
    if(name === '' || databaseType === '' || databaseType === null) {
        modal.nobtn({
            ctx: 'body',
            title: '数据详情',
            ctn: '请确保选择数据类型和输入数据名称'
        });
        return;
    }

    // 提交数据
    ajax.post({
        url: '/admin/base/update.do',
        param: {
            id: urler.normal().id,
            type: databaseType,
            name: name,
            memo: memo
        },
        cb: function(data) {
            $("#submit").attr("disabled", false);
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '数据详情',
                    ctn: '修改数据成功',
                    event: function() {
                        location.href = '/#proj_name#/html/data/basedata-list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '数据详情',
                    ctn: data.message
                });
            }
        }
    });
});
