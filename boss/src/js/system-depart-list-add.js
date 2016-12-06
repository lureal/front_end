/*!
 * 设置主管
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var time = require('./modules/time.js');
var urler = require('./modules/urler.js');

auth.toolbar1({
    title: '设置主管'
});

ajax.get({
    url: '/admin/depart/detail.do',
    param: {
        id: urler.normal().id
    },
    cb: function(data) {

        //渲染模板
        var tpl = $('#depart-add-tpl').html();
        $('#depart-add').html(_.template(tpl)(data));
        $('#depart-add').find('#name').val(data.data.depart.name);

        //填充主管列表
        select2.init({
            url: '/admin/depart/user_option.do',
            title: '设置主管',
            cb: function(_data) {
                var tpl = $('#director-name-tpl').html();
                $('#director-name').html(_.template(tpl)(_data));
                $('#director-name').select2({
                    placeholder: '选择主管'
                }).select2('val', data.data.depart.mgr);
            }
        });
    }
});

//提交
$('#submit').on('click', function(data) {
    $("#submit").attr("disabled", true);
    var directorId = $('#director-name').val();
    ajax.get({
        url: '/admin/depart/update_mgr.do',
        param: {
            id: urler.normal().id,
            userId: directorId
        },
        cb: function(data) {
            $("#submit").attr("disabled", false);
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '提交成功',
                    title: '设置主管',
                    event: function() {
                        location.href = "/#proj_name#/html/system/depart-list.html";
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    ctn: '提交失败',
                    title: '设置主管'
                });
            }
        }
    });
});