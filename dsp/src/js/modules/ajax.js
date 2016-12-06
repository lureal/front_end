/*!
 * 请求模块
 */

var request = {};
var _modal = require('./modal');

// 定义变量，判断弹框,如果count大于1，就不弹框，目的是三十秒查询弹框操作
var count ;

/**
 * 包装 jQuery get 请求
 * @param  [Objectt] obj [传递给 $.get 的参数]
 */
request.get = function(obj) {
	var url, param, cb, modal, title, ctx;

	url = obj.url ? obj.url : undefined;
	param = obj.url ? obj.param : undefined;
	cb = obj.cb ? obj.cb : function() {};
	modal = obj.modal ? obj.modal : _modal;
	title = obj.title ? obj.title : '错误提示';
	ctx = obj.ctx ? obj.ctx : 'body';

	// 发起请求
	$.get(url, param, function(data) {
		data = JSON.parse(data);

		console.log(data);
		console.log(data.code);

		// 根据接口文档定制状态码判定
		// 未登录，跳转到登录页面
		if(data.code === 100) {
		    $('#modal-twobtn').modal('hide');
			$('#modal-onebtn').modal('hide');

			location.href = '/#proj_name#/html/user/login.html';
			return;
		}

		// 该用户无权访问该请求
		if(data.code === 101) {
		    $('#modal-twobtn').modal('hide');
			$('#modal-onebtn').modal('hide');

			modal.nobtn({
				ctx: ctx,
				title: title,
				ctn: '当前用户无权限访问'
			});
			return;
		}

		// 直接跳转到链接
		if(data.code === 300) {
		    $('#modal-twobtn').modal('hide');
			$('#modal-onebtn').modal('hide');

			location.href = data.data;
			return;
		}

		// 展示给用户返回的结果后，用户确认后，再跳转到链接
		if(data.code === 301) {
		    $('#modal-twobtn').modal('hide');
			$('#modal-onebtn').modal('hide');

			modal.onebtn({
				ctx: ctx,
				title: title,
				ctn: data.message,
				event: function() {
					location.href = data.data;
				}
			});
			return;
		}

		// 请求错误，提示 message 给用户
		if(data.code === 400) {
		    $('#modal-twobtn').modal('hide');
			$('#modal-onebtn').modal('hide');

			modal.nobtn({
				ctx: ctx,
				title: title,
				ctn: data.message
			});
			return;
		}

		// 服务器异常
		if(data.code === 500) {
		    $('#modal-twobtn').modal('hide');
			$('#modal-onebtn').modal('hide');

			modal.nobtn({
				ctx: ctx,
				title: title,
				ctn: '服务器异常'
			});
			return;
		}

		// 服务器停机维护中
		if(data.code === 501) {
		    $('#modal-twobtn').modal('hide');
			$('#modal-onebtn').modal('hide');

			modal.nobtn({
				ctx: ctx,
				title: title,
				ctn: '服务器停机维护中'
			});
			return;
		}

		// 请求成功，需要展示给用户返回的 data
		if(data.code === 201) {
		    $('#modal-twobtn').modal('hide');
			$('#modal-onebtn').modal('hide');

			modal.nobtn({
				ctx: ctx,
				title: title,
				ctn: data.message
			});
			return;
		}

		// 请求成功
		if(data.code === 200) {
			count = 1;
			cb(data);
		} else {
		    $('#modal-twobtn').modal('hide');
			$('#modal-onebtn').modal('hide');

			modal.nobtn({
				ctx: ctx,
				title: title,
				ctn: data.message
			});
		}

	})
	.fail(function(data) {
		$('#modal-twobtn').modal('hide');
		$('#modal-onebtn').modal('hide');
		if(count < 1) {
			modal.nobtn({
				ctx: ctx,
				title: title,
				ctn: '服务器异常'
			});
		}
		count++;
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
	modal = obj.modal ? obj.modal : _modal;
	title = obj.title ? obj.title : '错误提示';
	ctx = obj.ctx ? obj.ctx : 'body';

	// 发起请求
	$.post(url, param, function(data) {
		data = JSON.parse(data);

		// 根据接口文档定制状态码判定
		// 未登录，跳转到登录页面
		if(data.code === 100) {
		    $('#modal-twobtn').modal('hide');
			$('#modal-onebtn').modal('hide');

			location.href = '/#proj_name#/html/user/login.html';
			return;
		}

		// 该用户无权访问该请求
		if(data.code === 101) {
		    $('#modal-twobtn').modal('hide');
			$('#modal-onebtn').modal('hide');

			modal.nobtn({
				ctx: ctx,
				title: title,
				ctn: '当前用户无权限访问'
			});
			return;
		}

		// 直接跳转到链接
		if(data.code === 300) {
		    $('#modal-twobtn').modal('hide');
			$('#modal-onebtn').modal('hide');

			location.href = data.data;
			return;
		}

		// 展示给用户返回的结果后，用户确认后，再跳转到链接
		if(data.code === 301) {
		    $('#modal-twobtn').modal('hide');
			$('#modal-onebtn').modal('hide');

			modal.onebtn({
				ctx: ctx,
				title: title,
				ctn: data.message,
				event: function() {
					location.href = data.data;
				}
			});
			return;
		}

		// 请求错误，提示 message 给用户
		if(data.code === 400) {
		    $('#modal-twobtn').modal('hide');
			$('#modal-onebtn').modal('hide');

			modal.nobtn({
				ctx: ctx,
				title: title,
				ctn: data.message
			});
			return;
		}

		// 服务器异常
		if(data.code === 500) {
		    $('#modal-twobtn').modal('hide');
			$('#modal-onebtn').modal('hide');

			modal.nobtn({
				ctx: ctx,
				title: title,
				ctn: '服务器异常'
			});
			return;
		}

		// 服务器停机维护中
		if(data.code === 501) {
		    $('#modal-twobtn').modal('hide');
			$('#modal-onebtn').modal('hide');

			modal.nobtn({
				ctx: ctx,
				title: title,
				ctn: '服务器停机维护中'
			});
			return;
		}

		// 请求成功，需要展示给用户返回的 data
		if(data.code === 201) {
		    $('#modal-twobtn').modal('hide');
			$('#modal-onebtn').modal('hide');

			modal.nobtn({
				ctx: ctx,
				title: title,
				ctn: data.message
			});
			return;
		}

		// 请求成功
		if(data.code === 200) {
			cb(data);
		} else {
		    $('#modal-twobtn').modal('hide');
			$('#modal-onebtn').modal('hide');

			modal.nobtn({
				ctx: ctx,
				title: title,
				ctn: data.message
			});
		}

	})
	.fail(function(data) {
		$('#modal-twobtn').modal('hide');
		$('#modal-onebtn').modal('hide');
		modal.nobtn({
			ctx: ctx,
			title: title,
			ctn: '请求出错，请联系技术人员'
		});
	});
};

module.exports = request;
