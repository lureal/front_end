/*!
 * 环评，主管打分模块
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var time = require('./modules/time.js');

auth.toolbar1({
    title: '环评打分'
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/grade/list_mgr.do',
        param: {
            page: sessionStorage.getItem('scoreListTargetPage') !== null ? sessionStorage.getItem('scoreListTargetPage') : 1
        },
        title: '环评打分'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        if(data.data.cycleGrade === true) {
            $('body').find('.depart-score').removeClass('z-hidden');
        }
        if(data.data.mgrGrade === true) {
            $('body').find('.staff-score').removeClass('z-hidden');
        }

        // 渲染模板
        var tpl = $('#director-tpl').html();
        $('#director').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/grade/list_mgr.do',
            param: param,
            title: '环评打分'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#director-tpl').html();
            $('#director').html(_.template(tpl)(data));

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var targetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('scoreListTargetPage', targetPage);
        }
    });
});

//初始化季度日期,用户列表选择
select2.init({
    url: '/admin/grade/quarter_option.do',
    title: '季度选择',
    cb: function(data) {
        var tpl = $('#score-date-tpl').html();
        $('#score-date').html(_.template(tpl)(data));
        $('#score-date').select2({
            placeholder: '季度选择'
        }).select2('val', '');
    }
});

//查询
$('#search').on('click', function() {
    var dateDate = $('#score-date').val();
    ajax.get({
        url: '/admin/grade/list_mgr.do',
        param: {
            dateDate: dateDate,
            page: 1
        },
        cb: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                dateDate: dateDate,
                page: 1
            }));
            var tpl = $('#director-tpl').html();
            $('#director').html(_.template(tpl)(data));
        }
    });
});