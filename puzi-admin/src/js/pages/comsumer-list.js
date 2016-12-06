/*!
 * 文章列表页面
 */

/**
 * 当前页面主函数，暴露出当前页面的代码
 * @param  {Object} ajax [包装过后的 ajax 对象]
 * @param {Object} modal [包装过后的弹窗对象]
 * @param {Object} time [包装过后的时间对象]
 * @param {Object} storage [包装过后的存储对象]
 */
var comsumerList = function(ajax, modal, time, storage) {

    var cacheComsumerList; // 缓存作者列表

    // 请求数据
    // requestList(1, undefined);
    requestList({
        page: 1
    }, undefined);

    // 搜索
    $('#comsumer-list').on('click', '#comsumer-list-search', function() {
        var name = $.trim($('#name').val());

        // 缓存数据，避免分页数据出错
        cacheParam = {
            // title: title,
            nickname: name
        }

        requestList(_.extend({}, { page: 1 }, cacheParam), undefined);
    });


    // 查看详情
    $('#comsumer-list').on('click', '#comsumer-list-detail', function() {
        var id = $(this).attr('data-id');
        var comsumerStr = JSON.stringify(getAuthorById(id, cacheComsumerList));
        sessionStorage.setItem('comsumer-list_comsumer', comsumerStr);
        location.href = '/#proj_name#/comsumer/detail';
    });

    // 向前翻页
    $('#comsumer-list').on('click', '.previous', function() {
        var pagecount = Number($(this).attr('data-pagecount')); // 分页总数
        var pagenow = Number($(this).attr('data-pagenow')); // 当前分页
        var $this = $(this);

        // 往前没有页面
        if(pagenow <= 1) {
            return;
        }

        requestList(pagenow - 1, $this);
    });

    // 指定页数分页
    $('#comsumer-list').on('click', '.page', function() {
        var pagecount = Number($(this).attr('data-pagecount')); // 分页总数
        var pagenow = Number($(this).attr('data-pagenow')); // 当前分页
        var page = Number($(this).attr('data-page')); // 跳转的页数
        var $this = $(this);

        // 当前页面在跳转页面上则不需要请求数据
        if(pagenow === page) {
            return;
        }

        requestList(page, $this);
    });

    // 指定页数翻页
    $('#comsumer-list').on('click', '.next', function() {
        var pagecount = Number($(this).attr('data-pagecount')); // 分页总数
        var pagenow = Number($(this).attr('data-pagenow')); // 当前分页
        var $this = $(this);

        // 往前没有页面
        if(pagenow >= pagecount) {
            return;
        }
        requestList(pagenow + 1, $this);
    });

    /**
     * 根据页面请求服务器数据
     * @param  {Number} page [请求第几页的数据]
     */
    function requestList(param, $targetBtn) {

        if($targetBtn !== null && $targetBtn !== undefined) {
            var cacheBtnText = $targetBtn.html();
            $targetBtn
                .attr('data-isloading', 'true')
                .html('<img class="page-loading" src="/#proj_name#/img/loading.gif">');
        }

        // 请求作者列表
        ajax.get({
            url: '/admin/consumer/list.do',
            // param: { page: page },
            param: param,
            cb: function(data) {

                cacheComsumerList = data;
                console.log(data);

                // 格式化文章时间
                // for(var i = 0; i < data.data.comsumer.length; i++) {
                //     var val = data.data.comsumer[i];
                //     val.posttime_str = time.unixToTime(val.posttime);
                // }
                cacheComsumerList = data;

                // 渲染用户管理列表
                var tpl = $('#comsumer-list-tpl').html();
                $('#comsumer-list-wrap').html(_.template(tpl)(data));
                if($targetBtn !== null && $targetBtn !== undefined) {
                    $targetBtn.html(cacheBtnText);
                }

            },
            modal: modal,
            title: '用户管理列表',
            ctx: '#comsumer-list'
        });
    }

    /**
     * 根据作者 id 返回缓存对象中的特定作者对象
     * @param  {String} id [作者 id]
     * @return {Object}    [特定作者对象]
     */
    function getAuthorById(id,comsumerList) {
        var comsumer;
        for(var i = 0; i < comsumerList.data.comsumer.length; i++) {
            var list = comsumerList.data.comsumer[i];

            if(String(list.id) === id) {
                comsumer = list;
            }
        }
        return comsumer;
    }
};

module.exports = comsumerList;
