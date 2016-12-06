/**
 * 办公电脑
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
var lineId = 0;

// 定义一个全局变量
var rebackFlag = false ;


// 初始化导航
auth.toolbar1({
    title: '办公电脑'
});

// 上传图片接口admin/common/upload.do

ajax.get({
    url: '/admin/device/detail_allot.do',
    param: {
        userid: urler.normal().id
    },
    cb: function(data) {

        // 渲染模板
        var tpl = $('#computer-detail-tpl').html();
        $('#computer-detail').html(_.template(tpl)(data));

        // 渲染checkbox(0代表勾选，1代表未勾选)
        if(data.data.allot.power === 0) {

            $('#power').attr('checked', true);
        } else {
            $('#power').attr('checked', false);
        }
        if(data.data.allot.mouse === 0) {
            $('input[name="mouse"]').attr('checked', true);
        } else {
            $('input[name="mouse"]').attr('checked', false);
        }
        if(data.data.allot.bag === 0) {
            $('input[name="computerPackage"]').attr('checked', true);
        } else {
            $('input[name="computerPackage"]').attr('checked', false);
        }
        $('#others').val(data.data.allot.others);
        $.each(data.data.allot.devicesUse, function(index, val) {

            // 渲染电脑配备类型（设备）
            select2.init({
                url: '/admin/device/allot_type_option.do',
                title: '电脑配备类型',
                cb: function(_data) {
                    var tpl = $('#company-device-tpl').html();
                    $('#company-device'+val.id).html(_.template(tpl)(_data));
                    $('#company-device'+val.id).select2({
                        placeholder: '选择使用电脑类型'
                    }).select2('val', val.type);
                }
            });
        });

        // 归还操作
        $('.reback').on('click', function() {
            var id = $(this).attr('data-id');
            ajax.get({
                url: '/admin/device/update_remarktype.do',
                param: {
                    id: id,
                    remarktype: 2
                },
                cb: function(data) {
                    if(data.data === true) {
                        modal.onebtn({
                            ctx: 'body',
                            title: '归还电脑',
                            ctn: '归还成功',
                            event: function() {
                                location.reload();
                            }
                        });
                    } else {
                        modal.nobtn({
                            ctx: 'body',
                            title: '归还电脑',
                            ctn: data.message !== null ? data.message : '归还失败'
                        });
                    }
                }
            });
        });

        // 点击增加记录按钮
        $('body').on('click', '#add-record', function() {

            // 获取并渲染模板
            var tpl = $('#record-tpl').html();
            $('#record-wrap').append(_.template(tpl)({
                index: ++lineId
            }));

            $('#dealtime'+lineId).datepicker({
                autoclose: true,
                format: 'yyyy-mm-dd'
            });

            // 渲染电脑配备类型（设备）
            select2.init({
                url: '/admin/device/allot_type_option.do',
                title: '配备类型',
                cb: function(_data) {
                    var tpl = $('#company-device-tpl').html();
                    $('#company-device'+lineId).html(_.template(tpl)(_data));
                    $('#company-device'+lineId).select2({
                        placeholder: '选择电脑设备类型'
                    }).select2('val', '');
                }
            });

            // 渲染备注
            select2.init({
                url: '/admin/device/remark_type_option.do',
                title: '配备类型',
                cb: function(_data) {
                    var tpl = $('#type-tpl').html();
                    $('#memo'+lineId).html(_.template(tpl)(_data));
                    $('#memo'+lineId).select2({
                        placeholder: '使用备注类型'
                    }).select2('val', '1');
                }
            });

            // 模糊查询按钮编号
            $('#model'+lineId).select2({
                placeholder: "电脑型号",
                minimumInputLength: 3,
                ajax: {
                    url: "/admin/device/option_computer.do",
                    dataType: 'json',
                    delay: 250,
                    data: function (params) {
                        return {
                            number: params.term, // search term
                            page: params.page
                        };

                        $('#model'+lineId).select2({
                            placeholder: '电脑型号',
                            openOnEnter: true
                        }).select2('val', '');
                    },
                processResults: function (data, params) {
                    localStorage.setItem('numObj', JSON.stringify(data.data.items));
                    params.page = params.page || 1;
                    return {
                        results: data.data.items,
                        pagination: {
                            more: (params.page * 30) < data.total_count
                        }
                    };
                },
                cache: true
                },
                escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
                minimumInputLength: 1,
                templateResult: formatRepo, // omitted for brevity, see the source of this page
                templateSelection: formatRepoSelection // omitted for brevity, see the source of this page
            });

            // 联动框，电脑设备号，通过模糊查询得到相应的设备号，那么联动就相应的得到电脑number号
            // 给电脑设备号（model）绑定一个change框
            $('#model'+lineId).change(function() {

                var modelId = $(this).attr('data-select');
                var model = select2.getVal({
                    id: '#model'+(modelId)
                });

                // 循环比较
                var numList = $.parseJSON(localStorage.getItem('numObj'));
                $.each(numList, function(index, val) {
                    if(model === val.id) {
                        $('#number'+(modelId)).val(val.trademark +  val.model);
                    }
                });
            });

            // 联动框，如果选择公司设备，页面上就会显示电脑型号、电脑number号（俩个框），
            // 如果选择自己的电脑，就会显示补贴详情（一个框）
            $('#company-device'+lineId).change(function() {
                var selectId = $(this).attr('data-select');
                var deviceid = select2.getVal({
                    id: '#company-device'+ selectId
                });

                // deviceid = 0 代表公司设备 1 代表自己设备
                if(deviceid === '0') {
                    $(this).parents('.record-add').find('.co-device').removeClass('z-hidden');
                    $(this).parents('.record-add').find('.self-device').addClass('z-hidden');
                } else {
                    $(this).parents('.record-add').find('.co-device').addClass('z-hidden');
                    $(this).parents('.record-add').find('.self-device').removeClass('z-hidden');
                }
            });
        });

        // 删除按钮
        $('body').on('click', '.delete', function() {
            var $record = $(this).parents('.record-add').remove();
        });
    }
});

// select2 所用到的方法
function formatRepo (repo) {
    if (repo.loading) return repo.full_name;
    var markup = "<div class='select2-result-repository__title'>"  + repo.full_name + "</div>";
    return markup;
}


function formatRepoSelection (repo) {
    return repo.full_name || repo.text;
}

// 提交
$('#submit').on('click', function() {

    // 获取checkbox的值(选中为true, 未勾选为false，0 为有，1为无)
    var power = $('input[name="power"]').prop('checked');
    var mouse = $('input[name="mouse"]').prop('checked');
    var computerPackage = $('input[name="computerPackage"]').prop('checked');
    var others = $('#others').val();

    // 定义一个数组List
    var devicesUse = [];
    $(".record-add").each(function(index, el) {
        var typeId = $(this).find('.company-device').attr('data-select');
        var typeObj = select2.getVal({
            id: '#company-device'+typeId
        });
        var dealtime = $(this).find('.dealtime').val();

        // 0 是公司设备，1代表个人设备
        if(typeObj === '0') {
            var modelId = $(this).find('.model').attr('data-select');
            var modelDeviceObj = select2.getVal({
                id: '#model'+ modelId
            });
            var numberObj = $(this).find('.number').val();
        } else {
            var selfObj = $(this).find('.deself-device').val();
        }

        // 获取备注类型
        var memoObj = $(this).find('.memo').attr('data-select');
        var remaker = select2.getVal({
            id: '#memo'+memoObj
        });

        devicesUse.push(
            {
                'deviceid': modelDeviceObj,
                'dealtime': dealtime,
                'remakType': remaker,
                'model': selfObj,
                'type': typeObj
            }
        )
    });
    var json = {
        power: power === false ? 1: 0,
        mouse: mouse === false ? 1: 0,
        bag : computerPackage === false ? 1: 0,
        others: others,
        devicesUse: devicesUse
    };
    ajax.get({
        url: '/admin/device/add_allot.do',
        param: {
            userid: urler.normal().id,
            json: JSON.stringify(json)
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '添加数据',
                    ctn: '添加数据成功',
                    event: function() {
                        location.href = '/#proj_name#/html/asset/office-computer.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '添加数据',
                    ctn: data.message !== '' ? data.message : '添加失败'
                });
            }
        }
    });
});
