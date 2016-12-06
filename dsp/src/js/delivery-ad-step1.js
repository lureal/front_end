/*!
 * 广告
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var sidebar = require('./modules/sidebar.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var urler = require('./modules/urler.js');
var time = require('./modules/time.js');
var header = require('./modules/header.js');
var cache = require('./modules/cache.js');
var timer = require('./modules/time-picker.js');

// 如果本地存储有数据，则获取数据，下文用这些数据进行填充
if(urler.normal().order_id) {
    var cacheData = cache.get('delivery_ad_detail');
} else {
    var cacheData = cache.get('delivery_ad_add');
}

// 初始化：订单名称
if(cacheData && cacheData.one && cacheData.one.name) {
    $('#name').val(cacheData.one.name);
}

// 初始化 url 模块
urler.initLink();

//初始化菜单
sidebar.delivery({
    title: '广告',
    active: 'ad'
});

// 初始化顶部栏
header.delivery({
    title: '广告'
});

// 获取平台列表
ajax.get({
    url: '/select/listPlatForms.do',
    param: {
        customId: urler.normal().cid
    },
    cb: function(data) {
        var tpl = $('#checkbox-tpl').html();
        $('#list').html(_.template(tpl)(data));

        // 初始化：如果有平台，则渲染平台
        if(cacheData && cacheData.one && cacheData.one.platform) {
            $('#list [type="radio"][value="' + cacheData.one.platform + '"]').prop('checked', true);
        }
    }
});

// 初始化选择广告组
select2.init({
    url: '/select/listAdGroups.do',
    param: {
        customId: urler.normal().cid
    },
    title: '客户管理',
    cb: function(data) {
        var tpl = $('#type-tpl').html();
        $('#select-group').html(_.template(tpl)(data));
        $('#select-group').select2({
            placeholder: '选择广告组'
        }).select2('val', '');

        if(cacheData && cacheData.one && cacheData.one.group) {
            $('#select-group').select2('val', cacheData.one.group);
        }
    }
});

// 新建广告组
$('#create-group').click(function() {
    modal.custom({
        tpl: '#group-modal-tpl',
        data: {
            title: '广告'
        }
    });

    $('#group-modal-submit').unbind('click').bind('click', function() {

        var name = $('#group-modal-name').val();
        var quota = Number($('#group-modal-quota').val());

        if(name === '' || quota <= 0) {

            // 隐藏当前弹出框
            $('#modal-custome').modal('hide');

            modal.nobtn({
                title: '',
                ctx: 'body',
                ctn: '请确保广告组名称和日限额已经输入，并且确保日限额为正数'
            });

            return;
        }

        ajax.get({
            url: '/deal/group/submit.do',
            param: {
                customId: urler.normal().cid,
                name: name,
                quota: parseInt(parseFloat(quota * 100).toPrecision(12))
            },
            cb: function(data) {

                // 隐藏当前弹出框
                $('#modal-custome').modal('hide');

                if(data.data === true) {
                    modal.nobtn({
                        ctx: 'body',
                        ctn: '新增广告组成功',
                        title: '广告'
                    });

                    // 重新初始化广告组，让新增的广告组能够体现在下拉列表中
                    select2.init({
                        url: '/select/listAdGroups.do',
                        param: {
                            customId: urler.normal().cid
                        },
                        title: '客户管理',
                        cb: function(data) {
                            var tpl = $('#type-tpl').html();
                            $('#select-group').html(_.template(tpl)(data));
                            $('#select-group').select2({
                                placeholder: '选择广告组'
                            }).select2('val', '');

                            if(cacheData && cacheData.one && cacheData.one.group) {
                                $('#select-group').select2('val', cacheData.one.group);
                            }
                        }
                    });
                } else {
                    modal.nobtn({
                        ctx: 'body',
                        ctn: '新增广告组失败',
                        title: '广告'
                    });
                }
            }
        })
    });
});

// 提交数据
$('#submit').click(function() {

    // 获取数据
    var group = select2.getVal({
        id: '#select-group'
    });
    var name = $('#name').val();
    var platform = '';
    $('#list [type="radio"]:checked').each(function() {
        platform = Number($(this).val());
    });

    // 数据校验
    if(platform.length < 1 || group === null || group === '' || name === '') {
        modal.nobtn({
            ctx: 'body',
            title: '广告',
            ctn: '请选择广告组，填写订单名称并选择投放平台'
        });
        return;
    }

    // 保存数据到本地
    if(urler.normal().order_id) {
        cache.set('delivery_ad_detail.one', {
            group: group,
            name: name,
            platform: platform
        });

        // 跳转到步骤2
        urler.initLink('/#proj_name#/html/delivery/ad/step2.html?order_id=' + urler.normal().order_id);

    } else {
        cache.set('delivery_ad_add.one', {
            group: group,
            name: name,
            platform: platform
        });

        // 跳转到步骤2
        urler.initLink('/#proj_name#/html/delivery/ad/step2.html');
    }

});
