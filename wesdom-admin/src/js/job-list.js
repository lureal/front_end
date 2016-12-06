/*!
 * 职位列表
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var time = require('./modules/time.js');
var storage = require('./modules/storage.js');

// 缓存职位列表
var cacheJob;

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/job/list.do',
        param: {
            page: 1
        },
        title: '职位'
    },
    $btn: null,
    callback: function(data) {

        for(var i = 0; i < data.data.jobs.length; i++) {
            var val = data.data.jobs[i];
            val.posttime_str = time.unixToTime(val.posttime);
        }

        cacheJob = data.data.jobs;

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#job').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(page, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/job/list.do',
            param: {
                page: page
            },
            title: '职位'
        },
        $btn: $this,
        callback: function(data) {

            for(var i = 0; i < data.data.jobs.length; i++) {
                var val = data.data.jobs[i];
                val.posttime_str = time.unixToTime(val.posttime);
            }

            var tpl = $('#list-tpl').html();
            $('#job').html(_.template(tpl)(data));
        }
    });
});

// 删除职位
$('body').on('click', '.delete', function() {
    var id = $(this).attr('data-id');
    ajax.post({
        url: '/admin/job/delete.do',
        param: {
            id: id
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '职位',
                    ctn: '删除职位成功',
                    event: function() {
                        location.reload();
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '职位',
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
        url: '/admin/job/move.do',
        param: {
            id: id,
            direction: dir
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '职位',
                    ctn: text + '成功',
                    event: function() {
                        location.reload();
                    }
                });
            } else {
                modal.onebtn({
                    ctx: 'body',
                    title: '职位',
                    ctn: text + '失败',
                    event: function() {
                        location.reload();
                    }
                });
            }
        }
    });
});

// 职位详情
$('body').on('click', '.detail', function() {
    var id = Number($(this).attr('data-id'));

    _.each(cacheJob, function(val, index) {
        if(val.id === id) {
            storage.setSession('job', JSON.stringify(val));
        }
    });

    location.href = '/#proj_name#/html/job/detail.html';
});
