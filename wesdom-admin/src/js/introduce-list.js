/*!
 * 图片列表
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var time = require('./modules/time.js');
var storage = require('./modules/storage.js');
var urler = require('./modules/urler.js');

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/introduce/list_event.do',
        param: {
            page: 1
        },
        title: '案例'
    },
    $btn: null,
    callback: function(data) {
        for(var i = 0; i < data.data.events.length; i++) {
            var val = data.data.events[i];
            val.posttime_str = time.unixToTime(val.posttime);
        }
        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#delvelop').html(_.template(tpl)(data));
    }
});

// 加载关于我们列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/introduce/list_pic.do',
        param: {
            page: 1
        },
        title: '关于我们'
    },
    $btn: null,
    callback: function(data) {
        for(var i = 0; i < data.data.pics.length; i++) {
            var val = data.data.pics[i];
            val.posttime_str = time.unixToTime(val.posttime);
        }
        // 渲染模板
        var tpl = $('#show-list-tpl').html();
        $('#show-aboutlist').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(page, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/introduce/list_event.do',
            param: {
                page: page
            },
            title: '事件'
        },
        $btn: $this,
        callback: function(data) {
            for(var i = 0; i < data.data.events.length; i++) {
                var val = data.data.events[i];
                val.posttime_str = time.unixToTime(val.posttime);
            }
            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#delvelop').html(_.template(tpl)(data));
        }
    });
}, $('#dev_event'));

// 分页
pager(function(page, $this) {
    lister({
        ajax: ajax,
		    ajaxParam: {
		        url: '/admin/introduce/list_pic.do',
		        param: {
		            page: page
		        },
		        title: '关于我们'
		    },
		    $btn: $this,
		    callback: function(data) {
		        for(var i = 0; i < data.data.pics.length; i++) {
		            var val = data.data.pics[i];
		            val.posttime_str = time.unixToTime(val.posttime);
		        }
		        // 渲染模板
		        var tpl = $('#show-list-tpl').html();
		        $('#show-aboutlist').html(_.template(tpl)(data));
		    }
    });
}, $('#about_us'));


// 删除大事件
$('body').on('click', '.event-delete', function() {
    var id = $(this).attr('data-id');
    ajax.post({
        url: '/admin/introduce/delete_event.do',
        param: {
            id: id
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '案例',
                    ctn: '删除事件成功',
                    event: function() {
                        location.reload();
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '事件',
                    ctn: data.message
                });
            }
        }
    });
});

// 删除关于我们
$('body').on('click', '.about-delete', function() {
    var id = $(this).attr('data-id');
    ajax.post({
        url: '/admin/introduce/delete_pic.do',
        param: {
            id: id
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '关于我们',
                    ctn: '删除关于我们成功',
                    event: function() {
                        location.reload();
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '关于我们',
                    ctn: data.message
                });
            }
        }
    });
});

// 关于我们图片上下移动
$('body').on('click', '.move', function() {
    var dir = $(this).attr('data-direction');
    var id = $(this).attr('data-id');
    var text = dir === '1' ? '前移' : '后移';

    ajax.post({
        url: '/admin/introduce/move.do',
        param: {
            id: id,
            direction: dir
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '公司介绍',
                    ctn: text + '成功',
                    event: function() {
                        location.reload();
                    }
                });
            } else {
                modal.onebtn({
                    ctx: 'body',
                    title: '公司介绍',
                    ctn: text + '失败',
                    event: function() {
                        location.reload();
                    }
                });
            }
        }
    });
})
