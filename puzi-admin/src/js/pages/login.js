/*!
 * 登录页面
 */

/**
 * 当前页面主函数，暴露出当前页面的代码
 * @param  {Object} ajax [包装过后的 ajax 对象]
 * @param {Object} modal [包装过后的弹窗对象]
 * @param {Object} regexp [正则表达式检查对象]
 */
var login = function(ajax, modal, regexp) {

	// 登录按钮
	$('#login').on('click', '#login-submit', function() {
		var email = $.trim($('#login-email').val());
		var passwd = $.trim($('#login-pwd').val());

		// 邮箱或者密码字段为空
		if(email === '' || passwd === '') {

			// 设置弹出窗
			modal.nobtn({
				ctx: '#login',
				title: '登录',
				ctn: '请输入邮箱或密码'
			});

			return;
		}

		// 检查邮箱是否输入错误
		if(!regexp.isEmail(email)) {
			modal.nobtn({
				ctx: '#login',
				title: '登录',
				ctn: '请输入正确的邮箱'
			});

			return;
		}

		// 检测完毕，发起请求登录
		ajax.get({
			url: '/admin/login.do',
			param: {
				username: email,
				token: passwd
			},
			cb: function(data) {

				if(data.data == true) {
					location.href = '/#proj_name#/html/home/index.html';
				} else {
					modal.nobtn({
						ctx: '#login',
						title: '登录',
						ctn: '登陆失败'
					});
				}

			},
            modal: modal,
			title: '登录',
			ctx: '#login'
		})
	});
};

module.exports = login;
