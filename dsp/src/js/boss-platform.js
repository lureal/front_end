/*!
 * 平台配置
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
	title: '平台配置',
	active: 'platform'
});

// 初始化顶部栏
header.boss({
	title: '平台配置'
});

//更改weibo平台设置
$('#commit').on('click', function() {
	var bidUrl = $('#bidding-url').val();
	var sendWinBidUrl = $('#bidding-notice').val();
	var qps = $('#qps').val();
	var bid = $('#bid input[name = "Bid"]:checked').val();

	//校验数据
	if(bidUrl === '' || sendWinBidUrl === '' || Number(qps) <= 0 ) {
		modal.nobtn({
			ctx: 'body',
			ctn: '请输入平台配置竞价url，竞赢通知url，qps需要大于0',
			title: '平台配置'
		});
		return;
	}
	ajax.get({
		url: '/admin/platformConfig/submit.do',
		param: {
			platformId: 1,
			bidUrl: bidUrl,
			sendWinBidUrl: sendWinBidUrl,
			qps: parseInt(qps),
			closeBid: bid
		},
		cb: function(data) {
			if(data.data === true) {
				modal.onebtn({
					ctx: 'body',
					ctn: '更改平台设置成功',
					title: '平台配置',
					event: function(){
						location.reload();
					}
				});
			} else {
				modal.nobtn({
					ctx: 'body',
					ctn: '更改平台设置失败',
					title: '平台配置'
				});
			}
		}
	})
});

//定义微博WAX的id的值
var weiboId;

//发送请求，获取平台数据
ajax.get({
	url: '/select/listPlatForms.do',
	cb: function(data) {
		$.each(data.data, function(key,val){
			if(key === '1') {
				weiboId = key;
				return weiboId;
			}
		});

		//成功获得weiboId的值，再发请求
		ajax.get({
			url:'/admin/platformConfig/get.do',
			param: {
				platformId: parseInt(weiboId)
			},
			cb: function(data) {

				//渲染页面数据
				$('#bidding-url').val(data.data.bidUrl);
				$('#bidding-notice').val(data.data.sendWinBidUrl);
				$('#qps').val(data.data.qps);
				if(data.data.closeBid === true) {
					$('input[name="Bid"]:eq(0)').attr('checked', true);
				} else {
					$('input[name="Bid"]:eq(1)').attr('checked', true);
				}
			}
		});
	},
});	

//渲染腾讯页面数据(后台没写腾讯页面的接口，暂时先放着，为了后续需要)
// ajax.get({
// 	url:'/admin/platformConfig/get.do',
// 	param: {
// 		platformId: parseInt('2')
// 	},
// 	cb: function(data) {

// 	   //渲染页面数据
// 	   	if(data.data !== null) {
// 	   		$('#tengxun-bidding-url').val(data.data.bidUrl);
// 			$('#tengxun-bidding-notice').val(data.data.sendWinBidUrl);
// 			$('#tengxun-qps').val(data.data.qps);
// 			if(data.data.closeBid === true) {
// 				$('#tengxun-closeBid').attr('checked', true);
// 			}
// 	   	}
// 	}
// });

// //更改腾讯平台设置
// $('#tengxun-commit').on('click', function() {
// 	var txbidUrl = $('#tengxun-bidding-url').val();
// 	var txsendWinBidUrl = $('#tengxun-bidding-notice').val();
// 	var txqps = $('#tengxun-qps').val();
// 	var txcloseBid = $('#tengxun-closeBid').is(':checked');

// 	//校验数据
// 	if(txbidUrl === '' || txsendWinBidUrl === '' || Number(txqps) <= 0 ) {
// 		modal.nobtn({
// 			ctx: 'body',
// 			ctn: '请输入平台配置竞价url，竞赢通知url，qps需要大于0',
// 			title: '平台配置'
// 		});
// 		return;
// 	}
// 	ajax.get({
// 		url: '/admin/platformConfig/submit.do',
// 		param: {
// 			platformId: parseInt('2'),
// 			bidUrl: txbidUrl,
// 			sendWinBidUrl: txsendWinBidUrl,
// 			qps: parseInt(txqps),
// 			closeBid: txcloseBid
// 		},
// 		cb: function(data) {
// 			if(data.data === true) {
// 				modal.onebtn({
// 					ctx: 'body',
// 					ctn: '更改平台设置成功',
// 					title: '平台配置',
// 					event: function() {
// 						location.reload();
// 					}
// 				});
// 			} else {
// 				modal.onebtn({
// 					ctx: 'body',
// 					ctn: '更改平台设置失败',
// 					title: '平台配置',
// 					event: function() {
// 						location.reload();
// 					}
// 				});
// 			}
// 		}
// 	})
// });


