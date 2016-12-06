/*!
 * 分页模块
 */

function pager(cb, $ctx) {

	if($ctx === undefined) {
		$ctx = $('body')
	}

    // 向前翻页
	$ctx.on('click', '.previous', function() {
		var pagecount = Number($(this).attr('data-pagecount')); // 分页总数
		var pagenow = Number($(this).attr('data-pagenow')); // 当前分页
		var ajaxParam = JSON.parse(decodeURIComponent($(this).attr('data-ajaxParam'))); // 获取请求参数
		var $this = $(this);

		// 往前没有页面
		if(pagenow <= 1) {
			return;
		}

		cb(_.extend(ajaxParam, {
			page: pagenow - 1
		}), $this);
	});

    // 指定页数分页
	$ctx.on('click', '.page', function() {
		var pagecount = Number($(this).attr('data-pagecount')); // 分页总数
		var pagenow = Number($(this).attr('data-pagenow')); // 当前分页
		var page = Number($(this).attr('data-page')); // 跳转的页数
		var ajaxParam = JSON.parse(decodeURIComponent($(this).attr('data-ajaxParam'))); // 获取请求参数
		var $this = $(this);

		// 当前页面在跳转页面上则不需要请求数据
		if(pagenow === page) {
			return;
		}

		cb(_.extend(ajaxParam, {
			page: page
		}), $this);
	});

    // 向后翻页
    $ctx.on('click', '.next', function() {
        var pagecount = Number($(this).attr('data-pagecount')); // 分页总数
        var pagenow = Number($(this).attr('data-pagenow')); // 当前分页
		var ajaxParam = JSON.parse(decodeURIComponent($(this).attr('data-ajaxParam'))); // 获取请求参数
        var $this = $(this);

        // 往前没有页面
        if(pagenow >= pagecount) {
            return;
        }

        cb(_.extend(ajaxParam, {
			page: pagenow + 1
		}), $this);
    });
}

module.exports = pager;
