/*!
 * Banner列表页面
 */

/**
 * 当前页面主函数，暴露出当前页面的代码
 * @param  {Object} ajax [包装过后的 ajax 对象]
 * @param {Object} modal [包装过后的弹窗对象]
 * @param {Object} time [包装过后的时间对象]
 */

var banner = function(ajax, modal, time) {

	requestList(1, undefined);

	// 取消订阅
	$('#banner-list').on('click', '#banner-list-delete', function() {
		var id = $(this).attr('data-id');

		// 请求服务器删除数据
		ajax.get({
			url: '/admin/subscriber/unsubscribe.do',
			param: {
				id: id
			},
			cb: function(data) {
				if(data.data === true) {
                    modal.onebtn({
                        ctx: '#banner-list',
                        title: 'banner管理',
                        ctn: '取消订阅成功',
                        event: function() {
                        	location.reload();
                        }
                    });
				} else {
                    modal.nobtn({
                        ctx: '#banner-list',
                        title: '取消订阅',
                        ctn: '取消订阅失败'
                    });
                }
			},
            modal: modal,
            title: 'banner管理',
            ctx: '#banner-list'
		});
	});

	// 向前翻页
	$('#banner-list').on('click', '.previous', function() {
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
	$('#banner-list').on('click', '.page', function() {
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
	$('#banner-list').on('click', '.next', function() {
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
			url: '/admin/brand/list_banner.do',
			param: { page: page },
			cb: function(data) {

				// 渲染界面
				var tpl = $('#banner-list-tpl').html();
				$('#banner-list-wrap').html(_.template(tpl)(data));

				if($targetBtn !== null && $targetBtn !== undefined) {
					$targetBtn.html(cacheBtnText);
				}
			},
	        modal: modal,
	        title: '订阅列表',
	        ctx: '#banner-list'
		});
	}
};

module.exports = banner;
