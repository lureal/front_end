/*!
 * 环评，环评打分模块
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
ajax.get({
    url: '/admin/grade/list_depart.do',
    cb: function(data) {
        var tpl = $('#depart-tpl').html();
        $('#depart').html(_.template(tpl)(data));

        //给第一个li元素，添加默认选中的样式
        $('#depart').find('ul li').eq(0).addClass('active');
        $('#depart').find('.tab-pane').eq(0).addClass('active');
    }
});

//提交
$('#commit').on('click', function(data) {
    // $("#commit").attr("disabled", true);
    var cur = [];
    var validateFlag;
    var id = $('#depart').find('tbody tr').attr('data-id');
    $('#depart').find('tbody .tableTr').each(function() {
        var abilityScore = $(this).find('.ability').val();
        var attitudeScore = $(this).next('.tableTr1').find('.attitude').val();
        var suggest = $(this).find('.suggest').val();
        var id = $(this).attr('data-id');
        var departId = $(this).parents('.tab-pane').attr('data-departId');
        var sum = Number(abilityScore) + Number(attitudeScore);
        if(abilityScore === '' || attitudeScore === '') {
            modal.nobtn({
                ctx: 'body',
                ctn: '请确保所有部门，人员打分已完成',
                title: '主管打分'
            });
            validateFlag = false;
            return false;
        }
        if(Number(abilityScore) < 1 || Number(abilityScore) > 5 || Number(attitudeScore) < 1
            || Number(abilityScore) > 5 || Number(abilityScore) === null
            || Number(attitudeScore) === null || Number(sum) > 9) {
            modal.nobtn({
                ctx: 'body',
                ctn: '态度，能力不能为空，且单项数值必须在1和5之间,且他们的和的值不能超过9',
                title: '主管打分'
            });
            validateFlag = false;
        }
        cur.push({
            abilityScore: abilityScore,
            attitudeScore: attitudeScore,
            suggest: suggest,
            target: id,
            opDepart: departId
        });
        return cur;
    });
    if(validateFlag === false ) {
        return false;
    } else {
        $('#modal-tpl').modal('show');
        $('body').on('click', '#submit', function() {
            ajax.post({
                url: '/admin/grade/add_depart_score.do',
                param: {
                    json: JSON.stringify(cur)
                },
                cb: function(data) {
                     $('#modal-tpl').modal('hide');
                    if(data.data === true) {
                        // $("#commit").attr("disabled", false);
                        modal.onebtn({
                            ctx: 'body',
                            ctn: '提交成功',
                            title: '主管打分',
                            event: function() {
                                location.href = '/#proj_name#/html/grade/score-list.html';
                            }
                        });
                    } else {
                        modal.nobtn({
                            ctx: 'body',
                            ctn: '提交失败',
                            title: '主管打分'
                        });
                    }
                }
            });
        });
        $('body').on('click', '#cancel', function() {
            $('#modal-tpl').modal('hide');
        });
    }
});

//保存
$('#save').on('click', function(data) {
    saveCur = [];
    var saveFlag;
    var id = $('#depart').find('tbody tr').attr('data-id');
    $('#depart').find('tbody .tableTr').each(function() {
        var abilityScore = $(this).find('.ability').val();
        var attitudeScore = $(this).next('.tableTr1').find('.attitude').val();
        var suggest = $(this).find('.suggest').val();
        var id = $(this).attr('data-id');
        var departId = $(this).parents('.tab-pane').attr('data-departId');
        var sum = Number(abilityScore) + Number(attitudeScore);
        var reg = /^\d+(\.[10])?$/;
        if( Number(abilityScore) < 1  && reg.test(abilityScore)||
            Number(abilityScore) > 5 && reg.test(abilityScore)||
            Number(attitudeScore) < 1 && reg.test(attitudeScore) ||
            Number(attitudeScore) > 5 && reg.test(attitudeScore)||
            Number(sum) > 9 ){
            saveFlag = false;
            modal.nobtn({
                ctx: 'body',
                ctn: '态度，能力单项数值必须在1和5之间,且他们的和的值不能超过9',
                title: '主管评分'
            });
            return false;
        } else {
            saveCur.push({
                abilityScore: abilityScore,
                attitudeScore: attitudeScore,
                suggest: suggest,
                target: id,
                opDepart: departId
            });
        }
    });
    if(saveFlag === false) {
        return false;
    } else {
        ajax.post({
            url: '/admin/grade/save_depart_score.do',
            param: {
                json: JSON.stringify(saveCur)
            },
            cb: function(data) {
                if(data.data === true) {
                    modal.onebtn({
                        ctx: 'body',
                        ctn: '保存成功',
                        title: '主管打分',
                        event: function() {
                            location.reload();
                        }
                    });
                } else {
                    modal.nobtn({
                        ctx: 'body',
                        ctn: '保存失败',
                        title: '主管打分'
                    });
                }
            }
        });
    }
});

