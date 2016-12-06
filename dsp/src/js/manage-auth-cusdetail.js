/*!
 * 客户管理
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
    title: '客户详情'
});

//获取用户信息
ajax.get({
    url: '/manage/user/get.do',
    param: {
        userId: parseInt(urler.normal().id)
    },
    cb: function(data) {
        data.data.posttime_str = time.unixToTime(data.data.posttime);
        var tpl = $('#customer-info-tpl').html();
        $('#customer-info').html(_.template(tpl)(data));
    },
});

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/manage/user/getCustoms.do',
        param: {
           userId: parseInt(urler.normal().id)
        },
        title: '客户管理'
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
        var tpl = $('#customer-detail-tpl').html();
        $('#customer-detail').html(_.template(tpl)(data));

        // 初始化链接
        urler.initLink();
    }
});

//取消关联
$('body').on('click','.cancel-connection', function() {	
  modal.twobtn({
		ctx: 'body',
		title: '取消关联',
		ctn: '确定取消关联吗？',
        btnOneText: '确定',
        btnTwoText: '取消',
        btnTwoClass: 'btn-default'
	});
    var customId = $(this).attr('data-id');
  	$('#modal-twobtn__btn1').on('click', function(){
  		$('#modal-twobtn').css('display','none');
  		ajax.get({
	        url: '/manage/user/removeCustom.do',
	        param: {
	            userId: parseInt(urler.normal().id),
	            customIds: customId
	        },
	        cb: function(data) {
	        	if(data.data === true) {
	        		modal.onebtn({
						ctx: 'body',
						title: '关联管理',
						ctn: '取消关联成功',
						event: function() {
                            location.reload();
						}
					});
				} else {
					modal.nobtn({
						ctx: 'body',
						title: '关联管理',
						ctn: data.massage
					});
				}
	        }
    	});
  	});

    //取消操作，取消关联操作
    $('body').on('click', '#modal-twobtn__btn2', function() {
        $('#modal-twobtn').css('display','none');
        location.reload();
    });
});




