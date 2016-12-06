/*!
 * 工具相关模块
 */

var util = {

	/**
	 * 通过对象的属性值来获取对象的属性名称，前提是所有对象都不重叠
	 * @return {String} [属性名称]
	 */
	getPropByValue: function(value, object) {
		var prop;

		for(var _prop in object) {
			if(value === object[_prop]) {
				prop = _prop
			}
		}

		return prop;
	},

	/**
	 * 通过数组的值匹配到对象数组的对象，并返回
	 * @param  {Array} valArr [数组]
	 * @param  {Array} objArr [对象数组]
	 * @return {Array}        [匹配结果]
	 */
	getObjByValue: function(arr, objArr) {
		var dest = [];
	
		// 循环值数组
		for(var i = 0; i < arr.length; i++) {
			
			// 循环出对象数组
			for(var j = 0; j < objArr.length; j++) {
				
				for(prop in objArr[j]) {

					// 数组对象的值跟数组的值相等
					if((objArr[j][prop]) === arr[i]) {
						dest.push(objArr[j]);
					}
				}
			}
		}

		return dest;
	}
};

module.exports = util;