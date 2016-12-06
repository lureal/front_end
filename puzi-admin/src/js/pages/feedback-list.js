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
var feebackList = function(ajax, modal, time, storage) {

    var cacheFeebackList; // 缓存作者列表

    // 请求数据
    // requestList(1, undefined);
    requestList({
        page: 1
    }, undefined);

    // 向前翻页
    $('#feeback-list').on('click', '.previous', function() {
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
    $('#feeback-list').on('click', '.page', function() {
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
    $('#feeback-list').on('click', '.next', function() {
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
            url: '/admin/feedback/list.do',
            // param: { page: page },
            param: param,
            cb: function(data) {

                cacheFeebackList = data;

                // 格式化文章时间
                // for(var i = 0; i < data.data.comsumer.length; i++) {
                //     var val = data.data.comsumer[i];
                //     val.posttime_str = time.unixToTime(val.posttime);
                // }
                cacheFeebackList = data;

                // 渲染作者列表
                var tpl = $('#feeback-list-tpl').html();
                $('#feeback-list-wrap').html(_.template(tpl)(data));

                if($targetBtn !== null && $targetBtn !== undefined) {
                    $targetBtn.html(cacheBtnText);
                }

            },
            modal: modal,
            title: '反馈管理',
            ctx: '#feeback-list'
        });
    }

    /**
     * 根据作者 id 返回缓存对象中的特定作者对象
     * @param  {String} id [作者 id]
     * @return {Object}    [特定作者对象]
     */
    function getAuthorById(id,feebackList) {
        var feeback;

        for(var i = 0; i < comsumerList.data.feeback.length; i++) {
            var list = comsumerList.data.feeback[i];

            if(String(list.id) === id) {
                feeback = list;
            }
        }

        return feeback;
    }
};

module.exports = feebackList;
