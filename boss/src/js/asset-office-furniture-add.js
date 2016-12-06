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
var upload = require('./modules/upload.js');


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


// 添加数据
$('#commit').click(function() {
    $("#commit").attr("disabled", true);

    // 获取办公区域
    var area = select2.getVal({
        id: '#area'
    });

    // 获取数量
    var count = $('#number').val();

    // 获取家具名称
    var name = $('#name').val();

    // 获取上传图片
    var cardPic = $('.file-submit', $('#pic')).attr('data-url');
    console.log(cardPic);

    // 获取备注
    var remark = $('#remark').val();

    if(count === '' || name === '' ||  area === null) {
        modal.nobtn({
            ctx: 'body',
            title: '添加数据',
            ctn: '请确保输入数量、家具名称、办公区域'
        });
        return;
    }

    // 提交数据
    ajax.post({
        url: '/admin/furniture/add.do',
        param: {
            name: name,
            count: count,
            img: cardPic,
            area: area,
            remark: remark
        },
        cb: function(data) {
            $("#commit").attr("disabled", false);
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '添加数据',
                    ctn: '添加数据成功',
                    event: function() {
                        location.href = '/#proj_name#/html/asset/office-furniture.html';
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

// 如果id不为空，那么就为详情页面
if(urler.normal().id) {
    $('.submit').addClass('z-hidden');
    $('.commit').removeClass('z-hidden');

    // 发情请求
    ajax.get({
        url: '/admin/furniture/detail.do',
        param: {
            id: urler.normal().id
        },
        cb: function(data) {

            // 渲染数据
            $('#name').val(data.data.furniture.name);
            $('#number').val(data.data.furniture.amount);

            // 后端返回接口有问题
            select2.init({
                url: '/admin/book/book_place_option.do',
                title: '办公区域',
                cb: function(_data) {
                    var tpl = $('#area-tpl').html();
                    $('#area').html(_.template(tpl)(_data));
                    $('#area').select2({
                        placeholder: '选择办公区域'
                    }).select2('val', data.data.furniture.area);
                }
            });


            $('.snapshats-link', '#pic').attr('href', data.data.furniture.img);
            $('.snapshats-preview', '#pic').attr('src', data.data.furniture.img);
            $('.file-submit', '#pic')
                .attr('data-url', data.data.furniture.img)
                .html('图片已上传')

            $('#remark').val(data.data.furniture.remark);
        }
    })

    // 点击更新按钮
    $('#commit').on('click', function() {
        $("#commit").attr("disabled", true);

        // 获取办公区域
        var area = select2.getVal({
            id: '#area'
        });

        // 获取数量
        var count = $('#number').val();

        // 获取家具名称
        var name = $('#name').val();

        var cardPic = $('.file-submit', $('#pic')).attr('data-url');

        // 获取备注
        var remark = $('#remark').val();

        if(count === '' || name === '' ||  area === null) {
            modal.nobtn({
                ctx: 'body',
                title: '添加数据',
                ctn: '请确保输入数量、家具名称、办公区域'
            });
            return;
        }

        // 提交数据
        ajax.post({
            url: ' /admin/furniture/update.do',
            param: {
                name: name,
                count: count,
                img: cardPic,
                area: area,
                remark: remark
            },
            cb: function(data) {
                $("#commit").attr("disabled", false);
                if(data.data === true) {
                    modal.onebtn({
                        ctx: 'body',
                        title: '添加数据',
                        ctn: '添加数据成功',
                        event: function() {
                            location.href = '/#proj_name#/html/asset/office-furniture.html';
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
    })
}