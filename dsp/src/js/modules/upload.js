/*!
 * 上传模块
 */

/**
 * 上传图片
 * @param {jQuery} context [上下作用域]
 */
function uploadImage(context, modal, title) {

    // 提交图片
    $('.snapshats-submit', context).click(function(e) {
        e.preventDefault();
        var img = $('.snapshats-input', context).val();

        if(img === '') {
            modal.nobtn({
                ctx: 'body',
                title: title,
                ctn: '请选择上传图片'
            });
            return;
        }

        $('.snapshats-form', context).submit();
        $('.snapshats-submit', context).html('<i class="fa fa-refresh fa-spin"></i>');
    });

    // 处理上传后的回调数据
    $('.snapshats-form', context).ajaxForm(function(data) {
        data = JSON.parse(data);
        console.log(data);
        console.log('-----');
        console.log(context);
        console.log('------');
        if(data.code === 200) {
            $('.snapshats-preview', context).attr('src', data.data);
            $('.snapshats-submit', context)
                .attr('data-img', data.data)
                .html('图片上传成功，点击重新上传');
        } else {
            $('.snapshats-submit', context).html('上传图片');
            modal.nobtn({
                ctx: 'body',
                title: title,
                ctn: '上传图片失败'
            })
        }

    });
}

/**
 * 上传文件
 * @param {jQuery} context [上下作用域]
 */
function uploadFile(context, modal, title, cb) {
    var isUploadPic = false;
    // 文件
    // $('.file-submit', context).click(function(e) {
    //     e.preventDefault();
    //     var img = $('.file-input', context).val();

    //     if(img === '') {
    //         modal.nobtn({
    //             ctx: 'body',
    //             title: title,
    //             ctn: '请选择上传文件'
    //         });
    //         return;
    //     }

    //     $('.file-form', context).submit();
    // });

    // 更改成自动上传方式, 并判断上传的是否是图片
    $('.file-input', context).change(function(e) {
        var img = $('.file-input', context).val();
        if(img !== '') {
            $('.file-form', context).submit();
        };
        modal.nobtn({
            ctx: 'body',
            title: title,
            backdrop: 'static',
   　　     keyboard: false,
            show: true,
            ctn: '文件正在上传，请稍等'
        });
    });
    // 删除图片
    $('.file-del', context).click(function(e) {
        e.preventDefault();
        $(this).parents('.snapshats').remove();
    });

    // 处理上传后的回调数据
    $('.file-form', context).ajaxForm(function(data) {
        data = JSON.parse(data);
        console.log(data);
        if(data.code === 200) {
            modal.nobtn({
                ctx: 'body',
                title: title,
                backdrop: 'static',
                show: true,
                keyboard: false,
                ctn: '上传文件成功'
            });
            cb(data);
        } else {
            modal.nobtn({
                ctx: 'body',
                title: title,
                ctn: data.message
            })
        }
    });
};

/**
 * 上传文件
 * @param {jQuery} context [上下作用域]
 */
function uploadNineFile(context, modal, title, cb) {
    var isUploadPic = false;
    // 文件
    $('.file-submit', context).click(function(e) {
        e.preventDefault();
        var img = $('.file-input', context).val();

        if(img === '') {
            modal.nobtn({
                ctx: 'body',
                title: title,
                ctn: '请选择上传文件'
            });
            return;
        }

        $('.file-form', context).submit();
    });

    // 更改成自动上传方式, 并判断上传的是否是图片
   //  $('.file-input', context).change(function(e) {
   //      var img = $('.file-input', context).val();
   //      if(img !== '') {
   //          $('.file-form', context).submit();
   //      };
   //      modal.nobtn({
   //          ctx: 'body',
   //          title: title,
   //          backdrop: 'static',
   // 　　     keyboard: false,
   //          show: true,
   //          ctn: '文件正在上传，请稍等'
   //      });
   //  });
   //  // 删除图片
    $('.file-del', context).click(function(e) {
        e.preventDefault();
        $(this).parents('.snapshats').remove();
    });

    // 处理上传后的回调数据
    $('.file-form', context).ajaxForm(function(data) {
        data = JSON.parse(data);
        console.log(data);
        if(data.code === 200) {
            modal.nobtn({
                ctx: 'body',
                title: title,
                backdrop: 'static',
                show: true,
                keyboard: false,
                ctn: '上传文件成功'
            });
            cb(data);
        } else {
            modal.nobtn({
                ctx: 'body',
                title: title,
                ctn: data.message
            })
        }
    });
};

/**
 * 上传视频文件
 * @param {jQuery} context [上下作用域]
 */
function uploadVideoFile(context, modal, title, cb) {
    var isUploadVideo;

    // 更改成自动上传方式, 并判断上传的是否是图片
    $('.file-input', context).change(function(e) {
        var img = $('.file-input', context).val();
        if(img !== '') {
            $('.file-form', context).submit();
        };
        var pattern = /\w+(.mp4)$/;
        if(!pattern.exec(img)) {
            isUploadVideo = true;
            modal.nobtn({
                ctx: 'body',
                title: title,
                ctn: '请上传正确的视频文件'
            });
            return false;
        } else {
            isUploadVideo = false;
            modal.nobtn({
                ctx: 'body',
                title: title,
                backdrop: 'static',
       　　     keyboard: false,
                show: true,
                ctn: '文件正在上传，请稍等'
            });
        }
    });

    // 处理上传后的回调数据
    $('.file-form', context).ajaxForm(function(data) {
        data = JSON.parse(data);
        console.log(data);
        if(isUploadVideo === false) {
            if(data.code === 200) {
                modal.nobtn({
                    ctx: 'body',
                    title: title,
                    backdrop: 'static',
                    show: true,
                    keyboard: false,
                    ctn: '上传文件成功'
                });
                cb(data);
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: title,
                    ctn: data.message
                })
            }
        }
    });
};

/**
 * 上传图片
 */
function uploadImg(context, modal, title, width, height, cb ) {
    var isUploadPic;
    var isCheckPic;

    // 更改成自动上传方式, 并判断上传的是否是图片
    $('.file-input', context).change(function(e) {
        // var img = $('.file-input', context).val();
        var img = $(this).get(0).files;
        console.log(img);
        var URL = window.URL || window.webkitURL;
        if(img && img.length) {
            for(var i = 0, len = img.length; i < len; i++) {
                var image = new Image();
                imgUrl =  URL.createObjectURL(img[i]);
                image.onload = function(){
                    var imageWidth = image.width;
                    var imageHeight = image.height;
                    var fileSize = image.fileSize;
                    console.log(fileSize);
                    console.log(imageHeight);
                    console.log(imageWidth);
                    URL.revokeObjectURL(imgUrl); // 判断图片大小是否符合规则的前面
                    if(imageWidth !== width || imageHeight !== height ) {
                        isCheckPic = true;
                        modal.nobtn({
                            ctx: 'body',
                            title: title,
                            ctn: '上传的图片不符合标准'
                        });
                        return false;
                    } else {
                        isCheckPic = false;
                    }
                };
                image.src = imgUrl;
            } 
        }
        
        if(img !== '') {
            $('.file-form', context).submit();
        };
        var rightFileType = {'jpg': 1, 'png': 1 };
        var fileType = $(this).val().substring($(this).val().lastIndexOf('.' ) + 1);
        if(!rightFileType[fileType]) {
            isUploadPic = true;
            modal.nobtn({
                ctx: 'body',
                title: title,
                ctn: '上传的图片类型错误'
            });  
            return false;
        } else {
            isUploadPic = false;
            modal.nobtn({
                ctx: 'body',
                title: title,
                ctn: '文件正在上传,请稍等',
            });
        }
    });

    // 处理上传后的回调数据
    $('.file-form', context).ajaxForm(function(data) {
        console.log(data);
        data = JSON.parse(data);
        if(isUploadPic === false && isCheckPic === false) {
            if(data.code === 200) {
                modal.nobtn({
                    ctx: 'body',
                    title: title,
                    ctn: '上传文件成功'
                });
                cb(data);
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: title,
                    ctn: '上传文件失败'
                })
            }
        }
    });
};

module.exports = {
    img: uploadImage,
    file: uploadFile,
    videofile: uploadVideoFile,
    ninefile: uploadNineFile,
    image: uploadImg
};
