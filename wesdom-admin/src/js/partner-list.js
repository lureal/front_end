/*!
 * 合作伙伴列表
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var time = require('./modules/time.js');
var storage = require('./modules/storage.js');

// 缓存合作伙伴列表
var cachePartner;

// 加载列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/partner/list.do',
        param: {
            page: 1
        },
        title: '合作伙伴'
    },
    $btn: null,
    callback: function(data) {

        for(var i = 0; i < data.data.partners.length; i++) {
            var val = data.data.partners[i];
            val.posttime_str = time.unixToTime(val.posttime);
        }

        cachePartner = data.data.partners;

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#partners').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(page, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/partner/list.do',
            param: {
                page: page
            },
            title: '合作伙伴'
        },
        $btn: $this,
        callback: function(data) {

            for(var i = 0; i < data.data.partners.length; i++) {
                var val = data.data.partners[i];
                val.posttime_str = time.unixToTime(val.posttime);
            }

            var tpl = $('#list-tpl').html();
            $('#partners').html(_.template(tpl)(data));
        }
    });
});

// 删除合作伙伴
$('body').on('click', '.delete', function() {
    var id = $(this).attr('data-id');
    ajax.post({
        url: '/admin/partner/delete.do',
        param: {
            id: id
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '合作伙伴',
                    ctn: '删除合作伙伴成功',
                    event: function() {
                        location.reload();
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '合作伙伴',
                    ctn: data.message
                });
            }
        }
    });
});

// 合作伙伴详情
$('body').on('click', '.detail', function() {
    var id = Number($(this).attr('data-id'));

    _.each(cachePartner, function(val, index) {
        if(val.id === id) {
            storage.setSession('partner', JSON.stringify(val));
        }
    });

    location.href = '/#proj_name#/html/partner/detail.html';
});

// 上下移动合作伙伴
$('body').on('click', '.move', function() {
    var dir = Number($(this).attr('data-dir'));
    var id = $(this).attr('data-id');

    ajax.post({
        url: '/admin/partner/move.do',
        param: {
            id: id,
            direction: dir
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '合作伙伴',
                    ctn: '移动合作伙伴成功',
                    event: function() {
                        location.reload();
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '合作伙伴',
                    ctn: data.message
                });
            }
        }
    });

});
