/*!
 * 换量合作方详情页面
 */

/**
 * 当前页面主函数，暴露出当前页面的代码
 * @param  {Object} ajax [包装过后的 ajax 对象]
 * @param {Object} modal [包装过后的弹窗对象]
 * @param {Object} storage [包装过后的数据存储对象]
 */
var streamParnerDetail = function(ajax, modal, storage) {

    // 添加换量合作方图片
    $('#stream-parner-detail').on('click', '#stream-parner-detail-image', function(e) {
        e.preventDefault();

        var img = $('#stream-parner-img_input').val();

        // 用户没有选择图片
        if(img === '') {
            modal.nobtn({
                ctx: '#stream-parner-detail',
                title: '添加换量合作方',
                ctn: '请选择上传图片'
            });
            return;
        }

        // 执行表单提交
        $('#stream-parner-img_form').submit();
        $('#stream-parner-detail-image').html('<i class="fa fa-refresh fa-spin"></i>');
    });

    // 处理上传后的回调数据
    $('#stream-parner-img_form').ajaxForm(function(data) {
        data = JSON.parse(data);
        console.log(data);

        // 上传成功
        if(data.code === 200) {
			$('#stream-parner-detail-image-preview').attr('src', data.data);
            $('#stream-parner-detail-image')
                .attr('data-img', data.data)
                .html('图片上传成功，点击重新上传');
        } else {
            $('#stream-parner-detail-image').html('上传图片');
            modal.nobtn({
                ctx: '#stream-parner-detail',
                title: '添加换量合作方',
                ctn: '上传图片失败'
            });
        }
    });

    // 获取存储在 sessionStorage 中的数据
    var streamPartnerListData = JSON.parse(storage.getSession('stream-parner-list_parner'));
    console.log('传递过来的数据');
    console.log(streamPartnerListData);

    // 填充数据
    $('#stream-parner-detail-name').val(streamPartnerListData.productName);
    $('#stream-parner-detail-platform').val(streamPartnerListData.platform);
    $('#stream-parner-detail-type').val(streamPartnerListData.productType);
    $('#stream-parner-detail-productStage').val(streamPartnerListData.productStage);
    $('#stream-parner-detail-contact').val(streamPartnerListData.contact);
    $('#stream-parner-detail-link').val(streamPartnerListData.link);
    $('#stream-parner-detail-content').val(streamPartnerListData.content);
    $('#stream-parner-detail-submit').attr('data-id', streamPartnerListData.id);
    $('#stream-parner-detail-image-preview').attr('src', streamPartnerListData.icon);
    $('#stream-parner-detail-image').attr('data-img', streamPartnerListData.icon);
    $('#stream-parner-detail-image').html('重新上传图片');

    // 换量合作方详情
    $('#stream-parner-detail').on('click', '#stream-parner-detail-submit', function() {
    	var id = $(this).attr('data-id');
        var productName = $.trim($('#stream-parner-detail-name').val());
        var platform = $.trim($('#stream-parner-detail-platform').val());
        var productStage = $.trim($('#stream-parner-detail-productStage').val());
        var productType = $.trim($('#stream-parner-detail-type').val());
        var contact = $.trim($('#stream-parner-detail-contact').val());
        var link = $.trim($('#stream-parner-detail-link').val());
        var content = $.trim($('#stream-parner-detail-content').val());
        var img = $.trim($('#stream-parner-detail-image').attr('data-img'));

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
                ctx: '#stream-parner-detail',
                title: '换量合作方详情',
                ctn: '请输入产品名称、平台、产品类型、联系方式、跳转链接、内容'
            });
            return;
        }

		if(productName.length > 25 ||
		   platform.length > 25 ||
		   productStage.length > 25 ||
	   	   productType.length > 25 ||
	       content.length > 25) {
			   modal.nobtn({
				   ctx: '#stream-parner-detail',
				   title: '添加换量合作方',
				   ctn: '产品名称，平台，产品阶段，产品类型，内容字数不能超过 25 个字'
			   })

               return;
		   }

        ajax.post({
            url: '/admin/streampartner/update.do',
            param: {
            	id: id,
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
                        ctx: '#stream-parner-detail',
                        title: '换量合作方详情',
                        ctn: '添加成功',
                        event: function() {
                            location.href = '/#proj_name#/html/stream-parner/list.html';
                        }
                    });
                } else {
                    modal.nobtn({
                        ctx: '#stream-parner-detail',
                        title: '换量合作方详情',
                        ctn: '添加失败'
                    });
                }
            },
            modal: modal,
            title: '换量合作方详情',
            ctx: '#stream-parner-detail'
        })
    });

    // 取消
    $('#stream-parner-detail').on('click', '#stream-parner-detail-canel', function() {
        history.back();
    });
};

module.exports = streamParnerDetail;
