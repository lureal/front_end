/*!
 * 正则表达式模块
 */

// 正则表达式对象
var regexp = {

	/**
	 * 检查传入字符串是否为手机
	 * @param  {String}  str [等待检测的字符串]
	 * @return {Boolean}     [str是手机，返回true，str不是手机，返回false]
	 */
	isEmail: function(str) {
		var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

		if(regex.test(str)) {
			return true;
		}

		return false;
	}

};

module.exports = regexp;
