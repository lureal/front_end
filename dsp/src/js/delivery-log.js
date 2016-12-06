/*!
 * 操作日志列表
 **/
var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var sidebar = require('./modules/sidebar.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var time = require('./modules/time.js');
var header = require('./modules/header.js');
var cache = require('./modules/cache.js');
var urler = require('./modules/urler.js');

//初始化菜单
sidebar.delivery({
	title: '操作日志',
	active: 'operate'
});

// 初始化顶部栏
header.delivery({
	title: '操作日志',
});

//初始化操作人列表选择
select2.init({
	url: '/select/listUsers.do',
	title: '操作人',
	cb: function(data) {
		var tpl = $('#delivery-person-tpl').html();
		$('#delivery-person').html(_.template(tpl)(data));
		$('#delivery-person').select2({
			placeholder: '筛选操作人'
		}).select2('val', '');
	}
});

//初始化操作对象
select2.init({
	url: '/select/listOperateTypes.do',
	title: '操作对象',
	cb: function(data) {
		var tpl = $('#delivery-object-tpl').html();
		$('#delivery-object').html(_.template(tpl)(data));
		$('#delivery-object').select2({
			placeholder: '筛选操作对象'
		}).select2('val', '');
	}
})

//初始化投放平台
select2.init({
	url: '/select/listPlatForms.do',
	title: '投放平台',
	cb: function(data) {
		var tpl = $('#delivery-platform-tpl').html();
		$('#delivery-platform').html(_.template(tpl)(data));
		$('#delivery-platform').select2({
			placeholder: '筛选投放平台'
		}).select2('val', '');
	}
})

// 加载列表
lister({
	ajax: ajax,
	ajaxParam: {
		url: '/deal/operate/list.do',
		param: {
			export: false,
			page: 1,
			customId: urler.normal().cid
		},
		title: '客户管理'
	},
	$btn: null,
	callback: function(data) {

		// 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
		data.data.ajaxParam = encodeURIComponent(JSON.stringify({
			page: 1,
			export: false,
			customId: urler.normal().cid
		}));

		for(var i = 0; i < data.data.records.length; i++) {
			var val = data.data.records[i];
			val.posttime_str = time.unixToTime(val.posttime);
		}

		// 渲染模板
		var tpl = $('#delivery-log-tpl').html();
		$('#delivery-log').html(_.template(tpl)(data));
	}
});

// 分页
pager(function(param, $this) {
	lister({
		ajax: ajax,
		ajaxParam: {
			url: '/deal/operate/list.do',
			param: param ,
			title: '操作日志'
		},
		$btn: $this,
		callback: function(data) {

			// 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
			data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));
		   
			for(var i = 0; i < data.data.records.length; i++) {
				var val = data.data.records[i];
				val.posttime_str = time.unixToTime(val.posttime);
			}
			
			// 渲染模板
			var tpl = $('#delivery-log-tpl').html();
			$('#delivery-log').html(_.template(tpl)(data));
		}
	});
});

// 搜索按钮
$('#log-search').on('click', function() {

	//获取日期
	var date = datePicker.getVal('#datepicker');

	// 获取操作人
	var username = select2.getVal({
		id: '#delivery-person'
	});
	
	//获取平台
	var platformId = select2.getVal({
		id: '#delivery-platform'
	});
	
	//获取操作对象
	var type = select2.getVal({
		id: '#delivery-object'
	});

	// 执行搜索
	ajax.get({
		url: '/deal/operate/list.do',
		param: {
			startDate: date.start,
			endDate: date.end,
			userId: username,
			type: type,
			platformId: platformId,
			page: 1,
			export: false,
			customId: urler.normal().cid
		},
		cb: function(data) {
			
			// 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
			data.data.ajaxParam = encodeURIComponent(JSON.stringify({
				startDate: date.start,
				endDate: date.end,
				userId: username,
				type: type,
				platformId: platformId,
				page: 1,
				export: false,
				customId: urler.normal().cid
			}));
			for(var i = 0; i < data.data.records.length; i++) {
				var val = data.data.records[i];
				val.posttime_str = time.unixToTime(val.posttime);
			}

			// 渲染模板
			var tpl = $('#delivery-log-tpl').html();
			$('#delivery-log').html(_.template(tpl)(data));
		},
		modal: modal,
		title: '查询列表管理'
	});	
});

// 初始化搜索条中的日期控件
datePicker.init('#datepicker');

