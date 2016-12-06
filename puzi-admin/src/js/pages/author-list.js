/*!
 * 文章列表页面
 */

/**
 * 当前页面主函数，暴露出当前页面的代码
 * @param  {Object} ajax [包装过后的 ajax 对象]
 * @param {Object} modal [包装过后的弹窗对象]
 * @param {Object} time [包装过后的时间对象]
 * @param {Object} storage [包装过后的存储对象]
 */
var authorList = function(ajax, modal, time, storage) {

	var cacheAuthorList; // 缓存作者列表

	// 请求数据
	// requestList(1, undefined);
    requestList({
        page: 1
    }, undefined);

    // 搜索
    $('#author-list').on('click', '#author-list-search', function() {
        // var title = $.trim($('#article-list-title').val());
        var name = $.trim($('#name').val());

        // 缓存数据，避免分页数据出错
        cacheParam = {
            // title: title,
            name: name
        }

        requestList(_.extend({}, { page: 1 }, cacheParam), undefined);
    });

	// 删除作者
	$('#author-list').on('click', '#author-list-delete', function() {
		var id = $(this).attr('data-id');

		ajax.post({
			url: '/admin/author/delete.do',
			param: { id: id },
            cb: function(data) {
                if(data.code === 200) {
                    modal.onebtn({
                        ctx: '#author-list',
                        title: '删除作者',
                        ctn: '删除成功',
                        event: function() {
                        	location.reload();
                        }
                    });
                } else {
                    modal.nobtn({
                        ctx: '#author-list',
                        title: '删除作者',
                        ctn: '删除作者失败'
                    });
                }
            },
            modal: modal,
            title: '删除作者',
            ctx: '#author-list'
		});
	});

	// 查看详情
	$('#author-list').on('click', '#author-list-detail', function() {
		var id = $(this).attr('data-id');
		var authorStr = JSON.stringify(getAuthorById(id, cacheAuthorList));
		storage.setSession('author-list_author', authorStr);
		location.href = '/#proj_name#/html/author/detail.html';
	});

	// 向前翻页
	$('#author-list').on('click', '.previous', function() {
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
	$('#author-list').on('click', '.page', function() {
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
	$('#author-list').on('click', '.next', function() {
		var pagecount = Number($(this).attr('data-pagecount')); // 分页总数
		var pagenow = Number($(this).attr('data-pagenow')); // 当前分页
		var $this = $(this);

		// 往前没有页面
		if(pagenow >= pagecount) {
			return;
		}

		requestList(pagenow + 1, $this);
	});

    // 置顶
    $('#author-list').on('click', '#author-list-placetop' , function() {
        var id = $(this).attr('data-id');
        ajax.get({
            url: '/admin/author/move_top.do',
            param: {
                id: id
            },
            cb: function(data) {
                if(data.code === 200) {
                    modal.onebtn({
                        ctx: '#author-list',
                        title: '作者',
                        ctn: '置顶作者成功',
                        event: function() {
                            location.reload();
                        }
                    });
                } else {
                    modal.nobtn({
                        ctx: '#author-list',
                        title: '作者',
                        ctn: '置顶作者失败'
                    });
                }
            }
        })
    });

	/**
	 * 根据页面请求服务器数据
	 * @param  {Number} page [请求第几页的数据]
	 */
	function requestList(param, $targetBtn) {

		if($targetBtn !== null && $targetBtn !== undefined) {
			var cacheBtnText = $targetBtn.html();
			$targetBtn
				.attr('data-isloading', 'true')
				.html('<img class="page-loading" src="/#proj_name#/img/loading.gif">');
		}

		// 请求作者列表
		ajax.get({
			url: '/admin/author/list.do',
			// param: { page: page },
            param: param,
			cb: function(data) {

				cacheAuthorList = data;

				// 格式化文章时间
				for(var i = 0; i < data.data.authors.length; i++) {
					var val = data.data.authors[i];
					val.posttime_str = time.unixToTime(val.posttime);
				}
                cacheAuthorList = data;

				// 渲染作者列表
				var tpl = $('#author-list-tpl').html();
				$('#author-list-wrap').html(_.template(tpl)(data));

				if($targetBtn !== null && $targetBtn !== undefined) {
					$targetBtn.html(cacheBtnText);
				}

			},
	        modal: modal,
	        title: '删除作者',
	        ctx: '#author-list'
		});
	}

	/**
	 * 根据作者 id 返回缓存对象中的特定作者对象
	 * @param  {String} id [作者 id]
	 * @return {Object}    [特定作者对象]
	 */
	function getAuthorById(id, authorList) {
		var author;

		for(var i = 0; i < authorList.data.authors.length; i++) {
			var list = authorList.data.authors[i];

			if(String(list.id) === id) {
				author = list;
			}
		}

		return author;
	}
};

module.exports = authorList;
