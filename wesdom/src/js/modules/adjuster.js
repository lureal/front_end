/*!
 * 界面调整工具
 * 根据屏宽动态改变 html 字体大小
 * 检测当前如果不是 pc 环境，则根据屏幕宽度大小计算出比例，再调整位于 html 中的字体大小
 * css 中的元素根据 html 的 font-size 动态设置
 */

var adjuster = function() {
	var docEl = document.documentElement;
	var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
	var recalc = function() {
		var clientWidth = docEl.clientWidth;

		if(!clientWidth) {
			return;
		}

		var docElWidth =  100 * (clientWidth / 320);

		if(docElWidth > 200) {
			docElWidth = 200;
		}

		docEl.style.fontSize = docElWidth + 'px';
	};

	if(!document.addEventListener) {
		return;
	}

	window.addEventListener(resizeEvt, recalc, false);
	document.addEventListener('DOMContentLoaded', recalc, false);
};

module.exports = adjuster;
