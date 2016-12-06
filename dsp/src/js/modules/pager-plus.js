/*!
 * 使用 Pagination.js 实现的分页
 * github: http://paginationjs.com/index.html
 */

var pager = {

    /**
     * @param {jQuery} $el [jQuery 对象]
     * @param {Function} cb [回掉函数]
     */
    init: function($el, cb) {
        alert($el.attr('data-ajaxParam'))
        var now = Number($el.attr('data-pagenow')), // 当前页数
            count = $el.attr('data-pagecount'), // 总页数
            ajaxParam = JSON.parse(decodeURIComponent($el.attr('data-ajaxParam'))), // 请求参数
            isFirst = true; // 避免插件本身初始化的时候执行回调函数

        // 构造总页数数组
        var pageArr = [];
        for(var i = 1; i <= count; i++) {
            pageArr.push(i);
        }

        // 初始化分页
        $el.pagination({
            dataSource: pageArr,
            pageSize: 1,
            pageNumber: now,
            callback: function(data, pagination) {
                if(isFirst) {
                    isFirst = false;
                    return;
                }

                cb(_.extend(ajaxParam, {
                    page: pagination.pageNumber
                }))
            }
        });

    }
};

module.exports = pager;
