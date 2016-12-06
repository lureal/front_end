/*!
 * 请求模块
 */

var request = {};

/**
 * 包装 jQuery get 请求
 * @param  [Objectt] obj [传递给 $.get 的参数]
 */
request.get = function(obj) {
	var url, param, cb, modal, title, ctx;

	url = obj.url ? obj.url : undefined;
	param = obj.url ? obj.param : undefined;
	cb = obj.cb ? obj.cb : function() {};
	modal = obj.modal ? obj.modal : { nobtn: function() {} };
	title = obj.title ? obj.title : '错误提示';
	ctx = obj.ctx ? obj.ctx : 'body';

	// 发起请求
	$.get(url, param, function(data) {
		data = JSON.parse(data);

		console.log(data);

		if(data.code === -100) {
			location.href = '/#proj_name#/html/user/login.html';
			return;
		}

		if(data.code === 200) {
			cb(data);
		} else {
			modal.nobtn({
				ctx: ctx,
				title: title,
				ctn: data.message
			});
		}

	})
	.fail(function(data) {
		modal.nobtn({
			ctx: ctx,
			title: title,
			ctn: '请求出错，请联系技术人员'
		});
	});
};

/**
 * 包装 jQuery post 请求
 * @param  [Objectt] obj [传递给 $.post 的参数]
 */
request.post = function(obj) {
	var url, param, cb, modal, title, ctx;

	url = obj.url ? obj.url : undefined;
	param = obj.url ? obj.param : undefined;
	cb = obj.cb ? obj.cb : function() {};
	modal = obj.modal ? obj.modal : { nobtn: function() {} };
	title = obj.title ? obj.title : '错误提示';
	ctx = obj.ctx ? obj.ctx : 'body';

	// 发起请求
	$.post(url, param, function(data) {
		data = JSON.parse(data);

		console.log(data);

		if(data.code === -100) {
			location.href = '/#proj_name#/html/user/login.html';
			return;
		}

		if(data.code === 200) {
			cb(data);
		} else {
			modal.nobtn({
				ctx: ctx,
				title: title,
				ctn: data.message
			});
		}

	})
	.fail(function(data) {
		modal.nobtn({
			ctx: ctx,
			title: title,
			ctn: '请求出错，请联系技术人员'
		});
	});
};

module.exports = request;
