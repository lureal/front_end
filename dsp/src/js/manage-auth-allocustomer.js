/*!
 * 分配客户
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var sidebar = require('./modules/sidebar.js');
var select2 = require('./modules/select2.js');
var datePicker = require('./modules/date-picker.js');
var urler = require('./modules/urler.js');
var time = require('./modules/time.js');
var header = require('./modules/header.js');

//初始化菜单
sidebar.manage({
    title: '权限管理',
    active: 'auth'
});

// 初始化顶部栏
header.manage({
    title: '分配权限'
});

//获取用户信息
ajax.get({
	url: '/manage/user/get.do',
    param: {
        userId: parseInt(urler.normal().id)
    },
	cb: function(data) {
        data.data.posttime_str = time.unixToTime(data.data.posttime);
		var tpl = $('#allo-person-tpl').html();
		$('#allo-person').html(_.template(tpl)(data));
	},
})


// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/manage/user/searchCustoms.do',
        param: {
            page: 1,
            export: false,
            userId: parseInt(urler.normal().id)
        },
        title: '权限管理管理'
    },
    $btn: null,
    callback: function(data) {

        // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
        data.data.ajaxParam = encodeURIComponent(JSON.stringify({
            page: 1,
            export: false
        }));

        for(var i = 0; i < data.data.records.length; i++) {
            var val = data.data.records[i];
            val.posttime_str = time.unixToTime(val.posttime);
        }

        // 渲染模板
        var tpl = $('#allo-list-tpl').html();
		$('#allo-list').html(_.template(tpl)(data));
    }
});


//查询按钮
$('#search').click(function() {

	// 获取搜索名称ID
	var keyword = $('#search-customer').val();

	// 执行搜索
	ajax.get({
		url: '/manage/user/searchCustoms.do',
		param: {
			keyword: keyword,
            userId: parseInt(urler.normal().id)

		},
		cb: function(data) {

			// 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
			data.data.ajaxParam = encodeURIComponent(JSON.stringify({
				keyword: keyword,
				page: 1
			}));

			for(var i = 0; i < data.data.records.length; i++) {
	            var val = data.data.records[i];
	            val.posttime_str = time.unixToTime(val.posttime);
        	}
        	
			// 渲染模板
			var tpl = $('#allo-list-tpl').html();
			$('#allo-list').html(_.template(tpl)(data));

		},
		modal: modal,
		title: '客户列表分配'
	});

});

//分配权限

$('#allocation-customer').on('click', function(){
    
	//获取checkbox选中的值
	// var selectVal = $('input:checkbox[name="unselect"]:checked').val();
    var selectVal = [];
    $('input:checkbox[name="unselect"]:checked').each(function() {
        selectVal.push($(this).attr('data-customId'));
          
    });
    var _selectValIds = selectVal.join(',');
	var customId = $('input:checkbox[name="unselect"]:checked').attr('data-customId');

	if(_selectValIds === '') {
		modal.nobtn({
			ctx: 'body',
			title: '分配客户',
			ctn: '你还没有选中客户'
		});
		return;
	}
	ajax.get({
		url: '/manage/user/addCustom.do',
		param: {
			userId: parseInt(urler.normal().id),
			customIds: _selectValIds
		},
		cb: function(data){
			if(data.data === true) {
				modal.onebtn({
					ctx: 'body',
					title: '分配客户',
					ctn: '分配客户成功',
					event: function() {
						location.reload();
					}
				});
			} else {
				modal.nobtn({
					ctx: 'body',
					title: '分配用户',
					ctn: data.message
				});
			}
		}
	});
})