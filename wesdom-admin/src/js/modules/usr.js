/*!
 * 用户相关模块
 */

var usr = {

	/**
	 * 判断当前是否登录
	 * @return {Boolean} [登录返回 true, 未登录返回 false]
	 */
	isLogin: function() {
		return true;
		var status = $.cookie('JsessionId');

		if(status === undefined || status === '') {
			return false;
		}

		return true;
	}
};

module.exports = usr;