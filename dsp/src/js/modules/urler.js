var urler = {};

/**
 * 获取 url 中的参数
 * 用法： getQuery.id
 * @return query 对象
 */
urler.normal = function() {
	var queryString = {},
		query = window.location.search.substring(1),
		queryArr = query.split("&");

	for(var i = 0; i < queryArr.length; i++) {
		var pair = queryArr[i].split('=');

		if (typeof queryString[pair[0]] === 'undefined') {
			queryString[pair[0]] = pair[1];

		} else if(typeof queryString[pair[0]] === 'string') {
			var arr = [ queryString[pair[0]], pair[1] ];
			queryString[pair[0]] = arr;

		} else {
			queryString[pair[0]].push(pair[1]);

		}
	}

	return queryString;
};

/**
 * 获取 url 中类似 /author/index/12-11-10 中的 12, 11, 10
 * @param url String 当前基础 url，用于标志参数的起点
 */
urler.dashParam = function(baseUrl) {
	var url = location.href.slice(baseUrl.length);
	return url.split('-');
}

/**
 * 投放系统需要在每个连接后面拼接上 customId，这里封装这个方法，来取代页面中的正常链接跳转
 *
 * 方法做了 2 个步骤：
 * 1. 获取 url 中的 cid 参数（cid 就是 customId）
 * 2. 如果当前有传 url 参数进去，则将 delivery_custome_id 绑定到 url 中，并跳转到绑定后
 *    的链接
 * 3. 如果当前没有传递 url 则把页面中所有带有 data-ah_href 属性的 href 全部取代为绑定在
 *    当前元素身上的 data-ah_href
 *
 * usage:
 *
 * html:
 * <a href="javascript:void(0);" data-ah_href="http://www.baidu.com">xxxxx</a>
 *
 * js:
 * var urler = require('path/urler');
 * urler.initLink();
 *
 * OR
 *
 * html:
 * <a href="javascript:void(0);" class="myLink">xxxxx</a>
 *
 * js:
 * var urler = require('path/urler');
 * $('.myLink').click(function() {
 *   urler.initLink('http://www.baidu.com');
 * });
 *
 */
urler.initLink = function(url) {

	// 获取 url 中的参数
	var customId = urler.normal().cid;

	// 如果当前是跳转到特定链接，
	if(url !== undefined && url !== '') {
		if(url.indexOf('?') !== -1) {
			location.href = url + '&cid=' + customId;
		} else {
			location.href = url + '?cid=' + customId;
		}
		return;
	}

	// 如果不是跳转到特定链接，则将页面中所有具有 data-ah_href 属性的 href 全部取代为绑定
	// 在当前元素身上的 data-ah_href
	$('[data-ah_href]').each(function() {
		var self = $(this);
		var href = '';

		if(self.attr('data-ah_href').indexOf('?') !== -1) {
			href = self.attr('data-ah_href') + '&cid=' + customId;
		} else {
			href = self.attr('data-ah_href') + '?cid=' + customId;
		}
		self.attr('href', href);
	});
}

module.exports = urler;
