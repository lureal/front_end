/*!
 * 案例列表
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var time = require('./modules/time.js');
var storage = require('./modules/storage.js');

// 缓存案例列表
var cacheCase;

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/case/list.do',
        param: {
            page: 1
        },
        title: '案例'
    },
    $btn: null,
    callback: function(data) {

        for(var i = 0; i < data.data.cases.length; i++) {
            var val = data.data.cases[i];
            val.posttime_str = time.unixToTime(val.posttime);
        }

        cacheCase = data.data.cases;

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#case').html(_.template(tpl)(data));
    }
});

// 加载案例展示列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/case/list_show.do',
        title: '案例'
    },
    $btn: null,
    callback: function(data) {

        // 渲染模板
        var tpl = $('#show-list-tpl').html();
        $('#show-case').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(page, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/case/list.do',
            param: {
                page: page
            },
            title: '案例'
        },
        $btn: $this,
        callback: function(data) {

            for(var i = 0; i < data.data.cases.length; i++) {
                var val = data.data.cases[i];
                val.posttime_str = time.unixToTime(val.posttime);
            }

            var tpl = $('#list-tpl').html();
            $('#case').html(_.template(tpl)(data));
        }
    });
});

// 删除案例
$('body').on('click', '.delete', function() {
    var id = $(this).attr('data-id');
    ajax.post({
        url: '/admin/case/delete.do',
        param: {
            id: id
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '案例',
                    ctn: '删除案例成功',
                    event: function() {
                        location.reload();
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '案例',
                    ctn: data.message
                });
            }
        }
    });
});

// 案例详情
$('body').on('click', '.detail', function() {
    var id = Number($(this).attr('data-id'));

    _.each(cacheCase, function(val, index) {
        if(val.id === id) {
            storage.setSession('case', JSON.stringify(val));
        }
    });

    location.href = '/#proj_name#/html/case/detail.html';
});

$('body').on('click', '.add2show', function() {

    var type = $(this).attr('data-type');
    var id = $(this).attr('data-id');

    ajax.post({
        url: '/admin/case/check_exists.do',
        param: {
            type: type
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '案例',
                    ctn: '该类型的案例已存在，是否覆盖首页案例展示列表中相同类型的案例',
                    event: function(data) {
                        ajax.post({
                            url: '/admin/case/add2Show.do',
                            param: {
                                id: id
                            },
                            cb: function(data) {
                                if(data.data === true) {
                                    modal.onebtn({
                                        ctx: 'body',
                                        title: '案例',
                                        ctn: '添加成功',
                                        event: function() {
                                            location.reload();
                                        }
                                    });
                                } else {
                                    modal.onebtn({
                                        ctx: 'body',
                                        title: '案例',
                                        ctn: '添加失败',
                                        event: function() {
                                            location.reload();
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            } else {
                ajax.post({
                    url: '/admin/case/add2Show.do',
                    param: {
                        id: id
                    },
                    cb: function(data) {
                        if(data.data === true) {
                            modal.onebtn({
                                ctx: 'body',
                                title: '案例',
                                ctn: '添加成功',
                                event: function() {
                                    location.reload();
                                }
                            });
                        } else {
                            modal.onebtn({
                                ctx: 'body',
                                title: '案例',
                                ctn: '添加失败',
                                event: function() {
                                    location.reload();
                                }
                            });
                        }
                    }
                });
            }
        }
    });
});
