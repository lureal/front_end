var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');

// 初始化导航
auth.noToolbar({
    title: '添加人员'
});

// 初始化在职状态
select2.init({
    url: ' /admin/user/user_status_option.do',
    title: '选择在职状态',
    cb: function(data) {
        var tpl = $('#type-tpl').html();
        $('#status').html(_.template(tpl)(data));
        $('#status').select2({
            placeholder: '选择在职状态'
        }).select2('val', '');
    }
});

// 初始化性别
select2.init({
    url: '/admin/user/gender_type_option.do',
    title: '选择性别',
    cb: function(data) {
        var tpl = $('#type-tpl').html();
        $('#sex').html(_.template(tpl)(data));
        $('#sex').select2({
            placeholder: '选择性别'
        }).select2('val', '');
    }
});

// 初始化部门
select2.init({
    url: '/admin/grade/depart_option.do',
    title: '选择部门',
    cb: function(data) {
        var tpl = $('#type-tpl').html();
        $('#depart').html(_.template(tpl)(data));
        $('#depart').select2({
            placeholder: '部门选择'
        }).select2('val', '');
    }
});

// 初始化入职时间
$('#datepicker').datepicker({
    format: 'yyyy-mm-dd',
    locale: {
        daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
        monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
    }
});

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
            title: '添加人员',
            ctn: '请确保输入或选择所有数据'
        });
        return;
    }

    // 提交数据
    ajax.post({
        url: '/admin/user/add.do',
        param: {
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
                    title: '添加人员',
                    ctn: '添加人员成功',
                    event: function() {
                        location.href = '/#proj_name#/html/system/user-list.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '添加人员',
                    ctn: data.message
                });
            }
        }
    });
});
