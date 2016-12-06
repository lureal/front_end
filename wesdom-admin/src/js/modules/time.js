/*!
 * 格式化时间模块
 */

var time = {

	/**
	 * 将 unix 时间戳转换成正常的时间
	 * @param  {Number} unixTime [服务器传递过来的 unix 时间戳，一般为 13 位整数]
	 * @return {String}          [正常的时间字符串]
	 */
	unixToTime: function(unixTime) {
		return moment.unix(unixTime / 1000).format('YYYY-MM-DD hh:mm:ss A');
	},

	/**
	 * 将 unix 时间戳转换 Ddaterangepicker 的自负床
	 * @param  {Number} unixTime [服务器传递过来的 unix 时间戳，一般为 13 位整数]
	 * @return {String}          [Ddaterangepicker 显示的时间格式]
	 */
	unixToPluginTime: function(unixTime) {
		return moment.unix(unixTime / 1000).format('MM/DD/YYYY hh:mm A');
	},

	/**
	 * 将 Ddaterangepicker 插件的时间格式化成传递给服务器的时间
	 * @param  {String} time [Ddaterangepicker 显示的时间]
	 * @return {Object}      [包含开始时间和结束时间的对象]
	 */
	formatPluginTime: function(time) {
		var startDate, // 开始时间日期
			startMonth, // 开始时间月份
			startYear, // 开始时间年份
			startHour, // 开始时间小时
			startMinute, // 开始时间分钟
			endDate, // 结束时间日期
			endMonth, // 结束时间月份
			endYear, // 结束时间年份
			endHour, // 结束时间小时
			endMinute, // 结束时间分钟
			isStartAM, // 开始时间是否是在早上
			isEndAM; // 结束时间是否是在早上
		
		startMonth = time.slice(0, 2);
		startDate = time.slice(3, 5);
		startYear = time.slice(6, 10);
		startHour = time.slice(11, 13);
		startMinute = time.slice(14, 16);
		isStartAM = time.slice(17, 19) === 'AM';

		endMonth = time.slice(22, 24);
		endDate = time.slice(25, 27);
		endYear = time.slice(28, 32);
		endHour = time.slice(33, 35);
		endMinute = time.slice(36, 38);
		isEndAM = time.slice(39, 41) === 'AM';

		if(!isStartAM) {
			startHour = String(Number(startHour) + 12)
		}

		if(!isEndAM) {
			endHour = String(Number(endHour) + 12);
		}

		return {
			start: startYear +'-' + startMonth + '-' +startDate + ' ' +
				startHour + ':' + startMinute + ':00',
			end: endYear + '-' + endMonth + '-' + endDate + ' ' +
				endHour + ':' + endMinute + ':00'
		};
	}
};

module.exports = time;