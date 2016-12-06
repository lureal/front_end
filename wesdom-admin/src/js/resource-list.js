/*!
 * 资源列表
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var time = require('./modules/time.js');
var storage = require('./modules/storage.js');

// 加载社交网络资源列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/resource/list.do',
        param: {
            page: 1,
            type: 1
        },
        title: '资源'
    },
    $btn: null,
    callback: function(data) {

        for(var i = 0; i < data.data.resources.length; i++) {
            var val = data.data.resources[i];
            val.posttime_str = time.unixToTime(val.posttime);
        }

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#social-resource').html(_.template(tpl)(data));
    }
});

// 加载网络媒体资源列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/resource/list.do',
        param: {
            page: 1,
            type: 2
        },
        title: '资源'
    },
    $btn: null,
    callback: function(data) {

        for(var i = 0; i < data.data.resources.length; i++) {
            var val = data.data.resources[i];
            val.posttime_str = time.unixToTime(val.posttime);
        }

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#media-resource').html(_.template(tpl)(data));
    }
});

// 加载网络媒体资源列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/resource/list.do',
        param: {
            page: 1,
            type: 3
        },
        title: '资源'
    },
    $btn: null,
    callback: function(data) {

        for(var i = 0; i < data.data.resources.length; i++) {
            var val = data.data.resources[i];
            val.posttime_str = time.unixToTime(val.posttime);
        }

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#app-resource').html(_.template(tpl)(data));
    }
});

// 社交网络分页
pager(function(page, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/resource/list.do',
            param: {
                page: page
            },
            title: '资源'
        },
        $btn: $this,
        callback: function(data) {

            for(var i = 0; i < data.data.resources.length; i++) {
                var val = data.data.resources[i];
                val.posttime_str = time.unixToTime(val.posttime);
            }

            var tpl = $('#list-tpl').html();
            $('#social-resource').html(_.template(tpl)(data));
        }
    });
}, $('#social-resource'));

// 网络媒体分页
pager(function(page, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/resource/list.do',
            param: {
                page: page
            },
            title: '资源'
        },
        $btn: $this,
        callback: function(data) {

            for(var i = 0; i < data.data.resources.length; i++) {
                var val = data.data.resources[i];
                val.posttime_str = time.unixToTime(val.posttime);
            }

            var tpl = $('#list-tpl').html();
            $('#media-resource').html(_.template(tpl)(data));
        }
    });
}, $('#media-resource'));

// 网络媒体分页
pager(function(page, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/resource/list.do',
            param: {
                page: page
            },
            title: '资源'
        },
        $btn: $this,
        callback: function(data) {

            for(var i = 0; i < data.data.resources.length; i++) {
                var val = data.data.resources[i];
                val.posttime_str = time.unixToTime(val.posttime);
            }

            var tpl = $('#list-tpl').html();
            $('#app-resource').html(_.template(tpl)(data));
        }
    });
}, $('#app-resource'));

// 删除资源
$('body').on('click', '.delete', function() {
    var id = $(this).attr('data-id');
    ajax.post({
        url: '/admin/resource/delete.do',
        param: {
            id: id
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '资源',
                    ctn: '删除资源成功',
                    event: function() {
                        location.reload();
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '资源',
                    ctn: data.message
                });
            }
        }
    });
});

// 上下移动资源
$('body').on('click', '.move', function() {
    var dir = $(this).attr('data-direction');
    var id = $(this).attr('data-id');
    var text = dir === '1' ? '前移' : '后移';

    ajax.post({
        url: '/admin/resource/move.do',
        param: {
            id: id,
            direction: dir
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '资源',
                    ctn: text + '成功',
                    event: function() {
                        location.reload();
                    }
                });
            } else {
                modal.onebtn({
                    ctx: 'body',
                    title: '资源',
                    ctn: text + '失败',
                    event: function() {
                        location.reload();
                    }
                });
            }
        }
    });
});

// 资源详情
$('body').on('click', '.detail', function() {
    var id = Number($(this).attr('data-id'));

    location.href = '/#proj_name#/html/resource/detail.html';
});
