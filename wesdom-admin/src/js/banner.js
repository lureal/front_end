/*!
 * Banner
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var upload = require('./modules/upload');

// 获取Banner数据
ajax.get({
    url: '/admin/brand/list_banner.do',
    cb: function(data) {

        // 渲染模板
        var tpl = $('#tpl').html();
        $('#banner').html(_.template(_.template(tpl)({data})));

        // 渲染添加图片模板
        var bannertpl = $('#snapshots-tpl').html();

        for(var i = 1; i <= 3; i++) {
            $('#banner' + i + '-type').select2()

            // 背景图
            $('.banner' + i + '-bg-snapshats').html(_.template(bannertpl)({
                action: '/admin/customer/upload.do',
                title: '背景图（尺寸：1920*1080像素）',
                name: 'iconFile',
                icon: data.data[i] ? data.data[i].background : '/#proj_name#/img/none.png'
            }));

            // 中心图
            $('.banner' + i + '-snapshats').html(_.template(bannertpl)({
                action: '/admin/customer/upload.do',
                title: '中心图',
                name: 'iconFile',
                icon: data.data[i] ? data.data[i].image : '/#proj_name#/img/none.png'
            }));

            upload($('.banner' + i + '-bg-snapshats'), modal, 'Banner');
            upload($('.banner' + i + '-snapshats'), modal, 'Banner');
        }

        // 填充数据
        _.each(data.data, function(val, index) {

            // 更改类型为图片
            if(val.type === 1) {
                $('.banner-wrap')
                    .eq(index)
                    .find('.select2')
                    .select2()
                    .select2('val', '1');

                $('.banner-wrap').eq(index).find('.link').val(val.link[0]);
                $('.banner-wrap').eq(index).find('.description').val(val.description);

            // 更改类型为视频
            } else {
                $('.banner-wrap')
                    .eq(index)
                    .find('.select2')
                    .select2()
                    .select2('val', '2');

                $('.banner-wrap').eq(index).find('.video-link').val(val.link[0]);
                $('.banner-wrap').eq(index).find('.video-link-mb').val(val.link[1]);
                $('.banner-wrap').eq(index).find('.description').val(val.description);
            }

            $('.banner-wrap').eq(index).find('.description').val(val.description);
            $('.banner-wrap').eq(index).find('.image-width').val(val.imageWidth);
            $('.banner-wrap').eq(index).find('.image-height').val(val.imageHeight);
            $('.banner-wrap').eq(index)
                .find('.bg-snapshats-wrap .snapshats-preview')
                .attr('src', val.background);
            $('.banner-wrap').eq(index)
                .find('.bg-snapshats-wrap .snapshats-submit')
                .attr('data-img', val.background)
                .html('重新上传图片');
            $('.banner-wrap').eq(index)
                .find('.snapshats-wrap .snapshats-preview')
                .attr('src', val.image);
            $('.banner-wrap').eq(index)
                .find('.snapshats-wrap .snapshats-submit')
                .attr('data-img', val.image)
                .html('重新上传图片');

        });
    },
    modal: modal,
    title: 'Banner'
});

// 提交更新
$('#submit').click(function() {
    var banner = [];

    // 获取数据
    $('.banner-wrap').each(function() {
        var type = $('.select2', $(this)).select2('val');
        var link = $('.link', $(this)).val();
        var bgImg = $('.bg-snapshats-wrap .snapshats-submit', $(this)).attr('data-img');
        var img = $('.snapshats-wrap .snapshats-submit', $(this)).attr('data-img');
        var videoLink = $('.video-link', $(this)).val();
        var videoLinkMb = $('.video-link-mb', $(this)).val();
        var desc = $('.description', $(this)).val();
        var imageWidth = Number($('.image-width', $(this)).val());
        var imageHeight = Number($('.image-height', $(this)).val());

        // 图片
        if(type === '1') {
            if(bgImg !== '' && img !== '' && desc !== '' && imageWidth > 0 && imageHeight > 0) {
                if(link === '') {
                    link = 'javascript:void(0);';
                }

                banner.push({
                    type: type,
                    background: bgImg,
                    image: img,
                    link: JSON.stringify([link]),
                    description: desc,
                    imageWidth: imageWidth,
                    imageHeight: imageHeight
                });
            }

        // 视频
        } else {
            if(videoLink !== '' && videoLinkMb !== '' && bgImg !== '' && img !== '' && desc !== '' && imageWidth > 0 && imageHeight > 0) {
                banner.push({
                    type: type,
                    background: bgImg,
                    image: img,
                    link: JSON.stringify([videoLink, videoLinkMb]),
                    description: desc,
                    imageWidth: imageWidth,
                    imageHeight: imageHeight
                });
            }
        }
    });

    if(banner.length === 0) {
        modal.nobtn({
            ctx: 'body',
            title: 'Banner',
            ctn: '请确保至少完整输入一个 banner 所需的数据，并确保中心图宽高大于0'
        });

        return;
    }

    ajax.get({
        url: '/admin/brand/add_banner.do',
        param: {
            json: JSON.stringify(banner)
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: 'Banner',
                    ctn: '更新 Banner 成功',
                    event: function() {
                        location.reload();
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: 'Banner',
                    ctn: data.message
                });
            }
        },
        modal: modal,
        title: 'Banner'
    });
});


//检测图片大小
// function checkImage(img){
//     var file = img.value;
//     if(!/.(gif|jpg|jpeg|png|GIF|JPG|png)$/.test(file)){
//         alert('请上传.gif,jpeg,jpg,png中的一种的图片');
//         return false;
//     } else {
//         var image = new Image();
//         image.src = file;
//         var heght = image.height;
//         var width = image.width;
//         alert(height+"x.."+filesize);
//             if(width>80 && height>80 && filesize>102400){
//             alert('请上传80*80像素 或者大小小于100k的图片');
//             return false;
//             }
//         }
//         alert("图片通过");
// }

// function checkImage1(img, width ,height){
//     var file = img.value;
//     if(!/.(gif|jpg|jpeg|png|GIF|JPG|png)$/.test(file)){
//         alert('请上传.gif,jpeg,jpg,png中的一种的图片');
//         return false;
//     } else {
//         var image = new Image();
//         image.src = file;
//         var imageHeight = image.height;
//         var imageWidth = image.width;
//         if(imageHeight != width || imageWidth != height) {
//             alert('请上传width':+ width +',height'+ height + '的像素');
//             return false;
//         }
//         else {
//             alert('图片通过')
//         }
//     }

// }
// checkImage1(img1, 200 ,400);
