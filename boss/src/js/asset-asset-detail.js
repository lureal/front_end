/*!
 * 记录详情
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var auth = require('./modules/auth.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var urler = require('./modules/urler.js');
var upload = require('./modules/upload.js');

// 初始化导航
auth.noToolbar({
    title: '记录详情'
});

// 获取记录数据
ajax.get({
    url: '/admin/asset/detail.do',
    param: {
        id: urler.normal().id
    },
    cb: function(data) {
        $('#name').val(data.data.asset.name);
        $('#count').val(data.data.asset.cnt);
        $('#price').val(data.data.asset.price);
        $('#memo').val(data.data.asset.memo);

        // 后端返回接口有问题
        select2.init({
            url: '/admin/asset/asset_grade_option.do',
            title: '物品级别',
            cb: function(_data) {
                var tpl = $('#type-tpl').html();
                $('#grade').html(_.template(tpl)(_data));
                $('#grade').select2({
                    placeholder: '选择物品级别'
                }).select2('val', data.data.asset.gradeId);
            }
        });

        // 渲染上传图片模板
        $('#pic').html(_.template($('#file-tpl').html())({
            action: '/admin/common/upload.do',
            title: '图片（点击图片查看详情）',
            name: 'dataFile'
        }));

        upload.image($('#pic'), modal, '图片', function(data) {

            // 渲染图片和链接
            $('#pic .snapshats-link').attr('href', data.data.dlUrl);
            $('#pic .snapshats-preview').attr('src', data.data.dlUrl);

            // 绑定数据
            $('#pic .file-submit')
                .attr('data-url', data.data.dlUrl)
                .html('附件已上传！');
        });

        $('.snapshats-link', '#pic').attr('href', data.data.asset.image);
        $('.snapshats-preview', '#pic').attr('src', data.data.asset.image);
        $('.file-submit', '#pic')
            .attr('data-url', data.data.asset.image)
            .html('图片已上传')
    }
});

// 更新数据
$('#submit').click(function() {
    $("#submit").attr("disabled", true);
    var name = $('#name').val();
    var count = $('#count').val();
    var price = $('#price').val();
    var memo = $('#memo').val();
    var gradeId = select2.getVal({
        id: '#grade'
    });

    // 获取上传图片
    var cardPic = $('.file-submit', $('#pic')).attr('data-url');

    if(name === '' || Number(count) < 1 || Number(price) < 1) {
        modal.nobtn({
            ctx: 'body',
            title: '记录详情',
            ctn: '请确保输入物品名称，数量和单价，数量和单价必须大于0'
        });
        return;
    }

    ajax.get({
        url: '/admin/asset/update.do',
        param: {
            id: urler.normal().id,
            name: name,
            price: price,
            cnt: count,
            gradeId: gradeId,
            image: cardPic,
            memo: memo
        },
        cb: function(data) {
            $("#submit").attr("disabled", false);
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '记录详情',
                    ctn: '更新记录成功',
                    event: function() {
                        location.href = '/#proj_name#/html/asset/exist-asset.html';
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '记录详情',
                    ctn: data.message
                });
            }
        }
    });
});
