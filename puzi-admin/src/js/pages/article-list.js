/*!
 * 文章列表页面
 */

var cacheParam = {};

/**
 * 当前页面主函数，暴露出当前页面的代码
 * @param  {Object} ajax [包装过后的 ajax 对象]
 * @param {Object} modal [包装过后的弹窗对象]
 * @param {Object} time [包装过后的时间对象]
 * @param {Object} storage [包装过后的数据存储对象]
 */
var articleList = function(ajax, modal, time, storage) {

	var cacheArticleList; // 缓存正常表格数据

	requestList({
		page: 1
	}, undefined);

	// 搜索
	$('#article-list').on('click', '#article-list-search', function() {
		var title = $.trim($('#article-list-title').val());
		var author = $.trim($('#article-list-author').val());

		// 缓存数据，避免分页数据出错
		cacheParam = {
			title: title,
			authorName: author
		}

		requestList(_.extend({}, { page: 1 }, cacheParam), undefined);
	});

	// 向前翻页
	$('#article-list').on('click', '.previous', function() {
		var pagecount = Number($(this).attr('data-pagecount')); // 分页总数
		var pagenow = Number($(this).attr('data-pagenow')); // 当前分页
		var $this = $(this);

		// 往前没有页面
		if(pagenow <= 1) {
			return;
		}

		requestList(_.extend({}, { page: pagenow - 1 }, cacheParam), $this);
	});

	// 指定页数分页
	$('#article-list').on('click', '.page', function() {
		var pagecount = Number($(this).attr('data-pagecount')); // 分页总数
		var pagenow = Number($(this).attr('data-pagenow')); // 当前分页
		var page = Number($(this).attr('data-page')); // 跳转的页数
		var $this = $(this);

		// 当前页面在跳转页面上则不需要请求数据
		if(pagenow === page) {
			return;
		}

		requestList(_.extend({}, { page: page }, cacheParam), $this);
	});

	// 向后翻页
	$('#article-list').on('click', '.next', function() {
		var pagecount = Number($(this).attr('data-pagecount')); // 分页总数
		var pagenow = Number($(this).attr('data-pagenow')); // 当前分页
		var $this = $(this);

		// 往前没有页面
		if(pagenow >= pagecount) {
			return;
		}

		requestList(_.extend({}, { page: pagenow + 1 }, cacheParam), $this);
	});

	// 渲染热门文章
	ajax.get({
		url: '/admin/article/list_hot.do',
		cb:
		function(data) {

			// 格式化文章时间
			for(var i = 0; i < data.data.length; i++) {
				var val = data.data[i];
				val.posttime_str = time.unixToTime(val.posttime);
			}

			// 渲染热门文章
			var tpl = $('#article-hot-list-tpl').html();
			$('#article-hot-list-wrap').html(_.template(tpl)(data));
		},
        modal: modal,
        title: '文章列表',
        ctx: '#article-list'
	});

	// 上移热门文章
	$('#article-list').on('click', '#article-hoy-list-moveup', function() {
		var id = $(this).attr('data-id');

		// 请求服务器删除数据
		ajax.get({
			url: '/admin/article/move_hot.do',
			param: {
				id: id,
				direction: 1
			},
			cb: function(data) {
				if(data.data === true) {
                    modal.onebtn({
                        ctx: '#article-list',
                        title: '文章管理',
                        ctn: '上移热门文章成功',
                        event: function() {
                        	location.reload();
                        }
                    });
				} else {
                    modal.nobtn({
                        ctx: '#article-list',
                        title: '文章管理',
                        ctn: '上移热门文章失败'
                    });
                }
			},
            modal: modal,
            title: '文章管理',
            ctx: '#article-list'
		});
	});

	// 下移热门文章
	$('#article-list').on('click', '#article-hoy-list-movedown', function() {
		var id = $(this).attr('data-id');

		// 请求服务器删除数据
		ajax.get({
			url: '/admin/article/move_hot.do',
			param: {
				id: id,
				direction: 2
			},
			cb: function(data) {
				if(data.data === true) {
                    modal.onebtn({
                        ctx: '#article-list',
                        title: '文章管理',
                        ctn: '下移热门文章成功',
                        event: function() {
                        	location.reload();
                        }
                    });
				} else {
                    modal.nobtn({
                        ctx: '#article-list',
                        title: '文章管理',
                        ctn: '下移热门文章失败'
                    });
                }
			},
            modal: modal,
            title: '文章管理',
            ctx: '#article-list'
		});
	});

	// 删除文章
	$('#article-list').on('click', '#article-list-delete', function() {
		var id = $(this).attr('data-id');

		// 请求服务器删除数据
		ajax.get({
			url: '/admin/article/delete.do',
			param: {
				id: id
			},
			cb: function(data) {
				if(data.data === true) {
                    modal.onebtn({
                        ctx: '#article-list',
                        title: '活动列表',
                        ctn: '删除成功',
                        event: function() {
                        	location.reload();
                        }
                    });
				} else {
                    modal.nobtn({
                        ctx: '#article-list',
                        title: '活动列表',
                        ctn: '删除失败'
                    });
                }
			},
            modal: modal,
            title: '活动列表',
            ctx: '#article-list'
		});
	});

	// 添加到热门文章
	$('#article-list').on('click', '#article-list-addhot', function() {
		var id = $(this).attr('data-id');

		// 请求服务器删除数据
		ajax.get({
			url: '/admin/article/add2hot.do',
			param: {
				id: id
			},
			cb: function(data) {
				if(data.data === true) {
                    modal.onebtn({
                        ctx: '#article-list',
                        title: '活动列表',
                        ctn: '添加成功',
                        event: function() {
                        	location.reload();
                        }
                    });
				} else {
                    modal.nobtn({
                        ctx: '#article-list',
                        title: '活动列表',
                        ctn: '添加失败'
                    });
                }
			},
            modal: modal,
            title: '活动列表',
            ctx: '#article-list'
		});
	});

	// 查看详情
	$('#article-list').on('click', '#article-list-detail', function() {
		var id = $(this).attr('data-id');
		var articleStr = JSON.stringify(getArticleById(id, cacheArticleList));
		storage.setSession('article-list_article', articleStr);
		location.href = '/#proj_name#/html/article/detail.html';
	});

	// 热门文章置顶
	$('#article-list').on('click', '#article-hoy-list-top', function() {
		var id = $(this).attr('data-id');

		// 请求服务器删除数据
		ajax.get({
			url: '/admin/article/move_hot_top.do',
			param: {
				id: id
			},
			cb: function(data) {
				if(data.data === true) {
					modal.onebtn({
						ctx: '#article-list',
						title: '文章管理',
						ctn: '文章置顶成功',
						event: function() {
							location.reload();
						}
					});
				} else {
					modal.nobtn({
						ctx: '#article-list',
						title: '文章管理',
						ctn: '文章置顶失败'
					});
				}
			},
			modal: modal,
			title: '文章管理',
			ctx: '#article-list'
		});
	});

	/**
	 * 根据页面请求服务器数据
	 * @param  {Number} param [请求参数]
	 */
	function requestList(param, $targetBtn) {

		if($targetBtn !== null && $targetBtn !== undefined) {
			var cacheBtnText = $targetBtn.html();
			$targetBtn
				.attr('data-isloading', 'true')
				.html('<img class="page-loading" src="/#proj_name#/img/loading.gif">');
		}

		// 获取列表数据
		ajax.get({
			url: '/admin/article/list.do',
			param: param,
			cb: function(data) {

				// 格式化文章时间
				for(var i = 0; i < data.data.articles.length; i++) {
					var val = data.data.articles[i];
					val.posttime_str = time.unixToTime(val.posttime);
				}

				cacheArticleList = data;

				// 渲染正常文章
				var tpl = $('#article-list-tpl').html();
				$('#article-list-wrap').html(_.template(tpl)(data));

				if($targetBtn !== null && $targetBtn !== undefined) {
					$targetBtn.html(cacheBtnText);
				}

			},
	        modal: modal,
	        title: '文章列表',
	        ctx: '#article-list'
		});
	}

	/**
	 * 根据作者 id 返回缓存对象中的特定作者对象
	 * @param  {String} id [作者 id]
	 * @return {Object}    [特定作者对象]
	 */
	function getArticleById(id, articleList) {
		var article;

		for(var i = 0; i < articleList.data.articles.length; i++) {
			var list = articleList.data.articles[i];

			if(String(list.id) === id) {
				article = list;
			}
		}

		return article;
	}
};

module.exports = articleList;
