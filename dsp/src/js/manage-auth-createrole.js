/*!
 * 创建新角色
 **/
var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var sidebar = require('./modules/sidebar.js');
var select2 = require('./modules/select2.js');
var urler = require('./modules/urler.js');
var header = require('./modules/header.js');

//初始化菜单
sidebar.manage({
    title: '权限管理',
    active: 'auth'
});

// 初始化顶部栏
header.manage({
    title: '创建角色'
});

//初始化角色
select2.init({
	url: '/select/listRoles.do',
	title: '角色',
	cb: function(data) {
		var tpl = $('#role-list-tpl').html();
		$('#role-list').html(_.template(tpl)(data));
		$('#role-list').select2({
			placeholder: '选择角色'
		}).select2('val', '');
	}
});

//初始化权限列表
ajax.get({
    url: '/select/listPermissions.do',
    cb: function(data) {
        
        // 渲染模板
        var tpl = $('#permission-role-tpl').html();
        $('#permission-role').html(_.template(tpl)(data));
    }
})

//修改页面角色
var url = decodeURIComponent(window.location.href);
var modifyFlag = decodeURIComponent(getQuery().id);
if(getQuery().id) {
	ajax.get({
		url: '/manage/user/get.do',
		param: {
	        userId: parseInt(urler.normal().id)
	    },
	    cb: function(data) {

	        // 填充数据
	        // 填充人员名称
	        $('#person-name').val(data.data.name);

	        //填充账号
	        $('#account').val(data.data.username);
	        $('#account').attr('disabled', true);

	        // 填充 角色
	        select2.init({
	            url: '/select/listRoles.do?id=role',
	            title: '角色',
	            cb: function(_data) {
	                var tpl = $('#role-list-tpl').html();
	                $('#role-list').html(_.template(tpl)(_data));
	                $('#role-list').select2({
	                    placeholder: '选择角色'
	                }).select2('val', data.data.roleId);
	            }
	        });

	     	//填充权限
			$('input:checkbox[name="customer-manage"]').each(function() {
				for(var i=0; i < data.data.permissionIds.length ; i++) {
					var checkbox = $(this).attr('data-id');
					if(data.data.permissionIds[i] == checkbox ) {
		     			$(this).prop('checked',true);
		     		}
		     	}
			});
		}
	});
}

//保存角色
$('body').on('click','.save-role', function(){

	//人员名称
	_personName = $('#person-name').val();

	//用户账号
	_account =  $('#account').val();

	//获取角色的值
	var role = select2.getVal({
		id: '#role-list'
	});

	//获取userId的值
	var userId = urler.normal().id;

	//获取checkbox 的选中值
    var permissionVal = [];
    $('input:checkbox[name="customer-manage"]:checked').each(function() {
        permissionVal.push($(this).attr('data-id'));    
    });
    var _permissdionIds = permissionVal.join(',');
    
    // 校验数据
    if(_personName === '' || _account ==='' || role === null) {
    	modal.nobtn({
    		ctx: 'body',
    		title: '创建角色',
    		ctn: '请填写人员名称，账号，角色，权限字段'
    	})
    	return;
    }
	ajax.post({
		url: '/manage/user/submit.do',
		param: {
			username : _account,
			name : _personName,
			roleId: role,
			permissionIds : _permissdionIds,
			userId: userId
		},
		cb: function(data) {
			if(data.data === true) {
				modal.onebtn({
					ctx: 'body',
					title: '客户提交',
					ctn: '保存成功',
					event: function(){
						location.href = '/#proj_name#/html/manage/auth/list.html';
					}
				});
			} else {
				modal.onebtn({
					ctx: 'body',
					title: '客户详情',
					ctn: '保存失败'
				});
			}
		},
		modal: modal,
		title: '保存客户'
	})
});

/**
 * 获取 url 中的参数
 * @return 参数数组
 */
function getQuery() {
	var queryString = {},
		query = window.location.search.substring(1),
		queryArr = query.split("&");
		for(var i = 0; i < queryArr.length; i++) {
			var pair = queryArr[i].split('=');
			if (typeof queryString[pair[0]] === 'undefined') {
				queryString[pair[0]] = pair[1];
			} else if(typeof queryString[pair[0]] === 'string') {
				var arr = [ queryString[pair[0]], pair[1] ];
				queryString[pair[0]] = arr;
			} else {
				queryString[pair[0]].push(pair[1]);
			}
		}
	return queryString;
}
