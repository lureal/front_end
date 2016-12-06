/*!
 * 客户管理
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var sidebar = require('./modules/sidebar.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var time = require('./modules/time.js');
var header = require('./modules/header.js');

// 初始化菜单
sidebar.manage({
    title: '客户管理',
    active: 'customer'
});

// 初始化顶部栏
header.manage({
    title: '客户管理'
});

// 初始化选择平台下拉框
select2.init({
    url: '/select/listPlatForms.do',
    title: '客户管理',
    cb: function(data) {
        var tpl = $('#type-tpl').html();
        $('#platform').html(_.template(tpl)(data));
        $('#platform').select2({
            placeholder: '选择平台'
        }).select2('val', '');
    }
});

// 初始化选择运营人员下拉框
select2.init({
    url: '/select/listUsers.do',
    title: '客户管理',
    cb: function(data) {
        var tpl = $('#type-tpl').html();
        $('#people').html(_.template(tpl)(data));
        $('#people').select2({
            placeholder: '选择运营人员'
        }).select2('val', '');
    }
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/manage/custom/list.do',
        param: {
            page: 1,
            export: false
        },
        title: '客户管理'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1,
            export: false
        }));

        for(var i = 0; i < data.data.records.length; i++) {
            var val = data.data.records[i];
            val.posttime_str = time.unixToTime(val.posttime);
        }

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#customer').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/manage/custom/list.do',
            param: param,
            title: '客户管理'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            for(var i = 0; i < data.data.records.length; i++) {
                var val = data.data.records[i];
                val.posttime_str = time.unixToTime(val.posttime);
            }

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#customer').html(_.template(tpl)(data));
        }
    });
});

// 搜索
$('#search').click(function() {

    // 获取平台 id
    var platform = select2.getVal({
        id: '#platform'
    });

    // 获取运营人员 id
    var people = select2.getVal({
        id: '#people'
    });

    // 执行搜索
    ajax.get({
        url: '/manage/custom/list.do',
        param: {
            platformId: platform,
            userId: people,
            page: 1,
            export: false
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                platformId: platform,
                userId: people,
                page: 1,
                export: false
            }));

            for(var i = 0; i < data.data.records.length; i++) {
                var val = data.data.records[i];
                val.posttime_str = time.unixToTime(val.posttime);
            }

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#customer').html(_.template(tpl)(data));

        },
        modal: modal,
        title: '客户管理'
    });

});

// 导出
$('#export').click(function() {

    // 获取平台 id
    var platform = select2.getVal({
        id: '#platform'
    });

    // 获取运营人员 id
    var people = select2.getVal({
        id: '#people'
    });

    // 浏览器打开页面的方式下载附件
    location.href = '/manage/custom/list.do?platformId=' + platform +
        '&userId=' + people +
        '&export=' + true;
});

// 查看投放平台
$('body').on('click', '.view-platform', function() {
    var name = $(this).attr('data-name');
    var reason = $(this).attr('data-reason');
    var status = $(this).attr('data-status');
    var id = $(this).attr('data-customerid');

    modal.custom({
        tpl: '#platform-tpl',
        data: {
            title: '投放平台状态',
            name: decodeURIComponent(name),
            reason: decodeURIComponent(reason),
            status: Number(decodeURIComponent(status)),
            id: id
        }
    });
});
