/*!
 * 活动详情页面
 */

/**
 * 当前页面主函数，暴露出当前页面的代码
 * @param  {Object} ajax [包装过后的 ajax 对象]
 * @param {Object} modal [包装过后的弹窗对象]
 */
var activityDetail = function(ajax, modal, time, storage, util) {

	// 获取存储在 sessionStorage 中的数据
    var activityData = JSON.parse(storage.getSession('activity-list_activity'));
    activityData.starttimestr = time.unixToPluginTime(activityData.starttime);
    activityData.endtimestr = time.unixToPluginTime(activityData.endtime);
    console.log(activityData);

	var cacheType; // 缓存活动类型

	// 获取分类数据
	ajax.get({
		url: '/admin/activity/list_type.do',
		cb: function(data) {
			cacheType = data.data;
			data.activityData = activityData; // 将活动数据与分类数据结合传递给 html
			console.log(data);

			// 渲染界面
			var tpl = $('#activity-detail-tpl').html();
			$('#activity-detail-content').html(_.template(tpl)(data));

			$('.select2').select2();
		    $('#activity-detail-time').daterangepicker({
		    	timePicker: true,
		    	timePickerIncrement: 1,
		    	format: 'MM/DD/YYYY hh:mm A'
		    });
            $('#activity-detail-description').val(activityData.description);

            // 将内容填充进编辑器
            var ue = UE.getEditor('myEditor');
            ue.addListener("ready", function () {
                ue.setContent(activityData.content);
            });

            var imgs = activityData.snapshots;
            _.each(imgs, function(val) {
                $('#snapshats-img-wtap').append(_.template($('#snapshats-img-tpl').html())({data: val}));
            });
            $('#activity-detail-submit').attr('data-id', activityData.id);

            // 作者详情图片
            $('#activity-detail').on('click', '#activity-detail-image', function(e) {
                e.preventDefault();

                var img = $('#img_input').val();

                // 用户没有选择图片
                if(img === '') {
                    modal.nobtn({
                        ctx: '#activity-detail',
                        title: '活动详情',
                        ctn: '请选择上传图片'
                    });
                    return;
                }

                // 执行表单提交
                $('#img_form').submit();
                $('#activity-detail-image').html('<i class="fa fa-refresh fa-spin"></i>');
            });

            // 处理上传后的回调数据
            $('#img_form').ajaxForm(function(data) {
                data = JSON.parse(data);
                console.log(data);

                // 上传成功
                if(data.code === 200) {
                    var tpl = $('#snapshats-img-tpl').html();
                    if(activityData.snapshots !== null) {
                        $('#snapshats-img-wtap').append(_.template(tpl)(data));
                    }
                    
                    $('#snapshats-img-wtap img').attr('src', data.data);
                    $('#activity-detail-image').html('上传略缩图');
                } else {
                    $('#activity-detail-image').html('上传略缩图');
                    modal.nobtn({
                        ctx: '#activity-detail',
                        title: '活动详情',
                        ctn: '上传图片失败'
                    });
                }
            });

		}
	});

    // 取消活动详情，返回上一页
	$('#activity-detail').on('click', '#activity-detail-canel', function() {
		history.back();
	});

	// 提交活动
	$('#activity-detail').on('click', '#activity-detail-submit', function() {

		var id = $(this).attr('data-id');
		var name = $.trim($('#activity-detail-name').val()); // 活动名称
		var provider = $.trim($('#activity-detail-provider').val()); // 活动提供商
		var type = util.getPropByValue($('#activity-detail-type').val(), cacheType); // 活动类型
		var date = $.trim($('#activity-detail-time').val());
		var startTime = time.formatPluginTime(date).start; // 活动开始时间
		var endTime = time.formatPluginTime(date).end; // 活动结束时间
		var content = UE.getEditor('myEditor').getContent(); // 活动内容
		var description = $.trim($('#activity-detail-description').val()); // 活动内容
		var snapshots = getSnapshots(); // 缩略图


		// 缺少输入某个字段
		if(name === '' ||
		   provider === '' ||
		   type === '' ||
		   date === '' ||
		   content === '' ||
		   snapshots.length === 0 ||
           description === '') {

			modal.nobtn({
				ctx: '#activity-detail',
				title: '活动详情',
				ctn: '请确保输入活动名称，活动提供商，文章缩略图，活动类型，活动时间，活动描述和活动内容'
			});
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
				ctx: '#activity-detail',
				title: '活动详情',
				ctn: '活动描述必须在 92 个字与 135 个字之间'
			});
            return;
        }

		ajax.post({
			url: '/admin/activity/update.do',
			param: {
				id: id,
				type: type,
				name: name,
				starttime: startTime,
				endtime: endTime,
				content: content,
				provider: provider,
                description: description,
                snapshots: JSON.stringify(snapshots)
			},
			cb: function(data) {
				if(data.data === true) {
					modal.onebtn({
						ctx: '#activity-detail',
						title: '活动详情',
						ctn: '更新活动成功',
						event: function() {
							location.href = '/#proj_name#/html/activity/list.html';
						}
					});
				} else {
					modal.nobtn({
						ctx: '#activity-detail',
						title: '活动详情',
						ctn: data.message
					});
				}
			}
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

module.exports = activityDetail;
