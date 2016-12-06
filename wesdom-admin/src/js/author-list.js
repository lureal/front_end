/*!
 * 作者列表
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var time = require('./modules/time.js');
var storage = require('./modules/storage.js');

// 缓存作者列表
var cacheAuthor;

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/author/list.do',
        param: {
            page: 1
        },
        title: '作者'
    },
    $btn: null,
    callback: function(data) {

        for(var i = 0; i < data.data.authors.length; i++) {
            var val = data.data.authors[i];
            val.posttime_str = time.unixToTime(val.posttime);
        }

        cacheAuthor = data.data.authors;

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#author').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(page, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/author/list.do',
            param: {
                page: page
            },
            title: '作者'
        },
        $btn: $this,
        callback: function(data) {

            for(var i = 0; i < data.data.authors.length; i++) {
                var val = data.data.authors[i];
                val.posttime_str = time.unixToTime(val.posttime);
            }

            var tpl = $('#list-tpl').html();
            $('#author').html(_.template(tpl)(data));
        }
    });
});

// 删除作者
$('body').on('click', '.delete', function() {
    var id = $(this).attr('data-id');
    ajax.post({
        url: '/admin/author/delete.do',
        param: {
            id: id
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '作者',
                    ctn: '删除作者成功',
                    event: function() {
                        location.reload();
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '作者',
                    ctn: data.message
                });
            }
        }
    });
});

// 作者详情
$('body').on('click', '.detail', function() {
    var id = Number($(this).attr('data-id'));

    _.each(cacheAuthor, function(val, index) {
        if(val.id === id) {
            storage.setSession('author', JSON.stringify(val));
        }
    });

    location.href = '/#proj_name#/html/author/detail.html';
});
