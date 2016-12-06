/*!
 * 订单管理
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var sidebar = require('./modules/sidebar.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var time = require('./modules/time.js');
var upload = require('./modules/upload.js');
var header = require('./modules/header.js');

// 初始化菜单
sidebar.boss({
	title: '订单管理',
	active: 'bill'
});

// 初始化顶部栏
header.boss({
	title: '订单管理'
});

//发送订单管理请求，获取订单管理详细数据
lister({
	ajax: ajax,
	ajaxParam: {
		 url: '/admin/order/get.do',
		param: {
			page: 1
		},
		title: '订单管理'
	},
	$btn: null,
	callback: function(data) {

		// 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
		data.data.ajaxParam = encodeURIComponent(JSON.stringify({
			page: 1
		}));

		for(var i = 0; i < data.data.records.length; i++) {
            var val = data.data.records[i];
            val.lastBidTime_str = time.unixToTime(val.lastBidTime);
        }

		//渲染模板数据
		var tpl = $('#order-tpl').html();
		$('#order').html(_.template(tpl)(data));
	}
});

// 分页
pager(function(param, $this) {
	lister({
		ajax: ajax,
		ajaxParam: {
			url: '/admin/order/get.do',
			param: param ,
			title: '订单管理'
		},
		$btn: $this,
		callback: function(data) {

			// 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
			data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

			for(var i = 0; i < data.data.records.length; i++) {
	            var val = data.data.records[i];
	            val.lastBidTime_str = time.unixToTime(val.lastBidTime);
	        }

			// 渲染模板
			var tpl = $('#order-tpl').html();
			$('#order').html(_.template(tpl)(data));
		}
	});
});

//初始化订单出价模式列表选择
select2.init({
	url: '/select/listBidMode.do',
	title: '所有订单',
	cb: function(data) {
		var tpl = $('#bill-list-tpl').html();
		$('#bill-list').html(_.template(tpl)(data));
		$('#bill-list').select2({
			placeholder: '所有订单'
		}).select2('val', '');
	}
});

//查询
$('#search').on('click', function(){
	var orderName = $('#order-name').val();
	var orderType = $('#bill-list').val();
	if(orderType === '所有订单') {
		orderType = '';
	}
	ajax.get({
		url: '/admin/order/get.do',
		param: {
			page: 1,
			keyword: orderName,
			bidModeId: orderType
		},
		cb: function(data) {

			// 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                page: 1,
				keyword: orderName,
				bidModeId: orderType
            }));

            for(var i = 0; i < data.data.records.length; i++) {
	            var val = data.data.records[i];
	            val.lastBidTime_str = time.unixToTime(val.lastBidTime);
	        }

			//渲染模板数据
			var tpl = $('#order-tpl').html();
			$('#order').html(_.template(tpl)(data));
		}
	})
});

//点击修改操作模式(要绑定在父元素上)
$('#order').on('click', '#modify-operate', function() {
	var orderId = $(this).attr('data-orderId');
	var priceRange = $(this).attr('data-priceRange');
	var maxValue = priceRange.substring(priceRange.indexOf('~') + 1);
	var minValueCur = priceRange.split('~');
	var minValue = minValueCur[0];
	modal.custom({
		tpl: '#modify-order',
		data: {
			title: '修改出价模式'
		},
	});
	ajax.get({
		url: '/admin/order/get.do',
		param: {
			page: 1,
			keyword: orderId
		},
		cb: function(data) {

			//填充订单出价模式列表选择
			select2.init({
				url: '/select/listBidMode.do',
				title: '所有订单',
				cb: function(selectData) {
					var tpl2 = $('#mode-list-tpl').html();
					$('#modify-mode').html(_.template(tpl2)(selectData));
					$('#modify-mode').select2({
						placeholder: '请选择订单类型'
					}).select2('val', data.data.records[0].modeId);
				}
			});
		}
	})

	//渲染出价范围内的值
	$('#min-value').val(minValue);
	$('#max-value').val(maxValue);

	//提交修改操作模式
	$('#commit').unbind('click').bind('click', function() {
		var modifyCode = $('#modify-mode').val();
		var minValue = $('#min-value').val();
		var maxValue = $('#max-value').val();

		//提交前校验数据
		if( Number(minValue) > Number(maxValue) || modifyCode === null ) {
			$('#modal-custome').modal('hide');
			modal.nobtn({
				ctx: 'body',
                ctn: '最大出价范围需大于最小出价范围，选择出价模式',
                title: '订单管理'
			});
			return;
		}
		ajax.get({
			url: '/admin/order/updateBidMode.do',
			param: {
				orderId : parseInt(orderId),
				priceRange: minValue + '~' + maxValue ,
				bidModeId: parseInt(modifyCode)
			},
			cb: function(data) {

				// 隐藏当前弹出框
                $('#modal-custome').modal('hide');
                if(data.data === true) {
                    modal.onebtn({
                        ctx: 'body',
                        ctn: '修改出价模式成功',
                        title: '订单管理',
                        event: function() {
                            location.reload();
                        }
                	});
				} else {
					modal.onebtn({
                        ctx: 'body',
                        ctn: '修改出价模式失败',
                        title: '订单管理',
                        event: function() {
                            location.reload();
                        }
                	});
				}
			}
		})
	});

	// 取消
	$('#cancel').unbind('click').bind('click', function() {
		$('#modal-custome').modal('hide');
	});

});



