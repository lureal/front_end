/*!
 * 权限管理列表
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

//初始化菜单
sidebar.manage({
    title: '权限管理',
    active: 'auth'
});

// 初始化顶部栏
header.manage({
 title: '权限管理'
});

//初始化管理人员,用户列表选择
select2.init({
	url: '/select/listUsers.do',
	title: '管理人员',
	cb: function(data) {
		var tpl = $('#manage-person-tpl').html();
		$('#manage-person').html(_.template(tpl)(data));
		$('#manage-person').select2({
			placeholder: '选择管理人员'
		}).select2('val', '');
	}
});

//初始化角色
select2.init({
	url: '/select/listRoles.do',
	title: '角色',
	cb: function(data) {
		var tpl = $('#manage-role-tpl').html();
		$('#manage-role').html(_.template(tpl)(data));
		$('#manage-role').select2({
			placeholder: '选择角色'
		}).select2('val', '');
	}
})

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/manage/user/list.do',
        param: {
        	export: false,
            page: 1
        },
        title: '权限管理'
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
        var tpl = $('#auth-list-tpl').html();
        $('#auth-list').html(_.template(tpl)(data));
    }
});

// 搜索按钮
$('#auth-search').on('click', function() {
   
    // 获取类型
    var username = select2.getVal({
        id: '#manage-person'
    });
    
    //获取角色
    var role = select2.getVal({
    	id: '#manage-role'
    });

    // 执行搜索
    ajax.get({
        url: '/manage/user/list.do',
        param: {
            userId: username,
            roleId: role,
            page: 1,
            export: false
        },
        cb: function(data) {
        	
            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify({
                username: username,
	            roleId: role,
	            page: 1,
	            export: false
            }));

            // 渲染模板
            var tpl = $('#auth-list-tpl').html();
            $('#auth-list').html(_.template(tpl)(data));
        },
        modal: modal,
        title: '查询列表管理'
    }); 
});

// 分页
pager(function(param, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/manage/user/list.do',
            param: param ,
            title: '权限管理'
        },
        $btn: $this,
        callback: function(data) {

            // 构造数据渲染进 html data 方便 pager 调用获取正确的分页数据
            data.data.ajaxParam = encodeURIComponent(JSON.stringify(param));

            // 渲染模板
            var tpl = $('#auth-list-tpl').html();
            $('#auth-list').html(_.template(tpl)(data));
        }
    });
});

//删除用户
$('body').on('click', '.delete', function() {
	var id = $(this).attr('data-id');
    modal.twobtn({
        ctx: 'body',
        ctn: '确定删除用户吗？',
        title: '用户管理',
        btnOneText: '取消',
        btnOneClass: 'btn-default'
    });

    //确定删除
    $('#modal-twobtn__btn2').unbind('click').bind('click', function(data) {   
        ajax.get({
            url: '/manage/user/remove.do',
            param: {
                userId: id
            },
            cb: function(data) {
                $('#modal-twobtn').modal('hide');
                if(data.data === true) {
                    modal.onebtn({
                        ctx: 'body',
                        ctn: '删除用户成功',
                        title: '用户管理',
                        event: function() {
                            location.reload();
                        }
                    });
                } else {
                    modal.nobtn({
                        ctx: 'body',
                        ctn: '删除用户失败',
                        title: '用户管理',
                    });
                }
            }
        })
    });

    // 取消
    $('#modal-twobtn__btn1').unbind('click').bind('click', function() {
        $('#modal-twobtn').modal('hide');
    });
});
