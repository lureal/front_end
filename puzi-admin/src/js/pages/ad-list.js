/*!
 * 广告列表页面
 */

/**
 * 当前页面主函数，暴露出当前页面的代码
 * @param  {Object} ajax [包装过后的 ajax 对象]
 * @param {Object} modal [包装过后的弹窗对象]
 * @param {Object} time [包装过后的时间对象]
 */

var ad = function(ajax, modal, time) {

	requestList(1, undefined);

	// 向前翻页
	$('#ad-list').on('click', '.previous', function() {
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
	$('#ad-list').on('click', '.page', function() {
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
	$('#ad-list').on('click', '.next', function() {
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
			url: '/admin/brand/list_ad.do',
			param: { page: page },
			cb: function(data) {

				// 渲染界面
				var tpl = $('#ad-list-tpl').html();
				$('#ad-list-wrap').html(_.template(tpl)(data));

				if($targetBtn !== null && $targetBtn !== undefined) {
					$targetBtn.html(cacheBtnText);
				}
			},
	        modal: modal,
	        title: '广告列表',
	        ctx: '#ad-list'
		});
	}
};

module.exports = ad;
