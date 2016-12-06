/*!
 * 添加作者页面
 */

/**
 * 当前页面主函数，暴露出当前页面的代码
 * @param  {Object} ajax [包装过后的 ajax 对象]
 * @param {Object} modal [包装过后的弹窗对象]
 */
var authorAdd = function(ajax, modal) {

    // 添加作者图片
    $('#author-add').on('click', '#author-add-image', function(e) {
        e.preventDefault();
        var img = $('#img_input').val();

        // 用户没有选择图片
        if(img === '') {
            modal.nobtn({
                ctx: '#author-add',
                title: '添加作者',
                ctn: '请选择上传图片'
            });
            return;
        }

        // 执行表单提交
        $('#img_form').submit();
        $('#author-add-image').html('<i class="fa fa-refresh fa-spin"></i>');
    });

    // 处理上传后的回调数据
    $('#img_form').ajaxForm(function(data) {
        data = JSON.parse(data);
        console.log(data);

        // 上传成功
        if(data.code === 200) {
            $('#author-preview').attr('src', data.data);
            $('#author-add-submit').attr('data-img', data.data);
            $('#author-add-image').html('图片上传成功，点击重新上传');
        } else {
            $('#author-add-image').html('上传图片');
            modal.nobtn({
                ctx: '#author-add',
                title: '添加作者',
                ctn: '上传图片失败'
            });
        }
    });

    // 添加作者
    $('#author-add').on('click', '#author-add-submit', function() {
        var name = $.trim($('#author-add-name').val());
        var description = $.trim($('#author-add-description').val());
        var icon = $(this).attr('data-img');
        var isSpe = $('input[name="specified-author"]:checked').val();
        console.log(isSpe);

        // 用户没有输入作者名称
        if(name === '' || icon === '' || description === '') {
            modal.nobtn({
                ctx: '#author-add',
                title: '添加作者',
                ctn: '请输入作者名称，描述和上传作者头像'
            });
            return;
        }

        ajax.post({
            url: '/admin/author/add.do',
            param: {
                icon: icon,
                name: name,
                isSpe: isSpe === 'true' ? 0 : 1,
                description: description
            },
            cb: function(data) {
                if(data.data === true) {
                    modal.onebtn({
                        ctx: '#author-add',
                        title: '添加作者',
                        ctn: '添加成功',
                        event: function() {
                            location.href = '/#proj_name#/html/author/list.html';
                        }
                    });
                } else {
                    modal.nobtn({
                        ctx: '#author-add',
                        title: '添加作者',
                        ctn: '添加失败'
                    });
                }
            },
            modal: modal,
            title: '添加作者',
            ctx: '#author-add'
        })
    });

    // 取消
    $('#author-add').on('click', '#author-add-canel', function() {
        history.back();
    });
};

module.exports = authorAdd;
