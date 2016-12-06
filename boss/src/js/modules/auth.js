/*!
 * 菜单，页面权限，个人信息
 *
 * 菜单和权限还有个人信息的接口是合在一起的，菜单和个人信息就是单纯使用 underscore 模板渲染菜单，接着判定是否有看
 * 整个页面的权限如果有，则展示，没有则展示没有权限，页面权限有多种情况
 *
 * 1. 页面中没有工具栏，操作按钮就放在头部，如，人员管理。
 *    这种情况下只需要在 html 中隐藏所有的按钮，然后按需展示，如果是表格头部的按钮则在 body
 *    上添加 show-table-del 或 show-table-detail 之类的类名来展示或者隐藏表格的按钮
 *
 * 2. 页面中有工具栏并且工具栏只有导入和导出（头部没导出），如，基础数据管理。
 *    这种情况下除了头部和表格按钮按照 1 所示的方式操作之外，还需要判定，权限是否有导出或搜索，
 *    如果有，就展示工具栏，如果没有就不展示，接着再判定是否有搜索按钮，如果有，展示搜索按钮，
 *    如果没有，不展示，导出按钮同理
 *
 * 3. 页面中有工具栏并且不只有导入和导出按钮，还有其他的按钮，如，产品为度统计。
 *    这种情况下除了头部和表格按钮按照 1 所示的方式操作之外，工具栏中的按钮在 html 中应该全部
 *    隐藏，然后按需展示
 */

var ajax = require('./ajax');
var modal = require('./modal');
var auth = {};

/**
 * 页面中没有工具栏的情况
 * @param {Object} ajaxParam [ajax 参数，包含：url, param, title, cb，代码中解释]
 */
auth.noToolbar = function(ajaxParam) {

    // 设置默认参数
    // 包含请求链接（url），请求参数（param），弹出框标题（title），回调函数（cb）
    var url = ajaxParam.url ? ajaxParam.url : '/admin/user/list_menus.do';
    var param = ajaxParam.param ? ajaxParam.param : { url: location.pathname };
    var title = ajaxParam.title ? ajaxParam.title : '';
    var cb = ajaxParam.cb ? ajaxParam.cb : function() {};

    // 发起请求
    ajax.get({
        url: url,
        param: param,
        cb: function(data) {

            // 渲染菜单和菜单上面的个人信息
            var tpl = $('#main-sidebar-tpl').html();
            $('#main-sidebar').html(_.template(tpl)(data));

            // 渲染个人信息
            $('#header-custome').html(_.template($('#header-custome-tpl').html())(data));


            // 判定是否有展示页面的权限
            // 有权限，显示实际内容
            if(data.data.haveRight) {
                $('.content-no-auth').css('display', 'none');
                $('.content-have-auth').css('display', 'block');

                // 根据接口返回的权限展示按钮
                // 按钮及判定总共有下面几种：
                // 下载模板和导入模板 -> import
                // 添加数据         -> add
                // 同步数据         -> sync
                // 导出数据         -> export
                _.each(data.data.actions, function(val) {

                    // 设置头部按钮展示与否
                    // 导入数据
                    if(val.code === 'import') {

                        // 如果页面中有导入按钮，则显示导入按钮
                        if($('.import-btn').size() > 0) {
                            $('.import-btn').css('display', 'inline-block');
                        }

                        // 如果页面中有下载按钮，显示下载模板
                        if($('.download-btn').size() > 0) {
                            $('.download-btn').css('display', 'inline-block');
                        }
                    }

                    // 添加数据
                    if(val.code === 'add') {
                        if($('.add-btn').size() > 0) {
                            $('.add-btn').css('display', 'inline-block');
                        }
                    }

                    // 同步数据
                    if(val.code === 'sync') {
                        if($('.sync-btn').size() > 0) {
                            $('.sync-btn').css('display', 'inline-block');
                        }
                    }

                    // 导出数据
                    if(val.code === 'export') {
                        if($('.export-btn').size() > 0) {
                            $('.export-btn').css('display', 'inline-block');
                        }
                    }

                    // 设置表格权限按钮展示与否
                    // 查看详情按钮
                    if(val.code === 'detail') {
                        $('body').addClass('table-btn-detail');
                    }

                    //设置主管
                    if(val.code === 'addmgr') {
                        $('body').addClass('table-btn-depart');
                    }

                    // 删除
                    if(val.code === 'del') {
                        $('body').addClass('table-btn-del');
                    }

                    // 角色分配
                    if(val.code === 'assignrole') {
                        $('body').addClass('table-btn-assignrole');
                    }

                    // 权限分配
                    if(val.code === 'assignright') {
                        $('body').addClass('table-btn-assignright');
                    }

                    // 部门下用户
                    if(val.code === 'userunderdepart') {
                        $('body').addClass('table-btn-userunderdepart');
                    }

                    // 角色下用户
                    if(val.code === 'userunderrole') {
                        $('body').addClass('table-btn-userunderrole');
                    }

                    // 角色下权限
                    if(val.code === 'rightunderrole') {
                        $('body').addClass('table-btn-rightunderrole');
                    }

                    // 显示资产
                    if(val.code === 'showasset') {
                        $('body').addClass('table-btn-showasset');
                    }

                    // 隐藏资产
                    if(val.code === 'hideasset') {
                        $('body').addClass('table-btn-hideasset');
                    }

                    // 主管打分
                    if(val.code === 'staffscore') {
                        $('body').addClass('table-btn-staffscore');
                    }

                    // 环评打分
                    if(val.code === 'departscore') {
                        $('body').addClass('table-btn-departscore');
                    }

                    // 预定会议室，编辑通告
                    if(val.code === 'notice') {
                        $('body').addClass('table-btn-notice')
                    }

                    // 我的客户明细,客户转出
                    if(val.code === 'customerout') {
                        $('body').addClass('table-btn-customerout')
                    }

                    // 我的客户明细,渠道商明细
                    if(val.code === 'channeldetail') {
                        $('body').addClass('table-btn-channeldetail')
                    }

                });

                // 如果有其他操作则执行其他操作
                cb();

            // 没有权限，显示没有权限内容
            } else {
                $('.content-have-auth').css('display', 'none');
                $('.content-no-auth').css('display', 'block');
            }
        },
        modal: modal,
        title: title
    });
};

/**
 * 页面中有工具栏并且工具栏只有导入和导出的情况
 * @param {Object} ajaxParam [ajax 参数，包含：url, param, title, cb，代码中解释]
 */
auth.toolbar1 = function(ajaxParam) {

    // 设置默认参数
    // 包含请求链接（url），请求参数（param），弹出框标题（title），回调函数（cb）
    var url = ajaxParam.url ? ajaxParam.url : '/admin/user/list_menus.do';
    var param = ajaxParam.param ? ajaxParam.param : { url: location.pathname };
    var title = ajaxParam.title ? ajaxParam.title : '';
    var cb = ajaxParam.cb ? ajaxParam.cb : function() {};

    // 发起请求
    ajax.get({
        url: url,
        param: param,
        cb: function(data) {

            // 缓存用户登录名、登录ID
            localStorage.setItem('userName', data.data.userInfo.userName);
            localStorage.setItem('userId', data.data.userInfo.userId);

            // 渲染菜单
            var tpl = $('#main-sidebar-tpl').html();
            $('#main-sidebar').html(_.template(tpl)(data));

            // 渲染个人信息
            $('#header-custome').html(_.template($('#header-custome-tpl').html())(data));

            // 判定是否有展示页面的权限
            // 有权限，显示实际内容
            if(data.data.haveRight) {
                $('.content-no-auth').css('display', 'none');
                $('.content-have-auth').css('display', 'block');

                // 根据接口返回的权限展示按钮
                // 按钮及判定总共有下面几种：
                // 下载模板和导入模板 -> import
                // 添加数据         -> add
                // 同步数据         -> sync
                // 导出数据         -> export
                _.each(data.data.actions, function(val) {

                    // 设置头部按钮展示与否
                    // 导入数据
                    if(val.code === 'import') {

                        // 如果页面中有导入按钮，则显示导入按钮
                        if($('.import-btn').size() > 0) {
                            $('.import-btn').css('display', 'inline-block');
                        }

                        // 如果页面中有下载按钮，显示下载模板
                        if($('.download-btn').size() > 0) {
                            $('.download-btn').css('display', 'inline-block');
                        }
                    }

                    // 添加数据
                    if(val.code === 'add') {
                        if($('.add-btn').size() > 0) {
                            $('.add-btn').css('display', 'inline-block');
                        }
                    }

                    // 同步数据
                    if(val.code === 'sync') {
                        if($('.sync-btn').size() > 0) {
                            $('.sync-btn').css('display', 'inline-block');
                        }
                    }

                    // 设置工具栏搜索和导出按钮
                    // 是否展示工具栏目
                    if(val.code === 'export' || val.code === 'search') {
                        if($('.table-toolbar').size() > 0) {
                            $('.table-toolbar').css('display', 'block');
                        }

                        // 导出按钮
                        if(val.code === 'export') {
                            if($('.export-btn').size() > 0) {
                                $('.export-btn').css('display', 'inline-block');
                            }
                        }

                        // 搜索按钮
                        if(val.code === 'search') {
                            if($('.search-btn').size() > 0) {
                                $('.search-btn').css('display', 'inline-block');
                            }
                        }
                    }

                    // 设置表格权限按钮展示与否
                    // 查看详情按钮
                    if(val.code === 'detail') {
                        $('body').addClass('table-btn-detail');
                    }

                    // 删除
                    if(val.code === 'del') {
                        $('body').addClass('table-btn-del');
                    }

                    // 角色分配
                    if(val.code === 'assignrole') {
                        $('body').addClass('table-btn-assignrole');
                    }

                    // 权限分配
                    if(val.code === 'assignright') {
                        $('body').addClass('table-btn-assignright');
                    }

                    // 部门下用户
                    if(val.code === 'userunderdepart') {
                        $('body').addClass('table-btn-userunderdepart');
                    }

                    // 角色下用户
                    if(val.code === 'userunderrole') {
                        $('body').addClass('table-btn-userunderrole');
                    }

                    // 角色下权限
                    if(val.code === 'rightunderrole') {
                        $('body').addClass('table-btn-rightunderrole');
                    }

                    // 显示资产
                    if(val.code === 'showasset') {
                        $('body').addClass('table-btn-showasset');
                    }

                    // 隐藏资产
                    if(val.code === 'hideasset') {
                        $('body').addClass('table-btn-hideasset');
                    }

                    // 主管打分
                    if(val.code === 'staffscore') {
                        $('body').addClass('table-btn-staffscore');
                    }

                    // 环评打分
                    if(val.code === 'departscore') {
                        $('body').addClass('table-btn-departscore');
                    }

                    // 预定会议室，编辑通告
                    if(val.code === 'notice') {
                        $('body').addClass('table-btn-notice')
                    }

                    // 我的客户明细,客户转出
                    if(val.code === 'customerout') {
                        $('body').addClass('table-btn-customerout')
                    }

                    // 我的客户明细,渠道商明细
                    if(val.code === 'channeldetail') {
                        $('body').addClass('table-btn-channeldetail')
                    }

                });

                // 如果有其他操作则执行其他操作
                cb();

            // 没有权限，显示没有权限内容
            } else {
                $('.content-have-auth').css('display', 'none');
                $('.content-no-auth').css('display', 'block');
            }
        },
        modal: modal,
        title: title
    });

};

/**
 * 页面中有工具栏并且工具栏不仅仅有导入，导出，还有别的按钮
 * @param {Object} ajaxParam [ajax 参数，包含：url, param, title, cb，代码中解释]
 */
auth.toolbar2 = function(ajaxParam) {

    // 设置默认参数
    // 包含请求链接（url），请求参数（param），弹出框标题（title），回调函数（cb）
    var url = ajaxParam.url ? ajaxParam.url : '/admin/user/list_menus.do';
    var param = ajaxParam.param ? ajaxParam.param : { url: location.pathname };
    var title = ajaxParam.title ? ajaxParam.title : '';
    var cb = ajaxParam.cb ? ajaxParam.cb : function() {};

    // 发起请求
    ajax.get({
        url: url,
        param: param,
        cb: function(data) {

            // 渲染菜单
            var tpl = $('#main-sidebar-tpl').html();
            $('#main-sidebar').html(_.template(tpl)(data));

            // 渲染个人信息
            $('#header-custome').html(_.template($('#header-custome-tpl').html())(data));

            // 判定是否有展示页面的权限
            // 有权限，显示实际内容
            if(data.data.haveRight) {
                $('.content-no-auth').css('display', 'none');
                $('.content-have-auth').css('display', 'block');

                // 根据接口返回的权限展示按钮
                // 按钮及判定总共有下面几种：
                // 下载模板和导入模板 -> import
                // 添加数据         -> add
                // 同步数据         -> sync
                // 导出数据         -> export
                _.each(data.data.actions, function(val) {

                    // 设置头部按钮展示与否
                    // 导入数据
                    if(val.code === 'import') {

                        // 如果页面中有导入按钮，则显示导入按钮
                        if($('.import-btn').size() > 0) {
                            $('.import-btn').css('display', 'inline-block');
                        }

                        // 如果页面中有下载按钮，显示下载模板
                        if($('.download-btn').size() > 0) {
                            $('.download-btn').css('display', 'inline-block');
                        }
                    }

                    // 添加数据
                    if(val.code === 'add') {
                        if($('.add-btn').size() > 0) {
                            $('.add-btn').css('display', 'inline-block');
                        }
                    }

                    // 同步数据
                    if(val.code === 'sync') {
                        if($('.sync-btn').size() > 0) {
                            $('.sync-btn').css('display', 'inline-block');
                        }
                    }

                    // 导出按钮
                    if(val.code === 'export') {
                        if($('.export-btn').size() > 0) {
                            $('.export-btn').css('display', 'inline-block');
                        }
                    }

                    // 搜索按钮
                    if(val.code === 'search') {
                        if($('.search-btn').size() > 0) {
                            $('.search-btn').css('display', 'inline-block');
                        }
                    }

                    // 设置表格权限按钮展示与否
                    // 查看详情按钮
                    if(val.code === 'detail') {
                        $('body').addClass('table-btn-detail');
                    }

                    // 删除
                    if(val.code === 'del') {
                        $('body').addClass('table-btn-del');
                    }

                    // 角色分配
                    if(val.code === 'assignrole') {
                        $('body').addClass('table-btn-assignrole');
                    }

                    // 权限分配
                    if(val.code === 'assignright') {
                        $('body').addClass('table-btn-assignright');
                    }

                    // 部门下用户
                    if(val.code === 'userunderdepart') {
                        $('body').addClass('table-btn-userunderdepart');
                    }

                    // 角色下用户
                    if(val.code === 'userunderrole') {
                        $('body').addClass('table-btn-userunderrole');
                    }

                    // 角色下权限
                    if(val.code === 'rightunderrole') {
                        $('body').addClass('table-btn-rightunderrole');
                    }

                    // 显示资产
                    if(val.code === 'showasset') {
                        $('body').addClass('table-btn-showasset');
                    }

                    // 隐藏资产
                    if(val.code === 'hideasset') {
                        $('body').addClass('table-btn-hideasset');
                    }

                    // 主管打分
                    if(val.code === 'staffscore') {
                        $('body').addClass('table-btn-staffscore');
                    }

                    // 环评打分
                    if(val.code === 'departscore') {
                        $('body').addClass('table-btn-departscore');
                    }

                    // 预定会议室，编辑通告
                    if(val.code === 'notice') {
                        $('body').addClass('table-btn-notice')
                    }

                    // 我的客户明细,客户转出
                    if(val.code === 'customerout') {
                        $('body').addClass('table-btn-customerout')
                    }

                    // 我的客户明细,渠道商明细
                    if(val.code === 'channeldetail') {
                        $('body').addClass('table-btn-channeldetail')
                    }

                });

                // 如果有其他操作则执行其他操作
                cb();

            // 没有权限，显示没有权限内容
            } else {
                $('.content-have-auth').css('display', 'none');
                $('.content-no-auth').css('display', 'block');
            }
        },
        modal: modal,
        title: title
    });
};

module.exports = auth;
