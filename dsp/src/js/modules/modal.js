/*!
 * 发起弹窗模块
 */

var modal = {};

/**
 * 设置无按钮弹出框的内容
 * @param  {Object} obj [设置弹出框所需的参数，作用域，标题，内容]
 */
modal.nobtn = function(obj) {
	var ctx, title, ctn;

	ctx = obj.ctx ? obj.ctx : undefined;
	title = obj.title ? obj.title : undefined;
	ctn = obj.ctn ? obj.ctn : undefined;

	$(ctx + ' #modal-nobtn__title').html(title);
	$(ctx + ' #modal-nobtn__ctn').html(ctn);
	$(ctx + ' #modal-nobtn').modal();
	
};

/**
 * 设置只有一个按钮的弹出框
 * @param  {Object} obj [设置弹出框所需的参数，作用域，标题，内容，按钮事件]
 */
modal.onebtn = function(obj) {
	var ctx, title, ctn, event;

	ctx = obj.ctx ? obj.ctx : undefined;
	title = obj.title ? obj.title : undefined;
	ctn = obj.ctn ? obj.ctn : undefined;
	btnText = obj.btnText ? obj.btnText : '确定';
	btnClass = obj.btnClass ? obj.btnClass : 'btn-primary';
	event = obj.event ? obj.event : function() {};

	$(ctx + ' #modal-onebtn__title').html(title);
	$(ctx + ' #modal-onebtn__ctn').html(ctn);
	$(ctx + ' #modal-onebtn__btn').html(btnText);
	$(ctx + ' #modal-onebtn__btn').addClass(btnClass);
	$(ctx + ' #modal-onebtn__btn').off('click').on('click', event);
	$(ctx + ' #modal-onebtn').modal();
};

/**
 * 设置只有两个按钮的弹出框
 * @param  {Object} obj [设置弹出框所需的参数，作用域，标题，内容，按钮1事件，按钮2事件]
 */
modal.twobtn = function(obj) {
	var ctx, title, ctn, eventOne, eventTwo;

	ctx = obj.ctx ? obj.ctx : undefined;
	title = obj.title ? obj.title : undefined;
	ctn = obj.ctn ? obj.ctn : undefined;
	btnOneText = obj.btnOneText ? obj.btnOneText : '确定';
	btnOneClass = obj.btnOneClass ? obj.btnOneClass : 'btn-primary';
	btnTwoText = obj.btnTwoText ? obj.btnTwoText : '确定';
	btnTwoClass = obj.btnTwoClass ? obj.btnTwoClass : 'btn-primary';
	eventOne = obj.eventOne ? obj.eventOne : function() {};
	eventTwo = obj.eventTwo ? obj.eventTwo : function() {};

	$(ctx + ' #modal-twobtn__title').html(title);
	$(ctx + ' #modal-twobtn__ctn').html(ctn);
	$(ctx + ' #modal-twobtn__btn1').html(btnOneText);
	$(ctx + ' #modal-twobtn__btn1').addClass(btnOneClass);
	$(ctx + ' #modal-twobtn__btn1').off('click').on('click', eventOne);
	$(ctx + ' #modal-twobtn__btn2').html(btnTwoText);
	$(ctx + ' #modal-twobtn__btn2').addClass(btnTwoClass);
	$(ctx + ' #modal-twobtn__btn2').off('click').on('click', eventTwo);
	$(ctx + ' #modal-twobtn').modal();
};


/**
 * 自定义弹窗
 * @param {Object} obj [初始化弹窗所需要的对象]
 */
modal.custom = function(obj) {
	var tpl = obj.tpl ? obj.tpl : '';
	var ctx = obj.ctx ? obj.ctx : '';
	var data = obj.data ? obj.data : {};

	$(ctx + ' .modal-custom-content').html(_.template($(tpl).html())(data));
	$(ctx + ' .modal-custom').modal();

}

module.exports = modal;
