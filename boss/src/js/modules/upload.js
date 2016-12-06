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
 * @param {Object} modal [弹窗]
 * @param {String} title [标题]
 * @param {Function} cb [回调函数]
 * @param {Boolean} checker [其他校验规则]
 */
function uploadFile(context, modal, title, cb) {

    // 文件
    $('.file-submit', context).click(function(e) {
        e.preventDefault();
        var img = $('.file-input', context).val();
        // var isPass = checker();
        console.log(img);
        if(img === '') {
            modal.nobtn({
                ctx: 'body',
                title: title,
                ctn: '请选择上传文件'
            });
            return;
        }

        // if(isPass === false) {
        //     return;
        // };
        // 将导入按钮灰显
        $('.file-submit').removeClass('btn-primary').addClass('btn-default');
        
        $('.file-form', context).submit();
        
        // 将导入按钮设为不可点击
        $('.file-submit').attr('disabled', true);
    });

    // 处理上传后的回调数据
    $('.file-form', context).ajaxForm(function(data) {
        data = JSON.parse(data);
        console.log(data);

        if(data.code === 200 ) {
            
            // 将导入按钮设为可点击
            $('.file-submit').attr('disabled', false);

            // 数据返回成功，导入按钮变为蓝色
            $('.file-submit').removeClass('btn-default').addClass('btn-primary');

            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: title,
                    ctn: '导入成功',
                    event: cb
                });
                
                
                
            } else if(data.data === false && data.message === ''){
                modal.nobtn({
                    ctx: 'body',
                    title: title,
                    ctn: '导入失败'
                });

            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: title,
                    ctn: data.message
                });
            }
            

            
        } else {
            modal.nobtn({
                ctx: 'body',
                title: title,
                ctn: '导入失败'
            })
        }

    });
}


/**
 * 上传图片
 */
function uploadImg(context, modal, title, cb ) {
    var isUploadPic = false;
    
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
module.exports = {
    img: uploadImage,
    file: uploadFile,
    image: uploadImg
};
