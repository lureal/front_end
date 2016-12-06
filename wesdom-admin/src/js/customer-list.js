/*!
 * 客户列表
 */

var ajax = require('./modules/ajax');
var modal = require('./modules/modal');
var lister = require('./modules/lister.js');
var pager = require('./modules/pager.js');
var time = require('./modules/time.js');
var storage = require('./modules/storage.js');

// 缓存客户列表
var cachecustomer;

// 加载APP客户列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/customer/list.do',
        param: {
            page: 1,
            type: 1
        },
        title: '客户'
    },
    $btn: null,
    callback: function(data) {

        for(var i = 0; i < data.data.customers.length; i++) {
            var val = data.data.customers[i];
            val.posttime_str = time.unixToTime(val.posttime);
        }

        cachecustomer = data.data.customers;

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#app #customer').html(_.template(tpl)(data));
    }
});

// 加载品牌客户列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/customer/list.do',
        param: {
            page: 1,
            type: 2
        },
        title: '客户'
    },
    $btn: null,
    callback: function(data) {

        for(var i = 0; i < data.data.customers.length; i++) {
            var val = data.data.customers[i];
            val.posttime_str = time.unixToTime(val.posttime);
        }

        cachecustomer = data.data.customers;

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#brand #customer').html(_.template(tpl)(data));
    }
});

// 加载O2O客户列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/customer/list.do',
        param: {
            page: 1,
            type: 3
        },
        title: '客户'
    },
    $btn: null,
    callback: function(data) {

        for(var i = 0; i < data.data.customers.length; i++) {
            var val = data.data.customers[i];
            val.posttime_str = time.unixToTime(val.posttime);
        }

        cachecustomer = data.data.customers;

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#o2o #customer').html(_.template(tpl)(data));
    }
});

// 加载网红客户列表
lister({
    ajax: ajax,
    ajaxParam: {
        url: '/admin/customer/list.do',
        param: {
            page: 1,
            type: 4
        },
        title: '客户'
    },
    $btn: null,
    callback: function(data) {

        for(var i = 0; i < data.data.customers.length; i++) {
            var val = data.data.customers[i];
            val.posttime_str = time.unixToTime(val.posttime);
        }

        cachecustomer = data.data.customers;

        // 渲染模板
        var tpl = $('#list-tpl').html();
        $('#celebrity #customer').html(_.template(tpl)(data));
    }
});

// 分页
pager(function(page, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/customer/list.do',
            param: {
                page: page,
                type: 1
            },
            title: '客户'
        },
        $btn: $this,
        callback: function(data) {

            for(var i = 0; i < data.data.customers.length; i++) {
                var val = data.data.customers[i];
                val.posttime_str = time.unixToTime(val.posttime);
            }

            var tpl = $('#list-tpl').html();
            $('#app #customer').html(_.template(tpl)(data));
        }
    });
}, $('#app'));

pager(function(page, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/customer/list.do',
            param: {
                page: page,
                type: 2
            },
            title: '客户'
        },
        $btn: $this,
        callback: function(data) {

            for(var i = 0; i < data.data.customers.length; i++) {
                var val = data.data.customers[i];
                val.posttime_str = time.unixToTime(val.posttime);
            }

            var tpl = $('#list-tpl').html();
            $('#brand #customer').html(_.template(tpl)(data));
        }
    });
}, $('#brand'));

pager(function(page, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/customer/list.do',
            param: {
                page: page,
                type: 3
            },
            title: '客户'
        },
        $btn: $this,
        callback: function(data) {

            for(var i = 0; i < data.data.customers.length; i++) {
                var val = data.data.customers[i];
                val.posttime_str = time.unixToTime(val.posttime);
            }

            var tpl = $('#list-tpl').html();
            $('#o2o #customer').html(_.template(tpl)(data));
        }
    });
}, $('#o2o'));

// 删除客户
$('body').on('click', '.delete', function() {
    var id = $(this).attr('data-id');
    ajax.post({
        url: '/admin/customer/delete.do',
        param: {
            id: id
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '客户',
                    ctn: '删除客户成功',
                    event: function() {
                        location.reload();
                    }
                });
            } else {
                modal.nobtn({
                    ctx: 'body',
                    title: '客户',
                    ctn: data.message
                });
            }
        }
    });
});

pager(function(page, $this) {
    lister({
        ajax: ajax,
        ajaxParam: {
            url: '/admin/customer/list.do',
            param: {
                page: page,
                type: 4
            },
            title: '客户'
        },
        $btn: $this,
        callback: function(data) {

            for(var i = 0; i < data.data.customers.length; i++) {
                var val = data.data.customers[i];
                val.posttime_str = time.unixToTime(val.posttime);
            }

            var tpl = $('#list-tpl').html();
            $('#celebrity #customer').html(_.template(tpl)(data));
        }
    });
}, $('#celebrity'));

// 上下移动资源
$('body').on('click', '.move', function() {
    var dir = $(this).attr('data-direction');
    var id = $(this).attr('data-id');
    var text = dir === '1' ? '前移' : '后移';

    ajax.post({
        url: '/admin/customer/move.do',
        param: {
            id: id,
            direction: dir
        },
        cb: function(data) {
            if(data.data === true) {
                modal.onebtn({
                    ctx: 'body',
                    title: '客户',
                    ctn: text + '成功',
                    event: function() {
                        location.reload();
                    }
                });
            } else {
                modal.onebtn({
                    ctx: 'body',
                    title: '客户',
                    ctn: text + '失败',
                    event: function() {
                        location.reload();
                    }
                });
            }
        }
    });
});

// 客户详情
$('body').on('click', '.detail', function() {
    var id = Number($(this).attr('data-id'));

    _.each(cachecustomer, function(val, index) {
        if(val.id === id) {
            storage.setSession('customer', JSON.stringify(val));
        }
    });

    location.href = '/#proj_name#/html/customer/detail.html';
});
