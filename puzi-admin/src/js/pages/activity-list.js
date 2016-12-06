/*!
 * 活动列表页面
 */

/**
 * 当前页面主函数，暴露出当前页面的代码
 * @param  {Object} ajax [包装过后的 ajax 对象]
 * @param {Object} modal [包装过后的弹窗对象]
 * @param {Object} time [包装过后的时间对象]
 * @param {storage} storage [包装过后的存储操作对象]
 */
var activityList = function(ajax, modal, time, storage) {

	var cacheActivityList; // 缓存信息

	requestList(1, undefined);

	// 删除当前活动
	$('#activity-list').on('click', '#activity-list-delete', function() {
		var id = $(this).attr('data-id');

		// 请求服务器删除数据
		ajax.get({
			url: '/admin/activity/delete.do',
			param: {
				id: id
			},
			cb: function(data) {
				if(data.data === true) {
                    modal.onebtn({
                        ctx: '#activity-list',
                        title: '删除活动',
                        ctn: '删除成功',
                        event: function() {
                        	location.reload();
                        }
                    });
				} else {
                    modal.nobtn({
                        ctx: '#activity-list',
                        title: '删除活动',
                        ctn: '删除作者失败'
                    });
                }
			},
            modal: modal,
            title: '删除活动',
            ctx: '#activity-list'
		});
	});

	// 查看当前活动
	$('#activity-list').on('click', '#activity-list-edit', function() {
		var id = $(this).attr('data-id');
		var activityStr = JSON.stringify(getActivityById(id, cacheActivityList));
		storage.setSession('activity-list_activity', activityStr);
		location.href = '/#proj_name#/html/activity/detail.html';
	});

	// 向前翻页
	$('#activity-list').on('click', '.previous', function() {
		var pagecount = Number($(this).attr('data-pagecount')); // 分页总数
		var pagenow = Number($(this).attr('data-pagenow')); // 当前分页
		var $this = $(this);

		// 往前没有页面
		if(pagenow <= 1) {
			return;
		}

		requestList(pagenow - 1, $this);
	});

	// 指定页数分页
	$('#activity-list').on('click', '.page', function() {
		var pagecount = Number($(this).attr('data-pagecount')); // 分页总数
		var pagenow = Number($(this).attr('data-pagenow')); // 当前分页
		var page = Number($(this).attr('data-page')); // 跳转的页数
		var $this = $(this);

		// 当前页面在跳转页面上则不需要请求数据
		if(pagenow === page) {
			return;
		}

		requestList(page, $this);
	});

	// 指定页数翻页
	$('#activity-list').on('click', '.next', function() {
		var pagecount = Number($(this).attr('data-pagecount')); // 分页总数
		var pagenow = Number($(this).attr('data-pagenow')); // 当前分页
		var $this = $(this);

		// 往前没有页面
		if(pagenow >= pagecount) {
			return;
		}

		requestList(pagenow + 1, $this);
	});

	/**
	 * 根据页面请求服务器数据
	 * @param  {Number} page [请求第几页的数据]
	 */
	function requestList(page, $targetBtn) {

		if($targetBtn !== null && $targetBtn !== undefined) {
			var cacheBtnText = $targetBtn.html();
			$targetBtn
				.attr('data-isloading', 'true')
				.html('<img class="page-loading" src="/#proj_name#/img/loading.gif">');
		}

		// 获取列表数据
		ajax.get({
			url: '/admin/activity/list.do',
			param: { page: page },
			cb: function(data) {

				// 格式化开始时间和结束时间
				for(var i = 0; i < data.data.activities.length; i++) {
					var val = data.data.activities[i];
					val.starttimestr = time.unixToTime(val.starttime);
					val.endtimestr = time.unixToTime(val.endtime);
				}

				// 初始化表格
			    $('#activity-list-table').DataTable({
					'paging': false,
					'lengthChange': false,
					'searching': false,
					'ordering': false,
					'info': false,
					'autoWidth': false
			    });

			    cacheActivityList = data;

				// 渲染界面
				var tpl = $('#activity-list-tpl').html();
				$('#activity-list-wrap').html(_.template(tpl)(data));

				if($targetBtn !== null && $targetBtn !== undefined) {
					$targetBtn.html(cacheBtnText);
				}
			},
	        modal: modal,
	        title: '活动列表',
	        ctx: '#activity-list'
		});
	}

	/**
	 * 根据作者 id 返回缓存对象中的特定活动对象
	 * @param  {String} id [作者 id]
	 * @return {Object}    [特定作者对象]
	 */
	function getActivityById(id, activityList) {
		var activity;

		for(var i = 0; i < activityList.data.activities.length; i++) {
			var list = activityList.data.activities[i];

			if(String(list.id) === id) {
				activity = list;
			}
		}

		return activity;
	}
};

module.exports = activityList;
