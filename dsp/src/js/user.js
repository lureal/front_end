/*!
 * 登录页面
 */
var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var blurer = require('./modules/blurer');
var urler = require('./modules/urler');

// 进行登录判断，如果当前登录过了，直接跳转到对应的页面
$.get('/hasLogin.do', function(data) {
	data = JSON.parse(data);

	// 该用户无权访问该请求
	if (data.code === 101) {
		tip('当前用户无权限访问');
		return;
	}

	// 直接跳转到链接
	if (data.code === 300) {
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
		tip(data.message);
		return;
	}

	// 服务器停机维护中
	if(data.code === 501) {
		tip('服务器停机维护中');
		return;
	}

	// 请求成功，需要展示给用户返回的 data
	if(data.code === 201) {
		tip(data.message);
		return;
	}

	if (data.code === 200) {

		// 当前没登录
		if(data.data === false) {
			$('.user-login').show();
			return;
		}

		// 区分系统
		// 进入后台
		if(data.data.roleId === 1) {
			location.href = '/#proj_name#/html/boss/system/index.html';

		// 进入投放系统
		} else if(data.data.roleId === 6) {
			location.href = '/wdsp/overview/index?cid=' + data.data.customId;

		// 进入管理系统
		} else {
			location.href = '/#proj_name#/html/manage/overview/index.html';
		}
	} else {
		tip(data.message);
	}
}).fail(function(data) {
	tip('请求出错，请联系技术人员');
});

// 判断用户是否已经登录
$.post('/hasLogin.do', function(data) {
	data = JSON.parse(data);
	
	// 未登录，跳转到登录页面
	if (data.code === 100) {
		location.href = '/#proj_name#/html/user/login.html';
		return;
	}

	// 该用户无权访问该请求
	if (data.code === 101) {
		tip('当前用户无权限访问');
		return;
	}

	// 直接跳转到链接
	if (data.code === 300) {
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
		tip(data.message);
		return;
	}

	// 服务器停机维护中
	if(data.code === 501) {
		tip('服务器停机维护中');
		return;
	}

	// 请求成功，需要展示给用户返回的 data
	if(data.code === 201) {
		tip(data.message);
		return;
	}
	
	if (data.code === 200) {
		if(data.data === false) {
			tip('请确保输入正确的用户名和密码');
			return;
		}

		// 区分系统
		// 进入后台
		if(data.data.roleId === 1) {
			location.href = '/#proj_name#/html/boss/system/index.html';

		// 进入投放系统
		} else if(data.data.roleId === 6) {
			location.href = '/wdsp/overview/index?cid=' + data.data.customId;

		// 进入管理系统
		} else {
			location.href = '/#proj_name#/html/manage/overview/index.html';
		}
	} else {
		tip(data.message);
	}
}).fail(function(data) {
	tip('请求出错，请联系技术人员');
});

// 登陆
$('body').on('click', '#login-submit', function() {
	var _username = $('#username').val(),
		_password = $('#password').val();

	// 数据有效性校验
	if(_username === '' || _password === '') {
		tip('请确保输入用户名和密码');
		return;
	}

	// 发起请求
	$.post('/login.do', {
		username: _username,
		password: _password
	}, function(data) {
		data = JSON.parse(data);
		
		// 未登录，跳转到登录页面
		if (data.code === 100) {
			location.href = '/#proj_name#/html/user/login.html';
			return;
		}

		// 该用户无权访问该请求
		if (data.code === 101) {
			tip('当前用户无权限访问');
			return;
		}

		// 直接跳转到链接
		if (data.code === 300) {
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
			tip(data.message);
			return;
		}

		// 服务器停机维护中
		if(data.code === 501) {
			tip('服务器停机维护中');
			return;
		}

		// 请求成功，需要展示给用户返回的 data
		if(data.code === 201) {
			tip(data.message);
			return;
		}
		
		if (data.code === 200) {
			if(data.data === false) {
				tip('请确保输入正确的用户名和密码');
				return;
			}

			// 区分系统
			// 进入后台
			if(data.data.roleId === 1) {
				location.href = '/#proj_name#/html/boss/system/index.html';

			// 进入投放系统
			} else if(data.data.roleId === 6) {
				location.href = '/wdsp/overview/index?cid=' + data.data.customId;

			// 进入管理系统
			} else {
				location.href = '/#proj_name#/html/manage/overview/index.html';
			}
		} else {
			tip(data.message);
		}
	}).fail(function(data) {
		tip('请求出错，请联系技术人员');
	});
});

// 回车登录
$('body').keydown(function() {
	if(event.keyCode == '13') {
		$('body #login-submit').click();
	}
});

// 弹出忘记密码弹窗
$('#forget-pwd').click(function() {
	var tpl = $('#find-pwd-tpl').html();
	diy({ ctn: tpl, className: 'login-modal' });
});

// 忘记密码操作
$('body').on('click', '#modal-findpwd', function() {
	var $email = $('#modal-findpwd-email');

    // 当前用户没有输入邮箱
    if ($email.val() === '') {
        showErrorTip($email, '请填写邮箱');
        return;
    }

    // 当前用户填写的邮箱格式不正确
    if (!checkEmail($email.val())) {
        showErrorTip($email, '请填写正确的邮箱');
        return;
    }

	// 发起请求
	$.post('/initPassword.do', {
        username: $email.val()
	}, function(data) {
		data = JSON.parse(data);
		
		// 未登录，跳转到登录页面
		if (data.code === 100) {
			location.href = '/#proj_name#/html/user/login.html';
			return;
		}

		// 该用户无权访问该请求
		if (data.code === 101) {
			tip('当前用户无权限访问');
			return;
		}

		// 直接跳转到链接
		if (data.code === 300) {
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
			tip(data.message);
			return;
		}

		// 服务器停机维护中
		if(data.code === 501) {
			tip('服务器停机维护中');
			return;
		}

		// 请求成功，需要展示给用户返回的 data
		if(data.code === 201) {
			tip(data.message);
			return;
		}
		
		if (data.code === 200) {

			// 发送成功
			if (data.data === true) {
				$('.modal').modal('hide');
				tip('发送成功，请及时查收邮件');
			// 发送失败
			} else {
				showErrorTip($email, '请输入正确的邮箱');
			}
		} else {
			tip(data.message);
		}
	}).fail(function(data) {
		tip('请求出错，请联系技术人员');
	});
});

// 弹出框焦点聚焦
$('body').on('focus', '#modal-findpwd-email', function(e) {
	var $self = $(e.currentTarget);
	$self.parent().removeClass('error');
});

// -------------------------------------------------------------

// 修改密码
$('body').on('click', '#resetpwd-submit', function() {
	var _username = $('#username').val();
	var _oldPassword = $('#oldPassword').val();
	var _newPassword = $('#newPassword').val();
	var _confirmPassword = $('#confirm_password').val();

	// 数据有效性校验
	if(_username === '' || _oldPassword === '' || _newPassword === '' || _confirmPassword === '') {
		modal.nobtn({
			ctx: 'body',
			ctn: '请确保输入用户名，原始密码，新密码，并输入确认密码',
			title: '修改密码'
		});
		return;
	}

	if(_newPassword !== _confirmPassword) {
		modal.nobtn({
			ctx: 'body',
			ctn: '请确保新设置的密码和再次输入的密码相同',
			title: '修改密码'
		});
		return;
	}

	ajax.post({
		url: '/changePassword.do',
		param: {
			username: _username,
			oldPassword: _oldPassword,
			newPassword: _newPassword
		},

		cb: function(data) {
			if(data.data === true) {
				modal.onebtn({
					ctx: 'body',
					title: '修改密码',
					ctn: '修改密码成功',
					event: function() {
						location.href = '/#proj_name#/html/user/login.html';
					}
				});
			} else {
				modal.nobtn({
					ctx: 'body',
					title: '修改密码',
					ctn: '修改密码失败'
				});
			}
		},
		modal: modal
	})
});

// 回车登录
$('body').keydown(function() {
	if(event.keyCode == '13') {
		$('body #resetpwd-submit').click();
	}
});

// 找回密码
$('body').on('click', '#forget-submit', function() {
	var _username = $('#username').val();

	// 数据有效性校验
	if(_username === '') {
		modal.nobtn({
			ctx: 'body',
			ctn: '请输入用户名',
			title: '找回密码'
		});
		return;
	}

	ajax.post({
		url: '/initPassword.do',
		param: {
			username: _username
		},
		cb: function(data) {
			if(data.data === true) {
				modal.nobtn({
					ctx: 'body',
					title: '找回密码',
					ctn: '密码已发到您的邮箱',
				});

			} else {
				modal.nobtn({
					ctx: 'body',
					title: '找回密码',
					ctn: '请输入正确的用户名',
				});
			}
		},
		modal: modal
	});
});

// 回车登录
$('body').keydown(function() {
	if(event.keyCode == '13') {
		$('body #forget-submit').click();
	}
});

// 自适应登录图片
blurer($('.bg'), 1920, 1080);
$(window).bind('resize', function() {
	blurer($('.bg'), 1920, 1080);
});

/**
 * 显示以 msg 为内容提示框
 * @param {String} msg - 纯粹的字符串或者 html 字符
 * @param {Boolean} control - 是否手动控制弹出框的隐藏
 */
function tip(msg, control) {
	$('#tip-content').html(msg);
	$('#tip').fadeIn('fast');

	// 如果当前有控制函数
	if (!control) {
		setTimeout(function() {
			$('#tip').fadeOut('fast');
		}, 1500);
	}
}

/**
 * 显示完全定制弹出框（用户传递 html 字符串，将作为弹出框的内容）
 * @param {String} ctn - html 字符串
 * @param {String} className - 为弹窗设置一个类名
 */
function diy(obj) {
	if (!obj.className) obj.className = '';
	$('#modal-diy').addClass(obj.className);
	$('#modal-diy-body').html(obj.ctn);
	$('#modal-diy').modal();
}

/**
 * 错误处理函数，将找到 $ele 元素的父元素，添加一个 error 类名
 * @param {jQuery} e - input 元素
 * @param {String} msg - 待显示的错误信息
 */
function showErrorTip(e, msg) {
    var parent = e.parent();
    parent.find('.error-tip').html(msg);
    parent.addClass('error');
}

/**
 * 判断传进来是不是 email
 * [stackoverflow](http://stackoverflow.com/questions/46155/validate-email-address-in-javascript)
 *
 * @param {String} email - 邮箱
 * @returns {Boolean} - 如果是，返回 true，如果不是，返回 false
 */
function checkEmail(email) {
    var isEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g.test(email);
    if (!isEmail) return false;
    return true;
};