/*!
 * 洞察文章列表
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var time = require('./modules/time.js');

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/insight/list.do',
        param: {
            page: 1
        },
        title: '洞察文章'
    },
    $btn: null,
    callback: function(data) {

        for(var i = 0; i < data.data.articles.length; i++) {
            var val = data.data.articles[i];
            val.posttime_str = time.unixToTime(val.posttime);
        }

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#articles').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(page, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/insight/list.do',
            param: {
                page: page
            },
            title: '洞察文章'
        },
        $btn: $this,
        callback: function(data) {

            for(var i = 0; i < data.data.articles.length; i++) {
                var val = data.data.articles[i];
                val.posttime_str = time.unixToTime(val.posttime);
            }

            // 渲染模板
            var tpl = $('#list-tpl').html();
            $('#articles').html(_.template(tpl)(data));
        }
    });
});

// 删除文章
$('body').on('click', '.delete', function() {
    var id = $(this).attr('data-id');
    ajax.post({
        url: '/admin/insight/delete.do',
        param: {
            id: id
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '洞察文章',
                    ctn: '删除洞察文章成功',
                    event: function() {
                        location.reload();
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '洞察文章',
                    ctn: data.message
                });
            }
        }
    });
});
