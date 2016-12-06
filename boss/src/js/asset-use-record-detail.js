/*!
 * 领用记录详情
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
    title: '领用记录详情'
});

ajax.get({
    url: '/admin/asset/detail_use.do',
    param: {
        id: urler.normal().id
    },
    cb: function(data) {

        // 初始化资产
        select2.init({
            url: '/admin/asset/asset_option.do',
            title: '新增领用记录',
            cb: function(_data) {
                var tpl = $('#type-tpl').html();
                $('#assets').html(_.template(tpl)(_data));
                $('#assets').select2({
                    placeholder: '选择资产'
                }).select2('val', data.data.assetUse.assetId);
            }
        });

        // 初始化领用类型
        select2.init({
            url: '/admin/asset/asset_use_type_option.do',
            title: '新增领用记录',
            cb: function(_data) {
                var tpl = $('#type-tpl').html();
                $('#use-type').html(_.template(tpl)(_data));
                $('#use-type').select2({
                    placeholder: '选择领用类型'
                }).select2('val', data.data.assetUse.type);
            }
        });

        // 初始化领用人
        select2.init({
            url: '/admin/asset/user_option.do',
            title: '新增领用记录',
            cb: function(_data) {
                var tpl = $('#type-tpl').html();
                $('#people').html(_.template(tpl)(_data));
                $('#people').select2({
                    placeholder: '选择领用人'
                }).select2('val', data.data.assetUse.usePerson);
            }
        });

        $('#datapicker').datepicker({
            autoclose: true,
            format: 'yyyy-mm-dd'
        });
        $('#number').val(data.data.assetUse.cnt);
        $('#datapicker').val(data.data.assetUse.execDate);
        $('#name').val(data.data.assetUse.custName);
        $('#purpose').val(data.data.assetUse.purpose);
        $('#memo').val(data.data.assetUse.memo);
    }
});

// 新增领用记录
$('#submit').click(function() {
    $("#submit").attr("disabled", true);
    var assets = select2.getVal({
        id: '#assets'
    });
    var useType = select2.getVal({
        id: '#use-type'
    });
    var number = Number($('#number').val());
    var people = select2.getVal({
        id: '#people'
    });
    var date = $('#datapicker').val();
    var name = $('#name').val();
    var purpose = $('#purpose').val();
    var memo = $('#memo').val();

    if(assets === null ||
        useType === null ||
        number <= 0 ||
        people === null ||
        date === '' ||
        name === '') {
            modal.nobtn({
                ctx: 'body',
                ctn: '请确保选择资产，领用类型，领取人，输入领用数量，选择发放日期，输入客户名称，用途和备注',
                title: '新增领用记录'
            });
            return;
        }

        ajax.post({
            url: '/admin/asset/update_use.do',
            param: {
                id: urler.normal().id,
                assetId: assets,
                type: useType,
                cnt: number,
                userId: people,
                execDate: date,
                custName: name,
                purpose: purpose,
                memo: memo
            },
            cb: function(data) {
                $("#submit").attr("disabled", false);
                if(data.data === true) {
                    modal.onebtn({
                        ctx: 'body',
                        title: '新增领用记录',
                        ctn: '添加成功',
                        event: function() {
                            location.href = '/#proj_name#/html/asset/use-record.html';
                        }
                    });

                } else {
                    modal.nobtn({
                        ctx: 'body',
                        title: '新增领用记录',
                        ctn: '添加失败'
                    });
                }
            }
        });
});
