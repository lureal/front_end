/*!
 * 添加数据
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
    title: '添加数据'
});

// 初始化区域选择(接口应该跟图书馆的接口是一个)
select2.init({
    url: '/admin/book/book_place_option.do',
    title: '办公区域',
    cb: function(data) {
        var tpl = $('#area-tpl').html();
        $('#area').html(_.template(tpl)(data));
        $('#area').select2({
            placeholder: '选择办公区域'
        }).select2('val', '');
    }
});

// 添加数据
$('#add').click(function() {
    $("#add").attr("disabled", true);

    // 获取办公区域
    var area = select2.getVal({
        id: '#area'
    });

    // 获取编号
    var number = $('#computer-number').val();

    // 获取品牌
    var trademark = $('#brand').val();

    // 获取型号
    var model = $('#computer-type').val();

    // 获取备注
    var remark = $('#memo').val();

    // 数据判定
    if(number === '' || trademark === '' || number ==='' || area === null) {
        modal.nobtn({
            ctx: 'body',
            title: '添加数据',
            ctn: '请确保选择数据类型和输入数据名称'
        });
        return;
    }

    // 提交数据
    ajax.post({
        url: '/admin/device/add_computer.do',
        param: {
            number: number,
            trademark: trademark,
            model: model,
            area: area,
            remark: remark
        },
        cb: function(data) {
             $("#add").attr("disabled", false);
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
                    ctn: data.message !== null ? data.message : '添加失败'
                });
            }
        }
    });
});

// 详情页面
if(urler.normal().id) {

    // // 将所有输入框设为不可输入
    // $('input').attr('disabled', 'disabled');
    // $('select').attr('disabled', 'disabled');

    // 隐藏新增按钮，变为修改按钮
    $('.computer-detail').removeClass('z-hidden');
    $('.computer-add').addClass('z-hidden');
    $('.modify').removeClass('z-hidden');
    $('.add').addClass('z-hidden')

    ajax.get({
        url: '/admin/device/detail_computer.do',
        param: {
            id: urler.normal().id
        },
        cb: function(data) {

            // 渲染数据
            // 电脑编号
            $('#computer-number').val(data.data.computer.number);

            // 品牌
            $('#brand').val(data.data.computer.trademark);

            // 电脑型号
            $('#computer-type').val(data.data.computer.model);

            //
            select2.init({
                url: '/admin/book/book_place_option.do',
                title: '办公区域',
                cb: function(_data) {
                    var tpl = $('#area-tpl').html();
                    $('#area').html(_.template(tpl)(_data));
                    $('#area').select2({
                        placeholder: '选择办公区域'
                    }).select2('val', data.data.computer.area);
                }
            });

            // 备注
            $('#memo').val(data.data.computer.remark);
        }
    });

    // 修改提交
    $('body').on('click', '#modify', function() {
         $("#modify").attr("disabled", true);

        // 获取办公区域
        var area = select2.getVal({
            id: '#area'
        });

        // 获取编号
        var number = $('#computer-number').val();

        // 获取品牌
        var trademark = $('#brand').val();

        // 获取型号
        var model = $('#computer-type').val();

        // 获取备注
        var remark = $('#memo').val();

        // 数据判定
        if(number === '' || trademark === '' || number ==='' || area === null) {
            modal.nobtn({
                ctx: 'body',
                title: '添加数据',
                ctn: '请确保选择数据类型和输入数据名称'
            });
            return;
        }

        // 提交数据
        ajax.post({
            url: '/admin/device/update_computer.do',
            param: {
                number: number,
                trademark: trademark,
                model: model,
                area: area,
                remark: remark
            },
            cb: function(data) {
                $("#modify").attr("disabled", false);
                if(data.data === true) {
                    modal.onebtn({
                        ctx: 'body',
                        title: '更新数据',
                        ctn: '更新数据成功',
                        event: function() {
                            location.href = '/#proj_name#/html/asset/office-computer.html';
                        }
                    });
                } else {
                    modal.nobtn({
                        ctx: 'body',
                        title: '更新数据',
                        ctn: data.message !== null ? data.message : '更新失败'
                    });
                }
            }
        });
    });
}