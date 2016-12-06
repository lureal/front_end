/**
 * 初始化日期控件
 */

module.exports = {

    /**
     * 初始化日期选择控件
     * @param [String] id {日期控件 id}
     */
    init: function(id) {
        $(id).daterangepicker({
            format: 'YYYY/MM/DD',
            locale: {
                applyLabel: '确定',
                cancelLabel: '取消',
                fromLabel: '从',
                toLabel: '到',
                weekLabel: 'W',
                customRangeLabel: 'Custom Range',
                daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
            }
        });
    },

    /**
     * 初始化只能选择单个的日期控件
     * @param {String} id [日期控件 id]
     */
    initMonthDate: function(id) {
        $(id).datepicker({
            format: 'yyyy-mm',
            minViewMode: 'months',
            viewMode: 'months',
            pickTime: false
        });
    },

    /**
     * 获取日期控件日期
     * @param [String] id {日期控件 id}
     */
    getVal: function(id) {
        var date = $.trim($(id).val().replace(/\//g, '-'));

        return({
            start: date.slice(0, 10),
            end: date.slice(13, 24)
        });
    },

    /**
     * 获取选择
     */
    getMonthDateVal: function(id) {
        return $.trim($(id).val());
    }
};
