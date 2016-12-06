/*!
 * 添加图片
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var upload = require('./modules/upload');
var urler = require('./modules/urler');



// 根据 url 中的 id 获取图片详情
ajax.get({
	url: '/admin/introduce/get_title.do',
	param: {
		id: urler.normal().id
	},
	cb: function(data) {

		
		// 填充数据
		$('#event-description').val(data.data[0]);
		$('#about-description').val(data.data[1]);
	},
	modal: modal,
	title: '页面描述'
});

// 添加
$('#submit').click(function() {
	var _eventdescription = $('#event-description').val();  
	var _aboutdescription = $('#about-description').val(); 
	var description = getContent($('.page-description'));
	if(_eventdescription === '' ||
	   _aboutdescription === '' 
		) {
		   modal.nobtn({
			   ctx: 'body',
			   title: '添加案例',
			   ctn: '请确保已经输入标题，描述'
		   });
		   return;
	   }

	ajax.post({
		url: '/admin/introduce/update_title.do',
		param: {
			json: JSON.stringify(description)
		},
		cb: function(data) {
			if(data.data === true) {
				modal.onebtn({
					ctx: 'body',
					title: '添加页面描述',
					ctn: '添加页面描述成功',
					event: function() {
						location.href = '/#proj_name#/html/introduce/list.html';
					}
				});
			} else {
				modal.nobtn({
					ctx: 'body',
					title: '添加页面描述',
					ctn: data.message
				});
			}
		},
		modal: modal,
		title: '添加页面描述'
	});
});


/**
 * 获取案例内容，拼接成数组
 * @param {Object} $wrap [包含块]
 */
function getContent($wrap) {
	var contents = [];
	$wrap.each(function() {
		var _eventdescription = $('#event-description', $(this)).val();
		var _aboutdescription = $('#about-description', $(this)).val();

		contents.push(_eventdescription);
		contents.push(_aboutdescription);
	});

	return contents;
}


