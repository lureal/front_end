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

module.exports = urler;
