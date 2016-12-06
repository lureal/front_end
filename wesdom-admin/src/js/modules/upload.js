/*!
 * 上传图片
 */

/**
 * @param {jQuery} context [上下作用域]
 */
function upload(context, modal, title) {

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

module.exports = upload;
