/*!
 * 添加换量合作方页面
 */

/**
 * 当前页面主函数，暴露出当前页面的代码
 * @param  {Object} ajax [包装过后的 ajax 对象]
 * @param {Object} modal [包装过后的弹窗对象]
 * @param {Object} storage [包装过后的数据存储对象]
 */
var streamParnerAdd = function(ajax, modal, storage) {

	$('.select2').select2();
    $('#stream-parner-add-time').daterangepicker();

    // 添加换量合作方图片
    $('#stream-parner-add').on('click', '#stream-parner-add-image', function(e) {
        e.preventDefault();

        var img = $('#stream-parner-img_input').val();

        // 用户没有选择图片
        if(img === '') {
            modal.nobtn({
                ctx: '#stream-parner-add',
                title: '添加换量合作方',
                ctn: '请选择上传图片'
            });
            return;
        }

        // 执行表单提交
        $('#stream-parner-img_form').submit();
        $('#stream-parner-add-image').html('<i class="fa fa-refresh fa-spin"></i>');
    });

    // 处理上传后的回调数据
    $('#stream-parner-img_form').ajaxForm(function(data) {
        data = JSON.parse(data);
        console.log(data);

        // 上传成功
        if(data.code === 200) {
			$('#stream-parner-add-image-preview').attr('src', data.data);
            $('#stream-parner-add-image')
                .attr('data-img', data.data)
                .html('图片上传成功，点击重新上传');
        } else {
            $('#stream-parner-add-image').html('上传图片');
            modal.nobtn({
                ctx: '#stream-parner-add',
                title: '添加换量合作方',
                ctn: '上传图片失败'
            });
        }
    });

    // 添加换量合作方
    $('#stream-parner-add').on('click', '#stream-parner-add-submit', function() {
        var productName = $.trim($('#stream-parner-add-name').val());
        var platform = $.trim($('#stream-parner-add-platform').val());
        var productStage = $.trim($('#stream-parner-add-stage').val());
        var productType = $.trim($('#stream-parner-add-type').val());
        var contact = $.trim($('#stream-parner-add-contact').val());
        var link = $.trim($('#stream-parner-add-link').val());
        var content = $.trim($('#stream-parner-add-content').val());
        var img = $.trim($('#stream-parner-add-image').attr('data-img'));

        // 用户没有输入作者名称
        if(productName === '' ||
           platform === '' ||
           productStage === '' ||
           productType === '' ||
           contact === '' ||
           link === '' ||
           img === '' ||
           content === '') {
            modal.nobtn({
                ctx: '#stream-parner-add',
                title: '添加换量合作方',
                ctn: '请输入产品名称、平台、产品类型、联系方式、跳转链接、内容，图片'
            });
            return;
        }

		if(productName.length > 25 ||
		   platform.length > 25 ||
		   productStage.length > 25 ||
	   	   productType.length > 25 ||
	       content.length > 25) {
			   modal.nobtn({
				   ctx: '#stream-parner-add',
				   title: '添加换量合作方',
				   ctn: '产品名称，平台，产品阶段，产品类型，内容字数不能超过 25 个字'
			   })

			   return;
		   }

        ajax.post({
            url: '/admin/streampartner/add.do',
            param: {
				productName: productName,
				platform: platform,
				productStage: productStage,
				productType: productType,
				content: content,
				contact: contact,
				link: link,
                icon: img
            },
            cb: function(data) {
                if(data.data === true) {
                    modal.onebtn({
                        ctx: '#stream-parner-add',
                        title: '添加换量合作方',
                        ctn: '添加成功',
                        event: function() {
                            location.href = '/#proj_name#/html/stream-parner/list.html';
                        }
                    });
                } else {
                    modal.nobtn({
                        ctx: '#stream-parner-add',
                        title: '添加换量合作方',
                        ctn: '添加失败'
                    });
                }
            },
            modal: modal,
            title: '添加换量合作方',
            ctx: '#stream-parner-add'
        })
    });

    // 取消
    $('#stream-parner-add').on('click', '#stream-parner-add-canel', function() {
        history.back();
    });
};

module.exports = streamParnerAdd;
