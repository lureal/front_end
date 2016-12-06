/*!
 * 本地存储模块
 */

var storage = {

	/**
	 * 获取存储在本地的 sessionStotage
	 * @param  {String} name [存储在本地的 sessionStorage 的名称]
	 * @return {String} [返回存储在 sessionStorage 的值]
	 */
	getSession: function(name) {
		return sessionStorage.getItem(name);
	},

	/**
	 * 根据传递进去的参数传递 sessionStorage
	 * @param {String} name  [等待存储的 sessionStorage 名称]
	 * @param {*} value [等待存储的 sessionStorage 的值]
	 */
	setSession: function(name, value) {
		sessionStorage.setItem(name, value);
	},

	/**
	 * 获取存储在本地的 localStorage
	 * @param  {String} name [存储在本地的 localStorage 的名称]
	 * @return {String} [返回存储在 localStorage 的值]
	 */
	getLocal: function(name) {
		return sessionStorage.getItem(name);
	},

	/**
	 * 根据传递进去的参数传递 sessionStorage
	 * @param {String} name  [等待存储的 sessionStorage 名称]
	 * @param {*} value [等待存储的 sessionStorage 的值]
	 */
	setLocal: function(name, value) {
		localStorage.setItem(name, value);
	}
};

module.exports = storage;
