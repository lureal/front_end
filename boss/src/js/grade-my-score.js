/*!
 * 环评，我的得分模块
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
    title: '我的得分'
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/grade/list_my.do',
        param: {
            page: sessionStorage.getItem('myScoreTargetPage') !== null ? sessionStorage.getItem('myScoreTargetPage') : 1
        },
        title: '我的得分'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1
        }));

        // 渲染模板
        var tpl = $('#score-table-tpl').html();
        $('#score-table').html(_.template(tpl)(data));



        //根据后台返回的值，如果为真，显示自评项
        if(data.data.canGrade === true) {
            var selfTpl = $('#self-assessment-tpl').html();
            $('#self-assessment').html(_.template(selfTpl)(data));
            $('#self-tip').css('display', 'none');
        } else {
            $('#self-tip').css('display', 'block');
        }
    }
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/grade/list_my.do',
            param: param,
            title: '我的得分'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#score-table-tpl').html();
            $('#score-table').html(_.template(tpl)(data));

            // 需求：翻页刷新，不回到第一页
            // 用户翻页时，将这个页码存到sessionStorage里
            var targetPage = $('body').find('.pagination > .active > .page').attr('data-pagenow');
            sessionStorage.setItem('myScoreTargetPage', targetPage);
        }
    });
});

//提交自评
$('#self-assessment').on('click', '#commit', function() {
    $("#self-assessment").attr("disabled", true);
    var abilityScore = $('#ability').val();
    var attitudeScore  = $('#attitude').val();
    var sum = Number(abilityScore) + Number(attitudeScore);

    //正则表达式验证输入的是整数
    var checkNum = /^[0-9]*[1-9][0-9]*$/;
    var reg = /^\d+(\.[10])?$/;
    // console.log(checkNum.test(abilityScore));
    // console.log(checkNum.test(attitudeScore));
    // console.log(abilityScore);

    //数据校验
    // if(abilityScore.toString().indexOf('.') ||attitudeScore.toString().indexOf('.')) {
    //      modal.nobtn({
    //         ctx: 'body',
    //         ctn: '自评能力、态度不能为空，且单项不能大于5或小于1的整数',
    //         title: '我的自评',
    //     });
    //     return;
    // }
    if(Number(abilityScore) < 1 && reg.test(abilityScore) || Number(abilityScore) > 5 && reg.test(abilityScore) ||
        Number(attitudeScore) < 1 && reg.test(attitudeScore) || Number(attitudeScore) > 5 && reg.test(attitudeScore) ) {
        modal.nobtn({
            ctx: 'body',
            ctn: '自评能力、态度不能为空，且单项不能大于5或小于1的整数',
            title: '我的自评',
        });
        return;
    }
    if(sum > 9 ) {
        modal.nobtn({
            ctx: 'body',
            ctn: '能力和态度总和不能大于9',
            title: '我的自评',
        });
        return;
    }
    ajax.get({
        url: '/admin/grade/add_my_score.do',
        param: {
            abilityScore: abilityScore,
            attitudeScore: attitudeScore
        },
        cb: function(data) {
            $("#self-assessment").attr("disabled", false);
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    ctn: '提交成功',
                    title: '我的自评',
                    event: function() {
                        location.reload();
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    ctn: '提交失败',
                    title: '我的自评'
                });
            }
        }
    });
});
