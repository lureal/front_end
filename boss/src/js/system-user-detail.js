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
    title: '人员详情'
});

// 获取职位详情
// 提交数据
ajax.post({
    url: '/admin/user/detail.do',
    param: {
        id: urler.normal().id
    },
    cb: function(data) {
        if(data.data === false) {
            modal.nobtn({
                ctx: 'body',
                title: '人员详情',
                ctn: data.message
            });
        } else {

            // 渲染数据
            $('#name').val(data.data.user.name);
            select2.init({
                url: ' /admin/user/user_status_option.do',
                title: '选择在职状态',
                cb: function(_data) {
                    var tpl = $('#type-tpl').html();
                    $('#status').html(_.template(tpl)(_data));
                    $('#status').select2({
                        placeholder: '选择在职状态'
                    }).select2('val', data.data.user.statusId);
                }
            });
            $('#email').val(data.data.user.email);
            $('#phone').val(data.data.user.phone);
            $('#graduate-datepicker').datepicker({
                format: 'yyyy-mm-dd',
                locale: {
                    daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
                }
            });
            $('#positive-datepicker').datepicker({
                format: 'yyyy-mm-dd',
                locale: {
                    daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
                }
            });
            $('#graduate-datepicker').val(data.data.user.graduateDate);
            $('#positive-datepicker').val(data.data.user.activeDate);
            select2.init({
                url: '/admin/user/gender_type_option.do',
                title: '选择性别',
                cb: function(_data) {
                    var tpl = $('#type-tpl').html();
                    $('#sex').html(_.template(tpl)(_data));
                    $('#sex').select2({
                        placeholder: '选择性别'
                    }).select2('val', data.data.user.genderId);
                }
            });
            select2.init({
                url: '/admin/grade/depart_option.do',
                title: '选择部门',
                cb: function(_data) {
                    var tpl = $('#type-tpl').html();
                    $('#depart').html(_.template(tpl)(_data));
                    $('#depart').select2({
                        placeholder: '部门选择'
                    }).select2('val', data.data.user.departId);
                }
            });
            $('#job').val(data.data.user.position);
            $('#datepicker').datepicker({
                format: 'yyyy-mm-dd',
                locale: {
                    daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                    monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
                }
            });
            $('#datepicker').val(data.data.user.joinTime);
        }
    }
});

// 提交数据
$('#submit').click(function() {
    $("#submit").attr("disabled", true);
    var name = $('#name').val();
    var status = select2.getVal({
        id: '#status'
    });
    var email = $('#email').val();
    var phone = $('#phone').val();
    var sex = select2.getVal({
        id: '#sex'
    });
    var depart = select2.getVal({
        id: '#depart'
    });
    var job = $('#job').val();
    var date = $('#datepicker').val();
    var activeDate = $('#positive-datepicker').val();
    var graduateDate = $('#graduate-datepicker').val();

    // 数据校验
    if (
        name === '' ||
        status === '' || status === null ||
        email === '' ||
        phone === '' ||
        sex === '' || sex === null ||
        depart === '' || depart === null ||
        job === '' ||
        date === '' 
    ) {
        modal.nobtn({
            ctx: 'body',
            title: '人员详情',
            ctn: '请确保输入或选择所有数据'
        });
        return;
    }

    // 提交数据
    ajax.post({
        url: '/admin/user/update.do',
        param: {
            id: urler.normal().id,
            name: name,
            status: status,
            email: email,
            phone: phone,
            gender: sex,
            departId: depart,
            position: job,
            joinTime: date,
            activeDate: activeDate,
            graduateDate: graduateDate
        },
        cb: function(data) {
            $("#submit").attr("disabled", false);
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '人员详情',
                    ctn: '人员详情成功',
                    event: function() {
                        location.href = '/#proj_name#/html/system/user-list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '人员详情',
                    ctn: data.message
                });
            }
        }
    });
});
