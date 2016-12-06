/*!
 * 作者详情页面
 */

/**
 * 当前页面主函数，暴露出当前页面的代码
 * @param  {Object} ajax [包装过后的 ajax 对象]
 * @param {Object} modal [包装过后的弹窗对象]
 * @param {Object} storage [包装过后的数据存储对象]
 */
var authorDetail = function(ajax, modal, storage) {

    // 根据存储在 sessionStorage 中的数据渲染界面
    var data = JSON.parse(storage.getSession('author-list_author'));
    console.log(data);

    // 绑定数据
    $('#author-detail-name').val(data.name);
    $('#author-detail-description').val(data.description);
    $('#author-detail-submit').attr('data-id', data.id);
    $('#author-detail-submit').attr('data-img', data.icon);
    $('#author-preview').attr('src', data.icon);
    $('#toptime').val(data.toptime);
    if(data.isSpe === 0) {
        $('input[name="specified-author"]:eq(0)').attr('checked', 'checked');
    } else {
        $('input[name="specified-author"]:eq(1)').attr('checked', 'checked');
    }


    // 作者详情图片
    $('#author-detail').on('click', '#author-detail-image', function(e) {
        e.preventDefault();

        var img = $('#img_input').val();

        // 用户没有选择图片
        if(img === '') {
            modal.nobtn({
                ctx: '#author-detail',
                title: '作者详情',
                ctn: '请选择上传图片'
            });
            return;
        }

        // 执行表单提交
        $('#img_form').submit();
        $('#author-detail-image').html('<i class="fa fa-refresh fa-spin"></i>');
    });

    // 处理上传后的回调数据
    $('#img_form').ajaxForm(function(data) {
        data = JSON.parse(data);
        console.log(data);

        // 上传成功
        if(data.code === 200) {
            $('#author-preview').attr('src', data.data);
            $('#author-detail-submit').attr('data-img', data.data);
            $('#author-detail-image').html('图片上传成功，点击重新上传');
        } else {
            $('#author-detail-image').html('上传图片');
            modal.nobtn({
                ctx: '#author-detail',
                title: '作者详情',
                ctn: '上传图片失败'
            });
        }
    });

    // 更新作者
    $('#author-detail').on('click', '#author-detail-submit', function() {
        var id = $(this).attr('data-id');
        var name = $.trim($('#author-detail-name').val());
        var description = $.trim($('#author-detail-description').val());
        var icon = $(this).attr('data-img');
        var isSpe = $('input[name="specified-author"]:checked').val();
        console.log(isSpe);

        // 用户没有输入作者名称
        if(name === '' || icon === '') {
            modal.nobtn({
                ctx: '#author-detail',
                title: '更新作者',
                ctn: '请输入作者名称，描述和上传作者头像'
            });
            return;
        }

        ajax.post({
            url: '/admin/author/update.do',
            param: {
                id: id,
                icon: icon,
                name: name,
                description: description,
                isSpe: isSpe === 'true' ? 0 : 1
            },
            cb: function(data) {
                if(data.data === true) {
                    modal.onebtn({
                        ctx: '#author-detail',
                        title: '更新作者',
                        ctn: '更新成功',
                        event: function() {
                            location.href = '/#proj_name#/html/author/list.html';
                        }
                    });
                } else {
                    modal.nobtn({
                        ctx: '#author-detail',
                        title: '更新作者',
                        ctn: '更新失败'
                    });
                }
            },
            modal: modal,
            title: '更新作者',
            ctx: '#author-detail'
        })

    });

    // 返回
    $('#author-detail').on('click', '#author-detail-canel', function() {
        history.back();
    });
};

module.exports = authorDetail;
