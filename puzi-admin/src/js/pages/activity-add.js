/*!
 * 添加活动页面
 */

/**
 * 当前页面主函数，暴露出当前页面的代码
 * @param  {Object} ajax [包装过后的 ajax 对象]
 * @param {Object} modal [包装过后的弹窗对象]
 */
var activityAdd = function(ajax, modal, time, util) {

	var cacheType; // 缓存活动类型

	// 获取分类数据
	ajax.get({
		url: '/admin/activity/list_type.do',
		cb: function(data) {
			cacheType = data.data;

			// 渲染界面
			var tpl = $('#activity-add-tpl').html();
			$('#activity-add-content').html(_.template(tpl)(data));

			$('.select2').select2();
		    $('#activity-add-time').daterangepicker({
		    	timePicker: true,
		    	timePickerIncrement: 1,
		    	format: 'MM/DD/YYYY hh:mm A'
		    });

			// 渲染
			UE.getEditor('myEditor');

                // 添加作者图片
            $('#activity-add').on('click', '#activity-add-image', function(e) {
                e.preventDefault();
                var img = $('#img_input').val();

                // 用户没有选择图片
                if(img === '') {
                    modal.nobtn({
                        ctx: '#activity-add',
                        title: '添加作者',
                        ctn: '请选择上传图片'
                    });
                    return;
                }
                // 执行表单提交
                $('#img_form1').submit();
                $('#activity-add-image').html('<i class="fa fa-refresh fa-spin"></i>');
            });

            // 处理上传后的回调数据
            $('#img_form1').ajaxForm(function(_data) {
                data = JSON.parse(_data);
                console.log(data);

                // 上传成功
                if(data.code === 200) {
                    $('#activity-preview').attr('src', data.data);
                    $('#activity-add-submit').attr('data-img', data.data);
                    $('#activity-add-image').html('图片上传成功，点击重新上传');
                } else {
                    $('#activity-add-image').html('上传图片');
                    modal.nobtn({
                        ctx: '#activity-add',
                        title: '添加作者',
                        ctn: '上传图片失败'
                    });
                }
            });
		}
	});

    // 取消添加活动，返回上一页
	$('#activity-add').on('click', '#activity-add-canel', function() {
		history.back();
	});

	// 提交新文章
	$('#activity-add').on('click', '#activity-add-submit', function() {

		var name = $.trim($('#activity-add-name').val()); // 活动名称
		var provider = $.trim($('#activity-add-provider').val()); // 活动提供商
		var type =  util.getPropByValue($('#activity-add-type').val(), cacheType); // 活动类型
		var date = $.trim($('#activity-add-time').val());
		var startTime = time.formatPluginTime(date).start; // 活动开始时间
		var endTime = time.formatPluginTime(date).end; // 活动结束时间
		var content = UE.getEditor('myEditor').getContent(); // 活动内容
		var description = $.trim($('#activity-add-description').val()); // 活动描述
		var snapshots = $(this).attr('data-img');
        var snapshotsArr = [];
        snapshotsArr.push(snapshots);

		console.log(description);
		console.log(content);

		// 缺少输入某个字段
		if(name === '' ||
		   provider === '' ||
		   type === '' ||
		   date === '' ||
		   content === '' ||
		   snapshots === '' ||
	   	   description === '') {

			modal.nobtn({
				ctx: '#activity-add',
				title: '添加活动',
				ctn: '请确保输入活动名称，活动提供商，活动类型，活动缩略图，活动时间，活动描述和活动内容'
			});

			return;
		}

		// 活动名称限制25个字
		if(name.length > 25) {
			modal.nobtn({
				ctx: '#activity-add',
				title: '添加活动',
				ctn: '活动名称不能大于 25 个字'
			});
			return;
		}

        if(description.length > 135 || description.length < 92) {
            modal.nobtn({
				ctx: '#activity-add',
				title: '活动详情',
				ctn: '活动描述必须在 92 个字与 135 个字之间'
			});
            return;
        }

		ajax.post({
			url: '/admin/activity/add.do',
			param: {
				type: type,
				name: name,
				starttime: startTime,
				endtime: endTime,
				content: content,
				provider: provider,
				description: description,
				snapshots: JSON.stringify(snapshotsArr)
			},
			cb: function(data) {
				if(data.data === true) {
					modal.onebtn({
						ctx: '#activity-add',
						title: '添加活动',
						ctn: '添加活动成功',
						event: function() {
							location.href = '/#proj_name#/html/activity/list.html';
						}
					});
				} else {
					modal.nobtn({
						ctx: '#activity-add',
						title: '添加活动',
						ctn: data.message
					});
				}
			},
            modal: modal,
            title: '添加活动',
            ctx: '#activity-add'
		});

	});

    /**
     * 获取略缩图
     * @return {Array} [字符串数组]
     */
    function getSnapshots() {
        var arr = [];

        $('.snapshots__img-wrap').each(function(val) {
            arr.push($('img', $(this)).attr('src'))
        });

        return arr;
    }
};

module.exports = activityAdd;
