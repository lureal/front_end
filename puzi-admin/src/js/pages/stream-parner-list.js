/*!
 * 换量合作方列表页面
 */

/**
 * 当前页面主函数，暴露出当前页面的代码
 * @param  {Object} ajax [包装过后的 ajax 对象]
 * @param {Object} modal [包装过后的弹窗对象]
 * @param {Object} time [包装过后的时间对象]
 */
var streamParnerList = function(ajax, modal, time, storage) {

	var cacheStreamParnerList; // 缓存合作方列表

	requestList(1, undefined);

	// 查看当前合作方
	$('#stream-parner-list').on('click', '#stream-parner-list-detail', function() {
		var id = $(this).attr('data-id');
		var parnerStr = JSON.stringify(getParnerById(id, cacheStreamParnerList));
		storage.setSession('stream-parner-list_parner', parnerStr);
		location.href = '/#proj_name#/html/stream-parner/detail.html';
	});

	// 上移动合作方
	$('#stream-parner-list').on('click', '#stream-parner-list-moveup', function() {
		var id = $(this).attr('data-id');

		// 请求服务器删除数据
		ajax.get({
			url: '/admin/streampartner/move.do',
			param: {
				id: id,
				direction: 1
			},
			cb: function(data) {
				if(data.data === true) {
                    modal.onebtn({
                        ctx: '#stream-parner-list',
                        title: '换量合作方管理',
                        ctn: '上移成功',
                        event: function() {
                        	location.reload();
                        }
                    });
				} else {
                    modal.nobtn({
                        ctx: '#stream-parner-list',
                        title: '换量合作方管理',
                        ctn: '上移失败'
                    });
                }
			},
            modal: modal,
            title: '换量合作方管理',
            ctx: '#stream-parner-list'
		});
	});

	// 下移动合作方
	$('#stream-parner-list').on('click', '#stream-parner-list-movedown', function() {
		var id = $(this).attr('data-id');

		// 请求服务器删除数据
		ajax.get({
			url: '/admin/streampartner/move.do',
			param: {
				id: id,
				direction: 2
			},
			cb: function(data) {
				if(data.data === true) {
                    modal.onebtn({
                        ctx: '#stream-parner-list',
                        title: '换量合作方管理',
                        ctn: '下移成功',
                        event: function() {
                        	location.reload();
                        }
                    });
				} else {
                    modal.nobtn({
                        ctx: '#stream-parner-list',
                        title: '换量合作方管理',
                        ctn: '下移失败'
                    });
                }
			},
            modal: modal,
            title: '换量合作方管理',
            ctx: '#stream-parner-list'
		});
	})

	// 删除
	$('#stream-parner-list').on('click', '#stream-parner-list-delete', function() {
		var id = $(this).attr('data-id');

		// 请求服务器删除数据
		ajax.get({
			url: '/admin/streampartner/delete.do',
			param: {
				id: id
			},
			cb: function(data) {
				if(data.data === true) {
                    modal.onebtn({
                        ctx: '#stream-parner-list',
                        title: '换量合作方管理',
                        ctn: '删除合作方成功',
                        event: function() {
                        	location.reload();
                        }
                    });
				} else {
                    modal.nobtn({
                        ctx: '#stream-parner-list',
                        title: '换量合作方管理',
                        ctn: '删除合作方失败'
                    });
                }
			},
            modal: modal,
            title: '换量合作方管理',
            ctx: '#stream-parner-list'
		});
	});

	// 向前翻页
	$('#stream-parner-list').on('click', '.previous', function() {
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
	$('#stream-parner-list').on('click', '.page', function() {
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
	$('#stream-parner-list').on('click', '.next', function() {
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
			url: '/admin/streampartner/list.do',
			param: { page: page },
			cb: function(data) {

				// 初始化表格
			    $('#stream-parner-list-table').DataTable({
					'paging': false,
					'lengthChange': false,
					'searching': false,
					'ordering': false,
					'info': false,
					'autoWidth': false
			    });

			    cacheStreamParnerList = data;

				// 渲染作者列表
				var tpl = $('#stream-parner-list-tpl').html();
				$('#stream-parner-list-wrap').html(_.template(tpl)(data));

				if($targetBtn !== null && $targetBtn !== undefined) {
					$targetBtn.html(cacheBtnText);
				}

			},
	        modal: modal,
	        title: '换量合作方列表',
	        ctx: '#stream-parner-list'
		});
	}

	/**
	 * 根据作者 id 返回缓存对象中的特定合作方对象
	 * @param  {String} id [合作方 id]
	 * @return {Object}    [特定合作方对象]
	 */
	function getParnerById(id, parnerList) {
		var parner;

		for(var i = 0; i < parnerList.data.streampartners.length; i++) {
			var list = parnerList.data.streampartners[i];

			if(String(list.id) === id) {
				parner = list;
			}
		}

		return parner;
	}
};

module.exports = streamParnerList;
